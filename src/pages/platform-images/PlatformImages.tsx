import { useEffect, useMemo, useState } from 'react'

import {
  imgUpload,
  useDeleteFileByIdMutation,
  useDeleteFilesBulkMutation,
  useLazyListFilesQuery,
} from '@/shared/lib/api/upload-files/uploadFiles'
import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import { CustomButton } from '@/shared/ui/custom-button/CustomButton'
import { Spinner } from '@/shared/ui/spinner/Spinner'
import { Checkbox } from 'antd'

import { PlatformImageCard } from './components/PlatformImageCard'
import { PlatformImagePreview } from './components/PlatformImagePreview'
import { PlatformImagesDropZone } from './components/PlatformImagesDropZone'
import { PlatformImagesToolbar } from './components/PlatformImagesToolbar'
import { PlatformImagesUploadModal } from './components/PlatformImagesUploadModal'
import { PAGE_SIZE, PLATFORM_IMAGES_FOLDER } from './constants'
import { usePlatformImagesUpload } from './hooks/usePlatformImagesUpload'
import './PlatformImages.scss'

export const PlatformImages = () => {
  const { contextHolder, openNotification } = useNotificationHandler()

  const [triggerList, listState] = useLazyListFilesQuery()
  const [deleteFileById, deleteState] = useDeleteFileByIdMutation()
  const [deleteFilesBulk, bulkDeleteState] = useDeleteFilesBulkMutation()

  const [items, setItems] = useState<imgUpload[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [nextToken, setNextToken] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'size' | 'name'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const [previewFile, setPreviewFile] = useState<imgUpload | null>(null)

  const loadFirstPage = async () => {
    setItems([])
    setSelectedIds([])
    setNextToken(undefined)
    setHasMore(false)
    setLoadingMore(false)

    try {
      const response = await triggerList({
        folder: PLATFORM_IMAGES_FOLDER,
        limit: PAGE_SIZE,
        search: search.trim() || undefined,
        sortBy,
        sortOrder,
      }).unwrap()

      setItems(response.data ?? [])
      setNextToken(response.meta?.nextContinuationToken)
      setHasMore(
        Boolean(response.meta?.nextContinuationToken) || Boolean(response.meta?.isTruncated)
      )
    } catch (error: any) {
      openNotification(
        'error',
        error?.data?.error || error?.data?.message || 'Не удалось загрузить изображения.'
      )
    }
  }

  const {
    bulkUploading,
    bulkProgress,
    uploadQueue,
    addFilesToQueue,
    handleRemoveFromQueue,
    handleClearPendingQueue,
    handleStartUpload,
    handleModalUpload,
    notifyInvalidFiles,
  } = usePlatformImagesUpload({ onUploaded: loadFirstPage })

  const busy = bulkUploading || deleteState.isLoading || bulkDeleteState.isLoading
  const loading = listState.isLoading || listState.isFetching
  const isInitialLoading = loading && items.length === 0
  const controlsDisabled = busy || loading || loadingMore

  const allVisibleIds = useMemo(() => items.map(item => item.fileId), [items])
  const isAllVisibleSelected =
    allVisibleIds.length > 0 && allVisibleIds.every(id => selectedIds.includes(id))

  const loadMore = async () => {
    if (!nextToken) {
      return
    }

    setLoadingMore(true)

    try {
      const response = await triggerList({
        folder: PLATFORM_IMAGES_FOLDER,
        limit: PAGE_SIZE,
        continuationToken: nextToken,
        search: search.trim() || undefined,
        sortBy,
        sortOrder,
      }).unwrap()

      setItems(previous => [...previous, ...(response.data ?? [])])
      setNextToken(response.meta?.nextContinuationToken)
      setHasMore(
        Boolean(response.meta?.nextContinuationToken) || Boolean(response.meta?.isTruncated)
      )
    } catch (error: any) {
      openNotification(
        'error',
        error?.data?.error || error?.data?.message || 'Не удалось загрузить следующую страницу.'
      )
    } finally {
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    void loadFirstPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (fileId: string) => {
    const ok = window.confirm('Удалить изображение?')

    if (!ok) {
      return
    }

    try {
      await deleteFileById({ fileId, folder: PLATFORM_IMAGES_FOLDER }).unwrap()
      setSelectedIds(previous => previous.filter(id => id !== fileId))
      openNotification('success', 'Изображение удалено.')
      await loadFirstPage()
    } catch (error: any) {
      openNotification(
        'error',
        error?.data?.error || error?.data?.message || 'Не удалось удалить изображение.'
      )
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      return
    }

    const ok = window.confirm(`Удалить выбранные изображения: ${selectedIds.length} шт.?`)

    if (!ok) {
      return
    }

    try {
      await deleteFilesBulk({
        fileIds: selectedIds,
        folder: PLATFORM_IMAGES_FOLDER,
      }).unwrap()

      openNotification('success', 'Выбранные изображения удалены.')
      await loadFirstPage()
    } catch (error: any) {
      openNotification(
        'error',
        error?.data?.error || error?.data?.message || 'Не удалось удалить выбранные изображения.'
      )
    }
  }

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      openNotification('success', 'Ссылка скопирована.')
    } catch {
      openNotification('error', 'Не удалось скопировать ссылку.')
    }
  }

  const handleSelectChange = (fileId: string, checked: boolean) => {
    setSelectedIds(previous => {
      if (checked) {
        return previous.includes(fileId) ? previous : [...previous, fileId]
      }

      return previous.filter(id => id !== fileId)
    })
  }

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(allVisibleIds)
      return
    }

    setSelectedIds([])
  }

  const onModalSubmit = async (files: File[], displayName?: string) => {
    const uploaded = await handleModalUpload(files, displayName)
    if (uploaded) {
      setUploadModalOpen(false)
    }
  }

  return (
    <div className="platform-images-page admin-page">
      {contextHolder}

      <PlatformImagesToolbar
        filters={{ search, sortBy, sortOrder }}
        disabled={controlsDisabled}
        onSearchChange={setSearch}
        onSortChange={(nextSortBy, nextSortOrder) => {
          setSortBy(nextSortBy)
          setSortOrder(nextSortOrder)
        }}
        onApply={loadFirstPage}
        onUploadOpen={() => setUploadModalOpen(true)}
      />

      <section className="platform-images-page__content">
        <PlatformImagesDropZone
          disabled={controlsDisabled}
          uploading={bulkUploading}
          progress={bulkProgress}
          queueItems={uploadQueue}
          onFilesSelected={addFilesToQueue}
          onInvalidFiles={notifyInvalidFiles}
          onRemoveQueueItem={handleRemoveFromQueue}
          onClearQueue={handleClearPendingQueue}
          onStartUpload={handleStartUpload}
        />

        <div className="platform-images-page__summary">
          <div className="platform-images-page__summary-left">
            <Checkbox
              checked={isAllVisibleSelected}
              disabled={items.length === 0 || controlsDisabled}
              onChange={event => handleToggleSelectAll(event.target.checked)}
            >
              Выбрать всё
            </Checkbox>
            <span>
              На экране: <strong>{items.length}</strong>
            </span>
            <span>
              Выбрано: <strong>{selectedIds.length}</strong>
            </span>
          </div>

          <div className="platform-images-page__summary-actions">
            {selectedIds.length > 0 ? (
              <CustomButton onClick={() => setSelectedIds([])} disabled={controlsDisabled}>
                Снять всё
              </CustomButton>
            ) : null}
            <CustomButton
              onClick={handleDeleteSelected}
              danger
              disabled={controlsDisabled || selectedIds.length === 0}
            >
              Удалить выбранные
            </CustomButton>
          </div>
        </div>

        {isInitialLoading ? (
          <div className="platform-images-page__loading">
            <Spinner />
          </div>
        ) : items.length === 0 ? (
          <div className="platform-images-page__empty">
            Пока нет изображений. Перетащите фото в зону выше или нажмите «Добавить фото».
          </div>
        ) : (
          <>
            <div className="platform-images-page__grid">
              {items.map(file => (
                <PlatformImageCard
                  key={file.fileId}
                  file={file}
                  checked={selectedIds.includes(file.fileId)}
                  disabled={controlsDisabled}
                  onSelectChange={handleSelectChange}
                  onPreview={setPreviewFile}
                  onDelete={handleDelete}
                  onCopy={handleCopy}
                />
              ))}
            </div>

            <div className="platform-images-page__footer">
              {hasMore ? (
                <div className="platform-images-page__load-more">
                  <CustomButton
                    onClick={loadMore}
                    type="primary"
                    disabled={controlsDisabled || !nextToken}
                  >
                    {loadingMore ? 'Загружаем...' : 'Загрузить ещё'}
                  </CustomButton>
                  {loadingMore ? <span>Подгружаем следующую страницу...</span> : null}
                </div>
              ) : (
                <span>Это все изображения по текущему фильтру.</span>
              )}
            </div>
          </>
        )}
      </section>

      <PlatformImagesUploadModal
        open={uploadModalOpen}
        loading={bulkUploading}
        onClose={() => setUploadModalOpen(false)}
        onSubmit={onModalSubmit}
      />

      <PlatformImagePreview file={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  )
}
