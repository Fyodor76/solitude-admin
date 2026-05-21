import type { SupportConversation } from '@/shared/lib/api/support/types'

export function filterSupportConversations(
  conversations: SupportConversation[],
  searchQuery: string
): SupportConversation[] {
  const q = searchQuery.trim().toLowerCase()
  if (!q) return conversations

  return conversations.filter(c => {
    const haystack = [
      c.displayName,
      c.visitorName,
      c.visitorEmail,
      c.visitorPhone,
      c.requesterTelegramId,
      c.lastMessagePreview,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return haystack.includes(q)
  })
}
