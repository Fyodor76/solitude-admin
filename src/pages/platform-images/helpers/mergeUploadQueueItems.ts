import { PLATFORM_IMAGE_MAX_BATCH } from '../constants'
import type { PlatformImageUploadQueueItem } from '../types'
import { createUploadQueueItems } from './createUploadQueueItems'

export function mergeUploadQueueItems(
  current: PlatformImageUploadQueueItem[],
  files: File[]
): PlatformImageUploadQueueItem[] {
  const newItems = createUploadQueueItems(files)
  const existingKeys = new Set(
    current.map(item => `${item.file.name}-${item.file.size}-${item.file.lastModified}`)
  )

  const uniqueNew = newItems.filter(
    item => !existingKeys.has(`${item.file.name}-${item.file.size}-${item.file.lastModified}`)
  )

  return [...current, ...uniqueNew].slice(0, PLATFORM_IMAGE_MAX_BATCH)
}
