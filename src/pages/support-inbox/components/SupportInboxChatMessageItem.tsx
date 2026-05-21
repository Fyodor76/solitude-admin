import { SUPPORT_MESSAGE_KIND } from '@/shared/lib/api/support/constants'
import type { SupportConversation, SupportMessage } from '@/shared/lib/api/support/types'
import { Spin } from 'antd'

import { SUPPORT_INBOX_COPY } from '../constants'
import { formatSupportDate } from '../helpers/formatSupportDate'
import { useSupportMessageMediaUrl } from '../hooks/useSupportMessageMediaUrl'

const MESSAGE_SENDER_CLASS = {
  user: 'user',
  operator: 'operator',
} as const

interface SupportInboxChatMessageItemProps {
  message: SupportMessage
  conversation: SupportConversation
}

export function SupportInboxChatMessageItem({
  message,
  conversation,
}: SupportInboxChatMessageItemProps) {
  const { url, loading, isMedia } = useSupportMessageMediaUrl(message, conversation)

  const senderClass =
    message.senderType === MESSAGE_SENDER_CLASS.operator
      ? MESSAGE_SENDER_CLASS.operator
      : MESSAGE_SENDER_CLASS.user

  const bodyText =
    message.kind === SUPPORT_MESSAGE_KIND.TEXT ? message.text : message.caption || message.text

  return (
    <div className={`support-inbox__message support-inbox__message--${senderClass}`}>
      <div className="support-inbox__message-bubble">
        {isMedia && (
          <div className="support-inbox__message-media">
            {loading && <Spin size="small" />}
            {!loading && url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="support-inbox__message-photo-link"
              >
                <img src={url} alt="" className="support-inbox__message-image" loading="lazy" />
              </a>
            )}
            {!loading && !url && (
              <span className="support-inbox__message-media-fallback">
                {message.kind === SUPPORT_MESSAGE_KIND.PHOTO
                  ? SUPPORT_INBOX_COPY.PHOTO_UNAVAILABLE
                  : SUPPORT_INBOX_COPY.FILE_UNAVAILABLE}
              </span>
            )}
          </div>
        )}

        {bodyText && <p className="support-inbox__message-text">{bodyText}</p>}

        {!bodyText && isMedia && !loading && !url && (
          <p className="support-inbox__message-text">
            {message.kind === SUPPORT_MESSAGE_KIND.PHOTO
              ? SUPPORT_INBOX_COPY.PHOTO_LABEL
              : SUPPORT_INBOX_COPY.FILE_LABEL}
          </p>
        )}

        <span className="support-inbox__message-time">{formatSupportDate(message.createdAt)}</span>
      </div>
    </div>
  )
}
