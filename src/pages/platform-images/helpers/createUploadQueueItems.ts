import type { PlatformImageUploadQueueItem } from '../types'

export function createUploadQueueItems(files: File[]): PlatformImageUploadQueueItem[] {
  return files.map(file => ({
    id: `${file.name}-${file.size}-${file.lastModified}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    file,
    previewUrl: URL.createObjectURL(file),
    status: 'queued',
  }))
}

export function revokeUploadQueuePreviews(items: PlatformImageUploadQueueItem[]) {
  for (const item of items) {
    URL.revokeObjectURL(item.previewUrl)
  }
}
