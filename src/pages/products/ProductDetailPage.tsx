import { useEffect, useMemo } from 'react'

import { useGetCategoriesTreeQuery } from '@/shared/lib/api/categories/Categories'
import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from '@/shared/lib/api/products/Products'
import { ProductUpdatePayload } from '@/shared/lib/api/products/types'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import { resolveMediaUrl } from '@/shared/lib/utils/resolveMediaUrl'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { Button, Form, Input, InputNumber, Select, Space, Switch, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { ProductVariation } from '@/app/types/product'

import './ProductsPage.scss'

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

export default function ProductDetailPage() {
  const { productId = '' } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { openNotification, contextHolder } = useNotificationHandler()
  const [form] = Form.useForm<ProductFormValues>()

  const { data, isLoading, isError } = useGetProductByIdQuery(productId, {
    skip: !productId,
  })
  const { data: categoriesResponse } = useGetCategoriesTreeQuery()
  const [updateProduct, { isLoading: isSaving }] = useUpdateProductMutation()

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
    })
  }, [form, product])

  const variationColumns: ColumnsType<ProductVariation> = [
    {
      title: '',
      dataIndex: 'mainImage',
      width: 64,
      render: (mainImage: string, record) => {
        const src = resolveMediaUrl(mainImage || record.images?.[0])
        return src ? <img src={src} alt="" className="product-detail__thumb" /> : null
      },
    },
    {
      title: 'Название',
      dataIndex: 'name',
      render: (name: string, record) => (
        <Link to={`/products/${productId}/variations/${record.id}`}>{name}</Link>
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 140,
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      width: 120,
      render: (price: number) => `${price.toLocaleString('ru-RU')} ₽`,
    },
    {
      title: 'Статус',
      dataIndex: 'isActive',
      width: 110,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'default'}>{isActive ? 'Активна' : 'Скрыта'}</Tag>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Link to={`/products/${productId}/variations/${record.id}`}>
          <Button type="link">Редактировать</Button>
        </Link>
      ),
    },
  ]

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
            <Form.Item label="Активен" name="isActive" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="В избранном" name="isFeatured" valuePropName="checked">
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
        <h2 className="product-detail__section-title">Вариации</h2>
        <Table<ProductVariation>
          rowKey="id"
          columns={variationColumns}
          dataSource={product?.variations ?? []}
          loading={isLoading}
          pagination={false}
          locale={{ emptyText: 'У товара пока нет вариаций' }}
        />
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
