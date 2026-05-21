import { useEffect, useState } from 'react'

import { SUPPORT_CHANNEL, SUPPORT_MESSAGE_KIND } from '@/shared/lib/api/support/constants'
import { useLazyGetSupportTelegramMediaUrlQuery } from '@/shared/lib/api/support/supportApi'
import type { SupportConversation, SupportMessage } from '@/shared/lib/api/support/types'

import { getSupportCdnUrl } from '../helpers/getSupportCdnUrl'

export function useSupportMessageMediaUrl(
  message: SupportMessage,
  conversation: SupportConversation | null
) {
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchTelegramUrl] = useLazyGetSupportTelegramMediaUrlQuery()

  const isMedia =
    message.kind === SUPPORT_MESSAGE_KIND.PHOTO || message.kind === SUPPORT_MESSAGE_KIND.DOCUMENT

  useEffect(() => {
    if (!isMedia || !message.fileId) {
      setUrl(null)
      return
    }

    const isTelegramFile =
      conversation?.channel === SUPPORT_CHANNEL.TELEGRAM || Boolean(message.senderTelegramId)

    if (!isTelegramFile) {
      setUrl(getSupportCdnUrl(message.fileId))
      return
    }

    let cancelled = false
    setLoading(true)

    fetchTelegramUrl(message.fileId)
      .unwrap()
      .then(res => {
        if (!cancelled) setUrl(res.data?.url ?? null)
      })
      .catch(() => {
        if (!cancelled) setUrl(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [conversation?.channel, fetchTelegramUrl, isMedia, message.fileId, message.senderTelegramId])

  return { url, loading, isMedia }
}
