import { SUPPORT_CHANNEL, SUPPORT_CONVERSATION_STATUS } from '@/shared/lib/api/support/constants'
import type { SupportConversation } from '@/shared/lib/api/support/types'
import { Button, Space, Tag, Typography } from 'antd'

import {
  SUPPORT_CHANNEL_LABELS,
  SUPPORT_INBOX_COPY,
  SUPPORT_STATUS_COLORS,
  SUPPORT_STATUS_LABELS,
} from '../constants'
import { SupportInboxChatContactHints } from './SupportInboxChatContactHints'

interface SupportInboxChatHeaderProps {
  conversation: SupportConversation
  readOnly: boolean
  showBackToList: boolean
  opening: boolean
  closing: boolean
  onBackToList?: () => void
  onOpen: () => void
  onClose: () => void
}

export function SupportInboxChatHeader({
  conversation,
  readOnly,
  showBackToList,
  opening,
  closing,
  onBackToList,
  onOpen,
  onClose,
}: SupportInboxChatHeaderProps) {
  const statusColor = SUPPORT_STATUS_COLORS[conversation.status] ?? '#8c8c8c'
  const isClosed = conversation.status === SUPPORT_CONVERSATION_STATUS.CLOSED || readOnly
  const canTake =
    !isClosed && !readOnly && conversation.status !== SUPPORT_CONVERSATION_STATUS.IN_PROGRESS

  return (
    <header className="support-inbox__chat-header">
      {showBackToList && onBackToList && (
        <Button type="link" className="support-inbox__back-to-list" onClick={onBackToList}>
          {SUPPORT_INBOX_COPY.BACK_TO_LIST}
        </Button>
      )}
      <div className="support-inbox__chat-header-main">
        <Typography.Title level={4} className="support-inbox__chat-title">
          {conversation.displayName}
        </Typography.Title>
        <div className="support-inbox__chat-meta">
          <Tag color={conversation.channel === SUPPORT_CHANNEL.WEB ? 'blue' : 'green'}>
            {SUPPORT_CHANNEL_LABELS[conversation.channel]}
          </Tag>
          <Tag color={statusColor}>
            {SUPPORT_STATUS_LABELS[conversation.status] ?? conversation.status}
          </Tag>
          {conversation.assignedOperatorLabel && (
            <span className="support-inbox__chat-operator">
              {SUPPORT_INBOX_COPY.OPERATOR_PREFIX} {conversation.assignedOperatorLabel}
            </span>
          )}
        </div>
        <SupportInboxChatContactHints conversation={conversation} />
      </div>
      <Space wrap className="support-inbox__chat-actions">
        {canTake && (
          <Button type="primary" loading={opening} onClick={onOpen}>
            {SUPPORT_INBOX_COPY.TAKE_CONVERSATION}
          </Button>
        )}
        {!isClosed && (
          <Button danger loading={closing} onClick={onClose}>
            {SUPPORT_INBOX_COPY.CLOSE_CONVERSATION}
          </Button>
        )}
      </Space>
    </header>
  )
}
