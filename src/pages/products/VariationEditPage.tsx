import { useEffect, useMemo, useRef, useState } from 'react'

import {
  useDeleteProductVariationMutation,
  useGetProductByIdQuery,
  useGetProductVariationByIdQuery,
  useUpdateProductMutation,
  useUpdateProductVariationMutation,
} from '@/shared/lib/api/products/Products'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import { resolveMediaUrl } from '@/shared/lib/utils/resolveMediaUrl'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { Button, Form, Input, InputNumber, Modal, Space } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

import { ProductImageUpload } from '../product-create/components/ProductImageUpload'
import { suggestSkuFromName, suggestSlugFromName } from '../product-create/helpers'
import '../product-create/ProductCreate.scss'
import { ProductImageItem } from '../product-create/types'
import './ProductsPage.scss'

type VariationFormValues = {
  name: string
  slug?: string
  sku?: string
  description?: string
  modelParameters?: string
  price: number
  comparePrice?: number | null
}

function toImageItems(images: string[] | undefined): ProductImageItem[] {
  return (images ?? []).map(value => ({
    fileId: value,
    url: resolveMediaUrl(value) || value,
  }))
}

export default function VariationEditPage() {
  const { productId = '', variationId = '' } = useParams<{
    productId: string
    variationId: string
  }>()
  const navigate = useNavigate()
  const { openNotification, contextHolder } = useNotificationHandler()
  const [form] = Form.useForm<VariationFormValues>()
  const [imageItems, setImageItems] = useState<ProductImageItem[]>([])
  const [mainImageId, setMainImageId] = useState<string | undefined>()
  const [showcaseFileIds, setShowcaseFileIds] = useState<string[]>([])
  const [showcaseHydrated, setShowcaseHydrated] = useState(false)

  const { data: productResponse } = useGetProductByIdQuery(productId, { skip: !productId })
  const {
    data: variationResponse,
    isLoading,
    isError,
  } = useGetProductVariationByIdQuery(variationId, { skip: !variationId })
  const [updateVariation, { isLoading: isSavingVariation }] = useUpdateProductVariationMutation()
  const [updateProduct, { isLoading: isSavingProduct }] = useUpdateProductMutation()
  const [deleteVariation, { isLoading: isDeleting }] = useDeleteProductVariationMutation()

  const product = productResponse?.data
  const variation = variationResponse?.data
  const isSaving = isSavingVariation || isSavingProduct || isDeleting
  const nameWatched = Form.useWatch('name', form)
  const previousNameRef = useRef('')
  const loadedVariationIdRef = useRef<string | null>(null)
  const slugLockedRef = useRef(false)
  const skuLockedRef = useRef(false)

  useEffect(() => {
    if (!variation) return
    const isNewVariation = loadedVariationIdRef.current !== variation.id
    if (isNewVariation) {
      loadedVariationIdRef.current = variation.id
      slugLockedRef.current = false
      skuLockedRef.current = false
      previousNameRef.current = variation.name
    }
    form.setFieldsValue({
      name: variation.name,
      slug: variation.slug,
      sku: variation.sku,
      description: variation.description,
      modelParameters: variation.modelParameters,
      price: variation.price,
      comparePrice: variation.comparePrice,
    })
    const items = toImageItems(variation.images)
    const mainId = variation.mainImage || items[0]?.fileId
    const ordered = mainId
      ? [
          ...items.filter(item => item.fileId === mainId),
          ...items.filter(item => item.fileId !== mainId),
        ]
      : items
    setImageItems(ordered)
    setMainImageId(mainId)
  }, [form, variation])

  useEffect(() => {
    if (!variation || nameWatched == null) return
    const nextName = String(nameWatched)
    if (nextName === previousNameRef.current) return

    if (!slugLockedRef.current) {
      const nextSlug = suggestSlugFromName(nextName)
      if (nextSlug) form.setFieldValue('slug', nextSlug)
    }
    if (!skuLockedRef.current) {
      const nextSku = suggestSkuFromName(nextName)
      if (nextSku) form.setFieldValue('sku', nextSku)
    }
    previousNameRef.current = nextName
  }, [form, nameWatched, variation])

  useEffect(() => {
    if (!product || showcaseHydrated) return
    setShowcaseFileIds(product.images ?? [])
    setShowcaseHydrated(true)
  }, [product, showcaseHydrated])

  const previewUrl = useMemo(() => {
    const main = imageItems.find(item => item.fileId === mainImageId)
    return main?.url || imageItems[0]?.url
  }, [imageItems, mainImageId])

  const handleImagesChange = (next: ProductImageItem[]) => {
    const remainingIds = new Set(next.map(item => item.fileId))
    const removedFromVariation = imageItems
      .filter(item => !remainingIds.has(item.fileId))
      .map(item => item.fileId)

    setImageItems(next)
    setMainImageId(next[0]?.fileId)
    if (removedFromVariation.length) {
      setShowcaseFileIds(prev => prev.filter(id => !removedFromVariation.includes(id)))
    }
  }

  const handleSave = async () => {
    if (!product) {
      openNotification('error', ['Товар ещё не загрузился'])
      return
    }

    try {
      const values = await form.validateFields()
      const imageIds = imageItems.map(item => item.fileId)

      await updateVariation({
        id: variationId,
        productId,
        body: {
          name: values.name.trim(),
          slug: values.slug?.trim() || undefined,
          sku: values.sku?.trim() || undefined,
          description: values.description?.trim() || undefined,
          modelParameters: values.modelParameters?.trim() || undefined,
          price: values.price,
          comparePrice: values.comparePrice ?? undefined,
          mainImage: mainImageId || imageIds[0],
          images: imageIds,
        },
      }).unwrap()

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
          images: showcaseFileIds,
        },
      }).unwrap()

      openNotification('success', ['Вариация и витрина сохранены'])
    } catch (error) {
      if (error && typeof error === 'object' && 'errorFields' in error) {
        return
      }
      openNotification('error', ['Не удалось сохранить'])
    }
  }

  const handleDelete = () => {
    if (!variation) return

    Modal.confirm({
      title: 'Удалить вариацию?',
      content: (
        <>
          Будут удалены вариация <strong>{variation.name}</strong> и все её складские позиции.
          Восстановить будет невозможно.
        </>
      ),
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await deleteVariation({ id: variationId, productId }).unwrap()
          openNotification('success', ['Вариация удалена'])
          navigate(`/products/${productId}`)
        } catch {
          openNotification('error', ['Не удалось удалить вариацию'])
          throw new Error('delete failed')
        }
      },
    })
  }

  if (isError) {
    return (
      <Container className="variation-edit admin-page">
        <PageHeader title="Вариация не найдена" />
        <Button onClick={() => navigate(`/products/${productId}`)}>К товару</Button>
      </Container>
    )
  }

  return (
    <Container className="variation-edit admin-page">
      {contextHolder}
      <PageHeader
        title={variation?.name || 'Вариация'}
        subtitle={
          product
            ? `Товар: ${product.name}${variation?.sku ? ` · SKU: ${variation.sku}` : ''}`
            : 'Загрузка...'
        }
        actions={
          <Space>
            <Button onClick={() => navigate(`/products/${productId}`)}>К товару</Button>
            <Button
              onClick={() => navigate(`/products/${productId}/variations/${variationId}/stock`)}
            >
              Сток
            </Button>
            <Button danger loading={isDeleting} onClick={handleDelete}>
              Удалить
            </Button>
            <Button type="primary" loading={isSaving} onClick={() => void handleSave()}>
              Сохранить
            </Button>
          </Space>
        }
      />

      <section className="variation-edit__section">
        <Form form={form} layout="vertical" disabled={isLoading || !variation}>
          <div className="variation-edit__grid">
            <Form.Item
              label="Название"
              name="name"
              rules={[{ required: true, message: 'Укажите название' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="SKU"
              name="sku"
              extra="Синхронизируется с названием, пока не правите вручную"
            >
              <Input
                onChange={() => {
                  skuLockedRef.current = true
                }}
              />
            </Form.Item>
            <Form.Item
              label="Slug"
              name="slug"
              extra="Синхронизируется с названием, пока не правите вручную"
            >
              <Input
                onChange={() => {
                  slugLockedRef.current = true
                }}
              />
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
                «На витрине» — фото попадёт в карточку товара в коллекции (можно с разных цветов,
                без лимита). Не забудьте сохранить.
              </p>
              <ProductImageUpload
                value={imageItems}
                showcaseFileIds={showcaseFileIds}
                onShowcaseChange={setShowcaseFileIds}
                onChange={handleImagesChange}
              />
            </div>
            {previewUrl ? (
              <div className="variation-edit__full">
                <img src={previewUrl} alt="" className="variation-edit__preview" />
              </div>
            ) : null}
          </div>
        </Form>
      </section>

      <div className="variation-edit__footer">
        <Button danger loading={isDeleting} onClick={handleDelete} style={{ marginRight: 'auto' }}>
          Удалить
        </Button>
        <Button onClick={() => navigate(`/products/${productId}`)}>Отмена</Button>
        <Button type="primary" loading={isSaving} onClick={() => void handleSave()}>
          Сохранить
        </Button>
      </div>
    </Container>
  )
}
