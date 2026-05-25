import type { TrackedPageSummary } from '@/shared/lib/api/page-analytics/pageAnalyticsApi'

import { STORE_PREVIEW_SITE_ORIGIN } from '../constants'

export function isStoreIframeDocumentOrigin(origin: string): boolean {
  try {
    const u = new URL(origin)
    const base = new URL(STORE_PREVIEW_SITE_ORIGIN)
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

export function normalizePath(raw: string): string {
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

export function pageButtonLabel(row: TrackedPageSummary): string {
  const path = normalizePath(row.externalPageId)
  if (row.lastSeenUri && row.lastSeenUri !== path) {
    return row.lastSeenUri
  }
  return path || '/'
}

export function buildIframeSrc(pathname: string): string {
  const u = new URL(pathname, STORE_PREVIEW_SITE_ORIGIN)
  u.searchParams.set('is_iframe', 'true')
  return u.toString()
}
