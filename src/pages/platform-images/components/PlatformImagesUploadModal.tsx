import { useEffect, useState } from 'react'

import { ImageUploadButton } from '@/shared/ui/image-upload'
import type { UploadFile, UploadProps } from 'antd'
import { Input, Modal } from 'antd'

import { UploadPlatformImagePayload } from '../types'

interface PlatformImagesUploadModalProps {
  open: boolean
  loading?: boolean
  onClose: () => void
  onSubmit: (payload: UploadPlatformImagePayload) => Promise<void>
}

export const PlatformImagesUploadModal = ({
  open,
  loading,
  onClose,
  onSubmit,
}: PlatformImagesUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [name, setName] = useState('')

  useEffect(() => {
    if (!open) {
      setFile(null)
      setFileList([])
      setName('')
    }
  }, [open])

  const uploadProps: UploadProps = {
    fileList,
    beforeUpload: nextFile => {
      setFile(nextFile)
      setFileList([nextFile as UploadFile])
      return false
    },
    onRemove: () => {
      setFile(null)
      setFileList([])
    },
  }

  const handleSubmit = async () => {
    if (!file) {
      return
    }

    await onSubmit({
      file,
      name: name.trim(),
    })
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="Загрузить"
      cancelText="Отмена"
      title="Добавить изображение"
      okButtonProps={{ disabled: !file }}
      destroyOnHidden
    >
      <div className="platform-images-upload-modal">
        <label className="platform-images-upload-modal__field">
          <span>Файл</span>
          <ImageUploadButton
            {...uploadProps}
            buttonText={file ? 'Выбрать другой файл' : 'Выбрать файл'}
          />
        </label>

        <label className="platform-images-upload-modal__field">
          <span>Название изображения</span>
          <Input
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder="Например, Главный баннер"
            maxLength={255}
          />
        </label>

        {file ? (
          <div className="platform-images-upload-modal__hint">
            Выбран файл: <strong>{file.name}</strong>
          </div>
        ) : (
          <div className="platform-images-upload-modal__hint">
            Сначала выберите изображение для загрузки.
          </div>
        )}
      </div>
    </Modal>
  )
}
