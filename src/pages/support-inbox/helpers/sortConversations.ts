import type { SupportConversation } from '@/shared/lib/api/support/types'

export function sortConversationsByLastMessage(
  conversations: SupportConversation[]
): SupportConversation[] {
  return [...conversations].sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  )
}
