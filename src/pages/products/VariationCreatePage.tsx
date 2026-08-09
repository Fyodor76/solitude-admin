import { useEffect, useMemo, useState } from 'react'

import { useGetAllProductAttributesQuery } from '@/shared/lib/api/product-attributes/ProductAttributes'
import {
  useCreateProductVariationMutation,
  useCreateStockBulkMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from '@/shared/lib/api/products/Products'
import { useGetSizeChartByCategoryIdQuery } from '@/shared/lib/api/size-charts/SizeCharts'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Empty,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Steps,
} from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

import { ProductImageUpload } from '../product-create/components/ProductImageUpload'
import { StepStock } from '../product-create/components/StepStock'
import { buildSku, slugify } from '../product-create/helpers'
import '../product-create/ProductCreate.scss'
import { DraftVariation, ProductImageItem, StockDraftRow } from '../product-create/types'
import './ProductsPage.scss'

type VariationCreateFormValues = {
  name: string
  colorId: string
  slug?: string
  sku?: string
  description?: string
  modelParameters?: string
  price: number
  comparePrice?: number | null
}

type CreateStep = 0 | 1 | 2

const DRAFT_KEY = 'new-variation'
const STEP_LABELS = ['Вариация', 'Размеры', 'Сток'] as const

function safeTrim(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed || undefined
}

