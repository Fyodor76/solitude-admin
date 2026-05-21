import { ApiResponse, baseApi } from '../baseApi'
import type {
  AdminReplyResult,
  SupportConversation,
  SupportConversationStatus,
  SupportMessage,
  SupportReplyPayload,
} from './types'

export type SupportInboxQueryParams = {
  channel?: 'web' | 'telegram'
  limit?: number
  offset?: number
  status?: SupportConversationStatus
  closedOnly?: boolean
}

export const supportApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getSupportInbox: builder.query<
      ApiResponse<SupportConversation[], unknown>,
      SupportInboxQueryParams | void
    >({
      query: params => ({
        url: '/support/admin/inbox',
        params: params ?? {},
      }),
      providesTags: ['SupportInbox'],
    }),

    getSupportConversation: builder.query<ApiResponse<SupportConversation, unknown>, number>({
      query: id => `/support/admin/conversations/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'SupportConversation', id }],
    }),

    getSupportMessages: builder.query<ApiResponse<SupportMessage[], unknown>, number>({
      query: id => `/support/admin/conversations/${id}/messages`,
      providesTags: (_r, _e, id) => [{ type: 'SupportMessages', id }],
    }),

    openSupportConversation: builder.mutation<ApiResponse<SupportConversation, unknown>, number>({
      query: id => ({
        url: `/support/admin/conversations/${id}/open`,
        method: 'POST',
      }),
      invalidatesTags: ['SupportInbox', 'SupportConversation', 'SupportMessages'],
    }),

    getSupportTelegramMediaUrl: builder.query<ApiResponse<{ url: string }, unknown>, string>({
      query: fileId => `/support/admin/media/telegram/${encodeURIComponent(fileId)}`,
    }),

    replySupportConversation: builder.mutation<
      ApiResponse<AdminReplyResult, unknown>,
      { id: number } & SupportReplyPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/support/admin/conversations/${id}/reply`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        'SupportInbox',
        { type: 'SupportConversation', id },
        { type: 'SupportMessages', id },
      ],
    }),

    closeSupportConversation: builder.mutation<ApiResponse<SupportConversation, unknown>, number>({
      query: id => ({
        url: `/support/admin/conversations/${id}/close`,
        method: 'POST',
      }),
      invalidatesTags: (_r, _e, id) => [
        'SupportInbox',
        { type: 'SupportConversation', id },
        { type: 'SupportMessages', id },
      ],
    }),
  }),
})

export const {
  useGetSupportInboxQuery,
  useGetSupportMessagesQuery,
  useLazyGetSupportTelegramMediaUrlQuery,
  useOpenSupportConversationMutation,
  useReplySupportConversationMutation,
  useCloseSupportConversationMutation,
} = supportApi
