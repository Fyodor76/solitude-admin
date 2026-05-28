import { useCallback, useEffect, useRef } from 'react'

import type { SupportConversation, SupportMessage } from '@/shared/lib/api/support/types'

import {
  isMessagesContainerNearBottom,
  scrollMessagesToBottomSoon,
  scrollSupportInboxChatIntoView,
} from '../helpers/scrollMessagesToBottom'

export function useSupportChatAutoScroll(options: {
  conversation: SupportConversation | null
  messages: SupportMessage[]
  messagesLoading: boolean
  messagesSwitching: boolean
}) {
  const messagesScrollRef = useRef<HTMLDivElement>(null)
  const prevMessageCountRef = useRef(0)
  const prevConversationIdRef = useRef<number | null>(null)
  const stickToBottomRef = useRef(true)
  const cancelPendingScrollRef = useRef<(() => void) | null>(null)

  const { conversation, messages, messagesLoading, messagesSwitching } = options

  const cancelPendingScroll = useCallback(() => {
    cancelPendingScrollRef.current?.()
    cancelPendingScrollRef.current = null
  }, [])

  const scheduleScrollToBottom = useCallback(
    (force: boolean) => {
      cancelPendingScroll()
      cancelPendingScrollRef.current = scrollMessagesToBottomSoon(messagesScrollRef.current, {
        behavior: 'smooth',
        shouldScroll: force ? undefined : () => stickToBottomRef.current,
      })
    },
    [cancelPendingScroll]
  )

  useEffect(() => {
    const container = messagesScrollRef.current
    if (!container || messagesLoading || messagesSwitching) return

    const onScroll = () => {
      stickToBottomRef.current = isMessagesContainerNearBottom(container)
      if (!stickToBottomRef.current) {
        cancelPendingScroll()
      }
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [conversation?.id, messagesLoading, messagesSwitching, cancelPendingScroll])

  useEffect(() => {
    if (!conversation || messagesLoading || messagesSwitching) return

    const conversationChanged = conversation.id !== prevConversationIdRef.current
    const countGrew = messages.length > prevMessageCountRef.current

    prevConversationIdRef.current = conversation.id
    prevMessageCountRef.current = messages.length

    if (!conversationChanged && !countGrew) return

    if (conversationChanged) {
      stickToBottomRef.current = true
      scrollSupportInboxChatIntoView('smooth')
      scheduleScrollToBottom(true)
      return
    }

    if (stickToBottomRef.current) {
      scheduleScrollToBottom(false)
    }
  }, [conversation, messages, messagesLoading, messagesSwitching, scheduleScrollToBottom])

  useEffect(() => {
    if (!conversation) {
      prevMessageCountRef.current = 0
      prevConversationIdRef.current = null
      stickToBottomRef.current = true
      cancelPendingScroll()
    }
  }, [conversation, cancelPendingScroll])

  useEffect(() => cancelPendingScroll, [cancelPendingScroll])

  const scrollToBottom = useCallback(() => {
    if (!stickToBottomRef.current) return
    scheduleScrollToBottom(false)
  }, [scheduleScrollToBottom])

  return { messagesScrollRef, scrollToBottom }
}
