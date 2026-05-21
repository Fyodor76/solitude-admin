const IMAGE_LOAD_SCROLL_DELAYS_MS = [150, 450, 900] as const

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

  const pageBody = document.querySelector('.main-page--support .main-page__body')
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

export function scrollMessagesToBottomSoon(
  container: HTMLElement | null,
  behavior: ScrollBehavior = 'smooth'
) {
  scrollMessagesToBottom(container, behavior)

  requestAnimationFrame(() => scrollMessagesToBottom(container, behavior))

  window.setTimeout(
    () => scrollMessagesToBottom(container, behavior),
    IMAGE_LOAD_SCROLL_DELAYS_MS[0]
  )
  window.setTimeout(
    () => scrollMessagesToBottom(container, behavior),
    IMAGE_LOAD_SCROLL_DELAYS_MS[1]
  )
  window.setTimeout(
    () => scrollMessagesToBottom(container, behavior),
    IMAGE_LOAD_SCROLL_DELAYS_MS[2]
  )
}

export function scrollSupportInboxChatIntoView(behavior: ScrollBehavior = 'smooth') {
  scrollSupportInboxPageToChat(behavior)
}
