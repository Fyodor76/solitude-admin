import { SUPPORT_INBOX_SCROLL } from '../constants'

const IMAGE_LOAD_SCROLL_DELAYS_MS = SUPPORT_INBOX_SCROLL.IMAGE_LOAD_DELAYS_MS

export function isMessagesContainerNearBottom(
  container: HTMLElement | null,
  thresholdPx = SUPPORT_INBOX_SCROLL.NEAR_BOTTOM_THRESHOLD_PX
): boolean {
  if (!container) return true
  const distanceFromBottom = container.scrollHeight - container.clientHeight - container.scrollTop
  return distanceFromBottom <= thresholdPx
}

export function scrollMessagesToBottom(
  container: HTMLElement | null,
  behavior: ScrollBehavior = 'smooth'
) {
  if (!container) return
  const top = container.scrollHeight - container.clientHeight
  if (top <= 0) return

  try {
    container.scrollTo({ top, behavior })
  } catch {
    container.scrollTop = container.scrollHeight
  }
}

export function scrollSupportInboxPageToChat(behavior: ScrollBehavior = 'smooth') {
  const main = document.querySelector('.support-inbox__main')
  if (main) {
    main.scrollIntoView({ behavior, block: 'nearest' })
  }

  const pageBody = document.querySelector(
    '.admin-layout__shell--support .admin-layout__shell__body'
  )
  if (pageBody instanceof HTMLElement) {
    try {
      pageBody.scrollTo({ top: pageBody.scrollHeight, behavior })
    } catch {
      pageBody.scrollTop = pageBody.scrollHeight
    }
  }

  try {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior })
  } catch {
    window.scrollTo(0, document.documentElement.scrollHeight)
  }
}

export type ScrollMessagesToBottomSoonOptions = {
  behavior?: ScrollBehavior
  /** Если задан — каждая попытка скролла выполняется только при true (например, пользователь у низа). */
  shouldScroll?: () => boolean
}

export function scrollMessagesToBottomSoon(
  container: HTMLElement | null,
  behaviorOrOptions: ScrollBehavior | ScrollMessagesToBottomSoonOptions = 'smooth',
  legacyShouldScroll?: () => boolean
): () => void {
  const options: ScrollMessagesToBottomSoonOptions =
    typeof behaviorOrOptions === 'string'
      ? { behavior: behaviorOrOptions, shouldScroll: legacyShouldScroll }
      : behaviorOrOptions

  const { behavior = 'smooth', shouldScroll } = options

  const attempt = () => {
    if (shouldScroll && !shouldScroll()) return
    scrollMessagesToBottom(container, behavior)
  }

  attempt()
  const rafId = requestAnimationFrame(attempt)
  const timeoutIds = IMAGE_LOAD_SCROLL_DELAYS_MS.map(delay => window.setTimeout(attempt, delay))

  return () => {
    cancelAnimationFrame(rafId)
    timeoutIds.forEach(id => window.clearTimeout(id))
  }
}

export function scrollSupportInboxChatIntoView(behavior: ScrollBehavior = 'smooth') {
  scrollSupportInboxPageToChat(behavior)
}
