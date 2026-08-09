import { ApiResponse, baseApi } from '../baseApi'
import type {
  AdminOrderDetail,
  AdminOrderListItem,
  AdminOrdersAttention,
  OrderCarrierOption,
  OrderResponseThin,
  UpdateOrderItemCustomPricingPayload,
  UpdateOrderShipmentPayload,
  UpdateOrderStatusPayload,
} from './types'

export const ordersApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getOrders: builder.query<ApiResponse<AdminOrderListItem[], unknown>, void>({
      query: () => '/orders',
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
