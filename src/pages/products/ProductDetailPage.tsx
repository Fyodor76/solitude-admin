import { useEffect, useMemo, useRef, useState } from 'react'

import { useGetCategoriesTreeQuery } from '@/shared/lib/api/categories/Categories'
import { useGetAllProductAttributesQuery } from '@/shared/lib/api/product-attributes/ProductAttributes'
import {
  useCreateProductVariationMutation,
  useCreateStockBulkMutation,
  useDeleteProductMutation,
  useDeleteProductVariationMutation,
  useDeleteStockItemMutation,
  useGetProductByIdQuery,
  useGetStockByProductQuery,
  useReorderProductVariationsMutation,
  useUpdateProductMutation,
  useUpdateProductVariationMutation,
  useUpdateStockItemMutation,
} from '@/shared/lib/api/products/Products'
import { useGetSizeChartByCategoryIdQuery } from '@/shared/lib/api/size-charts/SizeCharts'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { DeleteOutlined } from '@ant-design/icons'
import { Alert, Button, Empty, Modal, Space, Steps } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

import { StepAttributes } from '../product-create/components/StepAttributes'
import { StepProductBasics } from '../product-create/components/StepProductBasics'
import { StepStock } from '../product-create/components/StepStock'
import { StepVariations } from '../product-create/components/StepVariations'
import { STEP_LABELS } from '../product-create/constants'
import { useProductCreateWizard } from '../product-create/hooks/useProductCreateWizard'
import {
  collectShowcaseImages,
  mapProductToEditState,
  ProductEditSnapshot,
} from '../product-create/mapProductToEditState'
import '../product-create/ProductCreate.scss'
import { WizardStep } from '../product-create/types'
import './ProductsPage.scss'

function extractErrorMessage(error: unknown, fallback: string): string {
  const payload = error as { data?: { error?: unknown }; error?: unknown; message?: unknown }
  const message = payload?.data?.error || payload?.error || payload?.message || fallback
  return Array.isArray(message) ? message.join(', ') : String(message)
}

