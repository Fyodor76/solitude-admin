import { useCallback, useEffect, useRef, useState } from 'react'

import {
  useDeleteProductMutation,
  useReorderProductsMutation,
  useSearchProductsQuery,
} from '@/shared/lib/api/products/Products'
import type { ProductSearchFilters } from '@/shared/lib/api/products/types'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import { resolveMediaUrl } from '@/shared/lib/utils/resolveMediaUrl'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { DeleteOutlined, HolderOutlined } from '@ant-design/icons'
import { Button, Empty, Input, Modal, Pagination, Select, Space, Spin, Tag } from 'antd'
import { Reorder, useDragControls } from 'framer-motion'
import { Link } from 'react-router-dom'

import { Product } from '@/app/types/product'

import './ProductsPage.scss'

const PAGE_SIZE = 20

type ProductListItem = Pick<
  Product,
  'id' | 'name' | 'slug' | 'brand' | 'price' | 'isActive' | 'inStock' | 'images' | 'showOnLanding'
> & {
  variations?: Product['variations']
  sortOrder?: number
}

type ActiveFilter = 'all' | 'active' | 'inactive'
type StockFilter = 'all' | 'in_stock' | 'out_of_stock'
type LandingFilter = 'all' | 'yes' | 'no'

function getProductThumb(product: ProductListItem): string | null {
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

function ProductStatusTags({ product }: { product: ProductListItem }) {
  return (
    <div className="products-page__status">
      <Tag color={product.isActive ? 'green' : 'default'}>
        {product.isActive ? 'На витрине' : 'Скрыт'}
      </Tag>
      <Tag color={product.inStock ? 'blue' : 'orange'}>
        {product.inStock ? 'В наличии' : 'Нет остатка'}
      </Tag>
      {product.showOnLanding ? <Tag color="purple">Главная</Tag> : null}
    </div>
  )
}

function ProductSortableRow({
  product,
  canReorder,
  isDeleting,
  onDelete,
  onDragEnd,
}: {
  product: ProductListItem
  canReorder: boolean
  isDeleting: boolean
  onDelete: (product: ProductListItem) => void
  onDragEnd: () => void
}) {
  const controls = useDragControls()

  return (
    <Reorder.Item
      value={product}
      id={product.id}
      as="li"
      className="products-page__row"
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
      {canReorder ? (
        <button
          type="button"
          className="products-page__drag-handle"
          aria-label="Перетащить товар"
          onPointerDown={event => controls.start(event)}
        >
          <HolderOutlined />
        </button>
      ) : (
        <span className="products-page__drag-spacer" />
      )}

      <ProductThumb product={product} />

      <div className="products-page__name">
        <Link to={`/products/${product.id}`}>{product.name}</Link>
        <span className="products-page__slug">{product.slug}</span>
      </div>

      <span className="products-page__cell products-page__cell--brand">{product.brand}</span>
      <span className="products-page__cell products-page__cell--price">
        {Number(product.price || 0).toLocaleString('ru-RU')} ₽
      </span>
      <span className="products-page__cell products-page__cell--variations">
        {product.variations?.length ?? '—'}
      </span>

      <ProductStatusTags product={product} />

      <Space size={4} className="products-page__actions">
        <Link to={`/products/${product.id}`}>
          <Button type="link">Открыть</Button>
        </Link>
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          aria-label={`Удалить ${product.name}`}
          loading={isDeleting}
          onClick={() => onDelete(product)}
        />
      </Space>
    </Reorder.Item>
  )
}

function buildSearchFilters(input: {
  search: string
  page: number
  activeFilter: ActiveFilter
  stockFilter: StockFilter
  landingFilter: LandingFilter
}): ProductSearchFilters {
  return {
    search: input.search || undefined,
    isActiveFilter: input.activeFilter,
    inStock: input.stockFilter === 'all' ? undefined : input.stockFilter === 'in_stock',
    showOnLanding: input.landingFilter === 'all' ? undefined : input.landingFilter === 'yes',
    sort: 'sort_order',
    page: input.page,
    limit: PAGE_SIZE,
  }
}

export default function ProductsPage() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all')
  const [stockFilter, setStockFilter] = useState<StockFilter>('all')
  const [landingFilter, setLandingFilter] = useState<LandingFilter>('all')
  const [orderedProducts, setOrderedProducts] = useState<ProductListItem[]>([])
  const orderedRef = useRef(orderedProducts)
  const { openNotification, contextHolder } = useNotificationHandler()
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()
  const [reorderProducts, { isLoading: isReordering }] = useReorderProductsMutation()

  const filtersActive =
    Boolean(search) || activeFilter !== 'all' || stockFilter !== 'all' || landingFilter !== 'all'
  const canReorder = !filtersActive

  const { data, isFetching, isError, refetch } = useSearchProductsQuery(
    buildSearchFilters({ search, page, activeFilter, stockFilter, landingFilter })
  )

  const products = (data?.data ?? []) as ProductListItem[]
  const meta = data?.meta

  useEffect(() => {
    setOrderedProducts(products)
  }, [products])

  useEffect(() => {
    orderedRef.current = orderedProducts
  }, [orderedProducts])

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

  const persistOrder = useCallback(
    async (next: ProductListItem[]) => {
      const previousIds = products.map(item => item.id).join(',')
      const nextIds = next.map(item => item.id).join(',')
      if (previousIds === nextIds) return

      const previous = products
      setOrderedProducts(next)
      try {
        await reorderProducts({
          orderedIds: next.map(item => item.id),
          startOrder: (page - 1) * PAGE_SIZE,
        }).unwrap()
        openNotification('success', ['Порядок сохранён'])
      } catch {
        setOrderedProducts(previous)
        openNotification('error', ['Не удалось сохранить порядок'])
      }
    },
    [openNotification, page, products, reorderProducts]
  )

  const handleDragEnd = useCallback(() => {
    if (!canReorder) return
    void persistOrder(orderedRef.current)
  }, [canReorder, persistOrder])

  return (
    <Container className="products-page admin-page">
      {contextHolder}
      <PageHeader
        title="Товары"
        actions={
          <Space wrap>
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
        <Select
          className="products-page__filter"
          value={activeFilter}
          onChange={value => {
            setPage(1)
            setActiveFilter(value)
          }}
          options={[
            { value: 'all', label: 'Витрина: все' },
            { value: 'active', label: 'На витрине' },
            { value: 'inactive', label: 'Скрыты' },
          ]}
        />
        <Select
          className="products-page__filter"
          value={stockFilter}
          onChange={value => {
            setPage(1)
            setStockFilter(value)
          }}
          options={[
            { value: 'all', label: 'Сток: все' },
            { value: 'in_stock', label: 'В наличии' },
            { value: 'out_of_stock', label: 'Нет остатка' },
          ]}
        />
        <Select
          className="products-page__filter"
          value={landingFilter}
          onChange={value => {
            setPage(1)
            setLandingFilter(value)
          }}
          options={[
            { value: 'all', label: 'Главная: все' },
            { value: 'yes', label: 'На главной' },
            { value: 'no', label: 'Не на главной' },
          ]}
        />
      </div>

      {isError ? (
        <AlertError onRetry={() => void refetch()} />
      ) : (
        <Spin spinning={isFetching || isReordering}>
          <div className="products-page__list-wrap">
            <div className="products-page__list-head">
              <span />
              <span />
              <span>Название</span>
              <span>Бренд</span>
              <span>Цена</span>
              <span>Вариации</span>
              <span>Статус</span>
              <span />
            </div>

            {orderedProducts.length === 0 ? (
              <Empty className="products-page__empty" description="Товары не найдены" />
            ) : (
              <Reorder.Group
                axis="y"
                values={orderedProducts}
                onReorder={canReorder ? setOrderedProducts : () => undefined}
                as="ul"
                className="products-page__list"
              >
                {orderedProducts.map(product => (
                  <ProductSortableRow
                    key={product.id}
                    product={product}
                    canReorder={canReorder}
                    isDeleting={isDeleting}
                    onDelete={handleDelete}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </Reorder.Group>
            )}
          </div>

          <div className="products-page__pagination">
            <Pagination
              current={page}
              pageSize={PAGE_SIZE}
              total={meta?.total ?? 0}
              showSizeChanger={false}
              onChange={nextPage => setPage(nextPage)}
            />
          </div>
        </Spin>
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
