import { useState } from 'react'

import { useUploadImageMutation } from '@/shared/lib/api/upload-files/uploadFiles'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import { resolveMediaUrl } from '@/shared/lib/utils/resolveMediaUrl'
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons'
import { Button, Spin, Upload } from 'antd'
import classNames from 'classnames'

interface StageImageFieldProps {
  label: string
  hint: string
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
        'landing-stage-editor__media-row',
        `landing-stage-editor__media-row--${variant}`
      )}
    >
      <div
        className={classNames(
          'landing-stage-editor__thumb',
          `landing-stage-editor__thumb--${variant}`,
          !previewUrl && 'landing-stage-editor__thumb--empty'
        )}
      >
        {previewUrl ? (
          <img src={previewUrl} alt={label} />
        ) : uploading ? (
          <Spin size="small" />
        ) : (
          <InboxOutlined />
        )}
      </div>

      <div className="landing-stage-editor__media-meta">
        <div className="landing-stage-editor__media-title">{label}</div>
        <div className="landing-stage-editor__media-hint">{hint}</div>
      </div>

      <div className="landing-stage-editor__media-actions">
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
          <Button loading={uploading}>{previewUrl ? 'Заменить' : 'Загрузить'}</Button>
        </Upload>
        {previewUrl ? (
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onChange(null)}
            aria-label={`Удалить ${label}`}
          >
            Удалить
          </Button>
        ) : null}
      </div>
    </div>
  )
}
