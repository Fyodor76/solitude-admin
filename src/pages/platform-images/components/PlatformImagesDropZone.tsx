import { useMemo, useRef } from 'react'

import { InboxOutlined } from '@ant-design/icons'
import { Upload } from 'antd'
import type { UploadProps } from 'antd'

import { PLATFORM_IMAGE_ACCEPT, PLATFORM_IMAGES_COPY } from '../constants'
import { filterPlatformImageFiles } from '../helpers/filterPlatformImageFiles'
import { createFileBatchScheduler } from '../helpers/scheduleFileBatch'
import type { PlatformImagesBulkProgress, PlatformImageUploadQueueItem } from '../types'
import { PlatformImagesUploadQueue } from './PlatformImagesUploadQueue'

interface PlatformImagesDropZoneProps {
  disabled?: boolean
  uploading?: boolean
  progress?: PlatformImagesBulkProgress | null
  queueItems?: PlatformImageUploadQueueItem[]
  onFilesSelected: (files: File[]) => void
  onInvalidFiles?: () => void
  onRemoveQueueItem?: (id: string) => void
  onClearQueue?: () => void
  onStartUpload?: () => void
}

export const PlatformImagesDropZone = ({
  disabled,
  uploading,
  progress,
  queueItems = [],
  onFilesSelected,
  onInvalidFiles,
  onRemoveQueueItem,
  onClearQueue,
  onStartUpload,
}: PlatformImagesDropZoneProps) => {
  const onFilesSelectedRef = useRef(onFilesSelected)
  const onInvalidFilesRef = useRef(onInvalidFiles)
  onFilesSelectedRef.current = onFilesSelected
  onInvalidFilesRef.current = onInvalidFiles

  const scheduleBatch = useMemo(
    () =>
      createFileBatchScheduler(rawFiles => {
        const files = filterPlatformImageFiles(rawFiles)

        if (files.length === 0) {
          if (rawFiles.length > 0) {
            onInvalidFilesRef.current?.()
          }
          return
        }

        onFilesSelectedRef.current(files)
      }),
    []
  )

  const uploadProps: UploadProps = {
    multiple: true,
    accept: PLATFORM_IMAGE_ACCEPT,
    disabled: disabled || uploading,
    showUploadList: false,
    beforeUpload: (_file, fileList) => {
      scheduleBatch(fileList as File[])
      return false
    },
  }

  const progressLabel =
    progress && progress.total > 0
      ? `Загружено ${progress.completed} из ${progress.total}${
          progress.failed > 0 ? `, ошибок: ${progress.failed}` : ''
        }`
      : null

  return (
    <div
      className={[
        'platform-images-dropzone',
        uploading ? 'platform-images-dropzone--uploading' : '',
        queueItems.length > 0 ? 'platform-images-dropzone--has-queue' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Upload.Dragger {...uploadProps} className="platform-images-dropzone__upload">
        <p className="platform-images-dropzone__icon">
          <InboxOutlined />
        </p>
        <p className="platform-images-dropzone__title">
          {uploading ? PLATFORM_IMAGES_COPY.dropUploading : PLATFORM_IMAGES_COPY.dropTitle}
        </p>
        <p className="platform-images-dropzone__hint">{PLATFORM_IMAGES_COPY.dropHint}</p>
        {progressLabel ? (
          <p className="platform-images-dropzone__progress">{progressLabel}</p>
        ) : null}
      </Upload.Dragger>

      <PlatformImagesUploadQueue
        items={queueItems}
        uploading={uploading}
        onRemove={onRemoveQueueItem}
        onClear={onClearQueue}
        onStartUpload={onStartUpload}
      />
    </div>
  )
}
