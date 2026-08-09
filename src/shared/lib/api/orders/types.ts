export const ORDER_STATUSES = ['created', 'paid', 'shipped', 'delivered', 'cancelled'] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export type OrderItemType = 'product' | 'custom'

export interface OrderCarrierOption {
  code: string
  label: string
}

export interface AdminOrderListItem {
  id: string
  trackingId?: string
  status: OrderStatus
  totalAmount: number
  createdAt: string
  updatedAt?: string
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  itemsCount: number
  hasCustomItems: boolean
  needsCustomPricing?: boolean
  wasPaid?: boolean
  paymentInProgress?: boolean
  carrierCode?: string
  carrierLabel?: string
  carrierTrackingNumber?: string
}

export interface OrderTrackContact {
  name?: string
  phone?: string
  email?: string
  address?: string
  deliveryCity?: string
  pickupPointId?: string
  pickupPointName?: string
  pickupPointAddress?: string
  comment?: string
  preferredCarrierCode?: string
  preferredCarrierLabel?: string
}

export interface OrderTrackItem {
  id: string
  itemId: string
  type: OrderItemType
  name: string
  quantity: number
  size?: string
  sku?: string
  price: number
  customPricingApprovedAt?: string
}

export interface OrderTrackNotifications {
  emailEnabled?: boolean
  telegramEnabled?: boolean
  telegramLinkUrl?: string
  telegramLinked?: boolean
  telegramSubscribersCount?: number
}

export interface OrderTrackRefund {
  status?: 'pending' | 'succeeded' | 'canceled' | null
  expectedDays?: number
}

export interface AdminOrderDetail {
  id: string
  trackingId?: string
  formId: string
  totalAmount: number
  status: OrderStatus
  createdAt: string
  updatedAt?: string
  itemsCount: number
  items: OrderTrackItem[]
  contact?: OrderTrackContact
  notifications?: OrderTrackNotifications
  carrierCode?: string
  carrierLabel?: string
  carrierTrackingNumber?: string
  carrierTrackingUrl?: string
  wasPaid?: boolean
  paymentInProgress?: boolean
  refund?: OrderTrackRefund
}

/** Ответ PATCH статуса / доставки / custom pricing (без позиций) */
export interface OrderResponseThin {
  id: string
  trackingId?: string
  formId: string
  totalAmount: number
  status: OrderStatus
  createdAt: string
  updatedAt?: string
  carrierCode?: string
  carrierLabel?: string
  carrierTrackingNumber?: string
  carrierTrackingUrl?: string
}

export interface UpdateOrderStatusPayload {
  orderId: string
  status: OrderStatus
}

export interface UpdateOrderShipmentPayload {
  orderId: string
  carrierCode: string
  carrierTrackingNumber?: string
  carrierTrackingUrl?: string
}

export interface UpdateOrderItemCustomPricingPayload {
  orderId: string
  lineItemId: string
  price: number
}
