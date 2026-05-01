import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  type TrackedPageSummary,
  useGetTrackedPagesQuery,
  useLazyGetHeatmapClicksQuery,
} from '@/shared/lib/api/page-analytics/pageAnalyticsApi'
import { Button, Input, message, Space, Spin, Switch, Typography } from 'antd'

import './StorePreview.scss'

function storePreviewDbg(...args: unknown[]) {
  try {
    const on =
      process.env.NODE_ENV === 'development' ||
      (typeof window !== 'undefined' && window.localStorage.getItem('debug_store_preview') === '1')
    if (!on) {
      return
    }
    console.log('[store-preview]', ...args)
  } catch {
    /* empty */
  }
}

const SITE_ORIGIN = 'https://solitude-store.ru'

/** Origin документа во iframe (apex / www / поддомен витрины). */
function isStoreIframeDocumentOrigin(origin: string): boolean {
  try {
    const u = new URL(origin)
    const base = new URL(SITE_ORIGIN)
    if (u.protocol !== base.protocol) {
      return false
    }
    const h = u.hostname
    const bh = base.hostname
    if (h === bh) {
      return true
    }
    if (h === `www.${bh}` || bh === `www.${h}`) {
      return true
    }
    if (h.endsWith(`.${bh}`)) {
      return true
    }
    return false
  } catch {
    return false
  }
}

function normalizePath(raw: string): string {
  const t = raw.trim()
  if (t === '') {
    return '/'
  }
  if (t.startsWith('http://') || t.startsWith('https://')) {
    try {
      const u = new URL(t)
      if (isStoreIframeDocumentOrigin(u.origin)) {
        const combined = `${u.pathname}${u.search}${u.hash}`
        return combined === '' ? '/' : combined
      }
    } catch {
      return '/'
    }
    return '/'
  }
  return t.startsWith('/') ? t : `/${t}`
}

function pageButtonLabel(row: TrackedPageSummary): string {
  const path = normalizePath(row.externalPageId)
  if (row.lastSeenUri && row.lastSeenUri !== path) {
    return row.lastSeenUri
  }
  return path || '/'
}

function buildIframeSrc(pathname: string): string {
  const u = new URL(pathname, SITE_ORIGIN)
  u.searchParams.set('is_iframe', 'true')
  try {
    if (
      typeof window !== 'undefined' &&
      window.localStorage.getItem('debug_store_preview') === '1'
    ) {
      u.searchParams.set('debug_preview', '1')
    }
  } catch {
    /* empty */
  }
  return u.toString()
}

const IFRAME_READY_MESSAGE_KEYS = ['page_id', 'uri'] as const

function isIframeReadyPayload(data: unknown): data is { page_id: string; uri: string } {
  if (!data || typeof data !== 'object') {
    return false
  }
  const o = data as Record<string, unknown>
  for (const k of IFRAME_READY_MESSAGE_KEYS) {
    if (!(k in o)) {
      return false
    }
  }
  return typeof o.page_id === 'string'
}

