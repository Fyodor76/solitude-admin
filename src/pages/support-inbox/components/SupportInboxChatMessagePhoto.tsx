import { useEffect, useRef, useState } from 'react'

import { SUPPORT_MESSAGE_KIND } from '@/shared/lib/api/support/constants'
import type { SupportMessage } from '@/shared/lib/api/support/types'
import { Spin } from 'antd'

import { SUPPORT_INBOX_COPY } from '../constants'

interface SupportInboxChatMessagePhotoProps {
  url: string | null
  urlLoading: boolean
  kind: SupportMessage['kind']
  onImageLoaded?: () => void
}

export function SupportInboxChatMessagePhoto({
  url,
  urlLoading,
  kind,
  onImageLoaded,
}: SupportInboxChatMessagePhotoProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [imageReady, setImageReady] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageReady(false)
    setImageError(false)
  }, [url])

  useEffect(() => {
    const img = imgRef.current
    if (!url || !img) {
      return
    }

    if (img.complete && img.naturalWidth > 0) {
      setImageReady(true)
      setImageError(false)
      onImageLoaded?.()
    }
  }, [url, onImageLoaded])

  const loadingLabel =
    kind === SUPPORT_MESSAGE_KIND.PHOTO
      ? SUPPORT_INBOX_COPY.PHOTO_LOADING
      : SUPPORT_INBOX_COPY.FILE_LOADING

  if (!urlLoading && (!url || imageError)) {
    return (
      <span className="support-inbox__message-media-fallback">
        {kind === SUPPORT_MESSAGE_KIND.PHOTO
          ? SUPPORT_INBOX_COPY.PHOTO_UNAVAILABLE
          : SUPPORT_INBOX_COPY.FILE_UNAVAILABLE}
      </span>
    )
  }

  const showPlaceholder = urlLoading || Boolean(url && !imageReady && !imageError)

  return (
    <div className="support-inbox__message-media-frame">
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className={[
            'support-inbox__message-photo-link',
            imageReady ? 'support-inbox__message-photo-link--ready' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <img
            ref={imgRef}
            src={url}
            alt=""
            className="support-inbox__message-image"
            onLoad={() => {
              setImageReady(true)
              setImageError(false)
              onImageLoaded?.()
            }}
            onError={() => {
              setImageReady(false)
              setImageError(true)
            }}
          />
        </a>
      ) : null}

      {showPlaceholder ? (
        <div
          className="support-inbox__message-media-placeholder"
          role="status"
          aria-live="polite"
          aria-label={loadingLabel}
        >
          <Spin size="default" />
          <span className="support-inbox__message-media-placeholder-label">{loadingLabel}</span>
        </div>
      ) : null}
    </div>
  )
}
