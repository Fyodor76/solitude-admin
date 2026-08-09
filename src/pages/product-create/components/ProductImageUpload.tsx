import { useState } from 'react'

import { useUploadImageMutation } from '@/shared/lib/api/upload-files/uploadFiles'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import { resolveMediaUrl } from '@/shared/lib/utils/resolveMediaUrl'
import { DeleteOutlined, HolderOutlined, InboxOutlined } from '@ant-design/icons'
import { Button, Image, Spin, Upload } from 'antd'
import type { RcFile } from 'antd/es/upload'
import { Reorder, useDragControls } from 'framer-motion'

import { ProductImageItem } from '../types'

interface ProductImageUploadProps {
  value: ProductImageItem[]
  multiple?: boolean
  onChange: (next: ProductImageItem[]) => void
  /** fileId фото на витрине коллекции (product.images), без лимита */
  showcaseFileIds?: string[]
  onShowcaseChange?: (next: string[]) => void
}

function SortableImageItem({
  item,
  index,
  multiple,
  isMain,
  isShowcase,
  showcaseEnabled,
  onSetMain,
  onToggleShowcase,
  onRemove,
}: {
  item: ProductImageItem
  index: number
  multiple: boolean
  isMain: boolean
  isShowcase: boolean
  showcaseEnabled: boolean
  onSetMain: (fileId: string) => void
  onToggleShowcase: (fileId: string) => void
  onRemove: (fileId: string) => void
}) {
  const controls = useDragControls()
  const sortable = multiple

  return (
    <Reorder.Item
      value={item}
      as="div"
      className={[
        'product-create-images__item',
        isMain ? 'product-create-images__item--main' : '',
        isShowcase ? 'product-create-images__item--showcase' : '',
        sortable ? 'product-create-images__item--sortable' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      dragListener={false}
      dragControls={sortable ? controls : undefined}
      whileDrag={{
        scale: 1.06,
        boxShadow: '0 10px 24px rgba(0, 0, 0, 0.18)',
        zIndex: 3,
        cursor: 'grabbing',
      }}
      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
    >
      {sortable ? (
        <button
          type="button"
          className="product-create-images__drag-handle"
          aria-label={`Перетащить фото ${index + 1}`}
          onPointerDown={event => controls.start(event)}
        >
          <HolderOutlined />
        </button>
      ) : null}
      <Image
        src={item.url}
        alt=""
        width={96}
        height={96}
        style={{ objectFit: 'cover' }}
        preview={{ mask: 'Просмотр' }}
      />
      <div className="product-create-images__actions">
        {isMain ? (
          <span className="product-create-images__badge">Главная</span>
        ) : multiple ? (
          <Button
            type="default"
            size="small"
            className="product-create-images__action-btn"
            onClick={() => onSetMain(item.fileId)}
          >
            Главная
          </Button>
        ) : null}
        {showcaseEnabled ? (
          isShowcase ? (
            <button
              type="button"
              className="product-create-images__badge product-create-images__badge--showcase"
              onClick={() => onToggleShowcase(item.fileId)}
            >
              Витрина
            </button>
          ) : (
            <Button
              type="default"
              size="small"
              className="product-create-images__action-btn"
              onClick={() => onToggleShowcase(item.fileId)}
            >
              На витрине
            </Button>
          )
        ) : null}
      </div>
      <Button
        type="text"
        danger
        size="small"
        className="product-create-images__remove"
        icon={<DeleteOutlined />}
        onClick={() => onRemove(item.fileId)}
      />
    </Reorder.Item>
  )
}

/** Загрузка в корень CDN: в товар пишем только fileId, без folder. */
export function ProductImageUpload({
  value,
  multiple = true,
  onChange,
  showcaseFileIds,
  onShowcaseChange,
}: ProductImageUploadProps) {
  const { openNotification } = useNotificationHandler()
  const [uploadImage] = useUploadImageMutation()
  const [uploading, setUploading] = useState(false)

  const showcaseEnabled = Boolean(onShowcaseChange)
  const showcaseSet = new Set(showcaseFileIds ?? [])
  const canReorder = multiple && value.length > 1

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

  const toggleShowcase = (fileId: string) => {
    if (!onShowcaseChange) return
    const current = showcaseFileIds ?? []
    if (current.includes(fileId)) {
      onShowcaseChange(current.filter(id => id !== fileId))
      return
    }
    onShowcaseChange([...current, fileId])
  }

  const removeImage = (fileId: string) => {
    onChange(value.filter(image => image.fileId !== fileId))
    if (onShowcaseChange && (showcaseFileIds ?? []).includes(fileId)) {
      onShowcaseChange((showcaseFileIds ?? []).filter(id => id !== fileId))
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
        <p className="product-create-images__hint">
          JPG, PNG, WEBP, GIF
          {multiple ? ' · первое — главная · можно менять местами' : ''}
          {showcaseEnabled ? ' · «На витрине» — в карточке коллекции' : ''}
        </p>
      </Upload.Dragger>

      {uploading ? (
        <div className="product-create-images__loading">
          <Spin size="small" /> Загрузка...
        </div>
      ) : null}

      {value.length > 0 ? (
        canReorder ? (
          <Reorder.Group
            axis="x"
            values={value}
            onReorder={onChange}
            as="div"
            className="product-create-images__list product-create-images__list--sortable"
          >
            {value.map((item, index) => (
              <SortableImageItem
                key={item.fileId}
                item={item}
                index={index}
                multiple={multiple}
                isMain={index === 0}
                isShowcase={showcaseSet.has(item.fileId)}
                showcaseEnabled={showcaseEnabled}
                onSetMain={setAsMain}
                onToggleShowcase={toggleShowcase}
                onRemove={removeImage}
              />
            ))}
          </Reorder.Group>
        ) : (
          <div className="product-create-images__list">
            {value.map((item, index) => (
              <div
                key={item.fileId}
                className={[
                  'product-create-images__item',
                  multiple && index === 0 ? 'product-create-images__item--main' : '',
                  showcaseSet.has(item.fileId) ? 'product-create-images__item--showcase' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <Image
                  src={item.url}
                  alt=""
                  width={96}
                  height={96}
                  style={{ objectFit: 'cover' }}
                  preview={{ mask: 'Просмотр' }}
                />
                <div className="product-create-images__actions">
                  {multiple && index === 0 ? (
                    <span className="product-create-images__badge">Главная</span>
                  ) : null}
                  {showcaseEnabled ? (
                    showcaseSet.has(item.fileId) ? (
                      <button
                        type="button"
                        className="product-create-images__badge product-create-images__badge--showcase"
                        onClick={() => toggleShowcase(item.fileId)}
                      >
                        Витрина
                      </button>
                    ) : (
                      <Button
                        type="default"
                        size="small"
                        className="product-create-images__action-btn"
                        onClick={() => toggleShowcase(item.fileId)}
                      >
                        На витрине
                      </Button>
                    )
                  ) : null}
                </div>
                <Button
                  type="text"
                  danger
                  size="small"
                  className="product-create-images__remove"
                  icon={<DeleteOutlined />}
                  onClick={() => removeImage(item.fileId)}
                />
              </div>
            ))}
          </div>
        )
      ) : null}
    </div>
  )
}
