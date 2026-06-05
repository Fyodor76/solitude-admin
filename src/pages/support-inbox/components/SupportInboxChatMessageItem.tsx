import { SUPPORT_MESSAGE_KIND } from '@/shared/lib/api/support/constants'
import type { SupportConversation, SupportMessage } from '@/shared/lib/api/support/types'

import { SUPPORT_INBOX_COPY } from '../constants'
import { formatSupportDate } from '../helpers/formatSupportDate'
import { useSupportMessageMediaUrl } from '../hooks/useSupportMessageMediaUrl'
import { SupportInboxChatMessagePhoto } from './SupportInboxChatMessagePhoto'

const MESSAGE_SENDER_CLASS = {
  user: 'user',
  operator: 'operator',
} as const

interface SupportInboxChatMessageItemProps {
  message: SupportMessage
  conversation: SupportConversation
  onMediaLoaded?: () => void
}

export function SupportInboxChatMessageItem({
  message,
  conversation,
  onMediaLoaded,
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
            <SupportInboxChatMessagePhoto
              url={url}
              urlLoading={loading}
              kind={message.kind}
              onImageLoaded={onMediaLoaded}
            />
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
