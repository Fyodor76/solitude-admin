import { useEffect, useMemo, useState } from 'react'

import {
  useGetOrderByIdQuery,
  useGetOrderCarriersQuery,
  useUpdateOrderItemCustomPricingMutation,
  useUpdateOrderShipmentMutation,
  useUpdateOrderStatusMutation,
} from '@/shared/lib/api/orders/Orders'
import type { OrderStatus, OrderTrackItem } from '@/shared/lib/api/orders/types'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import {
  Alert,
  Button,
  Empty,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Spin,
  Table,
  Tag,
} from 'antd'
import { Link, useParams } from 'react-router-dom'

import {
  formatOrderDate,
  formatOrderMoney,
  formatOrderShortCode,
  ORDER_STATUS_COLOR,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_TRANSITIONS,
} from './constants'
import './OrdersPage.scss'

type ShipmentFormValues = {
  carrierCode: string
  carrierTrackingNumber?: string
  carrierTrackingUrl?: string
}

const OrderDetailPage = () => {
  const { orderId = '' } = useParams<{ orderId: string }>()
  const { contextHolder, openNotification } = useNotificationHandler()
  const { data, isLoading, isFetching, refetch } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
  })
  const { data: carriersResponse } = useGetOrderCarriersQuery()
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation()
  const [updateShipment, { isLoading: isUpdatingShipment }] = useUpdateOrderShipmentMutation()
  const [updatePricing, { isLoading: isUpdatingPricing }] =
    useUpdateOrderItemCustomPricingMutation()

  const order = data?.data
  const [shipmentForm] = Form.useForm<ShipmentFormValues>()
  const [pricingDrafts, setPricingDrafts] = useState<Record<string, number | null>>({})

  useEffect(() => {
    if (!order) return
    shipmentForm.setFieldsValue({
      carrierCode: order.carrierCode || order.contact?.preferredCarrierCode,
      carrierTrackingNumber: order.carrierTrackingNumber,
      carrierTrackingUrl: order.carrierTrackingUrl,
    })
  }, [order, shipmentForm])

  const nextStatuses = useMemo(() => (order ? ORDER_STATUS_TRANSITIONS[order.status] : []), [order])

  const carrierOptions = (carriersResponse?.data ?? []).map(item => ({
    value: item.code,
    label: item.label,
  }))

  const handleStatusChange = async (status: OrderStatus) => {
    if (!order) return
    try {
      await updateStatus({ orderId: order.id, status }).unwrap()
      openNotification('success', [`Статус: ${ORDER_STATUS_LABEL[status]}`])
    } catch (error: any) {
      openNotification('error', [String(error?.error || 'Не удалось сменить статус')])
    }
  }

  const handleShipmentSave = async (values: ShipmentFormValues) => {
    if (!order) return
    try {
      await updateShipment({
        orderId: order.id,
        carrierCode: values.carrierCode,
        carrierTrackingNumber: values.carrierTrackingNumber?.trim() || undefined,
        carrierTrackingUrl: values.carrierTrackingUrl?.trim() || undefined,
      }).unwrap()
      openNotification('success', ['Данные отправления сохранены'])
    } catch (error: any) {
      openNotification('error', [String(error?.error || 'Не удалось сохранить отправление')])
    }
  }

  const handleApprovePrice = async (item: OrderTrackItem) => {
    if (!order) return
    const price = pricingDrafts[item.id] ?? item.price
    if (!price || price <= 0) {
      openNotification('error', ['Укажите цену больше 0'])
      return
    }
    try {
      await updatePricing({
        orderId: order.id,
        lineItemId: item.id,
        price,
      }).unwrap()
      openNotification('success', ['Цена custom-позиции согласована'])
    } catch (error: any) {
      openNotification('error', [String(error?.error || 'Не удалось сохранить цену')])
    }
  }

  if (isLoading) {
    return (
      <Container className="orders-page admin-page">
        <div className="orders-page__loading">
          <Spin />
        </div>
      </Container>
    )
  }

  if (!order) {
    return (
      <Container className="orders-page admin-page">
        <PageHeader title="Заказ не найден" />
        <Empty description="Заказ не найден или удалён" />
        <Link to="/orders">← К списку заказов</Link>
      </Container>
    )
  }

  const canEditShipment = order.status === 'paid' || order.status === 'shipped'
  const shortCode = formatOrderShortCode(order.trackingId, order.id)

  return (
    <Container className="orders-page admin-page orders-detail">
      {contextHolder}
      <PageHeader
        title={`Заказ ${shortCode}`}
        subtitle={
          <Space wrap size={[8, 8]}>
            <Tag color={ORDER_STATUS_COLOR[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Tag>
            <span>{formatOrderMoney(order.totalAmount)}</span>
            <span className="orders-page__muted">{formatOrderDate(order.createdAt)}</span>
            {order.wasPaid ? <Tag color="green">оплата есть</Tag> : null}
            {order.paymentInProgress ? <Tag color="gold">оплата в процессе</Tag> : null}
            {order.trackingId ? (
              <span className="orders-page__muted">tracking: {order.trackingId}</span>
            ) : null}
          </Space>
        }
        actions={
          <Space wrap>
            <Button loading={isFetching} onClick={() => void refetch()}>
              Обновить
            </Button>
            <Link to="/orders">
              <Button>К списку</Button>
            </Link>
          </Space>
        }
      />

      {nextStatuses.length > 0 ? (
        <section className="orders-detail__section">
          <h2 className="orders-detail__title">Смена статуса</h2>
          <Space wrap>
            {nextStatuses.map(status => (
              <Button
                key={status}
                type={status === 'cancelled' ? 'default' : 'primary'}
                danger={status === 'cancelled'}
                loading={isUpdatingStatus}
                onClick={() => void handleStatusChange(status)}
              >
                {ORDER_STATUS_LABEL[status]}
              </Button>
            ))}
          </Space>
        </section>
      ) : null}

      <section className="orders-detail__section">
        <h2 className="orders-detail__title">Клиент и доставка</h2>
        <div className="orders-detail__grid">
          <div>
            <div className="orders-page__muted">Имя</div>
            <div>{order.contact?.name || '—'}</div>
          </div>
          <div>
            <div className="orders-page__muted">Телефон</div>
            <div>{order.contact?.phone || '—'}</div>
          </div>
          <div>
            <div className="orders-page__muted">Email</div>
            <div>{order.contact?.email || '—'}</div>
          </div>
          <div>
            <div className="orders-page__muted">Город</div>
            <div>{order.contact?.deliveryCity || '—'}</div>
          </div>
          <div>
            <div className="orders-page__muted">ПВЗ</div>
            <div>{order.contact?.pickupPointName || '—'}</div>
          </div>
          <div className="orders-detail__span">
            <div className="orders-page__muted">Адрес</div>
            <div>{order.contact?.pickupPointAddress || order.contact?.address || '—'}</div>
            {typeof order.contact?.pickupPointLat === 'number' &&
            typeof order.contact?.pickupPointLon === 'number' ? (
              <a
                className="orders-detail__map-link"
                href={`https://yandex.ru/maps/?pt=${order.contact.pickupPointLon},${order.contact.pickupPointLat}&z=16&l=map`}
                target="_blank"
                rel="noreferrer"
              >
                Открыть на карте
              </a>
            ) : null}
          </div>
          <div>
            <div className="orders-page__muted">Предпочтительный перевозчик</div>
            <div>
              {order.contact?.preferredCarrierLabel || order.contact?.preferredCarrierCode || '—'}
            </div>
          </div>
          {order.contact?.comment ? (
            <div className="orders-detail__span">
              <div className="orders-page__muted">Комментарий</div>
              <div>{order.contact.comment}</div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="orders-detail__section">
        <h2 className="orders-detail__title">Отправление</h2>
        {!canEditShipment ? (
          <Alert
            type="info"
            showIcon
            message="Трек можно указать в статусах «Оплачен · подготовка» или «В пути»."
          />
        ) : null}
        <Form
          form={shipmentForm}
          layout="vertical"
          className="orders-detail__shipment"
          onFinish={values => void handleShipmentSave(values)}
          disabled={!canEditShipment || isUpdatingShipment}
        >
          <Form.Item
            name="carrierCode"
            label="Перевозчик"
            rules={[{ required: true, message: 'Выберите перевозчика' }]}
          >
            <Select options={carrierOptions} placeholder="Служба доставки" />
          </Form.Item>
          <Form.Item name="carrierTrackingNumber" label="Трек-номер">
            <Input placeholder="Номер у перевозчика" />
          </Form.Item>
          <Form.Item name="carrierTrackingUrl" label="Ссылка на отслеживание">
            <Input placeholder="https://..." />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={isUpdatingShipment}>
            Сохранить отправление
          </Button>
        </Form>
        {order.carrierTrackingUrl ? (
          <p className="orders-detail__track-link">
            Текущая ссылка:{' '}
            <a href={order.carrierTrackingUrl} target="_blank" rel="noreferrer">
              {order.carrierTrackingUrl}
            </a>
          </p>
        ) : null}
      </section>

      <section className="orders-detail__section">
        <h2 className="orders-detail__title">Позиции ({order.itemsCount})</h2>
        <Table
          rowKey="id"
          dataSource={order.items}
          pagination={false}
          scroll={{ x: 900 }}
          columns={[
            {
              title: 'Название',
              dataIndex: 'name',
              render: (name: string, row) => {
                const productHref =
                  row.type === 'product' && row.productId && row.variationId
                    ? `/products/${row.productId}/variations/${row.variationId}`
                    : row.type === 'product' && row.productId
                      ? `/products/${row.productId}`
                      : null

                return (
                  <Space direction="vertical" size={0}>
                    {productHref ? <Link to={productHref}>{name}</Link> : <span>{name}</span>}
                    <Space size={4}>
                      <Tag>{row.type === 'custom' ? 'custom' : 'товар'}</Tag>
                      {row.type === 'custom' && !row.customPricingApprovedAt ? (
                        <Tag color="orange">цена не согласована</Tag>
                      ) : null}
                      {row.type === 'custom' && row.customPricingApprovedAt ? (
                        <Tag color="green">цена ок</Tag>
                      ) : null}
                    </Space>
                  </Space>
                )
              },
            },
            {
              title: 'Размер',
              dataIndex: 'size',
              width: 120,
              render: value => value || '—',
            },
            {
              title: 'Кол-во',
              dataIndex: 'quantity',
              width: 80,
            },
            {
              title: 'Цена',
              key: 'price',
              width: 220,
              render: (_value, row: OrderTrackItem) => {
                if (row.type !== 'custom') {
                  return formatOrderMoney(row.price)
                }
                return (
                  <Space>
                    <InputNumber
                      min={0.01}
                      step={100}
                      value={pricingDrafts[row.id] ?? row.price}
                      onChange={value =>
                        setPricingDrafts(prev => ({
                          ...prev,
                          [row.id]: typeof value === 'number' ? value : null,
                        }))
                      }
                      addonAfter="₽"
                    />
                    <Button
                      size="small"
                      type="primary"
                      loading={isUpdatingPricing}
                      onClick={() => void handleApprovePrice(row)}
                    >
                      Согласовать
                    </Button>
                  </Space>
                )
              },
            },
            {
              title: 'Сумма',
              key: 'lineTotal',
              width: 120,
              render: (_value, row) => formatOrderMoney(row.price * row.quantity),
            },
          ]}
        />
      </section>

      {order.refund?.status ? (
        <Alert
          type="warning"
          showIcon
          message={`Возврат: ${order.refund.status}${
            order.refund.expectedDays ? ` (ожидание ~${order.refund.expectedDays} дн.)` : ''
          }`}
        />
      ) : null}
    </Container>
  )
}

export default OrderDetailPage
