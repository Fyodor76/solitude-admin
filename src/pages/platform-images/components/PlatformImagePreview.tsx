import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'
import { Modal } from 'antd'

interface PlatformImagePreviewProps {
  file: imgUpload | null
  onClose: () => void
}

export const PlatformImagePreview = ({ file, onClose }: PlatformImagePreviewProps) => {
  return (
    <Modal
      open={Boolean(file)}
      onCancel={onClose}
      footer={null}
      width="auto"
      centered
      destroyOnHidden
      closable={false}
      className="platform-images-preview-modal"
    >
      {file ? (
        <div className="platform-images-preview__content">
          <button
            type="button"
            className="platform-images-preview__close"
            onClick={onClose}
            aria-label="Закрыть"
          />
          <img
            src={file.url}
            alt={file.name || file.fileId}
            className="platform-images-preview__image"
          />
        </div>
      ) : null}
    </Modal>
  )
}
