import { useEffect, useState } from 'react'

import { Button, Spin } from 'antd'
import FilerobotImageEditor, { TABS, TOOLS } from 'react-filerobot-image-editor'

import { API_URL } from '@/app/constans/url'

import './ImageEditModal.scss'

type SavedImageData = {
  name: string
  extension: string
  mimeType: string
  imageBase64?: string
  imageCanvas?: HTMLCanvasElement
}

type ImageEditModalProps = {
  open: boolean
  /** CDN URL — fallback, если нет fileId */
  imageUrl: string
  /** fileId в CDN — грузим через API (обход CORS CDN) */
  fileId?: string
  onCancel: () => void
  onSave: (file: File) => Promise<void>
}

async function savedDataToFile(data: SavedImageData): Promise<File> {
  const mimeType = data.mimeType || 'image/jpeg'
  const extension = data.extension?.replace(/^\./, '') || (mimeType.includes('png') ? 'png' : 'jpg')
  const fileName = `${data.name || 'edited'}.${extension}`

  if (data.imageCanvas) {
    const blob = await new Promise<Blob | null>(resolve => {
      data.imageCanvas!.toBlob(resolve, mimeType, 0.92)
    })
    if (!blob) throw new Error('Не удалось экспортировать изображение')
    return new File([blob], fileName, { type: mimeType })
  }

  if (data.imageBase64) {
    const response = await fetch(data.imageBase64)
    const blob = await response.blob()
    return new File([blob], fileName, { type: mimeType })
  }

  throw new Error('Нет данных изображения для сохранения')
}

function fileIdFromUrl(imageUrl: string): string | null {
  try {
    const pathname = new URL(imageUrl).pathname
    const segment = pathname.split('/').filter(Boolean).pop()
    return segment || null
  } catch {
    return null
  }
}

async function fetchViaApi(fileId: string): Promise<Blob> {
  const token = localStorage.getItem('access')
  const response = await fetch(`${API_URL}/cdn/file/${encodeURIComponent(fileId)}`, {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  })
  if (!response.ok) {
    throw new Error(`API download failed: ${response.status}`)
  }
  return response.blob()
}

async function resolveEditableSource(
  imageUrl: string,
  fileId?: string
): Promise<{ url: string; revoke: () => void }> {
  const resolvedId = fileId || fileIdFromUrl(imageUrl)

  if (resolvedId && API_URL) {
    try {
      const blob = await fetchViaApi(resolvedId)
      const objectUrl = URL.createObjectURL(blob)
      return {
        url: objectUrl,
        revoke: () => URL.revokeObjectURL(objectUrl),
      }
    } catch {
      // fall through to direct CDN fetch
    }
  }

  const response = await fetch(imageUrl, { mode: 'cors' })
  if (!response.ok) throw new Error('fetch failed')
  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  return {
    url: objectUrl,
    revoke: () => URL.revokeObjectURL(objectUrl),
  }
}

export function ImageEditModal({ open, imageUrl, fileId, onCancel, onSave }: ImageEditModalProps) {
  const [source, setSource] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open || !imageUrl) {
      setSource(null)
      setLoadError(null)
      return
    }

    let cancelled = false
    let revoke: () => void = () => undefined
    setSource(null)
    setLoadError(null)

    void resolveEditableSource(imageUrl, fileId)
      .then(result => {
        if (cancelled) {
          result.revoke()
          return
        }
        revoke = result.revoke
        setSource(result.url)
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError('Не удалось загрузить фото для редактирования. Проверьте доступ к API/CDN.')
        }
      })

    return () => {
      cancelled = true
      revoke()
      setSource(null)
    }
  }, [open, imageUrl, fileId])

  if (!open) return null

  const handleSave = async (data: SavedImageData) => {
    if (saving) return
    setSaving(true)
    try {
      const file = await savedDataToFile(data)
      await onSave(file)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="image-edit-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Редактирование фото"
    >
      <button
        type="button"
        className="image-edit-modal__backdrop"
        aria-label="Закрыть"
        onClick={onCancel}
      />
      <div className="image-edit-modal__panel">
        {loadError ? (
          <div className="image-edit-modal__loading image-edit-modal__error">
            <p>{loadError}</p>
            <Button type="primary" onClick={onCancel}>
              Закрыть
            </Button>
          </div>
        ) : !source ? (
          <div className="image-edit-modal__loading">
            <Spin tip="Загрузка фото..." />
          </div>
        ) : (
          <div className="image-edit-modal__editor">
            {saving ? (
              <div className="image-edit-modal__saving">
                <Spin tip="Сохранение..." />
              </div>
            ) : null}
            <FilerobotImageEditor
              source={source}
              onBeforeSave={() => false}
              onSave={handleSave}
              onClose={() => {
                if (!saving) onCancel()
              }}
              closeAfterSave={false}
              disableSaveIfNoChanges
              tabsIds={[TABS.ADJUST, TABS.FINETUNE]}
              defaultTabId={TABS.ADJUST}
              defaultToolId={TOOLS.CROP}
              defaultSavedImageType="jpeg"
              defaultSavedImageQuality={0.92}
              savingPixelRatio={1}
              previewPixelRatio={typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1}
              observePluginContainerSize
              language="en"
            />
          </div>
        )}
      </div>
    </div>
  )
}
