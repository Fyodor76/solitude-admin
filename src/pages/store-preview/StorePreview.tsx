import { PageHeader } from '@/shared/ui/page-header'
import { Button } from 'antd'

import { StorePreviewControls } from './components/StorePreviewControls'
import { StorePreviewFrame } from './components/StorePreviewFrame'
import { useStorePreview } from './hooks/useStorePreview'
import './StorePreview.scss'

const StorePreview = () => {
  const preview = useStorePreview()

  return (
    <div className="storePreview admin-page">
      <PageHeader
        title="Тепловая карта сайта"
        subtitle={
          <>
            <div>
              {preview.siteOrigin}
              {preview.path}
            </div>
            <div>Heatmap: клики из API, слой heatmap.js во iframe</div>
          </>
        }
        actions={
          <Button onClick={() => preview.setIsControlsVisible(previous => !previous)}>
            {preview.isControlsVisible ? 'Скрыть настройки' : 'Показать настройки'}
          </Button>
        }
      />

      {preview.isControlsVisible ? (
        <StorePreviewControls
          heatmap={preview.heatmap}
          draft={preview.draft}
          path={preview.path}
          pagesLoading={preview.pagesLoading}
          trackedPagesCount={preview.trackedPages.length}
          trackedPageSelectOptions={preview.trackedPageSelectOptions}
          onHeatmapChange={preview.setHeatmap}
          onDraftChange={preview.setDraft}
          onApplyDraft={preview.applyDraft}
          onPageSelect={preview.goTo}
          onRefreshIframe={preview.refreshIframe}
          onReloadHeatmap={() => void preview.pushHeatmapToIframe(undefined, true)}
        />
      ) : null}

      <StorePreviewFrame
        iframeRef={preview.iframeRef}
        iframeSrc={preview.iframeSrc}
        iframeNonce={preview.iframeNonce}
      />
    </div>
  )
}

export default StorePreview
