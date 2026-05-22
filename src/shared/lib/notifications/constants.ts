export const ADMIN_NOTIFICATIONS_POLL_MS = 30_000
export const ADMIN_NOTIFICATIONS_LIST_LIMIT = 50

export const ADMIN_NOTIFICATION_KIND = {
  SUPPORT: 'support',
  ORDER: 'order',
  SYSTEM: 'system',
} as const

export type AdminNotificationKind =
  (typeof ADMIN_NOTIFICATION_KIND)[keyof typeof ADMIN_NOTIFICATION_KIND]

export const ADMIN_NOTIFICATION_KIND_LABELS: Record<AdminNotificationKind, string> = {
  [ADMIN_NOTIFICATION_KIND.SUPPORT]: 'Обращение',
  [ADMIN_NOTIFICATION_KIND.ORDER]: 'Заказ',
  [ADMIN_NOTIFICATION_KIND.SYSTEM]: 'Система',
}

export const NOTIFICATION_BELL_COPY = {
  TITLE: 'Уведомления',
  EMPTY: 'Нет новых уведомлений',
  MARK_ALL_READ: 'Прочитать все',
  SUPPORT_FOOTER: 'Все обращения',
  unreadCount: (count: number) => `${count} непрочитанных`,
} as const
