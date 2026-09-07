import { useState } from 'react'

import { useUploadImageMutation } from '@/shared/lib/api/upload-files/uploadFiles'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import { resolveMediaUrl } from '@/shared/lib/utils/resolveMediaUrl'
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons'
import { Button, Spin, Upload } from 'antd'
import classNames from 'classnames'

interface StageImageFieldProps {
  label: string
  hint?: string
  variant: 'desktop' | 'mobile'
  fileId: string | null
  onChange: (fileId: string | null) => void
}

export function StageImageField({ label, hint, variant, fileId, onChange }: StageImageFieldProps) {
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
    <div
      className={classNames(
        'landing-stage-editor__image-field',
        `landing-stage-editor__image-field--${variant}`
      )}
    >
      <div className="landing-stage-editor__image-label">{label}</div>
      {hint ? <p className="landing-stage-editor__image-hint">{hint}</p> : null}
      {previewUrl ? (
        <div className="landing-stage-editor__preview">
          <div
            className={classNames(
              'landing-stage-editor__frame',
              `landing-stage-editor__frame--${variant}`
            )}
          >
            <img src={previewUrl} alt={label} className="landing-stage-editor__frame-img" />
          </div>
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
              <Button size="small" loading={uploading}>
                Заменить
              </Button>
            </Upload>
            <Button
              type="text"
              size="small"
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
          className={classNames(
            'landing-stage-editor__uploader',
            `landing-stage-editor__uploader--${variant}`
          )}
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
          <p className="ant-upload-text">Загрузить</p>
        </Upload.Dragger>
      )}
    </div>
  )
}
