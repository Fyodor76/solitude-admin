import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useGetCategoriesTreeQuery } from '@/shared/lib/api/categories/Categories'
import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import {
  useDeleteProductMutation,
  useDeleteProductVariationMutation,
  useGetProductByIdQuery,
  useReorderProductVariationsMutation,
  useUpdateProductMutation,
} from '@/shared/lib/api/products/Products'
import { ProductUpdatePayload } from '@/shared/lib/api/products/types'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import { resolveMediaUrl } from '@/shared/lib/utils/resolveMediaUrl'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { DeleteOutlined, HolderOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputNumber, Modal, Select, Space, Switch, Tag } from 'antd'
import { Reorder, useDragControls } from 'framer-motion'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { ProductVariation } from '@/app/types/product'

import './ProductsPage.scss'
import { PRODUCT_SWITCH_TOOLTIPS, productSwitchLabel } from './productSwitchLabels'

type ProductFormValues = {
  name: string
  slug: string
  description?: string
  modelParameters?: string
  price: number
  categoryId: string
  brand: string
  material: string
  isActive: boolean
  isFeatured: boolean
  showOnLanding: boolean
}

function flattenCategories(
  nodes: BaseCategoryTree[],
  prefix = ''
): { value: string; label: string }[] {
  return nodes.flatMap(node => {
    const label = prefix ? `${prefix} / ${node.name}` : node.name
    const self = [{ value: node.id, label }]
    const children = node.children?.length ? flattenCategories(node.children, label) : []
    return [...self, ...children]
  })
}

function sortVariations(list: ProductVariation[]): ProductVariation[] {
  return [...list].sort((a, b) => {
    const orderA = a.sortOrder ?? Number.MAX_SAFE_INTEGER
    const orderB = b.sortOrder ?? Number.MAX_SAFE_INTEGER
    if (orderA !== orderB) return orderA - orderB
    return (a.createdAt || '').localeCompare(b.createdAt || '')
  })
}

function VariationSortableRow({
  record,
  productId,
  onDragEnd,
  onDelete,
}: {
  record: ProductVariation
  productId: string
  onDragEnd: () => void
  onDelete: (variation: ProductVariation) => void
}) {
  const controls = useDragControls()
  const thumb = resolveMediaUrl(record.mainImage || record.images?.[0])

  return (
    <Reorder.Item
      value={record}
      as="div"
      className="product-detail__variation-row"
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      whileDrag={{
        scale: 1.01,
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
        zIndex: 2,
        cursor: 'grabbing',
      }}
      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
    >
      <button
        type="button"
        className="product-detail__drag-handle"
        aria-label="Перетащить вариацию"
        onPointerDown={event => controls.start(event)}
      >
        <HolderOutlined />
      </button>
      <div className="product-detail__thumb-wrap">
        {thumb ? (
          <img src={thumb} alt="" className="product-detail__thumb" />
        ) : (
          <div className="product-detail__thumb-placeholder" />
        )}
      </div>
      <Link
        to={`/products/${productId}/variations/${record.id}`}
        className="product-detail__cell-text"
      >
        {record.name}
      </Link>
      <span className="product-detail__sku" title={record.sku}>
        {record.sku}
      </span>
      <div className="product-detail__meta">
        <span className="product-detail__price">
          {Number(record.price || 0).toLocaleString('ru-RU')} ₽
        </span>
        <span className="product-detail__status">
          <Tag color={record.isActive ? 'green' : 'default'}>
            {record.isActive ? 'Активна' : 'Скрыта'}
          </Tag>
        </span>
      </div>
      <div className="product-detail__row-actions">
        <Space size={0} wrap>
          <Link to={`/products/${productId}/variations/${record.id}`}>
            <Button type="link">Редактировать</Button>
          </Link>
          <Link to={`/products/${productId}/variations/${record.id}/stock`}>
            <Button type="link">Сток</Button>
          </Link>
          <Button type="link" danger onClick={() => onDelete(record)}>
            Удалить
          </Button>
        </Space>
      </div>
    </Reorder.Item>
  )
}

