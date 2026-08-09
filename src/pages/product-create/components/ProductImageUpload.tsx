import { useState } from 'react'

import { useUploadImageMutation } from '@/shared/lib/api/upload-files/uploadFiles'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import { resolveMediaUrl } from '@/shared/lib/utils/resolveMediaUrl'
import { DeleteOutlined, HolderOutlined, InboxOutlined } from '@ant-design/icons'
import { Button, Image, Spin, Upload } from 'antd'
import type { RcFile } from 'antd/es/upload'

import { ProductImageItem } from '../types'

interface ProductImageUploadProps {
  value: ProductImageItem[]
  multiple?: boolean
  onChange: (next: ProductImageItem[]) => void
}

function reorderImages(list: ProductImageItem[], fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) {
    return list
  }
  const next = [...list]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

/** Загрузка в корень CDN: в товар пишем только fileId, без folder. */
export function ProductImageUpload({ value, multiple = true, onChange }: ProductImageUploadProps) {
  const { openNotification } = useNotificationHandler()
  const [uploadImage] = useUploadImageMutation()
  const [uploading, setUploading] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  const handleFiles = async (files: File[]) => {
    if (!files.length) return

    setUploading(true)
    try {
      const uploaded: ProductImageItem[] = []

      for (const file of files) {
        const response = await uploadImage({ file }).unwrap()
        if (response.data?.fileId) {
          const fileId = response.data.fileId
          uploaded.push({
            fileId,
            url: response.data.url || resolveMediaUrl(fileId) || fileId,
          })
        }
      }

      if (!uploaded.length) {
        openNotification('error', ['Не удалось загрузить изображения'])
        return
      }

      onChange(multiple ? [...value, ...uploaded] : uploaded.slice(0, 1))
      openNotification(
        'success',
        uploaded.length === 1
          ? ['Изображение загружено']
          : [`Загружено изображений: ${uploaded.length}`]
      )
    } catch {
      openNotification('error', ['Ошибка загрузки изображения'])
    } finally {
      setUploading(false)
    }
  }

  const setAsMain = (fileId: string) => {
    const selected = value.find(item => item.fileId === fileId)
    if (!selected) return
    onChange([selected, ...value.filter(item => item.fileId !== fileId)])
  }

  const clearDragState = () => {
    setDragIndex(null)
    setOverIndex(null)
  }

  return (
    <div className="product-create-images">
      <Upload.Dragger
        multiple={multiple}
        accept="image/*"
        showUploadList={false}
        disabled={uploading}
        beforeUpload={(file, fileList) => {
          const batch = (fileList as RcFile[]).length ? (fileList as RcFile[]) : [file as RcFile]
          if (file.uid === batch[0]?.uid) {
            void handleFiles(batch)
          }
          return false
        }}
      >
        <p className="product-create-images__icon">
          <InboxOutlined />
        </p>
        <p className="product-create-images__title">Перетащите фото или нажмите для выбора</p>
        <p className="product-create-images__hint">
          JPG, PNG, WEBP, GIF
          {multiple ? ' · первое фото — главное · можно менять местами' : ''}
        </p>
      </Upload.Dragger>

      {uploading ? (
        <div className="product-create-images__loading">
          <Spin size="small" /> Загрузка...
        </div>
      ) : null}

      {value.length > 0 ? (
        <div className="product-create-images__list">
          {value.map((item, index) => {
            const isMain = multiple && index === 0
            const isDragging = dragIndex === index
            const isOver = overIndex === index && dragIndex !== null && dragIndex !== index

            return (
              <div
                key={item.fileId}
                className={[
                  'product-create-images__item',
                  isMain ? 'product-create-images__item--main' : '',
                  isDragging ? 'product-create-images__item--dragging' : '',
                  isOver ? 'product-create-images__item--over' : '',
                  multiple && value.length > 1 ? 'product-create-images__item--sortable' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                draggable={multiple && value.length > 1}
                onDragStart={event => {
                  if (!multiple || value.length < 2) return
                  const target = event.target as HTMLElement
                  if (target.closest('button, a')) {
                    event.preventDefault()
                    return
                  }
                  setDragIndex(index)
                  event.dataTransfer.effectAllowed = 'move'
                  event.dataTransfer.setData('text/plain', String(index))
                }}
                onDragEnter={event => {
                  event.preventDefault()
                  if (dragIndex === null || dragIndex === index) return
                  setOverIndex(index)
                }}
                onDragOver={event => {
                  event.preventDefault()
                  event.dataTransfer.dropEffect = 'move'
                  if (dragIndex !== null && dragIndex !== index) {
                    setOverIndex(index)
                  }
                }}
                onDrop={event => {
                  event.preventDefault()
                  const from = dragIndex ?? Number(event.dataTransfer.getData('text/plain'))
                  if (Number.isNaN(from)) {
                    clearDragState()
                    return
                  }
                  onChange(reorderImages(value, from, index))
                  clearDragState()
                }}
                onDragEnd={clearDragState}
              >
                {multiple && value.length > 1 ? (
                  <span className="product-create-images__drag-handle" aria-hidden>
                    <HolderOutlined />
                  </span>
                ) : null}
                <Image
                  src={item.url}
                  alt=""
                  width={96}
                  height={96}
                  style={{ objectFit: 'cover' }}
                  preview={{ mask: 'Просмотр' }}
                />
                {isMain ? <span className="product-create-images__badge">Главное</span> : null}
                {multiple && index > 0 ? (
                  <Button
                    type="default"
                    size="small"
                    className="product-create-images__make-main"
                    onClick={() => setAsMain(item.fileId)}
                  >
                    Главное
                  </Button>
                ) : null}
                <Button
                  type="text"
                  danger
                  size="small"
                  className="product-create-images__remove"
                  icon={<DeleteOutlined />}
                  onClick={() => onChange(value.filter(image => image.fileId !== item.fileId))}
                />
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
