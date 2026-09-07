import { useState } from 'react'

import { useUploadImageMutation } from '@/shared/lib/api/upload-files/uploadFiles'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import { resolveMediaUrl } from '@/shared/lib/utils/resolveMediaUrl'
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons'
import { Button, Image, Spin, Upload } from 'antd'

interface StageImageFieldProps {
  label: string
  hint?: string
  fileId: string | null
  onChange: (fileId: string | null) => void
}

export function StageImageField({ label, hint, fileId, onChange }: StageImageFieldProps) {
  const { openNotification } = useNotificationHandler()
  const [uploadImage] = useUploadImageMutation()
  const [uploading, setUploading] = useState(false)

  const previewUrl = resolveMediaUrl(fileId)

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const response = await uploadImage({ file }).unwrap()
      const nextId = response.data?.fileId
      if (!nextId) {
        openNotification('error', ['Не удалось загрузить изображение'])
        return
      }
      onChange(nextId)
      openNotification('success', ['Изображение загружено'])
    } catch {
      openNotification('error', ['Ошибка загрузки изображения'])
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="landing-stage-editor__image-field">
      <div className="landing-stage-editor__image-label">{label}</div>
      {hint ? <p className="landing-stage-editor__image-hint">{hint}</p> : null}
      {previewUrl ? (
        <div className="landing-stage-editor__preview">
          <Image
            src={previewUrl}
            alt={label}
            className="landing-stage-editor__preview-img"
            preview={{ mask: 'Просмотр' }}
          />
          <div className="landing-stage-editor__preview-actions">
            <Upload
              accept="image/*"
              multiple={false}
              showUploadList={false}
              disabled={uploading}
              beforeUpload={file => {
                void handleUpload(file)
                return false
              }}
            >
              <Button loading={uploading}>Заменить</Button>
            </Upload>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onChange(null)}
              aria-label={`Удалить ${label}`}
            >
              Удалить
            </Button>
          </div>
        </div>
      ) : (
        <Upload.Dragger
          className="landing-stage-editor__uploader"
          accept="image/*"
          multiple={false}
          showUploadList={false}
          disabled={uploading}
          beforeUpload={file => {
            void handleUpload(file)
            return false
          }}
        >
          <p className="ant-upload-drag-icon">{uploading ? <Spin /> : <InboxOutlined />}</p>
          <p className="ant-upload-text">Загрузить {label.toLowerCase()}</p>
          <p className="ant-upload-hint">PNG, JPG, WEBP</p>
        </Upload.Dragger>
      )}
    </div>
  )
}