export default function ProductDetailPage() {
  const { productId = '' } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { openNotification, contextHolder } = useNotificationHandler()
  const [form] = Form.useForm<ProductFormValues>()
  const [orderedVariations, setOrderedVariations] = useState<ProductVariation[]>([])
  const orderedRef = useRef(orderedVariations)

  const { data, isLoading, isError } = useGetProductByIdQuery(productId, {
    skip: !productId,
  })
  const { data: categoriesResponse } = useGetCategoriesTreeQuery()
  const [updateProduct, { isLoading: isSaving }] = useUpdateProductMutation()
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()
  const [deleteVariation] = useDeleteProductVariationMutation()
  const [reorderVariations, { isLoading: isReordering }] = useReorderProductVariationsMutation()

  const product = data?.data

  const categoryOptions = useMemo(
    () => flattenCategories(categoriesResponse?.data ?? []),
    [categoriesResponse?.data]
  )

  useEffect(() => {
    if (!product) return
    form.setFieldsValue({
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
      showOnLanding: product.showOnLanding ?? false,
    })
    setOrderedVariations(sortVariations(product.variations ?? []))
  }, [form, product])

  useEffect(() => {
    orderedRef.current = orderedVariations
  }, [orderedVariations])

  const persistOrder = useCallback(
    async (next: ProductVariation[]) => {
      if (!productId || next.length < 2) return
      const prevIds = sortVariations(product?.variations ?? [])
        .map(item => item.id)
        .join(',')
      const nextIds = next.map(item => item.id).join(',')
      if (prevIds === nextIds) return

      try {
        await reorderVariations({
          productId,
          orderedIds: next.map(item => item.id),
        }).unwrap()
        openNotification('success', ['Порядок вариаций сохранён'])
      } catch {
        openNotification('error', ['Не удалось сохранить порядок вариаций'])
        if (product?.variations) {
          setOrderedVariations(sortVariations(product.variations))
        }
      }
    },
    [openNotification, product?.variations, productId, reorderVariations]
  )

  const handleDragEnd = useCallback(() => {
    void persistOrder(orderedRef.current)
  }, [persistOrder])

  const handleDeleteVariation = useCallback(
    (variation: ProductVariation) => {
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
            await deleteVariation({ id: variation.id, productId }).unwrap()
            openNotification('success', ['Вариация удалена'])
          } catch {
            openNotification('error', ['Не удалось удалить вариацию'])
            throw new Error('delete failed')
          }
        },
      })
    },
    [deleteVariation, openNotification, productId]
  )

  const handleSave = async () => {
    if (!product) return

    try {
      const values = await form.validateFields()
      const body: ProductUpdatePayload = {
        name: values.name.trim(),
        slug: values.slug.trim(),
        description: values.description?.trim() || undefined,
        modelParameters: values.modelParameters?.trim() || undefined,
        price: values.price,
        categoryId: values.categoryId,
        brand: values.brand.trim(),
        material: values.material.trim(),
        isActive: values.isActive,
        isFeatured: values.isFeatured,
        showOnLanding: values.showOnLanding,
        images: product.images,
      }

      await updateProduct({ id: product.id, body }).unwrap()
      openNotification('success', ['Товар сохранён'])
    } catch (error) {
      if (error && typeof error === 'object' && 'errorFields' in error) {
        return
      }
      openNotification('error', ['Не удалось сохранить товар'])
    }
  }

  const handleDelete = () => {
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

  if (isError) {
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
      <PageHeader
        title={product?.name || 'Товар'}
        subtitle={product ? `slug: ${product.slug}` : 'Загрузка...'}
        actions={
          <Space>
            <Button onClick={() => navigate('/products')}>К списку</Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              loading={isDeleting}
              disabled={!product}
              onClick={handleDelete}
            >
              Удалить
            </Button>
            <Button type="primary" loading={isSaving} onClick={() => void handleSave()}>
              Сохранить
            </Button>
          </Space>
        }
      />

      <section className="product-detail__section">
        <h2 className="product-detail__section-title">Основные данные</h2>
        <Form form={form} layout="vertical" disabled={isLoading || !product}>
          <div className="product-detail__grid">
            <Form.Item
              label="Название"
              name="name"
              rules={[{ required: true, message: 'Укажите название' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Slug"
              name="slug"
              rules={[{ required: true, message: 'Укажите slug' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Цена"
              name="price"
              rules={[{ required: true, message: 'Укажите цену' }]}
            >
              <InputNumber min={0.01} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="Категория"
              name="categoryId"
              rules={[{ required: true, message: 'Выберите категорию' }]}
            >
              <Select
                options={categoryOptions}
                showSearch
                optionFilterProp="label"
                placeholder="Категория"
              />
            </Form.Item>
            <Form.Item
              label="Бренд"
              name="brand"
              rules={[{ required: true, message: 'Укажите бренд' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Материал"
              name="material"
              rules={[{ required: true, message: 'Укажите материал' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={productSwitchLabel('На витрине', PRODUCT_SWITCH_TOOLTIPS.isActive)}
              name="isActive"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label={productSwitchLabel('Рекомендуемый', PRODUCT_SWITCH_TOOLTIPS.isFeatured)}
              name="isFeatured"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label={productSwitchLabel(
                'На главной лендинга',
                PRODUCT_SWITCH_TOOLTIPS.showOnLanding
              )}
              name="showOnLanding"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item className="product-detail__full" label="Описание" name="description">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              className="product-detail__full"
              label="Параметры модели"
              name="modelParameters"
            >
              <Input.TextArea rows={2} />
            </Form.Item>
          </div>
        </Form>
      </section>

      <section className="product-detail__section">
        <div className="product-detail__section-head">
          <h2 className="product-detail__section-title">Вариации</h2>
          <Button type="primary" onClick={() => navigate(`/products/${productId}/variations/new`)}>
            Добавить вариацию
          </Button>
        </div>
        {isLoading ? (
          <p className="product-detail__variations-empty">Загрузка...</p>
        ) : !orderedVariations.length ? (
          <p className="product-detail__variations-empty">У товара пока нет вариаций</p>
        ) : (
          <div className={`product-detail__variations ${isReordering ? 'is-reordering' : ''}`}>
            <div className="product-detail__variations-scroll">
              <div className="product-detail__variations-head">
                <span />
                <span>Фото</span>
                <span>Название</span>
                <span>SKU</span>
                <span>Цена</span>
                <span>Статус</span>
                <span />
              </div>
              <Reorder.Group
                axis="y"
                values={orderedVariations}
                onReorder={setOrderedVariations}
                as="div"
                className="product-detail__variations-list"
              >
                {orderedVariations.map(record => (
                  <VariationSortableRow
                    key={record.id}
                    record={record}
                    productId={productId}
                    onDragEnd={handleDragEnd}
                    onDelete={handleDeleteVariation}
                  />
                ))}
              </Reorder.Group>
            </div>
          </div>
        )}
      </section>

      <div className="product-detail__footer">
        <Button onClick={() => navigate('/products')}>Отмена</Button>
        <Button type="primary" loading={isSaving} onClick={() => void handleSave()}>
          Сохранить
        </Button>
      </div>
    </Container>
  )
}
