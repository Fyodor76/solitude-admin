import type { AdminNotificationKind } from './constants'

export type { AdminNotificationKind }

export type AdminNotificationItem = {
  id: string
  kind: AdminNotificationKind
  title: string
  description: string
  href: string
  createdAt: string
  readAt: string | null
  sourceId: string
  payload: Record<string, unknown> | null
}
