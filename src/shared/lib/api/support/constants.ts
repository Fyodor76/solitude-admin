import type { SupportConversationStatus } from './types'

export const SUPPORT_CONVERSATION_STATUS = {
  OPEN: 'open',
  WAITING_OPERATOR: 'waiting_operator',
  IN_PROGRESS: 'in_progress',
  WAITING_USER: 'waiting_user',
  CLOSED: 'closed',
} as const satisfies Record<string, SupportConversationStatus>

export const SUPPORT_CHANNEL = {
  WEB: 'web',
  TELEGRAM: 'telegram',
} as const

export const SUPPORT_MESSAGE_KIND = {
  TEXT: 'text',
  PHOTO: 'photo',
  DOCUMENT: 'document',
} as const