const StorePreview = () => {
  const [path, setPath] = useState('/')
  const [draft, setDraft] = useState('/')
  const [iframeNonce, setIframeNonce] = useState(0)
  const [heatmap, setHeatmap] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const {
    data: trackedPagesResponse,
    isLoading: pagesLoading,
    isError: pagesError,
  } = useGetTrackedPagesQuery(200)
  const trackedPages = trackedPagesResponse?.data ?? []

  const [triggerHeatmapClicks] = useLazyGetHeatmapClicksQuery()

  const iframeSrc = useMemo(() => buildIframeSrc(path), [path])

  useEffect(() => {
    if (pagesError) {
      storePreviewDbg('tracked pages query error', pagesError)
      message.warning('Не удалось загрузить список страниц из API')
    }
  }, [pagesError])

  const applyDraft = useCallback(() => {
    const n = normalizePath(draft)
    setPath(n)
    setDraft(n)
  }, [draft])

  const goTo = useCallback((next: string) => {
    const n = normalizePath(next)
    setPath(n)
    setDraft(n)
  }, [])

  const pushHeatmapToIframe = useCallback(
    async (pageIdForFetch?: string) => {
      const win = iframeRef.current?.contentWindow
      if (!win) {
        storePreviewDbg('pushHeatmap: no contentWindow')
        return
      }
      if (!heatmap) {
        storePreviewDbg('postMessage → iframe: heatmap OFF')
        win.postMessage({ isIframeInteraction: false }, '*')
        return
      }
      const pageId = pageIdForFetch ?? path
      storePreviewDbg('pushHeatmap: fetch clicks', { pageId })
      try {
        const res = await triggerHeatmapClicks(pageId).unwrap()
        const clicks = res.data?.clicks ?? []
        storePreviewDbg('postMessage → iframe: clicks', { count: clicks.length })
        win.postMessage({ clicks, isIframeInteraction: true }, '*')
      } catch (e) {
        storePreviewDbg('pushHeatmap: API error', e)
        message.error(e instanceof Error ? e.message : 'Не удалось загрузить heatmap')
      }
    },
    [heatmap, path, triggerHeatmapClicks]
  )

  useEffect(() => {
    let readyTimer: number | null = null

    const onIframeReady = (event: MessageEvent) => {
      storePreviewDbg('← iframe message', {
        origin: event.origin,
        storeOriginOk: isStoreIframeDocumentOrigin(event.origin),
        dataType: typeof event.data,
      })
      if (!isStoreIframeDocumentOrigin(event.origin)) {
        storePreviewDbg('ready handler: skip bad origin', event.origin)
        return
      }
      const win = iframeRef.current?.contentWindow
      if (!win || event.source !== win) {
        storePreviewDbg('ready handler: skip source mismatch', {
          hasWin: Boolean(win),
          sameSource: event.source === win,
        })
        return
      }
      if (!isIframeReadyPayload(event.data)) {
        storePreviewDbg('ready handler: skip not ready payload', event.data)
        return
      }
      if (!heatmap) {
        storePreviewDbg('ready handler: skip heatmap off')
        return
      }
      const pageId = normalizePath(event.data.page_id)
      storePreviewDbg('ready handler: schedule pushHeatmap', { pageId })
      if (readyTimer != null) {
        window.clearTimeout(readyTimer)
      }
      readyTimer = window.setTimeout(() => {
        readyTimer = null
        void pushHeatmapToIframe(pageId)
      }, 120)
    }

    window.addEventListener('message', onIframeReady)
    return () => {
      window.removeEventListener('message', onIframeReady)
      if (readyTimer != null) {
        window.clearTimeout(readyTimer)
      }
    }
  }, [heatmap, pushHeatmapToIframe])

  useEffect(() => {
    const win = iframeRef.current?.contentWindow
    if (!win) {
      storePreviewDbg('heatmap effect: no iframe window')
      return
    }
    if (!heatmap) {
      storePreviewDbg('heatmap effect: OFF → postMessage iframe')
      win.postMessage({ isIframeInteraction: false }, '*')
      return
    }
    storePreviewDbg('heatmap effect: ON → schedule push')
    const t = window.setTimeout(() => {
      void pushHeatmapToIframe()
    }, 150)
    return () => window.clearTimeout(t)
    // Вкл.: первый пуш; выкл.: снять слой во iframe. Смена path — через postMessage ready.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pushHeatmapToIframe меняется при path и дублирует ready
  }, [heatmap, pushHeatmapToIframe])

  return (
    <div className="storePreview">
      <div className="storePreview__header">
        <h1 className="storePreview__title">Просмотр витрины</h1>
        <Typography.Text type="secondary">
          {SITE_ORIGIN}
          {path}
        </Typography.Text>
      </div>

      <div className="storePreview__heatmapRow">
        <Space align="center">
          <Switch checked={heatmap} onChange={setHeatmap} />
          <Typography.Text>Heatmap (клики из API, слой heatmap.js во iframe)</Typography.Text>
        </Space>
      </div>

      <div className="storePreview__toolbar">
        {pagesLoading ? (
          <Spin size="small" />
        ) : (
          <Space wrap size="small">
            {trackedPages.map(row => {
              const p = normalizePath(row.externalPageId)
              return (
                <Button
                  key={row.id}
                  type={path === p ? 'primary' : 'default'}
                  onClick={() => goTo(p)}
                >
                  {pageButtonLabel(row)}
                </Button>
              )
            })}
          </Space>
        )}
      </div>

      <div className="storePreview__pathForm">
        <Input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onPressEnter={applyDraft}
          placeholder="/collection или полный URL solitude-store.ru"
          style={{ maxWidth: 480, minWidth: 200 }}
        />
        <Button type="primary" onClick={applyDraft}>
          Открыть
        </Button>
        <Button onClick={() => setIframeNonce(n => n + 1)}>Обновить</Button>
        {heatmap ? (
          <Button onClick={() => void pushHeatmapToIframe()}>Перезагрузить heatmap</Button>
        ) : null}
      </div>

      <div className="storePreview__frameWrap">
        <iframe
          key={`${iframeSrc}-${iframeNonce}`}
          ref={iframeRef}
          className="storePreview__frame"
          title="Solitude Store"
          src={iframeSrc}
          sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-same-origin"
        />
      </div>
    </div>
  )
}

export default StorePreview
