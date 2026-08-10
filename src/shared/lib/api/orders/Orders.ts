import { ApiResponse, baseApi } from '../baseApi'
import type {
  AdminOrderDetail,
  AdminOrderListItem,
  AdminOrdersAttention,
  OrderCarrierOption,
  OrderResponseThin,
  OrdersListQuery,
  OrdersPaginationMeta,
  UpdateOrderItemCustomPricingPayload,
  UpdateOrderShipmentPayload,
  UpdateOrderStatusPayload,
} from './types'

function buildOrdersQuery(params: OrdersListQuery = {}): Record<string, string | number | boolean> {
  const query: Record<string, string | number | boolean> = {
    page: params.page ?? 1,
    limit: params.limit ?? 50,
  }
  if (params.status) query.status = params.status
  if (params.needsCustomPricing) query.needsCustomPricing = true
  if (params.q?.trim()) query.q = params.q.trim()
  return query
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getOrders: builder.query<
      ApiResponse<AdminOrderListItem[], OrdersPaginationMeta>,
      OrdersListQuery | void
    >({
      query: params => ({
        url: '/orders',
        params: buildOrdersQuery(params ?? {}),
      }),
      providesTags: result =>
        result?.data
          ? ['Orders', ...result.data.map(item => ({ type: 'Order' as const, id: item.id }))]
          : ['Orders'],
    }),

    getOrderById: builder.query<ApiResponse<AdminOrderDetail, unknown>, string>({
      query: id => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),

    getOrderCarriers: builder.query<ApiResponse<OrderCarrierOption[], unknown>, void>({
      query: () => '/orders/meta/carriers',
    }),

    getOrdersAttention: builder.query<ApiResponse<AdminOrdersAttention, unknown>, void>({
      query: () => '/orders/meta/attention',
      providesTags: ['OrdersAttention'],
    }),

    updateOrderStatus: builder.mutation<
      ApiResponse<OrderResponseThin, unknown>,
      UpdateOrderStatusPayload
    >({
      query: ({ orderId, status }) => ({
        url: `/orders/${orderId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        'Orders',
        'OrdersAttention',
        { type: 'Order', id: orderId },
      ],
    }),

    updateOrderShipment: builder.mutation<
      ApiResponse<OrderResponseThin, unknown>,
      UpdateOrderShipmentPayload
    >({
      query: ({ orderId, ...body }) => ({
        url: `/orders/${orderId}/shipment`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        'Orders',
        'OrdersAttention',
        { type: 'Order', id: orderId },
      ],
    }),

    updateOrderItemCustomPricing: builder.mutation<
      ApiResponse<OrderResponseThin, unknown>,
      UpdateOrderItemCustomPricingPayload
    >({
      query: ({ orderId, lineItemId, price }) => ({
        url: `/orders/${orderId}/items/${lineItemId}/custom-pricing`,
        method: 'PATCH',
        body: { price },
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        'Orders',
        'OrdersAttention',
        { type: 'Order', id: orderId },
      ],
    }),
  }),
})

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderCarriersQuery,
  useGetOrdersAttentionQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderShipmentMutation,
  useUpdateOrderItemCustomPricingMutation,
} = ordersApi
