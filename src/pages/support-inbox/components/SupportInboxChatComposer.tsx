import { CloseOutlined } from '@ant-design/icons'
import { Input, Spin } from 'antd'

import { SUPPORT_INBOX_COPY } from '../constants'
import { SupportInboxPaperclipIcon, SupportInboxSendIcon } from '../support-inbox.icons'

const { TextArea } = Input

interface SupportInboxChatComposerProps {
  replyText: string
  replying: boolean
  uploadingPhoto: boolean
  canSend: boolean
  pendingPreviewUrl: string | null
  acceptImageTypes: string
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onReplyTextChange: (value: string) => void
  onPickPhoto: () => void
  onPhotoSelected: (file: File | null) => void
  onClearPendingPhoto: () => void
  onReply: () => void
}

export function SupportInboxChatComposer({
  replyText,
  replying,
  uploadingPhoto,
  canSend,
  pendingPreviewUrl,
  acceptImageTypes,
  fileInputRef,
  onReplyTextChange,
  onPickPhoto,
  onPhotoSelected,
  onClearPendingPhoto,
  onReply,
}: SupportInboxChatComposerProps) {
  const isBusy = replying || uploadingPhoto

  return (
    <footer className="support-inbox__composer">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptImageTypes}
        className="support-inbox__composer-file-input"
        onChange={e => {
          const file = e.target.files?.[0] ?? null
          void onPhotoSelected(file)
        }}
      />

      {pendingPreviewUrl && (
        <div className="support-inbox__composer-preview">
          <img src={pendingPreviewUrl} alt="" />
          <button
            type="button"
            className="support-inbox__composer-preview-remove"
            onClick={onClearPendingPhoto}
            aria-label={SUPPORT_INBOX_COPY.REMOVE_PHOTO}
          >
            <CloseOutlined />
          </button>
        </div>
      )}

      <div className="support-inbox__composer-main">
        <TextArea
          className="support-inbox__composer-input"
          rows={3}
          value={replyText}
          onChange={e => onReplyTextChange(e.target.value)}
          placeholder={SUPPORT_INBOX_COPY.REPLY_PLACEHOLDER}
          disabled={isBusy}
          onPressEnter={e => {
            if (!e.shiftKey) {
              e.preventDefault()
              onReply()
            }
          }}
        />
        <div className="support-inbox__composer-actions">
          <button
            type="button"
            className="support-inbox__composer-btn support-inbox__composer-btn--attach"
            onClick={onPickPhoto}
            disabled={isBusy}
            aria-label={SUPPORT_INBOX_COPY.ATTACH_PHOTO}
          >
            {uploadingPhoto ? <Spin size="small" /> : <SupportInboxPaperclipIcon />}
          </button>
          <button
            type="button"
            className="support-inbox__composer-btn support-inbox__composer-btn--send"
            disabled={!canSend}
            onClick={onReply}
            aria-label={SUPPORT_INBOX_COPY.SEND_REPLY}
          >
            {replying ? <Spin size="small" /> : <SupportInboxSendIcon />}
          </button>
        </div>
      </div>
    </footer>
  )
}
