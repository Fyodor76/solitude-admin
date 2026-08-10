import { useEffect, useMemo, useState } from 'react'

import {
  useDeleteStockItemMutation,
  useGetStockByProductQuery,
  useGetStockByVariationIdsQuery,
  useSearchProductsQuery,
  useUpdateStockItemMutation,
} from '@/shared/lib/api/products/Products'
import { StockItem } from '@/shared/lib/api/products/types'
import { useGetAllSizeParametersQuery } from '@/shared/lib/api/size-parameters/SizeParameters'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import { resolveMediaUrl } from '@/shared/lib/utils/resolveMediaUrl'
import { ColorDot } from '@/shared/ui/color-swatches'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { DeleteOutlined } from '@ant-design/icons'
import { Alert, Button, Empty, Input, InputNumber, Modal, Select, Space, Tag } from 'antd'
import { Link } from 'react-router-dom'

import { Product, ProductVariation } from '@/app/types/product'

import './StockPage.scss'

type StockAvailabilityFilter = 'all' | 'attention' | 'in_stock' | 'out_of_stock'

type StockRow = StockItem & {
  productName: string
  variationName: string
  variationSku: string
  sizeLabel: string
  draftSku: string
  draftQuantity: number
  draftLocation: string
  color?: ProductVariation['color']
  thumbUrl: string | null
}

type VariationGroup = {
  variationId: string
  productId: string
  variationName: string
  variationSku: string
  color?: ProductVariation['color']
  thumbUrl: string | null
  totalAvailable: number
  totalQuantity: number
  rows: StockRow[]
}

type ProductGroup = {
  productId: string
  productName: string
  totalAvailable: number
  variations: VariationGroup[]
}

const LOW_STOCK_THRESHOLD = 2

function isEmptyPlaceholder(item: StockItem): boolean {
  return (
    !item.sizeId &&
    (item.quantity ?? 0) === 0 &&
    (item.reserved ?? 0) === 0 &&
    String(item.sku || '').startsWith('EMPTY-')
  )
}

function stockLevel(available: number): 'ok' | 'low' | 'out' {
  if (available <= 0) return 'out'
  if (available <= LOW_STOCK_THRESHOLD) return 'low'
  return 'ok'
}

function stockLevelClass(available: number): string {
  return `stock-page__qty stock-page__qty--${stockLevel(available)}`
}

function getVariationThumb(variation?: ProductVariation, product?: Product): string | null {
  const raw = variation?.mainImage || variation?.images?.[0] || product?.images?.[0] || null
  return resolveMediaUrl(raw)
}

