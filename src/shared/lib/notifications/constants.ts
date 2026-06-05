export const ADMIN_NOTIFICATIONS_POLL_MS = 30_000
export const ADMIN_NOTIFICATIONS_LIST_LIMIT = 50
export const ADMIN_NOTIFICATIONS_PAGE_SIZE = 20

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

export const NOTIFICATION_BELL_MOBILE_MEDIA_QUERY = '(max-width: 640px)'

export const NOTIFICATION_BELL_COPY = {
  TITLE: 'Уведомления',
  EMPTY: 'Нет новых уведомлений',
  MARK_ALL_READ: 'Прочитать все',
  ALL_NOTIFICATIONS_FOOTER: 'Все уведомления',
} as const

export const NOTIFICATIONS_PAGE_COPY = {
  TITLE: 'Уведомления',
  SUBTITLE: 'Все события админ-панели: обращения, заказы и системные сообщения.',
  MARK_ALL_READ: 'Прочитать все',
  FILTER_ALL: 'Все',
  FILTER_UNREAD: 'Непрочитанные',
  FILTER_TYPE_ALL: 'Все типы',
  RESET_FILTERS: 'Сбросить',
  EMPTY_ALL: 'Уведомлений пока нет',
  EMPTY_UNREAD: 'Нет непрочитанных уведомлений',
  TOTAL: (total: number) => `Всего: ${total}`,
} as const
