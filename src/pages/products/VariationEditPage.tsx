import { useEffect, useMemo, useState } from 'react'

import {
  useGetProductByIdQuery,
  useGetProductVariationByIdQuery,
  useUpdateProductVariationMutation,
} from '@/shared/lib/api/products/Products'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import { resolveMediaUrl } from '@/shared/lib/utils/resolveMediaUrl'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { Button, Form, Input, InputNumber, Space } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

import { ProductImageUpload } from '../product-create/components/ProductImageUpload'
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

  const { data: productResponse } = useGetProductByIdQuery(productId, { skip: !productId })
  const {
    data: variationResponse,
    isLoading,
    isError,
  } = useGetProductVariationByIdQuery(variationId, { skip: !variationId })
  const [updateVariation, { isLoading: isSaving }] = useUpdateProductVariationMutation()

  const product = productResponse?.data
  const variation = variationResponse?.data

  useEffect(() => {
    if (!variation) return
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

  const previewUrl = useMemo(() => {
    const main = imageItems.find(item => item.fileId === mainImageId)
    return main?.url || imageItems[0]?.url
  }, [imageItems, mainImageId])

  const handleSave = async () => {
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

      openNotification('success', ['Вариация сохранена'])
    } catch (error) {
      if (error && typeof error === 'object' && 'errorFields' in error) {
        return
      }
      openNotification('error', ['Не удалось сохранить вариацию'])
    }
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
              <ProductImageUpload
                value={imageItems}
                onChange={next => {
                  setImageItems(next)
                  // Первое в списке — главное (кнопка «Главное» двигает фото в начало)
                  setMainImageId(next[0]?.fileId)
                }}
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
        <Button onClick={() => navigate(`/products/${productId}`)}>Отмена</Button>
        <Button type="primary" loading={isSaving} onClick={() => void handleSave()}>
          Сохранить
        </Button>
      </div>
    </Container>
  )
}
