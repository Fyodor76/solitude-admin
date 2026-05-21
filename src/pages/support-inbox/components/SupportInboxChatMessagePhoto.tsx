import { useEffect, useState } from 'react'

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
  const [imageReady, setImageReady] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageReady(false)
    setImageError(false)
  }, [url])

  const showPlaceholder = urlLoading || Boolean(url && !imageReady && !imageError)

  if (!urlLoading && (!url || imageError)) {
    return (
      <span className="support-inbox__message-media-fallback">
        {kind === SUPPORT_MESSAGE_KIND.PHOTO
          ? SUPPORT_INBOX_COPY.PHOTO_UNAVAILABLE
          : SUPPORT_INBOX_COPY.FILE_UNAVAILABLE}
      </span>
    )
  }

  return (
    <>
      {showPlaceholder ? (
        <div
          className="support-inbox__message-media-placeholder"
          role="status"
          aria-live="polite"
          aria-label={
            kind === SUPPORT_MESSAGE_KIND.PHOTO
              ? SUPPORT_INBOX_COPY.PHOTO_LOADING
              : SUPPORT_INBOX_COPY.FILE_LOADING
          }
        >
          <Spin size="default" />
          <span className="support-inbox__message-media-placeholder-label">
            {kind === SUPPORT_MESSAGE_KIND.PHOTO
              ? SUPPORT_INBOX_COPY.PHOTO_LOADING
              : SUPPORT_INBOX_COPY.FILE_LOADING}
          </span>
        </div>
      ) : null}

      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="support-inbox__message-photo-link"
          aria-hidden={!imageReady}
          style={imageReady ? undefined : { display: 'none' }}
        >
          <img
            src={url}
            alt=""
            className="support-inbox__message-image"
            loading="lazy"
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
    </>
  )
}