export default function StockPage() {
  const { openNotification, contextHolder } = useNotificationHandler()
  const [search, setSearch] = useState('')
  const [productId, setProductId] = useState<string | undefined>()
  const [availability, setAvailability] = useState<StockAvailabilityFilter>('in_stock')
  const [rows, setRows] = useState<StockRow[]>([])

  const { data: productsResponse, isLoading: isProductsLoading } = useSearchProductsQuery({
    limit: 100,
    page: 1,
    sort: 'sort_order',
    isActiveFilter: 'all',
  })
  const products = productsResponse?.data ?? []

  const variationMeta = useMemo(() => {
    const byVariationId = new Map<
      string,
      {
        productId: string
        productName: string
        variationName: string
        variationSku: string
        color?: ProductVariation['color']
        thumbUrl: string | null
      }
    >()

    for (const product of products) {
      for (const variation of product.variations ?? []) {
        byVariationId.set(variation.id, {
          productId: product.id,
          productName: product.name,
          variationName: variation.name,
          variationSku: variation.sku || '',
          color: variation.color,
          thumbUrl: getVariationThumb(variation, product),
        })
      }
    }

    return byVariationId
  }, [products])

  const allVariationIds = useMemo(() => [...variationMeta.keys()], [variationMeta])

  const productVariationIds = useMemo(() => {
    if (!productId) return []
    const product = products.find(item => item.id === productId)
    return (product?.variations ?? []).map(item => item.id)
  }, [productId, products])

  const {
    data: stockByProductResponse,
    isLoading: isStockByProductLoading,
    isFetching: isStockByProductFetching,
  } = useGetStockByProductQuery(productId || '', { skip: !productId })

  const {
    data: stockBatchResponse,
    isLoading: isStockBatchLoading,
    isFetching: isStockBatchFetching,
  } = useGetStockByVariationIdsQuery(allVariationIds, {
    skip: Boolean(productId) || !allVariationIds.length,
  })

  const { data: sizesResponse } = useGetAllSizeParametersQuery()
  const sizeLabelById = useMemo(() => {
    const map = new Map<string, string>()
    for (const size of sizesResponse?.data ?? []) {
      if (!size.id) continue
      map.set(
        size.id,
        size.russianSize
          ? `${size.internationalSize} / ${size.russianSize}`
          : size.internationalSize
      )
    }
    return map
  }, [sizesResponse?.data])

  const [updateStockItem, { isLoading: isUpdating }] = useUpdateStockItemMutation()
  const [deleteStockItem, { isLoading: isDeleting }] = useDeleteStockItemMutation()

  const rawStockItems = productId
    ? (stockByProductResponse?.data ?? [])
    : (stockBatchResponse?.data ?? [])

  useEffect(() => {
    const items = rawStockItems.filter(item => !isEmptyPlaceholder(item))

    setRows(
      items.map(item => {
        const meta = variationMeta.get(item.variationId)
        return {
          ...item,
          productName: meta?.productName || '—',
          variationName: meta?.variationName || '—',
          variationSku: meta?.variationSku || '',
          sizeLabel: item.sizeId ? sizeLabelById.get(item.sizeId) || item.sizeId : 'Без размера',
          draftSku: item.sku || '',
          draftQuantity: item.quantity ?? 0,
          draftLocation: item.location || '',
          color: meta?.color,
          thumbUrl: meta?.thumbUrl ?? null,
        }
      })
    )
  }, [rawStockItems, sizeLabelById, variationMeta])

  const productOptions = useMemo(
    () =>
      products.map(product => ({
        value: product.id,
        label: product.name,
      })),
    [products]
  )

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()

    return rows.filter(row => {
      if (productId && row.productId !== productId) return false

      const available = row.available ?? 0
      if (availability === 'in_stock' && available <= 0) return false
      if (availability === 'out_of_stock' && available > 0) return false
      if (availability === 'attention' && available > LOW_STOCK_THRESHOLD) return false

      if (!query) return true

      return (
        row.productName.toLowerCase().includes(query) ||
        row.variationName.toLowerCase().includes(query) ||
        row.variationSku.toLowerCase().includes(query) ||
        row.draftSku.toLowerCase().includes(query) ||
        row.sizeLabel.toLowerCase().includes(query) ||
        (row.draftLocation || '').toLowerCase().includes(query)
      )
    })
  }, [availability, productId, rows, search])

  const productGroups = useMemo(() => {
    const byProduct = new Map<string, ProductGroup>()

    for (const row of filteredRows) {
      let productGroup = byProduct.get(row.productId)
      if (!productGroup) {
        productGroup = {
          productId: row.productId,
          productName: row.productName,
          totalAvailable: 0,
          variations: [],
        }
        byProduct.set(row.productId, productGroup)
      }

      let variationGroup = productGroup.variations.find(
        item => item.variationId === row.variationId
      )
      if (!variationGroup) {
        variationGroup = {
          variationId: row.variationId,
          productId: row.productId,
          variationName: row.variationName,
          variationSku: row.variationSku,
          color: row.color,
          thumbUrl: row.thumbUrl,
          totalAvailable: 0,
          totalQuantity: 0,
          rows: [],
        }
        productGroup.variations.push(variationGroup)
      }

      variationGroup.rows.push(row)
      variationGroup.totalAvailable += row.available ?? 0
      variationGroup.totalQuantity += row.draftQuantity ?? 0
      productGroup.totalAvailable += row.available ?? 0
    }

    return [...byProduct.values()]
  }, [filteredRows])

  const attentionCount = useMemo(
    () => rows.filter(row => (row.available ?? 0) <= LOW_STOCK_THRESHOLD).length,
    [rows]
  )

  const patchRow = (id: string, patch: Partial<StockRow>) => {
    setRows(prev => prev.map(row => (row.id === id ? { ...row, ...patch } : row)))
  }

  const handleSaveRow = async (row: StockRow) => {
    try {
      await updateStockItem({
        id: row.id,
        variationId: row.variationId,
        body: {
          sku: row.draftSku.trim() || undefined,
          quantity: Number(row.draftQuantity) || 0,
          location: row.draftLocation.trim() || undefined,
        },
      }).unwrap()
      openNotification('success', ['Позиция сохранена'])
    } catch {
      openNotification('error', ['Не удалось сохранить позицию'])
    }
  }

  const handleDeleteRow = (row: StockRow) => {
    Modal.confirm({
      title: 'Удалить позицию склада?',
      content: (
        <>
          {row.productName} · {row.variationName} · {row.sizeLabel}
        </>
      ),
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await deleteStockItem({ id: row.id, variationId: row.variationId }).unwrap()
          openNotification('success', ['Позиция удалена'])
        } catch {
          openNotification('error', ['Не удалось удалить позицию'])
          throw new Error('delete failed')
        }
      },
    })
  }

  const isLoading =
    isProductsLoading ||
    (productId ? isStockByProductLoading : isStockBatchLoading) ||
    (!productId && !allVariationIds.length && isProductsLoading)

  const isFetching = productId ? isStockByProductFetching : isStockBatchFetching
  const busy = isFetching || isUpdating || isDeleting

  return (
    <Container className="stock-page admin-page">
      {contextHolder}
      <PageHeader
        title="Склад"
        subtitle="Остатки сгруппированы по товару и вариации. Красный — нет, жёлтый — мало (≤2)."
      />

      <div className="stock-page__filters">
        <Input.Search
          allowClear
          placeholder="Поиск: товар, вариация, SKU, размер..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="stock-page__search"
        />
        <Select
          allowClear
          showSearch
          optionFilterProp="label"
          placeholder="Товар"
          options={productOptions}
          value={productId}
          onChange={value => setProductId(value)}
          className="stock-page__product"
        />
        <Select
          value={availability}
          onChange={value => setAvailability(value)}
          className="stock-page__availability"
          options={[
            {
              value: 'attention',
              label: attentionCount ? `Мало / нет (${attentionCount})` : 'Мало / нет',
            },
            { value: 'all', label: 'Все остатки' },
            { value: 'in_stock', label: 'В наличии' },
            { value: 'out_of_stock', label: 'Нет в наличии' },
          ]}
        />
      </div>

      {productId && !productVariationIds.length ? (
        <Alert
          type="info"
          showIcon
          message="У выбранного товара нет вариаций"
          style={{ marginBottom: 16 }}
        />
      ) : null}

      <section className={`stock-page__section ${busy ? 'is-busy' : ''}`}>
        {isLoading ? (
          <Empty description="Загрузка..." />
        ) : !productGroups.length ? (
          availability === 'attention' && !search.trim() && !productId && rows.length > 0 ? (
            <Empty
              description="Критичных остатков нет — всё выше 2 шт."
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={() => setAvailability('all')}>
                Показать все остатки
              </Button>
            </Empty>
          ) : (
            <Empty description="Позиции склада не найдены" />
          )
        ) : (
          <div className="stock-page__groups">
            {productGroups.map(product => (
              <article key={product.productId} className="stock-page__product-group">
                <header className="stock-page__product-head">
                  <div className="stock-page__product-title">
                    <Link to={`/products/${product.productId}`}>{product.productName}</Link>
                    <span className="stock-page__muted">
                      {product.variations.length} вар. · доступно{' '}
                      <strong className={stockLevelClass(product.totalAvailable)}>
                        {product.totalAvailable}
                      </strong>
                    </span>
                  </div>
                </header>

                <div className="stock-page__variations">
                  {product.variations.map(variation => (
                    <section key={variation.variationId} className="stock-page__variation">
                      <header className="stock-page__variation-head">
                        <div className="stock-page__variation-identity">
                          {variation.thumbUrl ? (
                            <img src={variation.thumbUrl} alt="" className="stock-page__thumb" />
                          ) : (
                            <div className="stock-page__thumb stock-page__thumb--empty" />
                          )}
                          {variation.color ? <ColorDot color={variation.color} size="md" /> : null}
                          <div className="stock-page__variation-text">
                            <Link
                              to={`/products/${variation.productId}/variations/${variation.variationId}`}
                            >
                              {variation.variationName}
                            </Link>
                            {variation.variationSku ? (
                              <span className="stock-page__muted">{variation.variationSku}</span>
                            ) : null}
                          </div>
                        </div>
                        <div className="stock-page__variation-meta">
                          <Tag
                            color={
                              stockLevel(variation.totalAvailable) === 'out'
                                ? 'error'
                                : stockLevel(variation.totalAvailable) === 'low'
                                  ? 'warning'
                                  : 'success'
                            }
                          >
                            всего {variation.totalAvailable} шт.
                          </Tag>
                          <Link
                            to={`/products/${variation.productId}/variations/${variation.variationId}/stock`}
                          >
                            Открыть сток
                          </Link>
                        </div>
                      </header>

                      <div className="stock-page__rows">
                        <div className="stock-page__rows-head">
                          <span>Размер</span>
                          <span>SKU</span>
                          <span>Кол-во</span>
                          <span>Резерв</span>
                          <span>Доступно</span>
                          <span>Локация</span>
                          <span />
                        </div>
                        {variation.rows.map(row => {
                          const available = row.available ?? 0
                          return (
                            <div key={row.id} className="stock-page__row">
                              <span className="stock-page__cell stock-page__cell--size">
                                {row.sizeLabel === 'Без размера' ? (
                                  <Tag>Без размера</Tag>
                                ) : (
                                  row.sizeLabel
                                )}
                              </span>
                              <Input
                                value={row.draftSku}
                                onChange={e => patchRow(row.id, { draftSku: e.target.value })}
                                className="stock-page__cell stock-page__cell--sku"
                              />
                              <InputNumber
                                min={0}
                                value={row.draftQuantity}
                                className={`stock-page__cell stock-page__cell--qty ${stockLevelClass(row.draftQuantity)}`}
                                onChange={quantity =>
                                  patchRow(row.id, {
                                    draftQuantity: quantity == null ? 0 : Number(quantity),
                                  })
                                }
                              />
                              <span className="stock-page__cell stock-page__cell--reserved stock-page__num">
                                {row.reserved ?? 0}
                              </span>
                              <span
                                className={`stock-page__cell stock-page__cell--available ${stockLevelClass(available)}`}
                              >
                                {available}
                              </span>
                              <Input
                                value={row.draftLocation}
                                placeholder="Склад"
                                className="stock-page__cell stock-page__cell--location"
                                onChange={e => patchRow(row.id, { draftLocation: e.target.value })}
                              />
                              <Space
                                size={0}
                                className="stock-page__cell stock-page__cell--actions"
                                wrap
                              >
                                <Button
                                  type="link"
                                  size="small"
                                  onClick={() => void handleSaveRow(row)}
                                >
                                  Сохранить
                                </Button>
                                <Button
                                  type="link"
                                  size="small"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleDeleteRow(row)}
                                />
                              </Space>
                            </div>
                          )
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </Container>
  )
}
