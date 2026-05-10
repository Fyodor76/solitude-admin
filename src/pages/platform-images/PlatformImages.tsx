import { useEffect, useMemo, useRef, useState } from 'react'

import {
  imgUpload,
  useDeleteFileByIdMutation,
  useLazyListFilesQuery,
  useUploadImageMutation,
} from '@/shared/lib/api/upload-files/uploadFiles'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import { CustomButton } from '@/shared/ui/custom-button/CustomButton'
import { Spinner } from '@/shared/ui/spinner/Spinner'

const PAGE_SIZE = 24

export const PlatformImages = () => {
  const { contextHolder, openNotification } = useNotificationHandler()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [triggerList, listState] = useLazyListFilesQuery()
  const [uploadImage, uploadState] = useUploadImageMutation()
  const [deleteFileById, deleteState] = useDeleteFileByIdMutation()

  const [items, setItems] = useState<imgUpload[]>([])
  const [nextToken, setNextToken] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState<boolean>(false)

  const files = useMemo(() => items, [items])

  const loadFirstPage = async () => {
    setItems([])
    setNextToken(undefined)
    setHasMore(false)

    try {
      const res = await triggerList({ folder: '', limit: PAGE_SIZE }).unwrap()
      setItems(res.data ?? [])
      setNextToken(res.meta?.nextContinuationToken)
      setHasMore(Boolean(res.meta?.nextContinuationToken) || Boolean(res.meta?.isTruncated))
    } catch (err: any) {
      openNotification(
        'error',
        err?.data?.error || err?.data?.message || 'Не удалось загрузить список файлов'
      )
    }
  }

  const loadMore = async () => {
    if (!nextToken) return
    try {
      const res = await triggerList({
        folder: '',
        limit: PAGE_SIZE,
        continuationToken: nextToken,
      }).unwrap()
      setItems(prev => [...prev, ...(res.data ?? [])])
      setNextToken(res.meta?.nextContinuationToken)
      setHasMore(Boolean(res.meta?.nextContinuationToken) || Boolean(res.meta?.isTruncated))
    } catch (err: any) {
      openNotification(
        'error',
        err?.data?.error || err?.data?.message || 'Не удалось загрузить следующую страницу'
      )
    }
  }

  useEffect(() => {
    loadFirstPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onPickFile = () => fileInputRef.current?.click()

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async e => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      await uploadImage({ file, folder: '' }).unwrap()
      openNotification('success', 'Файл загружен')
      await loadFirstPage()
    } catch (err: any) {
      openNotification(
        'error',
        err?.data?.error || err?.data?.message || 'Не удалось загрузить файл'
      )
    } finally {
      e.target.value = ''
    }
  }

  const onDelete = async (fileId: string) => {
    const ok = window.confirm('Удалить изображение?')
    if (!ok) return

    try {
      await deleteFileById({ fileId, folder: '' }).unwrap()
      openNotification('success', 'Изображение удалено')
      await loadFirstPage()
    } catch (err: any) {
      openNotification(
        'error',
        err?.data?.error || err?.data?.message || 'Не удалось удалить изображение'
      )
    }
  }

  const busy =
    listState.isLoading || listState.isFetching || uploadState.isLoading || deleteState.isLoading

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}

      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
      >
        <h2 style={{ margin: 0 }}>Изображения платформы</h2>

        <div style={{ display: 'flex', gap: 8 }}>
          <CustomButton onClick={loadFirstPage} disabled={busy}>
            Обновить
          </CustomButton>
          <CustomButton onClick={onPickFile} type="primary" disabled={busy}>
            Добавить изображение
          </CustomButton>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{ display: 'none' }}
      />

      <div style={{ marginTop: 16 }}>
        {busy ? (
          <Spinner />
        ) : files.length === 0 ? (
          <div style={{ opacity: 0.7 }}>В папке пока нет изображений.</div>
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 12,
              }}
            >
              {files.map(f => (
                <div
                  key={f.fileId}
                  style={{
                    border: '1px solid rgba(0,0,0,0.12)',
                    borderRadius: 10,
                    overflow: 'hidden',
                    background: '#fff',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => window.open(f.url, '_blank', 'noopener,noreferrer')}
                    style={{
                      padding: 0,
                      border: 0,
                      width: '100%',
                      height: 160,
                      cursor: 'pointer',
                      background: '#fafafa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Открыть изображение"
                  >
                    <img
                      src={f.url}
                      alt={f.fileId}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      loading="lazy"
                    />
                  </button>

                  <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 12, opacity: 0.75, wordBreak: 'break-all' }}>
                      {f.fileId}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <CustomButton
                        onClick={() => navigator.clipboard.writeText(f.url)}
                        disabled={busy}
                        style={{ flex: 1 }}
                      >
                        Скопировать ссылку
                      </CustomButton>
                      <CustomButton
                        onClick={() => onDelete(f.fileId)}
                        danger
                        disabled={busy}
                        style={{ flex: 1 }}
                      >
                        Удалить
                      </CustomButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
              {hasMore ? (
                <CustomButton onClick={loadMore} disabled={busy || !nextToken} type="primary">
                  Загрузить ещё
                </CustomButton>
              ) : (
                <div style={{ opacity: 0.6 }}>Это все изображения.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
