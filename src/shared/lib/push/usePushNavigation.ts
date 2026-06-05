import { useEffect } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import {
  ADMIN_PUSH_PENDING_HREF_KEY,
  isPushNavigateMessage,
  normalizePushHref,
  peekPendingPushHref,
  stashPendingPushHref,
} from './pushNavigation'

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

function navigateToPushHref(navigate: ReturnType<typeof useNavigate>, href: string) {
  navigate(stashPendingPushHref(href))
}

function clearPendingIfMatched(pathname: string, search: string) {
  const pending = peekPendingPushHref()
  if (!pending) {
    return
  }

  if (`${pathname}${search}` === pending) {
    sessionStorage.removeItem(ADMIN_PUSH_PENDING_HREF_KEY)
  }
}

/** Переход по href из push: hash при cold start, sessionStorage, postMessage от SW. */
export function usePushNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    clearPendingIfMatched(location.pathname, location.search)
  }, [location.pathname, location.search])

  useEffect(() => {
    const fromHash = consumePushHash()
    if (fromHash) {
      navigateToPushHref(navigate, fromHash)
      return
    }

    const pending = peekPendingPushHref()
    if (pending && `${location.pathname}${location.search}` !== pending) {
      navigate(pending)
    }
  }, [location.pathname, location.search, navigate])

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return
    }

    const onMessage = (event: MessageEvent) => {
      if (!isPushNavigateMessage(event.data)) {
        return
      }

      navigateToPushHref(navigate, event.data.href)
    }

    navigator.serviceWorker.addEventListener('message', onMessage)
    return () => navigator.serviceWorker.removeEventListener('message', onMessage)
  }, [navigate])
}
