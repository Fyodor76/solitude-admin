import { useEffect, useMemo, useState } from 'react'

import { useGetAllProductAttributesQuery } from '@/shared/lib/api/product-attributes/ProductAttributes'
import {
  useCreateProductVariationMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from '@/shared/lib/api/products/Products'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { Alert, Button, Empty, Form, Input, InputNumber, Select, Space } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

import { ProductImageUpload } from '../product-create/components/ProductImageUpload'
import { buildSku, slugify } from '../product-create/helpers'
import '../product-create/ProductCreate.scss'
import { ProductImageItem } from '../product-create/types'
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

export default function VariationCreatePage() {
  const { productId = '' } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { openNotification, contextHolder } = useNotificationHandler()
  const [form] = Form.useForm<VariationCreateFormValues>()
  const [imageItems, setImageItems] = useState<ProductImageItem[]>([])
  const [showcaseFileIds, setShowcaseFileIds] = useState<string[]>([])
  const [defaultsReady, setDefaultsReady] = useState(false)

  const { data: productResponse, isLoading: isProductLoading } = useGetProductByIdQuery(productId, {
    skip: !productId,
  })
  const { data: attributesResponse, isLoading: isAttributesLoading } =
    useGetAllProductAttributesQuery()
  const [createVariation, { isLoading: isCreating }] = useCreateProductVariationMutation()
  const [updateProduct, { isLoading: isUpdatingProduct }] = useUpdateProductMutation()

  const product = productResponse?.data
  const isSaving = isCreating || isUpdatingProduct

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
    const baseName = product.name.trim() || 'variation'
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

  const handleCreate = async () => {
    if (!product) {
      openNotification('error', ['Товар ещё не загрузился'])
      return
    }

    if (!colorOptions.length) {
      openNotification('error', ['Сначала создайте цвета в «Опции товаров»'])
      return
    }

    try {
      const values = await form.validateFields()
      const imageIds = imageItems.map(item => item.fileId)

      const created = await createVariation({
        productId: product.id,
        colorId: values.colorId,
        name: values.name.trim(),
        slug: values.slug?.trim() || undefined,
        sku: values.sku?.trim() || undefined,
        description: values.description?.trim() || undefined,
        modelParameters: values.modelParameters?.trim() || undefined,
        price: values.price,
        comparePrice: values.comparePrice ?? undefined,
        mainImage: imageIds[0],
        images: imageIds,
        sortOrder: product.variations?.length ?? 0,
        attributes: [],
      }).unwrap()

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

      openNotification('success', ['Вариация создана'])
      const createdId = created.data?.id
      navigate(
        createdId ? `/products/${product.id}/variations/${createdId}` : `/products/${product.id}`
      )
    } catch (error) {
      if (error && typeof error === 'object' && 'errorFields' in error) {
        return
      }
      openNotification('error', ['Не удалось создать вариацию'])
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
        actions={
          <Space>
            <Button onClick={() => navigate(`/products/${productId}`)}>К товару</Button>
            <Button
              type="primary"
              loading={isSaving}
              disabled={!colorOptions.length}
              onClick={() => void handleCreate()}
            >
              Создать
            </Button>
          </Space>
        }
      />

      {!isAttributesLoading && !colorOptions.length ? (
        <Alert
          type="warning"
          showIcon
          message="Нет цветов"
          description="Создайте опцию type=color и значения в разделе «Опции товаров»."
        />
      ) : null}

      <section className="variation-edit__section">
        {isAttributesLoading || isProductLoading ? (
          <Empty description="Загрузка..." />
        ) : (
          <Form form={form} layout="vertical" disabled={!product || !colorOptions.length}>
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
                  «На витрине» — фото попадёт в карточку товара в коллекции. Не забудьте создать
                  вариацию.
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
        )}
      </section>

      <div className="variation-edit__footer">
        <Button onClick={() => navigate(`/products/${productId}`)}>Отмена</Button>
        <Button
          type="primary"
          loading={isSaving}
          disabled={!colorOptions.length}
          onClick={() => void handleCreate()}
        >
          Создать
        </Button>
      </div>
    </Container>
  )
}
