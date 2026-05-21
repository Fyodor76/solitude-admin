import { useEffect, useRef } from 'react'

import type { SupportConversation, SupportMessage } from '@/shared/lib/api/support/types'

export function useSupportChatAutoScroll(options: {
  conversation: SupportConversation | null
  messages: SupportMessage[]
  messagesLoading: boolean
  messagesSwitching: boolean
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const prevMessageCountRef = useRef(0)
  const prevConversationIdRef = useRef<number | null>(null)

  const { conversation, messages, messagesLoading, messagesSwitching } = options

  useEffect(() => {
    if (!conversation || messagesLoading || messagesSwitching) return

    const conversationChanged = conversation.id !== prevConversationIdRef.current
    const countGrew = messages.length > prevMessageCountRef.current

    prevConversationIdRef.current = conversation.id
    prevMessageCountRef.current = messages.length

    if (!messages.length) return

    messagesEndRef.current?.scrollIntoView({
      behavior: conversationChanged || !countGrew ? 'auto' : 'smooth',
      block: 'end',
    })
  }, [conversation, messages, messagesLoading, messagesSwitching])

  useEffect(() => {
    if (!conversation) {
      prevMessageCountRef.current = 0
      prevConversationIdRef.current = null
    }
  }, [conversation])

  return { messagesEndRef }
}
