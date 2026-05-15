import { CustomButton } from '@/shared/ui/custom-button/CustomButton'
import { PageHeader } from '@/shared/ui/page-header'
import { Input, Select } from 'antd'

import { PLATFORM_IMAGE_SORT_OPTIONS } from '../constants'
import { PlatformImagesFilters, PlatformImageSortBy, PlatformImageSortOrder } from '../types'

interface PlatformImagesToolbarProps {
  filters: PlatformImagesFilters
  disabled?: boolean
  onSearchChange: (value: string) => void
  onSortChange: (sortBy: PlatformImageSortBy, sortOrder: PlatformImageSortOrder) => void
  onApply: () => void
  onUploadOpen: () => void
}

export const PlatformImagesToolbar = ({
  filters,
  disabled,
  onSearchChange,
  onSortChange,
  onApply,
  onUploadOpen,
}: PlatformImagesToolbarProps) => {
  return (
    <PageHeader
      title="Изображения платформы"
      actions={
        <>
          <Input
            placeholder="Поиск по названию или ID"
            value={filters.search}
            onChange={event => onSearchChange(event.target.value)}
            className="platform-images-toolbar__search"
            allowClear
          />
          <Select
            value={`${filters.sortBy}:${filters.sortOrder}`}
            onChange={value => {
              const [sortBy, sortOrder] = value.split(':') as [
                PlatformImageSortBy,
                PlatformImageSortOrder,
              ]

              onSortChange(sortBy, sortOrder)
            }}
            options={PLATFORM_IMAGE_SORT_OPTIONS.map(option => ({
              value: option.value,
              label: option.label,
            }))}
            className="platform-images-toolbar__select"
          />
          <CustomButton onClick={onApply} disabled={disabled}>
            Применить
          </CustomButton>
          <CustomButton onClick={onUploadOpen} type="primary" disabled={disabled}>
            Добавить
          </CustomButton>
        </>
      }
    />
  )
}
