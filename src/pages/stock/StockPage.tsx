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
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { DeleteOutlined } from '@ant-design/icons'
import { Alert, Button, Empty, Input, InputNumber, Modal, Select, Space, Table, Tag } from 'antd'
import { Link } from 'react-router-dom'

import './StockPage.scss'

type StockAvailabilityFilter = 'all' | 'in_stock' | 'out_of_stock'

type StockRow = StockItem & {
  productName: string
  variationName: string
  variationSku: string
  sizeLabel: string
  draftSku: string
  draftQuantity: number
  draftLocation: string
}

function isEmptyPlaceholder(item: StockItem): boolean {
  return (
    !item.sizeId &&
    (item.quantity ?? 0) === 0 &&
    (item.reserved ?? 0) === 0 &&
    String(item.sku || '').startsWith('EMPTY-')
  )
}

export default function StockPage() {
  const { openNotification, contextHolder } = useNotificationHandler()
  const [search, setSearch] = useState('')
  const [productId, setProductId] = useState<string | undefined>()
  const [availability, setAvailability] = useState<StockAvailabilityFilter>('all')
  const [rows, setRows] = useState<StockRow[]>([])

  const { data: productsResponse, isLoading: isProductsLoading } = useSearchProductsQuery({
    limit: 100,
    page: 1,
    sort: 'sort_order',
  })
  const products = productsResponse?.data ?? []

  const variationMeta = useMemo(() => {
    const byVariationId = new Map<
      string,
      { productId: string; productName: string; variationName: string; variationSku: string }
    >()

    for (const product of products) {
      for (const variation of product.variations ?? []) {
        byVariationId.set(variation.id, {
          productId: product.id,
          productName: product.name,
          variationName: variation.name,
          variationSku: variation.sku || '',
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
      if (availability === 'in_stock' && (row.available ?? 0) <= 0) return false
      if (availability === 'out_of_stock' && (row.available ?? 0) > 0) return false

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

  return (
    <Container className="stock-page admin-page">
      {contextHolder}
      <PageHeader
        title="Склад"
        subtitle="Остатки по товарам и вариациям. Можно править количество прямо в таблице."
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

      <section className="stock-page__section">
        {isLoading ? (
          <Empty description="Загрузка..." />
        ) : !filteredRows.length ? (
          <Empty description="Позиции склада не найдены" />
        ) : (
          <div className="stock-page__table-wrap">
            <Table
              rowKey="id"
              pagination={{ pageSize: 50, showSizeChanger: true }}
              loading={isFetching || isUpdating || isDeleting}
              dataSource={filteredRows}
              scroll={{ x: 1100 }}
              columns={[
                {
                  title: 'Товар',
                  dataIndex: 'productName',
                  render: (value: string, row) => (
                    <Link to={`/products/${row.productId}`}>{value}</Link>
                  ),
                },
                {
                  title: 'Вариация',
                  dataIndex: 'variationName',
                  render: (value: string, row) => (
                    <Link to={`/products/${row.productId}/variations/${row.variationId}`}>
                      {value}
                    </Link>
                  ),
                },
                {
                  title: 'Размер',
                  dataIndex: 'sizeLabel',
                  width: 120,
                  render: (value: string) =>
                    value === 'Без размера' ? <Tag>Без размера</Tag> : value,
                },
                {
                  title: 'SKU',
                  dataIndex: 'draftSku',
                  width: 220,
                  render: (_value, row) => (
                    <Input
                      value={row.draftSku}
                      onChange={e => patchRow(row.id, { draftSku: e.target.value })}
                    />
                  ),
                },
                {
                  title: 'Кол-во',
                  dataIndex: 'draftQuantity',
                  width: 110,
                  render: (_value, row) => (
                    <InputNumber
                      min={0}
                      value={row.draftQuantity}
                      onChange={quantity =>
                        patchRow(row.id, {
                          draftQuantity: quantity == null ? 0 : Number(quantity),
                        })
                      }
                    />
                  ),
                },
                {
                  title: 'Резерв',
                  dataIndex: 'reserved',
                  width: 80,
                  render: (value: number) => value ?? 0,
                },
                {
                  title: 'Доступно',
                  dataIndex: 'available',
                  width: 90,
                  render: (value: number) => (
                    <Tag color={(value ?? 0) > 0 ? 'green' : 'default'}>{value ?? 0}</Tag>
                  ),
                },
                {
                  title: 'Локация',
                  dataIndex: 'draftLocation',
                  width: 160,
                  render: (_value, row) => (
                    <Input
                      value={row.draftLocation}
                      placeholder="Склад"
                      onChange={e => patchRow(row.id, { draftLocation: e.target.value })}
                    />
                  ),
                },
                {
                  title: '',
                  key: 'actions',
                  width: 200,
                  fixed: 'right',
                  render: (_value, row) => (
                    <Space size={0}>
                      <Button type="link" onClick={() => void handleSaveRow(row)}>
                        Сохранить
                      </Button>
                      <Link to={`/products/${row.productId}/variations/${row.variationId}/stock`}>
                        <Button type="link">Открыть</Button>
                      </Link>
                      <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteRow(row)}
                      />
                    </Space>
                  ),
                },
              ]}
            />
          </div>
        )}
      </section>
    </Container>
  )
}
