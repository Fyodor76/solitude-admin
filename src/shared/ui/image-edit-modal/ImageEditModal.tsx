import { useEffect, useRef, useState } from 'react'

import Portal from '@/shared/ui/portal'
import { Button, message, Spin } from 'antd'
import { createPortal } from 'react-dom'
import FilerobotImageEditor, { TABS } from 'react-filerobot-image-editor'

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
  const [topbarSlot, setTopbarSlot] = useState<HTMLElement | null>(null)
  const [canvasHost, setCanvasHost] = useState<HTMLElement | null>(null)
  const revokeRef = useRef<(() => void) | null>(null)
  const editorRootRef = useRef<HTMLDivElement | null>(null)

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
      setBgProgress(null)
      return
    }

    let cancelled = false
    setSource(null)
    setLoadError(null)
    setBgRemoved(false)
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

  useEffect(() => {
    if (!source) {
      setTopbarSlot(null)
      setCanvasHost(null)
      return
    }

    let cancelled = false
    setTopbarSlot(null)
    setCanvasHost(null)

    const pick = () => {
      const root = editorRootRef.current
      if (!root) return false
      const topbar = root.querySelector('.FIE_topbar-buttons-wrapper') as HTMLElement | null
      const canvas = root.querySelector('.FIE_canvas-container') as HTMLElement | null
      if (!topbar || !canvas) return false
      if (!cancelled) {
        setTopbarSlot(topbar)
        setCanvasHost(canvas)
      }
      return true
    }

    if (pick()) return

    const intervalId = window.setInterval(() => {
      if (pick()) window.clearInterval(intervalId)
    }, 50)
    const timeoutId = window.setTimeout(() => window.clearInterval(intervalId), 4000)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
    }
  }, [source, editorKey])

  const busy = saving || removingBg
  const busyLabel = removingBg ? bgProgress || 'Удаление фона...' : 'Сохранение...'
  const busyRef = useRef(false)
  busyRef.current = busy

  useEffect(() => {
    if (!open || !source) return

    const root = editorRootRef.current
    if (!root) return

    const handleCloseClick = (event: Event) => {
      const target = event.target as HTMLElement | null
      if (!target?.closest('.FIE_buttons-close-btn')) return
      event.preventDefault()
      event.stopPropagation()
      if (busyRef.current) return
      onCancel()
    }

    root.addEventListener('click', handleCloseClick, true)
    return () => root.removeEventListener('click', handleCloseClick, true)
  }, [open, source, topbarSlot, editorKey, onCancel])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (busyRef.current) return
      event.preventDefault()
      onCancel()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onCancel])

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
    setBgProgress('Подготовка модели...')

    try {
      const { removeBackground } = await import('@imgly/background-removal')
      const publicPath = new URL(
        `${import.meta.env.BASE_URL}background-removal-data/`,
        window.location.href
      ).href
      const blob = await removeBackground(source, {
        publicPath,
        // компактная квантованная модель — быстрее грузится с нашего хоста
        model: 'isnet_quint8',
        output: { format: 'image/png', quality: 0.9 },
        progress: (key, current, total) => {
          if (key === 'compute:inference') {
            setBgProgress('Удаление фона...')
            return
          }
          if (total > 0) {
            const pct = Math.round((current / total) * 100)
            setBgProgress(`Подготовка модели… ${pct}%`)
          }
        },
      })
      const objectUrl = URL.createObjectURL(blob)
      replaceSource(objectUrl, () => URL.revokeObjectURL(objectUrl))
      setBgRemoved(true)
      setBgProgress(null)
      message.success('Фон убран')
    } catch {
      setBgProgress(null)
      message.error('Не удалось убрать фон. Попробуйте ещё раз.')
    } finally {
      setRemovingBg(false)
    }
  }

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
              <div className="image-edit-modal__busy-inner">
                <Spin size="large" />
                <span>Загрузка фото...</span>
              </div>
            </div>
          ) : (
            <div className="image-edit-modal__editor" ref={editorRootRef}>
              {topbarSlot
                ? createPortal(
                    <Button
                      type="default"
                      size="small"
                      className="image-edit-modal__bg-btn"
                      loading={removingBg}
                      disabled={busy}
                      onClick={handleRemoveBackground}
                    >
                      Убрать фон
                    </Button>,
                    topbarSlot
                  )
                : null}
              {busy && canvasHost
                ? createPortal(
                    <div className="image-edit-modal__saving">
                      <div className="image-edit-modal__busy-inner">
                        <Spin size="large" />
                        <span>{busyLabel}</span>
                      </div>
                    </div>,
                    canvasHost
                  )
                : null}
              <FilerobotImageEditor
                key={editorKey}
                source={source}
                onBeforeSave={() => false}
                onSave={handleSave}
                onClose={() => {
                  if (!busyRef.current) onCancel()
                }}
                closeAfterSave={false}
                avoidChangesNotSavedAlertOnLeave
                disableSaveIfNoChanges={!bgRemoved}
                tabsIds={[TABS.ADJUST, TABS.FINETUNE]}
                defaultTabId={TABS.ADJUST}
                defaultSavedImageType={bgRemoved ? 'png' : 'jpeg'}
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
    </Portal>
  )
}
