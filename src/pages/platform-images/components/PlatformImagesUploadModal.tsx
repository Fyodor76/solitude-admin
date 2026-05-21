import { useEffect, useMemo, useState } from 'react'

import { InboxOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import { Input, Modal, Upload } from 'antd'
import type { RcFile } from 'antd/es/upload'

import { PLATFORM_IMAGE_ACCEPT, PLATFORM_IMAGES_UPLOAD } from '../constants'
import { filterPlatformImageFiles } from '../helpers/filterPlatformImageFiles'
import { filesFromUploadFileList, mapFilesToUploadFileList } from '../helpers/uploadFileList'

interface PlatformImagesUploadModalProps {
  open: boolean
  loading?: boolean
  onClose: () => void
  onSubmit: (files: File[], displayName?: string) => Promise<void>
}

export const PlatformImagesUploadModal = ({
  open,
  loading,
  onClose,
  onSubmit,
}: PlatformImagesUploadModalProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [name, setName] = useState('')

  const files = useMemo(() => filesFromUploadFileList(fileList), [fileList])

  const isSingleFile = files.length === 1

  useEffect(() => {
    if (!open) {
      setFileList([])
      setName('')
    }
  }, [open])

  const uploadProps: UploadProps = {
    multiple: true,
    accept: PLATFORM_IMAGE_ACCEPT,
    fileList,
    beforeUpload: (_file, batch) => {
      const next = filterPlatformImageFiles(batch as RcFile[])
      setFileList(mapFilesToUploadFileList(next))
      return false
    },
    onRemove: file => {
      setFileList(previous => previous.filter(item => item.uid !== file.uid))
    },
  }

  const handleSubmit = async () => {
    if (files.length === 0) {
      return
    }

    const displayName = isSingleFile && name.trim() ? name.trim() : undefined
    await onSubmit(files, displayName)
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={files.length > 1 ? `Загрузить (${files.length})` : 'Загрузить'}
      cancelText="Отмена"
      title={files.length > 1 ? 'Добавить изображения' : 'Добавить изображение'}
      okButtonProps={{ disabled: files.length === 0 }}
      destroyOnHidden
      width={PLATFORM_IMAGES_UPLOAD.MODAL_WIDTH_PX}
    >
      <div className="platform-images-upload-modal">
        <Upload.Dragger {...uploadProps} className="platform-images-upload-modal__dragger">
          <p className="platform-images-upload-modal__dragger-icon">
            <InboxOutlined />
          </p>
          <p className="platform-images-upload-modal__dragger-title">
            Перетащите фото или выберите файлы
          </p>
          <p className="platform-images-upload-modal__dragger-hint">
            Можно выбрать несколько сразу
          </p>
        </Upload.Dragger>

        {isSingleFile ? (
          <label className="platform-images-upload-modal__field">
            <span>Название изображения (необязательно)</span>
            <Input
              value={name}
              onChange={event => setName(event.target.value)}
              placeholder="Например, Главный баннер"
              maxLength={PLATFORM_IMAGES_UPLOAD.NAME_MAX_LENGTH}
            />
          </label>
        ) : null}

        {files.length > 0 ? (
          <div className="platform-images-upload-modal__hint">
            Выбрано файлов: <strong>{files.length}</strong>
          </div>
        ) : (
          <div className="platform-images-upload-modal__hint">
            Добавьте одно или несколько изображений для загрузки.
          </div>
        )}
      </div>
    </Modal>
  )
}
