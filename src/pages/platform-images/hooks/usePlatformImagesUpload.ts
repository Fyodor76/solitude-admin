import { useCallback, useEffect, useRef, useState } from 'react'

import { useUploadImageMutation } from '@/shared/lib/api/upload-files/uploadFiles'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'

import {
  PLATFORM_IMAGE_MAX_BATCH,
  PLATFORM_IMAGES_FOLDER,
  PLATFORM_IMAGES_UPLOAD,
} from '../constants'
import { revokeUploadQueuePreviews } from '../helpers/createUploadQueueItems'
import { filterPlatformImageFiles } from '../helpers/filterPlatformImageFiles'
import { mergeUploadQueueItems } from '../helpers/mergeUploadQueueItems'
import type { PlatformImagesBulkProgress, PlatformImageUploadQueueItem } from '../types'

export function usePlatformImagesUpload(options: { onUploaded: () => Promise<void> }) {
  const { onUploaded } = options
  const { openNotification } = useNotificationHandler()
  const [uploadImage] = useUploadImageMutation()

  const [bulkUploading, setBulkUploading] = useState(false)
  const [bulkProgress, setBulkProgress] = useState<PlatformImagesBulkProgress | null>(null)
  const [uploadQueue, setUploadQueue] = useState<PlatformImageUploadQueueItem[]>([])

  const uploadInFlightRef = useRef(false)
  const queueClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearUploadQueue = useCallback((itemsToRevoke: PlatformImageUploadQueueItem[]) => {
    revokeUploadQueuePreviews(itemsToRevoke)
    setUploadQueue([])
  }, [])

  const scheduleQueueClear = useCallback(
    (itemsToRevoke: PlatformImageUploadQueueItem[]) => {
      if (queueClearTimerRef.current) {
        clearTimeout(queueClearTimerRef.current)
      }

      queueClearTimerRef.current = setTimeout(() => {
        clearUploadQueue(itemsToRevoke)
        queueClearTimerRef.current = null
      }, PLATFORM_IMAGES_UPLOAD.QUEUE_CLEAR_MS)
    },
    [clearUploadQueue]
  )

  useEffect(() => {
    return () => {
      if (queueClearTimerRef.current) {
        clearTimeout(queueClearTimerRef.current)
      }

      revokeUploadQueuePreviews(uploadQueue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateQueueItem = useCallback(
    (id: string, patch: Partial<Pick<PlatformImageUploadQueueItem, 'status'>>) => {
      setUploadQueue(previous =>
        previous.map(item => (item.id === id ? { ...item, ...patch } : item))
      )
    },
    []
  )

  const notifyUploadResult = useCallback(
    (successCount: number, failedCount: number, skippedCount: number, totalValid: number) => {
      if (successCount === totalValid && failedCount === 0 && skippedCount === 0) {
        openNotification(
          'success',
          successCount === 1 ? 'Изображение загружено.' : `Загружено изображений: ${successCount}.`
        )
        return
      }

      if (successCount > 0) {
        openNotification(
          'warning',
          `Загружено: ${successCount}. Ошибок: ${failedCount}${
            skippedCount > 0 ? `, пропущено не-изображений: ${skippedCount}` : ''
          }.`
        )
        return
      }

      openNotification('error', 'Не удалось загрузить изображения.')
    },
    [openNotification]
  )

  const uploadQueueItems = useCallback(
    async (itemsToUpload: PlatformImageUploadQueueItem[], displayName?: string) => {
      if (uploadInFlightRef.current) {
        return
      }

      const queuedItems = itemsToUpload.filter(item => item.status === 'queued')

      if (queuedItems.length === 0) {
        return
      }

      uploadInFlightRef.current = true
      setBulkUploading(true)
      setBulkProgress({ completed: 0, total: queuedItems.length, failed: 0 })

      let successCount = 0
      let failedCount = 0

      for (let index = 0; index < queuedItems.length; index += 1) {
        const queueItem = queuedItems[index]
        const { file } = queueItem
        const useCustomName = queuedItems.length === 1 && displayName

        updateQueueItem(queueItem.id, { status: 'uploading' })

        try {
          await uploadImage({
            file,
            folder: PLATFORM_IMAGES_FOLDER,
            name: useCustomName ? displayName : file.name.replace(/\.[^.]+$/, '') || file.name,
          }).unwrap()

          successCount += 1
          updateQueueItem(queueItem.id, { status: 'success' })
        } catch {
          failedCount += 1
          updateQueueItem(queueItem.id, { status: 'error' })
        }

        setBulkProgress({
          completed: index + 1,
          total: queuedItems.length,
          failed: failedCount,
        })
      }

      setBulkUploading(false)
      setBulkProgress(null)
      uploadInFlightRef.current = false

      if (successCount > 0) {
        await onUploaded()
      }

      notifyUploadResult(successCount, failedCount, 0, queuedItems.length)

      setUploadQueue(current => {
        scheduleQueueClear(current)
        return current
      })
    },
    [notifyUploadResult, onUploaded, scheduleQueueClear, updateQueueItem, uploadImage]
  )

  const addFilesToQueue = useCallback(
    (files: File[]) => {
      const validFiles = filterPlatformImageFiles(files)

      if (validFiles.length === 0) {
        openNotification(
          'warning',
          'Не найдено подходящих изображений. Поддерживаются JPEG, PNG, WebP, GIF.'
        )
        return
      }

      const skippedCount = files.length - validFiles.length

      setUploadQueue(previous => {
        const merged = mergeUploadQueueItems(previous, validFiles)
        const addedCount = merged.length - previous.length

        if (addedCount === 0) {
          if (previous.length >= PLATFORM_IMAGE_MAX_BATCH) {
            openNotification(
              'warning',
              `Можно добавить не больше ${PLATFORM_IMAGE_MAX_BATCH} файлов.`
            )
          }

          return previous
        }

        if (skippedCount > 0) {
          openNotification(
            'warning',
            `Добавлено ${addedCount} фото. Пропущено не-изображений: ${skippedCount}.`
          )
        }

        return merged
      })
    },
    [openNotification]
  )

  const handleRemoveFromQueue = useCallback((id: string) => {
    setUploadQueue(previous => {
      const item = previous.find(entry => entry.id === id)

      if (!item || item.status !== 'queued') {
        return previous
      }

      URL.revokeObjectURL(item.previewUrl)
      return previous.filter(entry => entry.id !== id)
    })
  }, [])

  const handleClearPendingQueue = useCallback(() => {
    setUploadQueue(previous => {
      const pending = previous.filter(item => item.status === 'queued')
      revokeUploadQueuePreviews(pending)
      return previous.filter(item => item.status !== 'queued')
    })
  }, [])

  const handleStartUpload = useCallback(() => {
    const queued = uploadQueue.filter(item => item.status === 'queued')
    void uploadQueueItems(queued)
  }, [uploadQueue, uploadQueueItems])

  const handleModalUpload = useCallback(
    async (files: File[], displayName?: string) => {
      const validFiles = filterPlatformImageFiles(files)

      if (validFiles.length === 0) {
        openNotification(
          'warning',
          'Не найдено подходящих изображений. Поддерживаются JPEG, PNG, WebP, GIF.'
        )
        return false
      }

      const items = mergeUploadQueueItems([], validFiles)
      setUploadQueue(previous => mergeUploadQueueItems(previous, validFiles))
      await uploadQueueItems(items, displayName)
      return true
    },
    [openNotification, uploadQueueItems]
  )

  const notifyInvalidFiles = useCallback(() => {
    openNotification(
      'warning',
      'Не найдено подходящих изображений. Поддерживаются JPEG, PNG, WebP, GIF.'
    )
  }, [openNotification])

  return {
    bulkUploading,
    bulkProgress,
    uploadQueue,
    addFilesToQueue,
    handleRemoveFromQueue,
    handleClearPendingQueue,
    handleStartUpload,
    handleModalUpload,
    notifyInvalidFiles,
  }
}
