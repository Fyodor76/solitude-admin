import { useEffect, useRef, useState } from 'react'

import Portal from '@/shared/ui/portal'
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
  const [editorKey, setEditorKey] = useState(0)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [removingBg, setRemovingBg] = useState(false)
  const [bgProgress, setBgProgress] = useState<string | null>(null)
  const [bgRemoved, setBgRemoved] = useState(false)
  const [bgError, setBgError] = useState<string | null>(null)
  const revokeRef = useRef<(() => void) | null>(null)

  const replaceSource = (url: string, revoke: () => void) => {
    revokeRef.current?.()
    revokeRef.current = revoke
    setSource(url)
    setEditorKey(key => key + 1)
  }

  useEffect(() => {
    if (!open || !imageUrl) {
      setSource(null)
      setLoadError(null)
      setBgRemoved(false)
      setBgError(null)
      setBgProgress(null)
      return
    }

    let cancelled = false
    setSource(null)
    setLoadError(null)
    setBgRemoved(false)
    setBgError(null)
    setBgProgress(null)

    void resolveEditableSource(imageUrl, fileId)
      .then(result => {
        if (cancelled) {
          result.revoke()
          return
        }
        replaceSource(result.url, result.revoke)
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError('Не удалось загрузить фото для редактирования. Проверьте доступ к API/CDN.')
        }
      })

    return () => {
      cancelled = true
      revokeRef.current?.()
      revokeRef.current = null
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

  const handleRemoveBackground = async () => {
    if (!source || removingBg || saving) return

    setRemovingBg(true)
    setBgError(null)
    setBgProgress('Загрузка модели...')

    try {
      const { removeBackground } = await import('@imgly/background-removal')
      const blob = await removeBackground(source, {
        output: { format: 'image/png', quality: 0.9 },
        progress: (key, current, total) => {
          if (key === 'compute:inference') {
            setBgProgress('Удаление фона...')
            return
          }
          if (total > 0) {
            const pct = Math.round((current / total) * 100)
            setBgProgress(`Загрузка модели… ${pct}%`)
          }
        },
      })
      const objectUrl = URL.createObjectURL(blob)
      replaceSource(objectUrl, () => URL.revokeObjectURL(objectUrl))
      setBgRemoved(true)
      setBgProgress(null)
    } catch {
      setBgError('Не удалось убрать фон. Попробуйте ещё раз.')
      setBgProgress(null)
    } finally {
      setRemovingBg(false)
    }
  }

  const busy = saving || removingBg

  return (
    <Portal>
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
          disabled={busy}
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
            <>
              <div className="image-edit-modal__bar">
                <Button
                  type="default"
                  loading={removingBg}
                  disabled={busy}
                  onClick={handleRemoveBackground}
                >
                  Убрать фон
                </Button>
                {bgRemoved ? (
                  <span className="image-edit-modal__bar-hint">Фон убран · сохранение в PNG</span>
                ) : null}
                {bgError ? <span className="image-edit-modal__bar-error">{bgError}</span> : null}
              </div>
              <div className="image-edit-modal__editor">
                {busy ? (
                  <div className="image-edit-modal__saving">
                    <Spin tip={removingBg ? bgProgress || 'Удаление фона...' : 'Сохранение...'} />
                  </div>
                ) : null}
                <FilerobotImageEditor
                  key={editorKey}
                  source={source}
                  onBeforeSave={() => false}
                  onSave={handleSave}
                  onClose={() => {
                    if (!busy) onCancel()
                  }}
                  closeAfterSave={false}
                  disableSaveIfNoChanges={!bgRemoved}
                  tabsIds={[TABS.ADJUST, TABS.FINETUNE]}
                  defaultTabId={TABS.ADJUST}
                  defaultToolId={TOOLS.CROP}
                  defaultSavedImageType={bgRemoved ? 'png' : 'jpeg'}
                  defaultSavedImageQuality={0.92}
                  savingPixelRatio={1}
                  previewPixelRatio={
                    typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
                  }
                  observePluginContainerSize
                  language="en"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Portal>
  )
}
