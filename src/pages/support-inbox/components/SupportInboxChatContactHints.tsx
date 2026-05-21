import { SUPPORT_CHANNEL } from '@/shared/lib/api/support/constants'
import type { SupportConversation } from '@/shared/lib/api/support/types'
import { Typography } from 'antd'

interface SupportInboxChatContactHintsProps {
  conversation: SupportConversation
}

export function SupportInboxChatContactHints({ conversation }: SupportInboxChatContactHintsProps) {
  if (conversation.channel !== SUPPORT_CHANNEL.WEB) return null

  const hints = [
    conversation.visitorEmail,
    conversation.visitorPhone,
    conversation.visitorName,
  ].filter(Boolean)

  if (!hints.length) return null

  return (
    <Typography.Text type="secondary" className="support-inbox__contact-hints">
      {hints.join(' · ')}
    </Typography.Text>
  )
}