export default function VariationCreatePage() {
  const { productId = '' } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { openNotification, contextHolder } = useNotificationHandler()
  const [form] = Form.useForm<VariationCreateFormValues>()
  const [step, setStep] = useState<CreateStep>(0)
  const [maxReachedStep, setMaxReachedStep] = useState<CreateStep>(0)
  const [imageItems, setImageItems] = useState<ProductImageItem[]>([])
  const [showcaseFileIds, setShowcaseFileIds] = useState<string[]>([])
  const [defaultsReady, setDefaultsReady] = useState(false)
  const [selectedSizeIds, setSelectedSizeIds] = useState<string[]>([])
  const [stockRows, setStockRows] = useState<StockDraftRow[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { data: productResponse, isLoading: isProductLoading } = useGetProductByIdQuery(productId, {
    skip: !productId,
  })
  const { data: attributesResponse, isLoading: isAttributesLoading } =
    useGetAllProductAttributesQuery()
  const [createVariation, { isLoading: isCreating }] = useCreateProductVariationMutation()
  const [updateProduct, { isLoading: isUpdatingProduct }] = useUpdateProductMutation()
  const [createStockBulk, { isLoading: isCreatingStock }] = useCreateStockBulkMutation()

  const product = productResponse?.data
  const isSaving = isCreating || isUpdatingProduct || isCreatingStock

  const {
    data: sizeChartResponse,
    isFetching: isSizeChartLoading,
    isError: isSizeChartMissing,
  } = useGetSizeChartByCategoryIdQuery(product?.categoryId || '', {
    skip: !product?.categoryId,
  })

  const sizeChart = sizeChartResponse?.data
  const sizeParameters = sizeChart?.sizeParameters || []

  const sizeCodeById = useMemo(() => {
    const map: Record<string, string> = {}
    for (const size of sizeParameters) {
      if (!size.id) continue
      map[size.id] = size.internationalSize || size.russianSize || 'SIZE'
    }
    return map
  }, [sizeParameters])

  const colorOptions = useMemo(() => {
    const attributes = attributesResponse?.data ?? []
    return attributes
      .filter(attr => attr.type === 'color')
      .flatMap(attr =>
        (attr.values || [])
          .filter(value => value.isActive !== false)
          .map(value => ({
            label: value.displayName || value.value,
            value: value.id,
          }))
      )
  }, [attributesResponse?.data])

  useEffect(() => {
    if (!product || isAttributesLoading || defaultsReady) return

    const index = (product.variations?.length ?? 0) + 1
    const baseName = product.name?.trim() || 'variation'
    const baseSlug = product.slug?.trim() || slugify(baseName) || 'item'

    form.setFieldsValue({
      name: `${baseName} ${index}`,
      slug: `${baseSlug}-${index}`,
      sku: buildSku(baseSlug, String(index)),
      price: product.price,
      comparePrice: null,
      description: '',
      modelParameters: product.modelParameters || '',
      colorId: colorOptions[0]?.value,
    })
    setShowcaseFileIds(product.images ?? [])
    setDefaultsReady(true)
  }, [colorOptions, defaultsReady, form, isAttributesLoading, product])

  const watchedName = Form.useWatch('name', form)
  const watchedSku = Form.useWatch('sku', form)

  const draftVariation = useMemo<DraftVariation>(
    () => ({
      key: DRAFT_KEY,
      name: watchedName || 'Новая вариация',
      slug: '',
      sku: watchedSku || '',
      price: null,
      comparePrice: null,
      colorId: '',
      description: '',
      mainImage: null,
      images: [],
      showcaseFileIds: [],
    }),
    [watchedName, watchedSku]
  )

  useEffect(() => {
    if (step !== 2) return

    const skuBase = (watchedSku || '').trim() || slugify(watchedName || 'var')
    setStockRows(prev => {
      const next: StockDraftRow[] = []
      for (const sizeId of selectedSizeIds) {
        const key = `${DRAFT_KEY}:${sizeId}`
        const existing = prev.find(row => row.key === key)
        next.push({
          key,
          variationKey: DRAFT_KEY,
          sizeId,
          quantity: existing?.quantity ?? 0,
          sku: existing?.sku || buildSku(skuBase, sizeCodeById[sizeId] || 'SIZE'),
        })
      }
      return next
    })
  }, [step, selectedSizeIds, sizeCodeById, watchedName, watchedSku])

  const handleImagesChange = (next: ProductImageItem[]) => {
    const remainingIds = new Set(next.map(item => item.fileId))
    const removed = imageItems
      .filter(item => !remainingIds.has(item.fileId))
      .map(item => item.fileId)

    setImageItems(next)
    if (removed.length) {
      setShowcaseFileIds(prev => prev.filter(id => !removed.includes(id)))
    }
  }

  const goToStep = async (target: CreateStep) => {
    if (target > step) {
      if (step === 0) {
        try {
          await form.validateFields()
        } catch {
          return
        }
        if (!colorOptions.length) {
          openNotification('error', ['Сначала создайте цвета в «Опции товаров»'])
          return
        }
      }
    }

    setStep(target)
    setMaxReachedStep(prev => (target > prev ? target : prev) as CreateStep)
  }

  const handleCreate = async () => {
    if (!product) {
      openNotification('error', ['Товар ещё не загрузился'])
      return
    }

    setSubmitError(null)

    try {
      // Форма должна оставаться смонтированной на всех шагах — иначе Ant Design
      // сбрасывает значения и name/sku становятся undefined.
      const values = await form.validateFields()
      const name = safeTrim(values.name)
      const colorId = values.colorId
      if (!name || !colorId) {
        setStep(0)
        openNotification('error', ['Заполните название и цвет вариации'])
        return
      }

      const imageIds = imageItems.map(item => item.fileId)

      const created = await createVariation({
        productId: product.id,
        colorId,
        name,
        slug: safeTrim(values.slug),
        sku: safeTrim(values.sku),
        description: safeTrim(values.description),
        modelParameters: safeTrim(values.modelParameters),
        price: values.price,
        comparePrice: values.comparePrice ?? undefined,
        mainImage: imageIds[0],
        images: imageIds,
        sortOrder: product.variations?.length ?? 0,
        attributes: [],
      }).unwrap()

      const variationId = created.data?.id
      if (!variationId) {
        throw new Error('Вариация создана без id')
      }

      const nextShowcase = [...new Set(showcaseFileIds)]
      const productImagesChanged =
        nextShowcase.length !== (product.images?.length ?? 0) ||
        nextShowcase.some((id, index) => product.images?.[index] !== id)

      if (productImagesChanged) {
        await updateProduct({
          id: product.id,
          body: {
            name: product.name,
            slug: product.slug,
            description: product.description,
            modelParameters: product.modelParameters,
            price: product.price,
            categoryId: product.categoryId,
            brand: product.brand,
            material: product.material,
            isActive: product.isActive,
            isFeatured: product.isFeatured,
            showOnLanding: product.showOnLanding,
            images: nextShowcase,
          },
        }).unwrap()
      }

      const stockItems = stockRows.map(row => ({
        productId: product.id,
        variationId,
        sizeId: row.sizeId,
        sku: row.sku || undefined,
        quantity: Number(row.quantity) || 0,
      }))

      if (stockItems.length) {
        await createStockBulk({ items: stockItems }).unwrap()
      }

      openNotification('success', [
        'Вариация создана',
        stockItems.length ? `Сток: ${stockItems.length} позиций` : 'Сток не создан (нет размеров)',
      ])
      navigate(`/products/${product.id}/variations/${variationId}/stock`)
    } catch (error: any) {
      if (error && typeof error === 'object' && 'errorFields' in error) {
        setStep(0)
        return
      }
      const message =
        error?.data?.error || error?.error || error?.message || 'Не удалось создать вариацию'
      const text = Array.isArray(message) ? message.join(', ') : String(message)
      setSubmitError(text)
      openNotification('error', [text])
    }
  }

  if (!isProductLoading && !product) {
    return (
      <Container className="variation-edit admin-page">
        <PageHeader title="Товар не найден" />
        <Button onClick={() => navigate('/products')}>К списку товаров</Button>
      </Container>
    )
  }

  return (
    <Container className="variation-edit admin-page">
      {contextHolder}
      <PageHeader
        title="Новая вариация"
        subtitle={product ? `Товар: ${product.name}` : 'Загрузка...'}
        actions={<Button onClick={() => navigate(`/products/${productId}`)}>К товару</Button>}
      />

      <Steps
        current={step}
        className="product-create__steps"
        items={STEP_LABELS.map((title, index) => ({
          title,
          disabled: !(index <= maxReachedStep || index <= step),
        }))}
        onChange={value => void goToStep(value as CreateStep)}
      />

      {!isAttributesLoading && !colorOptions.length && step === 0 ? (
        <Alert
          type="warning"
          showIcon
          message="Нет цветов"
          description="Создайте опцию type=color и значения в разделе «Опции товаров»."
        />
      ) : null}

      <section className="variation-edit__section">
        {isAttributesLoading || isProductLoading ? (
          step === 0 ? (
            <Empty description="Загрузка..." />
          ) : null
        ) : (
          <div style={{ display: step === 0 ? 'block' : 'none' }} aria-hidden={step !== 0}>
            <Form
              form={form}
              layout="vertical"
              disabled={!product || !colorOptions.length}
              preserve
            >
              <div className="variation-edit__grid">
                <Form.Item
                  label="Название"
                  name="name"
                  rules={[{ required: true, message: 'Укажите название' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Цвет"
                  name="colorId"
                  rules={[{ required: true, message: 'Выберите цвет' }]}
                >
                  <Select
                    options={colorOptions}
                    placeholder="Выберите цвет"
                    showSearch
                    optionFilterProp="label"
                  />
                </Form.Item>
                <Form.Item label="SKU" name="sku">
                  <Input />
                </Form.Item>
                <Form.Item label="Slug" name="slug">
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Цена"
                  name="price"
                  rules={[{ required: true, message: 'Укажите цену' }]}
                >
                  <InputNumber min={0.01} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Старая цена" name="comparePrice">
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item className="variation-edit__full" label="Описание" name="description">
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item
                  className="variation-edit__full"
                  label="Параметры модели"
                  name="modelParameters"
                >
                  <Input.TextArea rows={2} />
                </Form.Item>
                <div className="variation-edit__full">
                  <p className="variation-edit__images-hint">
                    «На витрине» — фото попадёт в карточку товара в коллекции.
                  </p>
                  <ProductImageUpload
                    value={imageItems}
                    showcaseFileIds={showcaseFileIds}
                    onShowcaseChange={setShowcaseFileIds}
                    onChange={handleImagesChange}
                  />
                </div>
              </div>
            </Form>
          </div>
        )}

        {step === 1 && (
          <Card
            title="Размеры для склада"
            size="small"
            extra={
              sizeParameters.length ? (
                <Button
                  type="link"
                  onClick={() =>
                    setSelectedSizeIds(sizeParameters.map(item => item.id!).filter(Boolean))
                  }
                >
                  Выбрать все
                </Button>
              ) : null
            }
          >
            <p className="product-create__hint">
              Выберите размеры, по которым будете вести остатки. Берётся из размерной сетки
              категории товара.
            </p>

            {isSizeChartMissing ? (
              <Alert
                type="warning"
                showIcon
                message="Для категории товара нет размерной сетки"
                description="Создайте сетку в «Размерные сетки». Без размеров сток на следующем шаге будет пустым."
              />
            ) : !sizeParameters.length ? (
              <Empty description="В сетке категории пока нет размеров" />
            ) : (
              <>
                {sizeChart?.name ? (
                  <div className="product-create__meta">Сетка: {sizeChart.name}</div>
                ) : null}
                <Checkbox.Group
                  className="product-create__size-grid"
                  value={selectedSizeIds}
                  onChange={values => setSelectedSizeIds(values as string[])}
                  options={sizeParameters.map(size => ({
                    label: size.russianSize
                      ? `${size.internationalSize} / ${size.russianSize}`
                      : size.internationalSize,
                    value: size.id!,
                  }))}
                />
              </>
            )}
          </Card>
        )}

        {step === 2 && (
          <StepStock
            rows={stockRows}
            variations={[draftVariation]}
            sizeParameters={sizeParameters}
            onChange={(key, patch) =>
              setStockRows(prev => prev.map(row => (row.key === key ? { ...row, ...patch } : row)))
            }
          />
        )}
      </section>

      {isSizeChartLoading && step === 1 ? (
        <Alert type="info" showIcon message="Загружаем размерную сетку категории..." />
      ) : null}

      {submitError ? <Alert type="error" showIcon message={submitError} /> : null}

      <div className="variation-edit__footer">
        <Space>
          <Button onClick={() => navigate(`/products/${productId}`)}>Отмена</Button>
          <Button
            disabled={step === 0 || isSaving}
            onClick={() => void goToStep((step - 1) as CreateStep)}
          >
            Назад
          </Button>
          {step < 2 ? (
            <Button
              type="primary"
              disabled={isSaving}
              onClick={() => void goToStep((step + 1) as CreateStep)}
            >
              Далее
            </Button>
          ) : (
            <Button type="primary" loading={isSaving} onClick={() => void handleCreate()}>
              Создать
            </Button>
          )}
        </Space>
      </div>
    </Container>
  )
}
