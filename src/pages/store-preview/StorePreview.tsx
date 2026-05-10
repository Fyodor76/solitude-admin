import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  type TrackedPageSummary,
  useGetTrackedPagesQuery,
  useLazyGetHeatmapClicksQuery,
} from '@/shared/lib/api/page-analytics/pageAnalyticsApi'
import { PageHeader } from '@/shared/ui/page-header'
import { Button, Input, Select, Space, Spin, Switch, Typography } from 'antd'

import './StorePreview.scss'

const SITE_ORIGIN = 'https://solitude-store.ru'

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

const HEATMAP_PUSH_DEBOUNCE_MS = 400

const StorePreview = () => {
  const [path, setPath] = useState('/')
  const [draft, setDraft] = useState('/')
  const [iframeNonce, setIframeNonce] = useState(0)
  const [heatmap, setHeatmap] = useState(true)
  const [isControlsVisible, setIsControlsVisible] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const lastHeatmapPushRef = useRef<{ pageId: string; at: number } | null>(null)

  const { data: trackedPagesResponse, isLoading: pagesLoading } = useGetTrackedPagesQuery(200)
  const trackedPages = trackedPagesResponse?.data ?? []

  const [triggerHeatmapClicks] = useLazyGetHeatmapClicksQuery()

  const iframeSrc = useMemo(() => buildIframeSrc(path), [path])

  const trackedPageSelectOptions = useMemo(() => {
    const byPath = new Map<string, { value: string; label: string }>()
    for (const row of trackedPages) {
      const p = normalizePath(row.externalPageId)
      byPath.set(p, { value: p, label: pageButtonLabel(row) })
    }
    if (path && !byPath.has(path)) {
      byPath.set(path, { value: path, label: path })
    }
    return [...byPath.values()]
  }, [trackedPages, path])

  const applyDraft = useCallback(() => {
    const normalized = normalizePath(draft)
    setPath(normalized)
    setDraft(normalized)
  }, [draft])

  const goTo = useCallback((next: string) => {
    const normalized = normalizePath(next)
    setPath(normalized)
    setDraft(normalized)
  }, [])

  const pushHeatmapToIframe = useCallback(
    async (pageIdForFetch?: string, force = false) => {
      const win = iframeRef.current?.contentWindow
      if (!win) {
        return
      }
      if (!heatmap) {
        win.postMessage({ isIframeInteraction: false }, '*')
        return
      }
      const pageId = pageIdForFetch ?? path
      if (!force) {
        const now = Date.now()
        const last = lastHeatmapPushRef.current
        if (last && last.pageId === pageId && now - last.at < HEATMAP_PUSH_DEBOUNCE_MS) {
          return
        }
      }
      lastHeatmapPushRef.current = { pageId, at: Date.now() }
      try {
        const res = await triggerHeatmapClicks(pageId).unwrap()
        const clicks = res.data?.clicks ?? []
        win.postMessage({ clicks, isIframeInteraction: true }, '*')
      } catch {
        return
      }
    },
    [heatmap, path, triggerHeatmapClicks]
  )

  useEffect(() => {
    let readyTimer: number | null = null

    const onIframeReady = (event: MessageEvent) => {
      if (!isStoreIframeDocumentOrigin(event.origin)) {
        return
      }
      const win = iframeRef.current?.contentWindow
      if (!win || event.source !== win) {
        return
      }
      if (!isIframeReadyPayload(event.data) || !heatmap) {
        return
      }

      const pageId = normalizePath(event.data.page_id)
      if (readyTimer != null) {
        window.clearTimeout(readyTimer)
      }
      readyTimer = window.setTimeout(() => {
        readyTimer = null
        void pushHeatmapToIframe(pageId, true)
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
      return
    }
    if (!heatmap) {
      win.postMessage({ isIframeInteraction: false }, '*')
      return
    }
    const timer = window.setTimeout(() => {
      void pushHeatmapToIframe()
    }, 150)
    return () => window.clearTimeout(timer)
  }, [heatmap, pushHeatmapToIframe])

  return (
    <div className="storePreview">
      <PageHeader
        title="Тепловая карта сайта"
        subtitle={
          <>
            <div>
              {SITE_ORIGIN}
              {path}
            </div>
            <div>Heatmap: клики из API, слой heatmap.js во iframe</div>
          </>
        }
        actions={
          <Button onClick={() => setIsControlsVisible(previous => !previous)}>
            {isControlsVisible ? 'Скрыть настройки' : 'Показать настройки'}
          </Button>
        }
      />

      {isControlsVisible ? (
        <div className="storePreview__controls">
          <div className="storePreview__heatmapRow">
            <Space align="center">
              <Switch checked={heatmap} onChange={setHeatmap} />
              <Typography.Text>Показывать слой heatmap</Typography.Text>
            </Space>
          </div>

          <div className="storePreview__toolbar">
            <Typography.Text type="secondary" className="storePreview__toolbarLabel">
              Страницы из аналитики:
            </Typography.Text>
            {pagesLoading ? (
              <Spin size="small" />
            ) : (
              <Select
                showSearch
                className="storePreview__pageSelect"
                placeholder={
                  trackedPages.length > 0 ? 'Поиск и выбор страницы' : 'Нет отслеживаемых страниц'
                }
                notFoundContent={trackedPages.length ? undefined : 'Пока нет данных'}
                loading={pagesLoading}
                disabled={trackedPages.length === 0 && !path}
                options={trackedPageSelectOptions}
                value={trackedPageSelectOptions.length ? path : undefined}
                onChange={value => goTo(String(value))}
                optionFilterProp="label"
                filterOption={(input, option) => {
                  const label = String(option?.label ?? '')
                  const value = String(option?.value ?? '')
                  const query = input.trim().toLowerCase()
                  return label.toLowerCase().includes(query) || value.toLowerCase().includes(query)
                }}
                virtual={trackedPageSelectOptions.length > 48}
                listHeight={320}
              />
            )}
          </div>

          <div className="storePreview__pathForm">
            <Input
              value={draft}
              onChange={event => setDraft(event.target.value)}
              onPressEnter={applyDraft}
              placeholder="/collection или полный URL solitude-store.ru"
              style={{ maxWidth: 480, minWidth: 200 }}
            />
            <Button type="primary" onClick={applyDraft}>
              Открыть
            </Button>
            <Button onClick={() => setIframeNonce(value => value + 1)}>Обновить</Button>
            {heatmap ? (
              <Button onClick={() => void pushHeatmapToIframe(undefined, true)}>
                Перезагрузить heatmap
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

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
