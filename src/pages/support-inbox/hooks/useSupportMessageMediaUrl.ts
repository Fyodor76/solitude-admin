import { useEffect, useState } from 'react'

import { SUPPORT_CHANNEL, SUPPORT_MESSAGE_KIND } from '@/shared/lib/api/support/constants'
import { useLazyGetSupportTelegramMediaUrlQuery } from '@/shared/lib/api/support/supportApi'
import type { SupportConversation, SupportMessage } from '@/shared/lib/api/support/types'
import { useLazyGetFileUrlByIdQuery } from '@/shared/lib/api/upload-files/uploadFiles'

import { extractMediaUrl } from '../helpers/extractMediaUrl'

export function useSupportMessageMediaUrl(
  message: SupportMessage,
  conversation: SupportConversation | null
) {
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchTelegramUrl] = useLazyGetSupportTelegramMediaUrlQuery()
  const [fetchWebFileUrl] = useLazyGetFileUrlByIdQuery()

  const isMedia =
    message.kind === SUPPORT_MESSAGE_KIND.PHOTO || message.kind === SUPPORT_MESSAGE_KIND.DOCUMENT

  const isTelegramChannel = conversation?.channel === SUPPORT_CHANNEL.TELEGRAM

  useEffect(() => {
    if (!isMedia || !message.fileId) {
      setUrl(null)
      setLoading(false)
      return
    }

    if (message.fileId.startsWith('http://') || message.fileId.startsWith('https://')) {
      setUrl(message.fileId)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setUrl(null)

    const fileId = message.fileId

    const resolve = async () => {
      try {
        if (isTelegramChannel) {
          const res = await fetchTelegramUrl(fileId).unwrap()
          if (!cancelled) setUrl(extractMediaUrl(res))
          return
        }

        // Web: fileId в корне бакета (без folder) — URL отдаёт core через GET /cdn/url/:fileId
        const res = await fetchWebFileUrl({ fileId }).unwrap()
        if (!cancelled) setUrl(extractMediaUrl(res))
      } catch {
        if (!cancelled) setUrl(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void resolve()

    return () => {
      cancelled = true
    }
  }, [fetchTelegramUrl, fetchWebFileUrl, isMedia, isTelegramChannel, message.fileId])

  return { url, loading, isMedia }
}
