import { ApiResponse, baseApi } from '../baseApi'
import type {
  AdminNotificationDto,
  AdminNotificationsListParams,
  AdminNotificationsPaginationMeta,
  AdminNotificationsSummary,
} from './types'

export const adminNotificationsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAdminNotifications: builder.query<
      ApiResponse<AdminNotificationDto[], AdminNotificationsPaginationMeta>,
      AdminNotificationsListParams | void
    >({
      query: params => ({
        url: '/admin/notifications',
        params: params ?? {},
      }),
      providesTags: result =>
        result?.data
          ? [
              'AdminNotifications',
              ...result.data.map(n => ({
                type: 'AdminNotification' as const,
                id: n.id,
              })),
            ]
          : ['AdminNotifications'],
    }),

    getAdminNotificationsSummary: builder.query<
      ApiResponse<AdminNotificationsSummary, unknown>,
      void
    >({
      query: () => '/admin/notifications/summary',
      providesTags: ['AdminNotificationsSummary'],
    }),

    markAdminNotificationRead: builder.mutation<
      ApiResponse<AdminNotificationDto | null, unknown>,
      number
    >({
      query: id => ({
        url: `/admin/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: (_r, _e, id) => [
        'AdminNotifications',
        'AdminNotificationsSummary',
        { type: 'AdminNotification', id },
      ],
    }),

    markAdminNotificationReadBySource: builder.mutation<
      ApiResponse<AdminNotificationDto | null, unknown>,
      string
    >({
      query: sourceId => ({
        url: '/admin/notifications/read-by-source',
        method: 'POST',
        body: { sourceId },
      }),
      invalidatesTags: ['AdminNotifications', 'AdminNotificationsSummary'],
    }),

    markAllAdminNotificationsRead: builder.mutation<
      ApiResponse<{ markedCount: number }, unknown>,
      void
    >({
      query: () => ({
        url: '/admin/notifications/read-all',
        method: 'POST',
      }),
      invalidatesTags: ['AdminNotifications', 'AdminNotificationsSummary'],
    }),
  }),
})

export const {
  useGetAdminNotificationsQuery,
  useGetAdminNotificationsSummaryQuery,
  useMarkAdminNotificationReadMutation,
  useMarkAdminNotificationReadBySourceMutation,
  useMarkAllAdminNotificationsReadMutation,
} = adminNotificationsApi
