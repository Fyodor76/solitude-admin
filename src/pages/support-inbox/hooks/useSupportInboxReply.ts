import { useCallback, useRef, useState } from 'react'

import { useReplySupportConversationMutation } from '@/shared/lib/api/support/supportApi'
import { useImageState } from '@/shared/lib/hooks/useImage'

const ACCEPT_IMAGE_TYPES = 'image/jpeg,image/png,image/webp,image/gif'

export function useSupportInboxReply(selectedId: number | null, onSent: () => void) {
  const [replyText, setReplyText] = useState('')
  const [pendingFileId, setPendingFileId] = useState<string | null>(null)
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadImage, loading } = useImageState()
  const [replyConversation, { isLoading: replying }] = useReplySupportConversationMutation()

  const clearPendingPhoto = useCallback(() => {
    setPendingFileId(null)
    if (pendingPreviewUrl) {
      URL.revokeObjectURL(pendingPreviewUrl)
    }
    setPendingPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [pendingPreviewUrl])

  const handlePickPhoto = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoSelected = async (file: File | null) => {
    if (!file) return
    try {
      const result = await uploadImage(file)
      setPendingFileId(result.data.fileId)
      setPendingPreviewUrl(result.data.url)
    } catch {
      clearPendingPhoto()
    }
  }

  const canSend = Boolean(replyText.trim() || pendingFileId)

  const handleReply = async () => {
    if (!selectedId || !canSend) return

    await replyConversation({
      id: selectedId,
      ...(replyText.trim() ? { text: replyText.trim() } : {}),
      ...(pendingFileId ? { fileId: pendingFileId } : {}),
    }).unwrap()

    setReplyText('')
    clearPendingPhoto()
    onSent()
  }

  return {
    replyText,
    setReplyText,
    pendingFileId,
    pendingPreviewUrl,
    fileInputRef,
    acceptImageTypes: ACCEPT_IMAGE_TYPES,
    uploadingPhoto: loading.upload,
    replying,
    canSend,
    handlePickPhoto,
    handlePhotoSelected,
    clearPendingPhoto,
    handleReply,
  }
}
