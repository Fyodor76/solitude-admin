import { SUPPORT_CONVERSATION_STATUS } from '@/shared/lib/api/support/constants'
import type { SupportConversation, SupportMessage } from '@/shared/lib/api/support/types'
import { Empty } from 'antd'

import { SUPPORT_INBOX_COPY } from '../constants'
import { useSupportChatAutoScroll } from '../hooks/useSupportChatAutoScroll'
import { useSupportInboxReply } from '../hooks/useSupportInboxReply'
import { SupportInboxChatComposer } from './SupportInboxChatComposer'
import { SupportInboxChatHeader } from './SupportInboxChatHeader'
import { SupportInboxChatMessages } from './SupportInboxChatMessages'

interface SupportInboxChatPanelProps {
  conversation: SupportConversation | null
  messages: SupportMessage[]
  messagesLoading: boolean
  messagesSwitching: boolean
  onOpen: () => void
  onClose: () => void
  onReplySent: () => void
  opening: boolean
  closing: boolean
  readOnly?: boolean
  showBackToList?: boolean
  onBackToList?: () => void
}

export function SupportInboxChatPanel({
  conversation,
  messages,
  messagesLoading,
  messagesSwitching,
  onOpen,
  onClose,
  onReplySent,
  opening,
  closing,
  readOnly = false,
  showBackToList = false,
  onBackToList,
}: SupportInboxChatPanelProps) {
  const reply = useSupportInboxReply(conversation?.id ?? null, onReplySent)

  const { messagesScrollRef, messagesEndRef } = useSupportChatAutoScroll({
    conversation,
    messages,
    messagesLoading,
    messagesSwitching,
  })

  if (!conversation) {
    return (
      <div className="support-inbox__chat-empty">
        <Empty description={SUPPORT_INBOX_COPY.CHAT_EMPTY} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    )
  }

  const isClosed = conversation.status === SUPPORT_CONVERSATION_STATUS.CLOSED || readOnly
  const showComposer = !isClosed && !readOnly

  return (
    <div className="support-inbox__chat">
      <SupportInboxChatHeader
        conversation={conversation}
        readOnly={readOnly}
        showBackToList={showBackToList}
        opening={opening}
        closing={closing}
        onBackToList={onBackToList}
        onOpen={onOpen}
        onClose={onClose}
      />

      <SupportInboxChatMessages
        conversation={conversation}
        messages={messages}
        messagesLoading={messagesLoading}
        messagesSwitching={messagesSwitching}
        messagesScrollRef={messagesScrollRef}
        messagesEndRef={messagesEndRef}
      />

      {showComposer && (
        <SupportInboxChatComposer
          replyText={reply.replyText}
          replying={reply.replying}
          uploadingPhoto={reply.uploadingPhoto}
          canSend={reply.canSend}
          pendingPreviewUrl={reply.pendingPreviewUrl}
          acceptImageTypes={reply.acceptImageTypes}
          fileInputRef={reply.fileInputRef}
          onReplyTextChange={reply.setReplyText}
          onPickPhoto={reply.handlePickPhoto}
          onPhotoSelected={reply.handlePhotoSelected}
          onClearPendingPhoto={reply.clearPendingPhoto}
          onReply={reply.handleReply}
        />
      )}

      {isClosed && (
        <div className="support-inbox__closed-banner">{SUPPORT_INBOX_COPY.CLOSED_BANNER}</div>
      )}
    </div>
  )
}
