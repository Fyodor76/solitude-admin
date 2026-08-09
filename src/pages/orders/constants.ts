import { ORDER_STATUSES, type OrderStatus } from '@/shared/lib/api/orders/types'

export const ORDER_STATUSES_FILTER = ORDER_STATUSES

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  created: 'Заявка получена',
  paid: 'Оплачен · подготовка',
  shipped: 'В пути',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
}

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  created: 'green',
  paid: 'cyan',
  shipped: 'blue',
  delivered: 'success',
  cancelled: 'default',
}

/** Допустимые переходы — как в solitude-core OrderApplication */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  created: ['paid', 'cancelled'],
  paid: ['shipped', 'delivered', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
}

export function formatOrderMoney(value: number): string {
  return `${Number(value || 0).toLocaleString('ru-RU')} ₽`
}

export function formatOrderDate(value?: string): string {
  if (!value) return '—'
  return new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
