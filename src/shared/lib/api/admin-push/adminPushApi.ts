import { ApiResponse, baseApi } from '../baseApi'

export type AdminPushVapidKeyResponse = {
  publicKey: string | null
  enabled: boolean
}

export type AdminPushSubscribePayload = {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export const adminPushApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAdminPushVapidPublicKey: builder.query<
      ApiResponse<AdminPushVapidKeyResponse, unknown>,
      void
    >({
      query: () => '/admin/push/vapid-public-key',
    }),

    subscribeAdminPush: builder.mutation<
      ApiResponse<{ id: number; endpoint: string }, unknown>,
      AdminPushSubscribePayload
    >({
      query: body => ({
        url: '/admin/push/subscribe',
        method: 'POST',
        body,
      }),
    }),

    unsubscribeAdminPush: builder.mutation<
      ApiResponse<{ removed: boolean }, unknown>,
      { endpoint: string }
    >({
      query: body => ({
        url: '/admin/push/unsubscribe',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useGetAdminPushVapidPublicKeyQuery,
  useSubscribeAdminPushMutation,
  useUnsubscribeAdminPushMutation,
} = adminPushApi
