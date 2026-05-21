import { CustomButton } from '@/shared/ui/custom-button/CustomButton'
import { CheckOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons'

import { PLATFORM_IMAGES_COPY } from '../constants'
import type { PlatformImageUploadQueueItem } from '../types'

interface PlatformImagesUploadQueueProps {
  items: PlatformImageUploadQueueItem[]
  uploading?: boolean
  onRemove?: (id: string) => void
  onClear?: () => void
  onStartUpload?: () => void
}

export const PlatformImagesUploadQueue = ({
  items,
  uploading,
  onRemove,
  onClear,
  onStartUpload,
}: PlatformImagesUploadQueueProps) => {
  if (items.length === 0) {
    return null
  }

  const pendingCount = items.filter(item => item.status === 'queued').length
  const canEditQueue = !uploading && pendingCount > 0

  return (
    <div className="platform-images-upload-queue">
      <div className="platform-images-upload-queue__header">
        <p className="platform-images-upload-queue__title">
          {PLATFORM_IMAGES_COPY.queueTitle}: <strong>{items.length}</strong>
          {pendingCount > 0 && pendingCount !== items.length ? (
            <span className="platform-images-upload-queue__pending">
              {' '}
              (к загрузке: {pendingCount})
            </span>
          ) : null}
        </p>

        <div className="platform-images-upload-queue__actions">
          <CustomButton type="primary" onClick={() => onStartUpload?.()} disabled={!canEditQueue}>
            {PLATFORM_IMAGES_COPY.queueUpload}
            {pendingCount > 0 ? ` (${pendingCount})` : ''}
          </CustomButton>
          <CustomButton onClick={() => onClear?.()} disabled={!canEditQueue}>
            {PLATFORM_IMAGES_COPY.queueClear}
          </CustomButton>
        </div>
      </div>

      <ul className="platform-images-upload-queue__list">
        {items.map(item => (
          <li
            key={item.id}
            className={[
              'platform-images-upload-queue__item',
              `platform-images-upload-queue__item--${item.status}`,
            ].join(' ')}
          >
            <div className="platform-images-upload-queue__thumb">
              <img src={item.previewUrl} alt={item.file.name} loading="lazy" />
              {item.status === 'queued' && onRemove ? (
                <button
                  type="button"
                  className="platform-images-upload-queue__remove"
                  aria-label={PLATFORM_IMAGES_COPY.queueRemoveAria}
                  onClick={() => onRemove(item.id)}
                >
                  <CloseOutlined />
                </button>
              ) : null}
              {item.status === 'uploading' ? (
                <span className="platform-images-upload-queue__overlay" aria-hidden>
                  <LoadingOutlined spin />
                </span>
              ) : null}
              {item.status === 'success' ? (
                <span
                  className="platform-images-upload-queue__overlay platform-images-upload-queue__overlay--success"
                  aria-hidden
                >
                  <CheckOutlined />
                </span>
              ) : null}
              {item.status === 'error' ? (
                <span
                  className="platform-images-upload-queue__overlay platform-images-upload-queue__overlay--error"
                  aria-hidden
                >
                  <CloseOutlined />
                </span>
              ) : null}
            </div>
            <span className="platform-images-upload-queue__name" title={item.file.name}>
              {item.file.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
