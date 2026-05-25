import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  useGetTrackedPagesQuery,
  useLazyGetHeatmapClicksQuery,
} from '@/shared/lib/api/page-analytics/pageAnalyticsApi'

import { HEATMAP_PUSH_DEBOUNCE_MS, STORE_PREVIEW_SITE_ORIGIN } from '../constants'
import { isIframeReadyPayload } from '../helpers/iframeReadyPayload'
import {
  buildIframeSrc,
  isStoreIframeDocumentOrigin,
  normalizePath,
  pageButtonLabel,
} from '../helpers/storePreviewPath'

export function useStorePreview() {
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

  return {
    siteOrigin: STORE_PREVIEW_SITE_ORIGIN,
    path,
    draft,
    setDraft,
    iframeNonce,
    heatmap,
    setHeatmap,
    isControlsVisible,
    setIsControlsVisible,
    iframeRef,
    iframeSrc,
    pagesLoading,
    trackedPages,
    trackedPageSelectOptions,
    applyDraft,
    goTo,
    pushHeatmapToIframe,
    refreshIframe: () => setIframeNonce(value => value + 1),
  }
}
