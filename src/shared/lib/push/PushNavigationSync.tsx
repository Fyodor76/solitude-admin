import { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import {
  consumePendingPushHref,
  isPushNavigateMessage,
  normalizePushHref,
  stashPendingPushHref,
} from './pushNavigation'

function applyPushNavigation(navigate: ReturnType<typeof useNavigate>, href: string) {
  const path = normalizePushHref(href)
  stashPendingPushHref(path)
  navigate(path)
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

  useEffect(() => {
    const fromHash = consumePushHash()
    if (fromHash) {
      navigate(fromHash)
      return
    }

    const pending = consumePendingPushHref()
    if (pending) {
      navigate(pending)
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

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage)
    }
  }, [navigate])

  return null
}
