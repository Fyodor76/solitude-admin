import type { MouseEventHandler } from 'react'

import { CustomButton } from '@/shared/ui/custom-button/CustomButton'
import { Checkbox } from 'antd'

import { PlatformImageCardProps } from '../types'

const formatDate = (value?: string) => {
  if (!value) return 'Дата неизвестна'

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

const formatSize = (value?: number) => {
  if (!value) return 'Размер неизвестен'

  if (value >= 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(1)} МБ`
  }

  if (value >= 1024) {
    return `${Math.round(value / 1024)} КБ`
  }

  return `${value} Б`
}

export const PlatformImageCard = ({
  file,
  disabled,
  checked,
  onSelectChange,
  onPreview,
  onDelete,
  onCopy,
}: PlatformImageCardProps) => {
  const handleCardClick: MouseEventHandler<HTMLElement> = event => {
    if (disabled) {
      return
    }

    const target = event.target as HTMLElement

    if (
      target.closest('button') ||
      target.closest('.ant-checkbox-wrapper') ||
      target.closest('.ant-checkbox')
    ) {
      return
    }

    onSelectChange(file.fileId, !checked)
  }

  return (
    <article
      className={`platform-image-card${checked ? ' platform-image-card--selected' : ''}`}
      onClick={handleCardClick}
    >
      <div className="platform-image-card__select">
        <Checkbox
          checked={checked}
          disabled={disabled}
          onChange={event => onSelectChange(file.fileId, event.target.checked)}
        >
          Выбрать
        </Checkbox>
      </div>

      <button
        type="button"
        className="platform-image-card__preview"
        onClick={() => onPreview(file)}
        title="Открыть изображение"
      >
        <img src={file.url} alt={file.name || file.fileId} loading="lazy" />
      </button>

      <div className="platform-image-card__body">
        <div className="platform-image-card__meta">
          <h3>{file.name || file.fileId}</h3>
          <p>{file.fileId}</p>
          <span>{formatDate(file.lastModified)}</span>
          <span>{formatSize(file.size)}</span>
        </div>

        <div className="platform-image-card__actions">
          <CustomButton onClick={() => onCopy(file.url)} disabled={disabled} size="small">
            Копировать
          </CustomButton>
          <CustomButton
            onClick={() => onDelete(file.fileId)}
            danger
            disabled={disabled}
            size="small"
          >
            Удалить
          </CustomButton>
        </div>
      </div>
    </article>
  )
}