export default function ProductDetailPage() {
  const { productId = '' } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { openNotification, contextHolder } = useNotificationHandler()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const hydratedTokenRef = useRef<string | null>(null)
  const snapshotRef = useRef<ProductEditSnapshot | null>(null)

  const {
    data: productResponse,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useGetProductByIdQuery(productId, { skip: !productId })
  const {
    data: stockResponse,
    isLoading: isStockLoading,
    isError: isStockError,
    isSuccess: isStockSuccess,
  } = useGetStockByProductQuery(productId, {
    skip: !productId,
  })
  const { data: categoriesResponse } = useGetCategoriesTreeQuery()
  const { data: attributesResponse } = useGetAllProductAttributesQuery()

  const product = productResponse?.data
  const stockItems = stockResponse?.data ?? []
  const attributes = attributesResponse?.data || []
  const colorAttributes = useMemo(
    () => attributes.filter(item => item.type === 'color'),
    [attributes]
  )

  const wizard = useProductCreateWizard(colorAttributes, { persistDraft: false })

  const {
    data: sizeChartResponse,
    isFetching: isSizeChartLoading,
    isError: isSizeChartMissing,
  } = useGetSizeChartByCategoryIdQuery(wizard.state.basics.categoryId, {
    skip: !wizard.state.basics.categoryId,
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

  useEffect(() => {
    wizard.setSizeCodeById(sizeCodeById)
  }, [sizeCodeById, wizard.setSizeCodeById])

  useEffect(() => {
    hydratedTokenRef.current = null
    snapshotRef.current = null
    setReady(false)
  }, [productId])

  const hydrateToken = product ? `${product.id}:${product.updatedAt}` : ''

  useEffect(() => {
    if (!product || !isStockSuccess || !hydrateToken) return
    if (hydratedTokenRef.current === hydrateToken) return

    const mapped = mapProductToEditState(product, stockItems)
    wizard.hydrate(mapped.state)
    snapshotRef.current = mapped.snapshot
    hydratedTokenRef.current = hydrateToken
    setReady(true)
  }, [hydrateToken, isStockSuccess, product, stockItems, wizard.hydrate])

  const [updateProduct, { isLoading: isUpdatingProduct }] = useUpdateProductMutation()
  const [createVariation, { isLoading: isCreatingVariation }] = useCreateProductVariationMutation()
  const [updateVariation, { isLoading: isUpdatingVariation }] = useUpdateProductVariationMutation()
  const [deleteVariation, { isLoading: isDeletingVariation }] = useDeleteProductVariationMutation()
  const [reorderVariations, { isLoading: isReordering }] = useReorderProductVariationsMutation()
  const [createStockBulk, { isLoading: isCreatingStock }] = useCreateStockBulkMutation()
  const [updateStockItem, { isLoading: isUpdatingStock }] = useUpdateStockItemMutation()
  const [deleteStockItem, { isLoading: isDeletingStock }] = useDeleteStockItemMutation()
  const [deleteProduct, { isLoading: isDeletingProduct }] = useDeleteProductMutation()

  const isSaving =
    isUpdatingProduct ||
    isCreatingVariation ||
    isUpdatingVariation ||
    isDeletingVariation ||
    isReordering ||
    isCreatingStock ||
    isUpdatingStock ||
    isDeletingStock

  const handleRemoveVariation = (key: string) => {
    const variation = wizard.state.variations.find(item => item.key === key)
    if (!variation) return

    const reservedRows = wizard.state.stockRows.filter(
      row => row.variationKey === key && (row.reserved ?? 0) > 0
    )
    if (reservedRows.length) {
      Modal.error({
        title: 'Нельзя удалить вариацию',
        content: 'По ней есть резерв в заказах. Сначала дождитесь отгрузки или отмените резерв.',
      })
      return
    }

    if (!variation.id) {
      wizard.removeVariation(key)
      return
    }

    Modal.confirm({
      title: 'Удалить вариацию?',
      content: (
        <>
          При сохранении будут удалены вариация <strong>{variation.name}</strong> и её складские
          позиции.
        </>
      ),
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: () => wizard.removeVariation(key),
    })
  }

  const handleSizesChange = (sizeIds: string[]) => {
    const removed = wizard.state.selectedSizeIds.filter(id => !sizeIds.includes(id))
    const blocked = wizard.state.stockRows.filter(
      row => removed.includes(row.sizeId) && (row.reserved ?? 0) > 0
    )
    if (blocked.length) {
      openNotification('error', ['Нельзя убрать размер: по нему есть резерв в заказах'])
    }
    wizard.setSelectedSizeIds(sizeIds)
  }

  const handleSave = async () => {
    if (!product) return
    setSubmitError(null)

    if (!wizard.canEnterStep(3)) {
      openNotification('error', ['Заполните товар и вариации, включая цвет'])
      return
    }

    const snapshot = snapshotRef.current
    if (!snapshot) {
      openNotification('error', ['Данные товара ещё не загрузились'])
      return
    }

    const { basics, variations, attributeSelections, stockRows } = wizard.state

    try {
      const keyToId = new Map<string, string>()

      for (const [index, variation] of variations.entries()) {
        if (variation.id) {
          keyToId.set(variation.key, variation.id)
          continue
        }

        const created = await createVariation({
          productId: product.id,
          colorId: variation.colorId,
          name: variation.name.trim(),
          slug: variation.slug.trim(),
          sku: variation.sku.trim(),
          price: Number(variation.price),
          comparePrice: variation.comparePrice ?? undefined,
          description: variation.description.trim() || undefined,
          modelParameters: variation.modelParameters?.trim() || undefined,
          mainImage: variation.mainImage?.fileId,
          images: variation.images.map(image => image.fileId),
          sortOrder: index,
          attributes: [],
        }).unwrap()

        const createdId = created.data?.id
        if (!createdId) {
          throw new Error('Вариация создана без id')
        }
        keyToId.set(variation.key, createdId)
      }

      await Promise.all(
        variations.flatMap((variation, index) =>
          variation.id
            ? [
                updateVariation({
                  id: variation.id,
                  productId: product.id,
                  body: {
                    colorId: variation.colorId,
                    name: variation.name.trim(),
                    slug: variation.slug.trim(),
                    sku: variation.sku.trim(),
                    price: Number(variation.price),
                    comparePrice: variation.comparePrice ?? undefined,
                    description: variation.description.trim() || undefined,
                    modelParameters: variation.modelParameters?.trim() || undefined,
                    mainImage: variation.mainImage?.fileId,
                    images: variation.images.map(image => image.fileId),
                    sortOrder: index,
                  },
                }).unwrap(),
              ]
            : []
        )
      )

      const currentIds = new Set([...keyToId.values()])
      for (const id of snapshot.variationIds) {
        if (currentIds.has(id)) continue
        await deleteVariation({ id, productId: product.id }).unwrap()
      }

      await updateProduct({
        id: product.id,
        body: {
          name: basics.name.trim(),
          slug: basics.slug.trim(),
          description: basics.description.trim() || undefined,
          modelParameters: basics.modelParameters.trim() || undefined,
          price: Number(basics.price),
          categoryId: basics.categoryId,
          brand: basics.brand.trim(),
          material: basics.material.trim(),
          isActive: basics.isActive,
          isFeatured: basics.isFeatured,
          showOnLanding: basics.showOnLanding,
          images: collectShowcaseImages(variations, snapshot.images),
          attributes: attributeSelections
            .filter(item => item.valueIds.length > 0)
            .map(item => ({
              attributeId: item.attributeId,
              valueIds: item.valueIds,
            })),
        },
      }).unwrap()

      const orderedIds = variations.map(item => keyToId.get(item.key)).filter(Boolean) as string[]
      if (orderedIds.length > 1) {
        await reorderVariations({ productId: product.id, orderedIds }).unwrap()
      }

      const remainingVariationIds = new Set(orderedIds)
      const currentStockIds = new Set(
        stockRows.map(row => row.id).filter((id): id is string => Boolean(id))
      )

      for (const item of snapshot.stock) {
        if (currentStockIds.has(item.id)) continue
        if (!remainingVariationIds.has(item.variationId)) continue
        if (item.reserved > 0) {
          throw new Error('Нельзя удалить складскую позицию с резервом')
        }
        await deleteStockItem({ id: item.id, variationId: item.variationId }).unwrap()
      }

      const stockToCreate = []
      const stockToUpdate = []

      for (const row of stockRows) {
        const variationId = keyToId.get(row.variationKey)
        if (!variationId || !row.sizeId) continue

        if (row.id) {
          stockToUpdate.push(
            updateStockItem({
              id: row.id,
              variationId,
              body: {
                sku: row.sku.trim() || undefined,
                quantity: Number(row.quantity) || 0,
                location: row.location?.trim() || undefined,
              },
            }).unwrap()
          )
        } else {
          stockToCreate.push({
            productId: product.id,
            variationId,
            sizeId: row.sizeId,
            sku: row.sku.trim() || undefined,
            quantity: Number(row.quantity) || 0,
            location: row.location?.trim() || undefined,
          })
        }
      }

      if (stockToUpdate.length) {
        await Promise.all(stockToUpdate)
      }
      if (stockToCreate.length) {
        await createStockBulk({ items: stockToCreate }).unwrap()
      }

      hydratedTokenRef.current = null
      snapshotRef.current = null
      setReady(false)
      openNotification('success', ['Товар сохранён'])
    } catch (error) {
      const text = extractErrorMessage(error, 'Не удалось сохранить товар')
      setSubmitError(text)
      openNotification('error', [text])
    }
  }

  const handleDeleteProduct = () => {
    if (!product) return

    Modal.confirm({
      title: 'Удалить товар?',
      content: (
        <>
          Будут удалены товар <strong>{product.name}</strong>, его вариации и остатки. Восстановить
          будет невозможно.
        </>
      ),
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await deleteProduct(product.id).unwrap()
          openNotification('success', ['Товар удалён'])
          navigate('/products')
        } catch {
          openNotification('error', ['Не удалось удалить товар'])
          throw new Error('delete failed')
        }
      },
    })
  }

  const stepItems = ([0, 1, 2, 3] as WizardStep[]).map(step => ({
    title: STEP_LABELS[step],
    disabled: !(step <= wizard.state.maxReachedStep || wizard.canEnterStep(step)),
  }))

  if (isProductError) {
    return (
      <Container className="product-detail admin-page">
        <PageHeader title="Товар не найден" />
        <Button onClick={() => navigate('/products')}>К списку товаров</Button>
      </Container>
    )
  }

  return (
    <Container className="product-detail admin-page">
      {contextHolder}
      <div className="product-create">
        <PageHeader
          title={product?.name || 'Товар'}
          subtitle={
            product
              ? 'Те же шаги, что при создании: товар, вариации с цветом, опции, размеры и сток'
              : 'Загрузка...'
          }
          actions={
            <Space wrap>
              <Button onClick={() => navigate('/products')}>К списку</Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                loading={isDeletingProduct}
                disabled={!product}
                onClick={handleDeleteProduct}
              >
                Удалить
              </Button>
            </Space>
          }
        />

        {isStockError ? (
          <Alert
            type="error"
            showIcon
            message="Не удалось загрузить склад"
            description="Без остатков сохранение может затереть сток. Обновите страницу и попробуйте снова."
            style={{ marginBottom: 16 }}
          />
        ) : null}

        {isProductLoading || isStockLoading || !ready ? (
          <Empty description="Загрузка товара..." />
        ) : (
          <>
            <Steps
              current={wizard.state.step}
              items={stepItems}
              onChange={value => wizard.goToStep(value as WizardStep)}
              className="product-create__steps"
            />

            <div className="product-create__body">
              {wizard.state.step === 0 && (
                <StepProductBasics
                  value={wizard.state.basics}
                  categories={categoriesResponse?.data || []}
                  onChange={wizard.updateBasics}
                />
              )}

              {wizard.state.step === 1 && (
                <StepVariations
                  variations={wizard.state.variations}
                  colorOptions={wizard.colorOptions}
                  onAdd={wizard.addVariation}
                  onChange={wizard.updateVariation}
                  onRemove={handleRemoveVariation}
                  onReorder={wizard.reorderVariations}
                />
              )}

              {wizard.state.step === 2 && (
                <StepAttributes
                  attributes={attributes}
                  sizeParameters={sizeParameters}
                  sizeChartName={sizeChart?.name}
                  sizeChartMissing={Boolean(wizard.state.basics.categoryId) && isSizeChartMissing}
                  selections={wizard.state.attributeSelections}
                  selectedSizeIds={wizard.state.selectedSizeIds}
                  onAddAttribute={wizard.addAttributeSelection}
                  onAttributeChange={wizard.setAttributeSelection}
                  onRemoveAttribute={wizard.removeAttributeSelection}
                  onSizesChange={handleSizesChange}
                  sizesHint="Размеры, по которым ведёте остатки. Снятие размера удалит позицию склада при сохранении — кроме тех, где есть резерв."
                />
              )}

              {wizard.state.step === 3 && (
                <StepStock
                  rows={wizard.state.stockRows}
                  variations={wizard.state.variations}
                  sizeParameters={sizeParameters}
                  onChange={wizard.updateStockRow}
                  showInventoryDetails
                />
              )}
            </div>

            {isSizeChartLoading && wizard.state.step === 2 ? (
              <Alert type="info" showIcon message="Загружаем размерную сетку категории..." />
            ) : null}

            {submitError ? <Alert type="error" showIcon message={submitError} /> : null}

            <div className="product-create__footer">
              <Space>
                <Button onClick={() => navigate('/products')}>Отмена</Button>
                <Button disabled={wizard.state.step === 0 || isSaving} onClick={wizard.prevStep}>
                  Назад
                </Button>
                {wizard.state.step < 3 ? (
                  <Button
                    disabled={
                      !wizard.canEnterStep((wizard.state.step + 1) as WizardStep) || isSaving
                    }
                    onClick={wizard.nextStep}
                  >
                    Далее
                  </Button>
                ) : null}
                <Button
                  type="primary"
                  loading={isSaving}
                  disabled={!wizard.canEnterStep(3) || isStockError}
                  onClick={() => void handleSave()}
                >
                  Сохранить
                </Button>
              </Space>
            </div>
          </>
        )}
      </div>
    </Container>
  )
}
