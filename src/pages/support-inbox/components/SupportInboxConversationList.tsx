import { SUPPORT_CHANNEL } from '@/shared/lib/api/support/constants'
import type { SupportConversation } from '@/shared/lib/api/support/types'
import { Badge, Empty, Spin, Tag, Typography } from 'antd'

import {
  SUPPORT_CHANNEL_LABELS,
  SUPPORT_INBOX_COPY,
  SUPPORT_STATUS_COLORS,
  SUPPORT_STATUS_LABELS,
} from '../constants'
import { formatSupportDate } from '../helpers/formatSupportDate'

interface SupportInboxConversationListProps {
  conversations: SupportConversation[]
  selectedId: number | null
  isLoading: boolean
  onSelect: (id: number) => void
  emptyDescription?: string
}

export function SupportInboxConversationList({
  conversations,
  selectedId,
  isLoading,
  onSelect,
  emptyDescription = SUPPORT_INBOX_COPY.EMPTY_ACTIVE,
}: SupportInboxConversationListProps) {
  if (isLoading) {
    return (
      <div className="support-inbox__list-loading">
        <Spin />
      </div>
    )
  }

  if (!conversations.length) {
    return (
      <Empty
        className="support-inbox__list-empty"
        description={emptyDescription}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  return (
    <ul className="support-inbox__list">
      {conversations.map(item => {
        const isActive = item.id === selectedId
        const statusColor = SUPPORT_STATUS_COLORS[item.status] ?? '#8c8c8c'

        return (
          <li key={item.id}>
            <button
              type="button"
              className={`support-inbox__list-item${isActive ? ' support-inbox__list-item--active' : ''}`}
              onClick={() => onSelect(item.id)}
            >
              <div className="support-inbox__list-item-top">
                <span className="support-inbox__list-item-name">{item.displayName}</span>
                <Tag color={item.channel === SUPPORT_CHANNEL.WEB ? 'blue' : 'green'}>
                  {SUPPORT_CHANNEL_LABELS[item.channel]}
                </Tag>
              </div>
              <p className="support-inbox__list-item-preview">
                {item.lastMessagePreview || SUPPORT_INBOX_COPY.NO_MESSAGES_PREVIEW}
              </p>
              <div className="support-inbox__list-item-meta">
                <Badge
                  color={statusColor}
                  text={SUPPORT_STATUS_LABELS[item.status] ?? item.status}
                />
                <Typography.Text type="secondary">
                  {formatSupportDate(item.lastMessageAt)}
                </Typography.Text>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
