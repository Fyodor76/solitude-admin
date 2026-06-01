import { useEffect } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import {
  ADMIN_PUSH_PENDING_HREF_KEY,
  isPushNavigateMessage,
  normalizePushHref,
  peekPendingPushHref,
  stashPendingPushHref,
} from './pushNavigation'

function applyPushNavigation(navigate: ReturnType<typeof useNavigate>, href: string) {
  const path = stashPendingPushHref(href)
  navigate(path)
}

function clearPendingIfMatched(pathname: string, search: string) {
  const pending = peekPendingPushHref()
  if (!pending) {
    return
  }

  const current = `${pathname}${search}`
  if (current === pending) {
    sessionStorage.removeItem(ADMIN_PUSH_PENDING_HREF_KEY)
  }
}

function consumePushHash(): string | null {
  const { hash } = window.location
  const prefix = '#push-nav='
  if (!hash.startsWith(prefix)) {
    return null
  }

  const encoded = hash.slice(prefix.length)
  window.history.replaceState(null, '', window.location.pathname + window.location.search)
  try {
    return normalizePushHref(decodeURIComponent(encoded))
  } catch {
    return null
  }
}

/** Синхронизирует переход из push-уведомления с React Router. */
export function PushNavigationSync() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    clearPendingIfMatched(location.pathname, location.search)
  }, [location.pathname, location.search])

  useEffect(() => {
    const goPending = (href: string) => {
      stashPendingPushHref(href)
      navigate(href)
    }

    const fromHash = consumePushHash()
    if (fromHash) {
      goPending(fromHash)
    } else {
      const pending = peekPendingPushHref()
      if (pending) {
        navigate(pending)
      }
    }

    const retryPending = () => {
      const pending = peekPendingPushHref()
      if (!pending) {
        return
      }

      const current = `${window.location.pathname}${window.location.search}`
      if (current !== pending) {
        navigate(pending)
      }
    }

    const retryTimer = window.setTimeout(retryPending, 400)
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        retryPending()
      }
    }

    document.addEventListener('visibilitychange', onVisible)

    return () => {
      window.clearTimeout(retryTimer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [navigate])

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return
    }

    const handleMessage = (event: MessageEvent) => {
      if (!isPushNavigateMessage(event.data)) {
        return
      }

      applyPushNavigation(navigate, event.data.href)
    }

    navigator.serviceWorker.addEventListener('message', handleMessage)

    void navigator.serviceWorker.ready.then(() => {
      const pending = peekPendingPushHref()
      if (pending) {
        navigate(pending)
      }
    })

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage)
    }
  }, [navigate])

  return null
}
