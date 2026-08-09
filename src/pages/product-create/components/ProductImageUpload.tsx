import { useState } from 'react'

import { useUploadImageMutation } from '@/shared/lib/api/upload-files/uploadFiles'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import { resolveMediaUrl } from '@/shared/lib/utils/resolveMediaUrl'
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons'
import { Button, Image, Spin, Upload } from 'antd'
import type { RcFile } from 'antd/es/upload'

import { ProductImageItem } from '../types'

interface ProductImageUploadProps {
  value: ProductImageItem[]
  multiple?: boolean
  onChange: (next: ProductImageItem[]) => void
}

/** Загрузка в корень CDN: в товар пишем только fileId, без folder. */
export function ProductImageUpload({ value, multiple = true, onChange }: ProductImageUploadProps) {
  const { openNotification } = useNotificationHandler()
  const [uploadImage] = useUploadImageMutation()
  const [uploading, setUploading] = useState(false)

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
        <p className="product-create-images__hint">JPG, PNG, WEBP, GIF</p>
      </Upload.Dragger>

      {uploading ? (
        <div className="product-create-images__loading">
          <Spin size="small" /> Загрузка...
        </div>
      ) : null}

      {value.length > 0 ? (
        <div className="product-create-images__list">
          {value.map((item, index) => (
            <div
              key={item.fileId}
              className={[
                'product-create-images__item',
                index === 0 ? 'product-create-images__item--main' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <Image src={item.url} alt="" width={96} height={96} style={{ objectFit: 'cover' }} />
              {index === 0 ? <span className="product-create-images__badge">Главное</span> : null}
              <Button
                type="text"
                danger
                size="small"
                className="product-create-images__remove"
                icon={<DeleteOutlined />}
                onClick={() => onChange(value.filter(image => image.fileId !== item.fileId))}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
