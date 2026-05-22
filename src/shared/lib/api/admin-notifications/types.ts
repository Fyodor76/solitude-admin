import type { AdminNotificationKind } from '@/shared/lib/notifications/constants'

export type { AdminNotificationKind }

export type AdminNotificationDto = {
  id: number
  type: AdminNotificationKind
  sourceId: string
  title: string
  body: string | null
  href: string
  payload: Record<string, unknown> | null
  readAt: string | null
  createdAt: string
  updatedAt: string
}

export type AdminNotificationsSummary = {
  unreadCount: number
  supportUnreadCount: number
}

export type AdminNotificationsListParams = {
  unreadOnly?: boolean
  type?: AdminNotificationKind
  limit?: number
  offset?: number
}
