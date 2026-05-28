import { SUPPORT_CHANNEL, SUPPORT_CONVERSATION_STATUS } from '@/shared/lib/api/support/constants'
import type { SupportConversationStatus } from '@/shared/lib/api/support/types'

export const SUPPORT_INBOX_CHANNEL_FILTER = {
  WEB: SUPPORT_CHANNEL.WEB,
  TELEGRAM: SUPPORT_CHANNEL.TELEGRAM,
  ALL: 'all',
} as const

export type SupportInboxChannelFilter =
  (typeof SUPPORT_INBOX_CHANNEL_FILTER)[keyof typeof SUPPORT_INBOX_CHANNEL_FILTER]

export const SUPPORT_INBOX_LIST_TAB = {
  ACTIVE: 'active',
  CLOSED: 'closed',
} as const

export type SupportInboxListTab =
  (typeof SUPPORT_INBOX_LIST_TAB)[keyof typeof SUPPORT_INBOX_LIST_TAB]

export const SUPPORT_INBOX_STATUS_FILTER = {
  ALL: 'all',
  ...SUPPORT_CONVERSATION_STATUS,
} as const

export type SupportInboxStatusFilter =
  | typeof SUPPORT_INBOX_STATUS_FILTER.ALL
  | SupportConversationStatus

export const SUPPORT_INBOX_POLL = {
  INBOX_MS: 12000,
  MESSAGES_MS: 8000,
} as const

export const SUPPORT_INBOX_QUERY_LIMIT = 100

export const SUPPORT_INBOX_MOBILE_MEDIA_QUERY = '(max-width: 1023px)'

export const SUPPORT_INBOX_LAYOUT_CLASS = {
  ROOT: 'support-inbox',
  MOBILE_CHAT: 'support-inbox--mobile-chat',
} as const

/** Layout / timing — значения дублируются в SupportInbox.scss (px). */
export const SUPPORT_INBOX_LAYOUT = {
  SIDEBAR_MIN_WIDTH_PX: 280,
  SIDEBAR_MAX_WIDTH_PX: 360,
  MESSAGES_MAX_HEIGHT_OFFSET_PX: 320,
  PANEL_MIN_HEIGHT_OFFSET_PX: 240,
  MOBILE_MESSAGES_MAX_HEIGHT_OFFSET_PX: 200,
  CHAT_HEADER_CONTAINER_MAX_PX: 560,
  MEDIA_MAX_WIDTH_PX: 240,
  MEDIA_PLACEHOLDER_HEIGHT_PX: 160,
  MEDIA_PLACEHOLDER_MIN_WIDTH_PX: 140,
  COMPOSER_PREVIEW_SIZE_PX: 72,
  COMPOSER_PREVIEW_REMOVE_PX: 22,
} as const

export const SUPPORT_INBOX_SCROLL = {
  IMAGE_LOAD_DELAYS_MS: [150, 450, 900] as const,
  /** Если пользователь выше этого порога от низа — не подскролливать автоматически. */
  NEAR_BOTTOM_THRESHOLD_PX: 80,
} as const

export const SUPPORT_STATUS_LABELS: Record<SupportConversationStatus | string, string> = {
  [SUPPORT_CONVERSATION_STATUS.OPEN]: 'Открыт',
  [SUPPORT_CONVERSATION_STATUS.WAITING_OPERATOR]: 'Ждёт оператора',
  [SUPPORT_CONVERSATION_STATUS.IN_PROGRESS]: 'В работе',
  [SUPPORT_CONVERSATION_STATUS.WAITING_USER]: 'Ждёт клиента',
  [SUPPORT_CONVERSATION_STATUS.CLOSED]: 'Закрыт',
}

export const SUPPORT_STATUS_COLORS: Record<string, string> = {
  [SUPPORT_CONVERSATION_STATUS.OPEN]: '#8c8c8c',
  [SUPPORT_CONVERSATION_STATUS.WAITING_OPERATOR]: '#d48806',
  [SUPPORT_CONVERSATION_STATUS.IN_PROGRESS]: '#1677ff',
  [SUPPORT_CONVERSATION_STATUS.WAITING_USER]: '#52c41a',
  [SUPPORT_CONVERSATION_STATUS.CLOSED]: '#595959',
}

export const SUPPORT_CHANNEL_LABELS = {
  [SUPPORT_CHANNEL.WEB]: 'Сайт',
  [SUPPORT_CHANNEL.TELEGRAM]: 'Telegram',
} as const

