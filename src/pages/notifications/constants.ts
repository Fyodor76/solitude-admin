import {
  ADMIN_NOTIFICATION_KIND,
  ADMIN_NOTIFICATION_KIND_LABELS,
  NOTIFICATIONS_PAGE_COPY,
} from '@/shared/lib/notifications'

export type NotificationsFilter = 'all' | 'unread'

export const TYPE_FILTER_OPTIONS = [
  { value: '', label: NOTIFICATIONS_PAGE_COPY.FILTER_TYPE_ALL },
  {
    value: ADMIN_NOTIFICATION_KIND.SUPPORT,
    label: ADMIN_NOTIFICATION_KIND_LABELS.support,
  },
  {
    value: ADMIN_NOTIFICATION_KIND.ORDER,
    label: ADMIN_NOTIFICATION_KIND_LABELS.order,
  },
  {
    value: ADMIN_NOTIFICATION_KIND.SYSTEM,
    label: ADMIN_NOTIFICATION_KIND_LABELS.system,
  },
] as const
