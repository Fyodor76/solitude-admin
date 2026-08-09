import { useCallback, useMemo, useState } from 'react'

import {
  useDeleteProductMutation,
  useSearchProductsQuery,
} from '@/shared/lib/api/products/Products'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import { resolveMediaUrl } from '@/shared/lib/utils/resolveMediaUrl'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { DeleteOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Link } from 'react-router-dom'

import { Product } from '@/app/types/product'

import './ProductsPage.scss'

const PAGE_SIZE = 20

/** Ответ search может быть без variations — учитываем. */
type ProductListItem = Pick<
  Product,
  'id' | 'name' | 'slug' | 'brand' | 'price' | 'isActive' | 'inStock' | 'images'
> & {
  variations?: Product['variations']
}

function getProductThumb(product: ProductListItem): string | null {
  // Источник правды — фото вариации; product.images только запасной вариант
  const variation = product.variations?.[0]
  const raw = variation?.mainImage || variation?.images?.[0] || product.images?.[0] || null
  return resolveMediaUrl(raw)
}

function ProductThumb({ product }: { product: ProductListItem }) {
  const [failed, setFailed] = useState(false)
  const thumb = getProductThumb(product)

  if (!thumb || failed) {
    return <div className="products-page__thumb-placeholder" />
  }

  return <img src={thumb} alt="" className="products-page__thumb" onError={() => setFailed(true)} />
}

export default function ProductsPage() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const { openNotification, contextHolder } = useNotificationHandler()
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()

  const { data, isFetching, isError, refetch } = useSearchProductsQuery({
    search: search || undefined,
    isActiveFilter: 'all',
    sort: 'newest',
    page,
    limit: PAGE_SIZE,
  })

  const products = (data?.data ?? []) as ProductListItem[]
  const meta = data?.meta

  const handleDelete = useCallback(
    (product: ProductListItem) => {
      Modal.confirm({
        title: 'Удалить товар?',
        content: (
          <>
            Будут удалены товар <strong>{product.name}</strong>, его вариации и остатки.
            Восстановить будет невозможно.
          </>
        ),
        okText: 'Удалить',
        okType: 'danger',
        cancelText: 'Отмена',
        onOk: async () => {
          try {
            await deleteProduct(product.id).unwrap()
            openNotification('success', ['Товар удалён'])
          } catch {
            openNotification('error', ['Не удалось удалить товар'])
            throw new Error('delete failed')
          }
        },
      })
    },
    [deleteProduct, openNotification]
  )

  const columns: ColumnsType<ProductListItem> = useMemo(
    () => [
      {
        title: '',
        key: 'thumb',
        width: 64,
        render: (_, record) => <ProductThumb key={record.id} product={record} />,
      },
      {
        title: 'Название',
        dataIndex: 'name',
        render: (name: string, record) => (
          <div className="products-page__name">
            <Link to={`/products/${record.id}`}>{name}</Link>
            <span className="products-page__slug">{record.slug}</span>
          </div>
        ),
      },
      {
        title: 'Бренд',
        dataIndex: 'brand',
        width: 140,
      },
      {
        title: 'Цена',
        dataIndex: 'price',
        width: 120,
        render: (price: number) => `${Number(price || 0).toLocaleString('ru-RU')} ₽`,
      },
      {
        title: 'Вариации',
        dataIndex: 'variations',
        width: 100,
        render: (variations: ProductListItem['variations']) => variations?.length ?? '—',
      },
      {
        title: 'Статус',
        dataIndex: 'isActive',
        width: 220,
        render: (isActive: boolean, record) => (
          <div className="products-page__status">
            <Tag color={isActive ? 'green' : 'default'}>{isActive ? 'Активен' : 'Скрыт'}</Tag>
            <Tag color={record.inStock ? 'blue' : 'orange'}>
              {record.inStock ? 'В наличии' : 'Нет'}
            </Tag>
          </div>
        ),
      },
      {
        title: '',
        key: 'actions',
        width: 140,
        render: (_, record) => (
          <Space size={4}>
            <Link to={`/products/${record.id}`}>
              <Button type="link">Открыть</Button>
            </Link>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              aria-label={`Удалить ${record.name}`}
              loading={isDeleting}
              onClick={() => handleDelete(record)}
            />
          </Space>
        ),
      },
    ],
    [handleDelete, isDeleting]
  )

  return (
    <Container className="products-page admin-page">
      {contextHolder}
      <PageHeader
        title="Товары"
        subtitle="Список товаров каталога: просмотр и редактирование"
        actions={
          <Space>
            <Button loading={isFetching} onClick={() => void refetch()}>
              Обновить
            </Button>
            <Link to="/products/create">
              <Button type="primary">Создать</Button>
            </Link>
          </Space>
        }
      />

      <div className="products-page__toolbar">
        <Input.Search
          className="products-page__search"
          placeholder="Поиск по названию, slug, бренду"
          allowClear
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onSearch={value => {
            setPage(1)
            setSearch(value.trim())
          }}
          enterButton="Найти"
        />
      </div>

      {isError ? (
        <AlertError onRetry={() => void refetch()} />
      ) : (
        <Table<ProductListItem>
          rowKey="id"
          columns={columns}
          dataSource={products}
          loading={isFetching}
          locale={{ emptyText: 'Товары не найдены' }}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total: meta?.total ?? 0,
            showSizeChanger: false,
            onChange: nextPage => setPage(nextPage),
          }}
        />
      )}
    </Container>
  )
}

function AlertError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="products-page__error">
      <p>Не удалось загрузить товары</p>
      <Button onClick={onRetry}>Повторить</Button>
    </div>
  )
}
