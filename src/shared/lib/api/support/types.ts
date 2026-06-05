export type SupportConversationStatus =
  | 'open'
  | 'waiting_operator'
  | 'in_progress'
  | 'waiting_user'
  | 'closed'

export type SupportChannel = 'telegram' | 'web'

export interface SupportConversation {
  id: number
  channel: SupportChannel
  visitorSessionId: string | null
  visitorName: string | null
  visitorEmail: string | null
  visitorPhone: string | null
  requesterTelegramId: string | null
  displayName: string
  status: SupportConversationStatus
  assignedOperatorLabel: string | null
  lastMessagePreview: string | null
  lastMessageAt: string
  createdAt: string
  updatedAt: string
  closedAt: string | null
}

export type SupportMessageKind = 'text' | 'photo' | 'document'

export interface SupportMessage {
  id: number
  conversationId: number
  senderType: 'user' | 'operator' | 'system'
  senderTelegramId: string | null
  senderUserId: string | null
  kind: SupportMessageKind
  text: string | null
  fileId: string | null
  caption: string | null
  createdAt: string
}

export interface SupportReplyPayload {
  text?: string
  fileId?: string
}

export interface AdminReplyResult {
  conversation: SupportConversation
  message: SupportMessage
}
