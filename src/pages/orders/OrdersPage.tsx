import { useMemo, useState } from 'react'

import { useMatchMedia } from '@/shared/hooks/useMatchMedia'
import { useGetOrdersQuery } from '@/shared/lib/api/orders/Orders'
import type { AdminOrderListItem, OrderStatus } from '@/shared/lib/api/orders/types'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { Button, Empty, Input, Segmented, Spin, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Link } from 'react-router-dom'

import { ADMIN_MOBILE_SIDEBAR_MEDIA_QUERY } from '@/app/constans/layout'

import {
  formatOrderDate,
  formatOrderMoney,
  ORDER_STATUS_COLOR,
  ORDER_STATUS_LABEL,
  ORDER_STATUSES_FILTER,
} from './constants'
import './OrdersPage.scss'

const OrdersPage = () => {
  const isMobile = useMatchMedia(ADMIN_MOBILE_SIDEBAR_MEDIA_QUERY)
  const { data, isLoading, isFetching, refetch } = useGetOrdersQuery()
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return orders.filter(order => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false
      if (!q) return true
      const haystack = [
        order.id,
        order.trackingId,
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
      title: 'Tracking',
      dataIndex: 'trackingId',
      width: 200,
      render: (value: string | undefined, row) => (
        <Link to={`/orders/${row.id}`}>{value || row.id.slice(0, 8)}</Link>
      ),
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
      title: 'Позиции',
      dataIndex: 'itemsCount',
      width: 100,
      render: (count: number, row) => (
        <span>
          {count}
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
      width: 120,
      render: (_value, row) => {
        if (row.wasPaid) return <Tag color="green">оплачен</Tag>
        if (row.paymentInProgress) return <Tag color="gold">ожидает</Tag>
        return <Tag>нет</Tag>
      },
    },
  ]

  const statusOptions = [
    { label: `Все (${orders.length})`, value: 'all' as const },
    ...ORDER_STATUSES_FILTER.map(status => ({
      label: `${ORDER_STATUS_LABEL[status]} (${statusCounts[status]})`,
      value: status,
    })),
  ]

  return (
    <Container className="orders-page admin-page">
      <PageHeader
        title="Заказы"
        subtitle="Список заказов: статусы, клиенты, custom-цены и доставка."
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
          onChange={value => setStatusFilter(value as OrderStatus | 'all')}
        />
        <Input.Search
          allowClear
          placeholder="Поиск: клиент, телефон, email, tracking..."
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
          {filtered.map(order => (
            <Link key={order.id} to={`/orders/${order.id}`} className="orders-page__card">
              <div className="orders-page__card-head">
                <Tag color={ORDER_STATUS_COLOR[order.status]}>
                  {ORDER_STATUS_LABEL[order.status]}
                </Tag>
                <span className="orders-page__muted">{formatOrderDate(order.createdAt)}</span>
              </div>
              <strong>{order.customerName || order.trackingId || order.id.slice(0, 8)}</strong>
              <div className="orders-page__card-meta">
                <span>{formatOrderMoney(order.totalAmount)}</span>
                <span>{order.itemsCount} поз.</span>
                {order.needsCustomPricing ? <Tag color="orange">нужна цена</Tag> : null}
              </div>
            </Link>
          ))}
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
        />
      )}
    </Container>
  )
}

export default OrdersPage
