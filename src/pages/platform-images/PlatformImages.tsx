import { useEffect, useMemo, useRef, useState } from 'react'

import {
  imgUpload,
  useDeleteFileByIdMutation,
  useLazyListFilesQuery,
  useUploadImageMutation,
} from '@/shared/lib/api/upload-files/uploadFiles'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import { CustomButton } from '@/shared/ui/custom-button/CustomButton'
import Portal from '@/shared/ui/portal'
import { Spinner } from '@/shared/ui/spinner/Spinner'
import { Input, Select } from 'antd'

const PAGE_SIZE = 24
const PLATFORM_IMAGES_FOLDER = ''

export const PlatformImages = () => {
  const { contextHolder, openNotification } = useNotificationHandler()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [triggerList, listState] = useLazyListFilesQuery()
  const [uploadImage, uploadState] = useUploadImageMutation()
  const [deleteFileById, deleteState] = useDeleteFileByIdMutation()

  const [items, setItems] = useState<imgUpload[]>([])
  const [nextToken, setNextToken] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'size' | 'name'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const files = useMemo(() => items, [items])

  const loadFirstPage = async () => {
    setItems([])
    setNextToken(undefined)
    setHasMore(false)
    setLoadingMore(false)

    try {
      const res = await triggerList({
        folder: PLATFORM_IMAGES_FOLDER,
        limit: PAGE_SIZE,
        search: search.trim() || undefined,
        sortBy,
        sortOrder,
      }).unwrap()
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
    setLoadingMore(true)
    try {
      const res = await triggerList({
        folder: PLATFORM_IMAGES_FOLDER,
        limit: PAGE_SIZE,
        continuationToken: nextToken,
        search: search.trim() || undefined,
        sortBy,
        sortOrder,
      }).unwrap()
      setItems(prev => [...prev, ...(res.data ?? [])])
      setNextToken(res.meta?.nextContinuationToken)
      setHasMore(Boolean(res.meta?.nextContinuationToken) || Boolean(res.meta?.isTruncated))
    } catch (err: any) {
      openNotification(
        'error',
        err?.data?.error || err?.data?.message || 'Не удалось загрузить следующую страницу'
      )
    } finally {
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    loadFirstPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewUrl(null)
    }
    if (previewUrl) {
      window.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [previewUrl])

  const onPickFile = () => fileInputRef.current?.click()

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async e => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      await uploadImage({ file, folder: PLATFORM_IMAGES_FOLDER }).unwrap()
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
      await deleteFileById({ fileId, folder: PLATFORM_IMAGES_FOLDER }).unwrap()
      openNotification('success', 'Изображение удалено')
      await loadFirstPage()
    } catch (err: any) {
      openNotification(
        'error',
        err?.data?.error || err?.data?.message || 'Не удалось удалить изображение'
      )
    }
  }

  const isInitialLoading = listState.isLoading && files.length === 0
  const busy = uploadState.isLoading || deleteState.isLoading

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}

      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
      >
        <h2 style={{ margin: 0 }}>Изображения платформы</h2>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Input
            placeholder="Поиск по названию / fileId"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />
          <Select
            value={`${sortBy}:${sortOrder}`}
            onChange={v => {
              const [sb, so] = v.split(':') as ['date' | 'size' | 'name', 'asc' | 'desc']
              setSortBy(sb)
              setSortOrder(so)
            }}
            style={{ width: 220 }}
            options={[
              { value: 'date:desc', label: 'По дате (новые)' },
              { value: 'date:asc', label: 'По дате (старые)' },
              { value: 'size:desc', label: 'По размеру (больше)' },
              { value: 'size:asc', label: 'По размеру (меньше)' },
              { value: 'name:asc', label: 'По имени (A→Z)' },
              { value: 'name:desc', label: 'По имени (Z→A)' },
            ]}
          />
          <CustomButton
            onClick={loadFirstPage}
            disabled={busy || listState.isFetching || listState.isLoading || loadingMore}
          >
            Применить
          </CustomButton>
          <CustomButton
            onClick={onPickFile}
            type="primary"
            disabled={busy || listState.isFetching || listState.isLoading || loadingMore}
          >
            Добавить
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
        {isInitialLoading ? (
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
                    onClick={() => setPreviewUrl(f.url)}
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
                    title="Открыть на весь экран"
                  >
                    <img
                      src={f.url}
                      alt={f.name || f.fileId}
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
                      {f.name || f.fileId}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                      <CustomButton
                        onClick={() => navigator.clipboard.writeText(f.url)}
                        disabled={
                          busy || listState.isFetching || listState.isLoading || loadingMore
                        }
                        size="small"
                      >
                        Скопировать ссылку
                      </CustomButton>
                      <CustomButton
                        onClick={() => onDelete(f.fileId)}
                        danger
                        disabled={
                          busy || listState.isFetching || listState.isLoading || loadingMore
                        }
                        size="small"
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CustomButton
                    onClick={loadMore}
                    disabled={
                      busy ||
                      !nextToken ||
                      listState.isFetching ||
                      listState.isLoading ||
                      loadingMore
                    }
                    type="primary"
                  >
                    {loadingMore ? 'Загрузка…' : 'Загрузить ещё'}
                  </CustomButton>
                  {loadingMore ? (
                    <span style={{ opacity: 0.7, fontSize: 12 }}>Подгружаем…</span>
                  ) : null}
                </div>
              ) : (
                <div style={{ opacity: 0.6 }}>Это все изображения.</div>
              )}
            </div>
          </>
        )}
      </div>

      {previewUrl ? (
        <div
          onClick={() => setPreviewUrl(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <button
              type="button"
              onClick={() => setPreviewUrl(null)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.22)',
                color: '#fff',
                borderRadius: 10,
                padding: '8px 12px',
                cursor: 'pointer',
                zIndex: 1,
              }}
            >
              ✕
            </button>

            <img
              src={previewUrl}
              alt="preview"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: 12,
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
