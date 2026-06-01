export const ADMIN_PUSH_NAVIGATE_MESSAGE = 'admin-push-navigate' as const
export const ADMIN_PUSH_PENDING_HREF_KEY = 'admin-push-pending-href'

export type PushNavigateMessage = {
  type: typeof ADMIN_PUSH_NAVIGATE_MESSAGE
  href: string
}

export function isPushNavigateMessage(data: unknown): data is PushNavigateMessage {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as PushNavigateMessage).type === ADMIN_PUSH_NAVIGATE_MESSAGE &&
    typeof (data as PushNavigateMessage).href === 'string'
  )
}

export function normalizePushHref(href: string): string {
  const trimmed = href.trim()
  if (!trimmed) {
    return '/'
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const url = new URL(trimmed)
      return `${url.pathname}${url.search}${url.hash}`.replace(/#.*$/, '')
    } catch {
      return '/'
    }
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

export function stashPendingPushHref(href: string): string {
  const path = normalizePushHref(href)
  sessionStorage.setItem(ADMIN_PUSH_PENDING_HREF_KEY, path)
  return path
}

export function consumePendingPushHref(): string | null {
  const href = sessionStorage.getItem(ADMIN_PUSH_PENDING_HREF_KEY)
  if (!href) {
    return null
  }

  sessionStorage.removeItem(ADMIN_PUSH_PENDING_HREF_KEY)
  return href
}

export function peekPendingPushHref(): string | null {
  return sessionStorage.getItem(ADMIN_PUSH_PENDING_HREF_KEY)
}
