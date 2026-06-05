import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'

export type PlatformImageSortBy = 'date' | 'size' | 'name'
export type PlatformImageSortOrder = 'asc' | 'desc'

export interface PlatformImagesFilters {
  search: string
  sortBy: PlatformImageSortBy
  sortOrder: PlatformImageSortOrder
}

export type PlatformImageUploadQueueStatus = 'queued' | 'uploading' | 'success' | 'error'

export interface PlatformImageUploadQueueItem {
  id: string
  file: File
  previewUrl: string
  status: PlatformImageUploadQueueStatus
}

export interface PlatformImagesBulkProgress {
  completed: number
  total: number
  failed: number
}

export interface PlatformImageCardProps {
  file: imgUpload
  disabled?: boolean
  checked?: boolean
  onSelectChange: (fileId: string, checked: boolean) => void
  onPreview: (file: imgUpload) => void
  onDelete: (fileId: string) => void
  onCopy: (url: string) => void
}
