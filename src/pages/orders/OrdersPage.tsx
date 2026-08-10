import { useEffect, useMemo, useState } from 'react'

import { useMatchMedia } from '@/shared/hooks/useMatchMedia'
import { useGetOrdersAttentionQuery, useGetOrdersQuery } from '@/shared/lib/api/orders/Orders'
import type { AdminOrderListItem, OrderStatus } from '@/shared/lib/api/orders/types'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import {
  Button,
  Empty,
  Input,
  Pagination,
  Segmented,
  Select,
  Spin,
  Table,
  Tag,
  Tooltip,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Link, useNavigate } from 'react-router-dom'

import {
  ADMIN_COMPACT_LAYOUT_MEDIA_QUERY,
  ADMIN_MOBILE_SIDEBAR_MEDIA_QUERY,
} from '@/app/constans/layout'

import {
  formatOrderDate,
  formatOrderMoney,
  formatOrderShortCode,
  ORDER_STATUS_COLOR,
  ORDER_STATUS_LABEL,
  ORDER_STATUSES_FILTER,
  type OrdersListFilter,
} from './constants'
import './OrdersPage.scss'

const PAGE_SIZE = 50
const SEARCH_DEBOUNCE_MS = 300

const OrdersPage = () => {
  const navigate = useNavigate()
  const isMobile = useMatchMedia(ADMIN_MOBILE_SIDEBAR_MEDIA_QUERY)
  const isCompact = useMatchMedia(ADMIN_COMPACT_LAYOUT_MEDIA_QUERY)

  const [statusFilter, setStatusFilter] = useState<OrdersListFilter>('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [statusFilter, debouncedSearch])

  const listQuery = useMemo(() => {
    const base = { page, limit: PAGE_SIZE, q: debouncedSearch || undefined }
    if (statusFilter === 'needs_pricing') {
      return { ...base, needsCustomPricing: true as const }
    }
    if (statusFilter !== 'all') {
      return { ...base, status: statusFilter }
    }
    return base
  }, [page, statusFilter, debouncedSearch])

  const { data, isLoading, isFetching, refetch } = useGetOrdersQuery(listQuery)
  const { data: attentionData } = useGetOrdersAttentionQuery()

  const orders = data?.data ?? []
  const total = data?.meta?.total ?? 0
  const attention = attentionData?.data
  const statusCounts = attention?.statusCounts
  const needsPricingCount = attention?.needsCustomPricingCount ?? 0
  const totalCount = attention?.totalCount ?? total

  const columns: ColumnsType<AdminOrderListItem> = [
    {
      title: 'Дата',
      dataIndex: 'createdAt',
      width: 150,
      render: value => formatOrderDate(value),
    },
    {
      title: (
        <Tooltip title="Короткий код заказа для поиска и поддержки. Не путать с трек-номером службы доставки.">
          Код
        </Tooltip>
      ),
      key: 'shortCode',
      width: 110,
      render: (_value, row) => {
        const code = row.shortCode || formatOrderShortCode(row.trackingId, row.id)
        return (
          <Link
            to={`/orders/${row.id}`}
            className="orders-page__code"
            onClick={e => e.stopPropagation()}
          >
            {code}
          </Link>
        )
      },
    },
    {
      title: 'Клиент',
      key: 'customer',
      render: (_value, row) => (
        <div className="orders-page__client">
          <span>{row.customerName || '—'}</span>
          {row.customerPhone ? (
            <span className="orders-page__muted">{row.customerPhone}</span>
          ) : null}
          {row.customerEmail ? (
            <span className="orders-page__muted">{row.customerEmail}</span>
          ) : null}
        </div>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      width: 180,
      render: (status: OrderStatus) => (
        <Tag color={ORDER_STATUS_COLOR[status]}>{ORDER_STATUS_LABEL[status]}</Tag>
      ),
    },
    {
      title: 'Сумма',
      dataIndex: 'totalAmount',
      width: 120,
      render: value => formatOrderMoney(value),
    },
    {
      title: 'Поз.',
      dataIndex: 'itemsCount',
      width: 90,
      render: (count: number, row) => (
        <span>
          {count ?? 0}
          {row.needsCustomPricing ? (
            <Tag color="orange" style={{ marginLeft: 8 }}>
              цена
            </Tag>
          ) : row.hasCustomItems ? (
            <Tag style={{ marginLeft: 8 }}>custom</Tag>
          ) : null}
        </span>
      ),
    },
    {
      title: 'Оплата',
      key: 'payment',
      width: 110,
      render: (_value, row) => {
        if (row.wasPaid) return <Tag color="green">да</Tag>
        if (row.paymentInProgress) return <Tag color="gold">ожидает</Tag>
        return <span className="orders-page__muted">нет</span>
      },
    },
  ]

  const statusOptions = [
    { label: `Все (${totalCount})`, value: 'all' as const },
    {
      label: `Нужна цена (${needsPricingCount})`,
      value: 'needs_pricing' as const,
    },
    ...ORDER_STATUSES_FILTER.map(status => ({
      label: `${ORDER_STATUS_LABEL[status]} (${statusCounts?.[status] ?? 0})`,
      value: status,
    })),
  ]

  const paginationNode =
    total > 0 ? (
      <div className="orders-page__pagination">
        <Pagination
          current={page}
          pageSize={PAGE_SIZE}
          total={total}
          showSizeChanger={false}
          onChange={nextPage => setPage(nextPage)}
        />
      </div>
    ) : null

  return (
    <Container className="orders-page admin-page">
      <PageHeader
        title="Заказы"
        subtitle={
          isMobile
            ? 'Статусы, клиенты, доставка и custom-цены.'
            : 'Статусы, клиенты, доставка и согласование цен custom-позиций.'
        }
        actions={
          <Button loading={isFetching} onClick={() => void refetch()} block={isMobile}>
            Обновить
          </Button>
        }
      />

      <div className="orders-page__toolbar">
        {isCompact ? (
          <Select
            className="orders-page__filter-select"
            value={statusFilter}
            options={statusOptions}
            onChange={value => setStatusFilter(value as OrdersListFilter)}
          />
        ) : (
          <div className="orders-page__segmented-wrap">
            <Segmented
              className="orders-page__segmented"
              options={statusOptions}
              value={statusFilter}
              onChange={value => setStatusFilter(value as OrdersListFilter)}
            />
          </div>
        )}
        <Input.Search
          allowClear
          placeholder="Клиент, телефон, email, код..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="orders-page__search"
        />
      </div>

      {isLoading ? (
        <div className="orders-page__loading">
          <Spin />
        </div>
      ) : orders.length === 0 ? (
        <Empty className="orders-page__empty" description="Заказы не найдены" />
      ) : isCompact ? (
        <>
          <Spin spinning={isFetching}>
            <div className="orders-page__cards">
              {orders.map(order => {
                const code = order.shortCode || formatOrderShortCode(order.trackingId, order.id)
                return (
                  <Link key={order.id} to={`/orders/${order.id}`} className="orders-page__card">
                    <div className="orders-page__card-head">
                      <Tag color={ORDER_STATUS_COLOR[order.status]}>
                        {ORDER_STATUS_LABEL[order.status]}
                      </Tag>
                      <span className="orders-page__muted">{formatOrderDate(order.createdAt)}</span>
                    </div>
                    <strong>{order.customerName || code}</strong>
                    {order.customerPhone ? (
                      <span className="orders-page__muted">{order.customerPhone}</span>
                    ) : null}
                    <div className="orders-page__card-meta">
                      <code className="orders-page__code">{code}</code>
                      <span>{formatOrderMoney(order.totalAmount)}</span>
                      <span>{order.itemsCount ?? 0} поз.</span>
                      {order.wasPaid ? <Tag color="green">оплата</Tag> : null}
                      {order.needsCustomPricing ? <Tag color="orange">нужна цена</Tag> : null}
                    </div>
                  </Link>
                )
              })}
            </div>
          </Spin>
          {paginationNode}
        </>
      ) : (
        <div className="orders-page__table-wrap">
          <Table
            className="orders-page__table"
            rowKey="id"
            columns={columns}
            dataSource={orders}
            loading={isFetching}
            pagination={false}
            scroll={{ x: 960 }}
            onRow={row => ({
              onClick: () => navigate(`/orders/${row.id}`),
              className: 'orders-page__row',
            })}
          />
          {paginationNode}
        </div>
      )}
    </Container>
  )
}

export default OrdersPage
