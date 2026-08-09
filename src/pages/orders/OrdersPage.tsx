import { useMemo, useState } from 'react'

import { useMatchMedia } from '@/shared/hooks/useMatchMedia'
import { useGetOrdersQuery } from '@/shared/lib/api/orders/Orders'
import type { AdminOrderListItem, OrderStatus } from '@/shared/lib/api/orders/types'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { Button, Empty, Input, Segmented, Spin, Table, Tag, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Link, useNavigate } from 'react-router-dom'

import { ADMIN_MOBILE_SIDEBAR_MEDIA_QUERY } from '@/app/constans/layout'

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

const OrdersPage = () => {
  const navigate = useNavigate()
  const isMobile = useMatchMedia(ADMIN_MOBILE_SIDEBAR_MEDIA_QUERY)
  const { data, isLoading, isFetching, refetch } = useGetOrdersQuery()
  const [statusFilter, setStatusFilter] = useState<OrdersListFilter>('all')
  const [search, setSearch] = useState('')

  const orders = data?.data ?? []

  const statusCounts = useMemo(() => {
    const counts = Object.fromEntries(ORDER_STATUSES_FILTER.map(s => [s, 0])) as Record<
      OrderStatus,
      number
    >
    for (const order of orders) {
      counts[order.status] = (counts[order.status] ?? 0) + 1
    }
    return counts
  }, [orders])

  const needsPricingCount = useMemo(
    () => orders.filter(order => order.needsCustomPricing).length,
    [orders]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return orders.filter(order => {
      if (statusFilter === 'needs_pricing') {
        if (!order.needsCustomPricing) return false
      } else if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false
      }
      if (!q) return true
      const shortCode = order.shortCode || formatOrderShortCode(order.trackingId, order.id)
      const haystack = [
        order.id,
        order.trackingId,
        shortCode,
        order.customerName,
        order.customerPhone,
        order.customerEmail,
        order.carrierTrackingNumber,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [orders, search, statusFilter])

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
    { label: `Все (${orders.length})`, value: 'all' as const },
    {
      label: `Нужна цена (${needsPricingCount})`,
      value: 'needs_pricing' as const,
    },
    ...ORDER_STATUSES_FILTER.map(status => ({
      label: `${ORDER_STATUS_LABEL[status]} (${statusCounts[status]})`,
      value: status,
    })),
  ]

  return (
    <Container className="orders-page admin-page">
      <PageHeader
        title="Заказы"
        subtitle="Статусы, клиенты, доставка и согласование цен custom-позиций."
        actions={
          <Button loading={isFetching} onClick={() => void refetch()}>
            Обновить
          </Button>
        }
      />

      <div className="orders-page__toolbar">
        <Segmented
          className="orders-page__segmented"
          options={statusOptions}
          value={statusFilter}
          onChange={value => setStatusFilter(value as OrdersListFilter)}
        />
        <Input.Search
          allowClear
          placeholder="Клиент, телефон, email, код заказа..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="orders-page__search"
        />
      </div>

      {isLoading ? (
        <div className="orders-page__loading">
          <Spin />
        </div>
      ) : filtered.length === 0 ? (
        <Empty className="orders-page__empty" description="Заказы не найдены" />
      ) : isMobile ? (
        <div className="orders-page__cards">
          {filtered.map(order => {
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
                <div className="orders-page__card-meta">
                  <code className="orders-page__code">{code}</code>
                  <span>{formatOrderMoney(order.totalAmount)}</span>
                  <span>{order.itemsCount ?? 0} поз.</span>
                  {order.needsCustomPricing ? <Tag color="orange">нужна цена</Tag> : null}
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <Table
          className="orders-page__table"
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          loading={isFetching}
          pagination={{ pageSize: 20, showSizeChanger: false }}
          scroll={{ x: 1100 }}
          onRow={row => ({
            onClick: () => navigate(`/orders/${row.id}`),
            className: 'orders-page__row',
          })}
        />
      )}
    </Container>
  )
}

export default OrdersPage
