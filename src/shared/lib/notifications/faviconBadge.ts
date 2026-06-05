/** Как у Badge колокольчика: --color-blue */
export const FAVICON_BADGE_STYLE = {
  color: '#1072d5',
  text: '#ffffff',
  ring: '#ffffff',
  shadow: 'rgba(0, 0, 0, 0.25)',
} as const

export const DEFAULT_FAVICON_URL = '/icons/favicon.svg'

/** Интервал мигания: логотип → круг с цифрой */
export const FAVICON_BLINK_INTERVAL_MS = 1000

const FAVICON_LINK_ID = 'app-favicon-badge'
const STATIC_ICON_SELECTOR = 'link[rel="icon"], link[rel="shortcut icon"]'
const FAVICON_CANVAS_SIZE = 96

let logoDataUrlPromise: Promise<string> | null = null
let blinkTimer: ReturnType<typeof setInterval> | null = null
let blinkCount = 0
let showLogoFrame = true
let visibilityListenerAttached = false

function resolveFaviconUrl(path: string): string {
  const base = import.meta.env.BASE_URL ?? '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  return `${normalizedBase}${normalizedPath}`
}

function loadLogoImage(): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load favicon: ${DEFAULT_FAVICON_URL}`))
    img.src = resolveFaviconUrl(DEFAULT_FAVICON_URL)
  })
}

function formatBadgeLabel(count: number): string {
  return count > 99 ? '99+' : String(count)
}

function getCountFontSize(label: string, size: number): number {
  if (label.length > 2) {
    return Math.round(size * 0.42)
  }

  if (label.length > 1) {
    return Math.round(size * 0.48)
  }

  return Math.round(size * 0.56)
}

function drawUnreadCountFavicon(ctx: CanvasRenderingContext2D, count: number, size: number): void {
  const label = formatBadgeLabel(count)
  const center = size / 2
  const outerRadius = size / 2 - 1
  const innerRadius = outerRadius - 4

  ctx.save()
  ctx.shadowColor = FAVICON_BADGE_STYLE.shadow
  ctx.shadowBlur = 4
  ctx.shadowOffsetY = 1

  ctx.beginPath()
  ctx.arc(center, center, outerRadius, 0, Math.PI * 2)
  ctx.fillStyle = FAVICON_BADGE_STYLE.ring
  ctx.fill()

  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

  ctx.beginPath()
  ctx.arc(center, center, innerRadius, 0, Math.PI * 2)
  ctx.fillStyle = FAVICON_BADGE_STYLE.color
  ctx.fill()

  const fontSize = getCountFontSize(label, size)
  ctx.font = `700 ${fontSize}px system-ui, -apple-system, 'Segoe UI', sans-serif`
  ctx.fillStyle = FAVICON_BADGE_STYLE.text
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, center, center + 1)
  ctx.restore()
}

function renderUnreadFaviconDataUrl(count: number): string {
  const canvas = document.createElement('canvas')
  canvas.width = FAVICON_CANVAS_SIZE
  canvas.height = FAVICON_CANVAS_SIZE

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Canvas 2d context unavailable')
  }

  drawUnreadCountFavicon(ctx, count, FAVICON_CANVAS_SIZE)
  return canvas.toDataURL('image/png')
}

async function renderLogoFaviconDataUrl(): Promise<string> {
  const baseImage = await loadLogoImage()
  const canvas = document.createElement('canvas')
  canvas.width = FAVICON_CANVAS_SIZE
  canvas.height = FAVICON_CANVAS_SIZE

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Canvas 2d context unavailable')
  }

  const inset = Math.round(FAVICON_CANVAS_SIZE * 0.04)
  const iconSize = FAVICON_CANVAS_SIZE - inset * 2
  ctx.drawImage(baseImage, inset, inset, iconSize, iconSize)

  return canvas.toDataURL('image/png')
}

function getLogoFaviconDataUrl(): Promise<string> {
  if (!logoDataUrlPromise) {
    logoDataUrlPromise = renderLogoFaviconDataUrl()
  }

  return logoDataUrlPromise
}

function getOrCreateBadgeLink(): HTMLLinkElement {
  const existing = document.getElementById(FAVICON_LINK_ID)

  if (existing instanceof HTMLLinkElement) {
    return existing
  }

  const link = document.createElement('link')
  link.id = FAVICON_LINK_ID
  link.rel = 'icon'
  link.type = 'image/png'
  link.sizes = '96x96'

  const firstIcon = document.head.querySelector(STATIC_ICON_SELECTOR)
  if (firstIcon) {
    document.head.insertBefore(link, firstIcon)
  } else {
    document.head.appendChild(link)
  }

  return link
}

function setDynamicFaviconHref(dataUrl: string): void {
  const link = getOrCreateBadgeLink()
  link.href = dataUrl
}

function suppressStaticFavicons(): void {
  document.querySelectorAll<HTMLLinkElement>(STATIC_ICON_SELECTOR).forEach(link => {
    if (link.id === FAVICON_LINK_ID) {
      return
    }

    if (!link.dataset.faviconOriginalHref) {
      link.dataset.faviconOriginalHref = link.href
      link.removeAttribute('href')
    }
  })
}

function restoreStaticFavicons(): void {
  document.querySelectorAll<HTMLLinkElement>(STATIC_ICON_SELECTOR).forEach(link => {
    if (link.id === FAVICON_LINK_ID) {
      return
    }

    const originalHref = link.dataset.faviconOriginalHref
    if (originalHref) {
      link.href = originalHref
      delete link.dataset.faviconOriginalHref
    }
  })
}

function clearBlinkTimer(): void {
  if (blinkTimer !== null) {
    clearInterval(blinkTimer)
    blinkTimer = null
  }
}

async function showLogoFrameNow(): Promise<void> {
  const logoUrl = await getLogoFaviconDataUrl()
  setDynamicFaviconHref(logoUrl)
  showLogoFrame = true
}

async function blinkTick(): Promise<void> {
  if (blinkCount <= 0 || document.hidden) {
    return
  }

  if (showLogoFrame) {
    setDynamicFaviconHref(renderUnreadFaviconDataUrl(blinkCount))
    showLogoFrame = false
  } else {
    const logoUrl = await getLogoFaviconDataUrl()
    setDynamicFaviconHref(logoUrl)
    showLogoFrame = true
  }
}

function handleVisibilityChange(): void {
  if (blinkCount <= 0) {
    return
  }

  if (document.hidden) {
    clearBlinkTimer()
    return
  }

  void showLogoFrameNow()
  blinkTimer = setInterval(() => {
    void blinkTick()
  }, FAVICON_BLINK_INTERVAL_MS)
}

function ensureVisibilityListener(): void {
  if (visibilityListenerAttached || typeof document === 'undefined') {
    return
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
  visibilityListenerAttached = true
}

export function restoreDefaultFavicon(): void {
  stopFaviconBadgeBlink()
}

export function stopFaviconBadgeBlink(): void {
  clearBlinkTimer()
  blinkCount = 0

  const link = document.getElementById(FAVICON_LINK_ID)
  if (link instanceof HTMLLinkElement) {
    link.remove()
  }

  restoreStaticFavicons()
}

export async function startFaviconBadgeBlink(unreadCount: number): Promise<void> {
  if (unreadCount <= 0) {
    stopFaviconBadgeBlink()
    return
  }

  const countChanged = blinkCount !== unreadCount
  blinkCount = unreadCount

  if (blinkTimer !== null && !countChanged) {
    return
  }

  clearBlinkTimer()
  suppressStaticFavicons()
  ensureVisibilityListener()

  await showLogoFrameNow()

  if (document.hidden) {
    return
  }

  blinkTimer = setInterval(() => {
    void blinkTick()
  }, FAVICON_BLINK_INTERVAL_MS)
}

/** @deprecated используйте startFaviconBadgeBlink */
export async function applyFaviconBadge(unreadCount: number): Promise<void> {
  await startFaviconBadgeBlink(unreadCount)
}
