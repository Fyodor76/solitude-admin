import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'

export type PlatformImageSortBy = 'date' | 'size' | 'name'
export type PlatformImageSortOrder = 'asc' | 'desc'

export interface PlatformImagesFilters {
  search: string
  sortBy: PlatformImageSortBy
  sortOrder: PlatformImageSortOrder
}

export interface UploadPlatformImagePayload {
  file: File
  name: string
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
