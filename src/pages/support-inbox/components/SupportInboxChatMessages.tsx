import type { RefObject } from 'react'

import type { SupportConversation, SupportMessage } from '@/shared/lib/api/support/types'
import { Empty, Spin } from 'antd'

import { SUPPORT_INBOX_COPY } from '../constants'
import { SupportInboxChatMessageItem } from './SupportInboxChatMessageItem'

interface SupportInboxChatMessagesProps {
  conversation: SupportConversation
  messages: SupportMessage[]
  messagesLoading: boolean
  messagesSwitching: boolean
  messagesScrollRef: RefObject<HTMLDivElement | null>
  messagesEndRef: RefObject<HTMLDivElement | null>
}

export function SupportInboxChatMessages({
  conversation,
  messages,
  messagesLoading,
  messagesSwitching,
  messagesScrollRef,
  messagesEndRef,
}: SupportInboxChatMessagesProps) {
  if (messagesLoading || messagesSwitching) {
    return (
      <div
        ref={messagesScrollRef}
        className="support-inbox__messages support-inbox__messages-loading"
      >
        <Spin tip={messagesSwitching ? SUPPORT_INBOX_COPY.MESSAGES_SWITCHING : undefined} />
      </div>
    )
  }

  if (!messages.length) {
    return (
      <div ref={messagesScrollRef} className="support-inbox__messages">
        <Empty
          description={SUPPORT_INBOX_COPY.MESSAGES_EMPTY}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    )
  }

  return (
    <div ref={messagesScrollRef} className="support-inbox__messages">
      {messages.map(msg => (
        <SupportInboxChatMessageItem key={msg.id} message={msg} conversation={conversation} />
      ))}
      <div ref={messagesEndRef} className="support-inbox__messages-anchor" aria-hidden />
    </div>
  )
}