export const SUPPORT_INBOX_COPY = {
  PAGE_SUBTITLE: 'Чаты с сайта и Telegram',
  REFRESH_LIST: 'Обновить список',
  SEARCH_PLACEHOLDER: 'Имя, email, телефон…',
  TAB_ACTIVE: 'Активные',
  TAB_CLOSED: 'Закрытые',
  CHANNEL_WEB: 'Сайт',
  CHANNEL_TELEGRAM: 'Telegram',
  CHANNEL_ALL: 'Все',
  STATUS_ALL: 'Все статусы',
  LIST_COUNT: 'в списке',
  WAITING_PILL_TITLE: 'Ждут ответа оператора',
  WAITING_PILL_LABEL: 'ждут оператора',
  EMPTY_SEARCH: 'Ничего не найдено по запросу',
  EMPTY_CLOSED: 'Нет закрытых обращений',
  EMPTY_ACTIVE: 'Нет активных обращений',
  CHAT_EMPTY: 'Выберите обращение слева',
  BACK_TO_LIST: '← К списку',
  TAKE_CONVERSATION: 'Взять в работу',
  CLOSE_CONVERSATION: 'Закрыть диалог',
  REPLY_PLACEHOLDER: 'Напишите ответ клиенту…',
  SEND_REPLY: 'Отправить',
  MESSAGES_LOADING: 'Загрузка сообщений…',
  MESSAGES_SWITCHING: 'Загрузка диалога…',
  MESSAGES_EMPTY: 'Сообщений пока нет',
  CLOSED_BANNER: 'Диалог закрыт. Новые сообщения недоступны.',
  NO_MESSAGES_PREVIEW: 'Без сообщений',
  OPERATOR_PREFIX: 'Оператор:',
  ATTACH_PHOTO: 'Прикрепить фото',
  REMOVE_PHOTO: 'Убрать фото',
  PHOTO_LABEL: 'Фото',
  PHOTO_LOADING: 'Загрузка фото…',
  FILE_LOADING: 'Загрузка файла…',
  FILE_LABEL: 'Файл',
  PHOTO_UNAVAILABLE: 'Не удалось загрузить фото',
  FILE_UNAVAILABLE: 'Не удалось загрузить файл',
} as const

export const SUPPORT_INBOX_SEGMENT_OPTIONS = {
  LIST_TAB: [
    { label: SUPPORT_INBOX_COPY.TAB_ACTIVE, value: SUPPORT_INBOX_LIST_TAB.ACTIVE },
    { label: SUPPORT_INBOX_COPY.TAB_CLOSED, value: SUPPORT_INBOX_LIST_TAB.CLOSED },
  ],
  CHANNEL: [
    { label: SUPPORT_INBOX_COPY.CHANNEL_WEB, value: SUPPORT_INBOX_CHANNEL_FILTER.WEB },
    { label: SUPPORT_INBOX_COPY.CHANNEL_TELEGRAM, value: SUPPORT_INBOX_CHANNEL_FILTER.TELEGRAM },
    { label: SUPPORT_INBOX_COPY.CHANNEL_ALL, value: SUPPORT_INBOX_CHANNEL_FILTER.ALL },
  ],
} as const

export const SUPPORT_INBOX_STATUS_FILTER_OPTIONS: {
  value: SupportInboxStatusFilter
  label: string
}[] = [
  { value: SUPPORT_INBOX_STATUS_FILTER.ALL, label: SUPPORT_INBOX_COPY.STATUS_ALL },
  {
    value: SUPPORT_CONVERSATION_STATUS.WAITING_OPERATOR,
    label: SUPPORT_STATUS_LABELS[SUPPORT_CONVERSATION_STATUS.WAITING_OPERATOR],
  },
  {
    value: SUPPORT_CONVERSATION_STATUS.IN_PROGRESS,
    label: SUPPORT_STATUS_LABELS[SUPPORT_CONVERSATION_STATUS.IN_PROGRESS],
  },
  {
    value: SUPPORT_CONVERSATION_STATUS.WAITING_USER,
    label: SUPPORT_STATUS_LABELS[SUPPORT_CONVERSATION_STATUS.WAITING_USER],
  },
  {
    value: SUPPORT_CONVERSATION_STATUS.OPEN,
    label: SUPPORT_STATUS_LABELS[SUPPORT_CONVERSATION_STATUS.OPEN],
  },
]
