import { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

export const ADMIN_PUSH_NAVIGATE_MESSAGE = 'admin-push-navigate' as const

type PushNavigateMessage = {
  type: typeof ADMIN_PUSH_NAVIGATE_MESSAGE
  href: string
}

function isPushNavigateMessage(data: unknown): data is PushNavigateMessage {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as PushNavigateMessage).type === ADMIN_PUSH_NAVIGATE_MESSAGE &&
    typeof (data as PushNavigateMessage).href === 'string'
  )
}

/** Открывает маршрут из push-уведомления через React Router (без полной перезагрузки). */
export function usePushNotificationDeepLink() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return
    }

    const handleMessage = (event: MessageEvent) => {
      if (!isPushNavigateMessage(event.data)) {
        return
      }

      const href = event.data.href.trim()
      if (!href) {
        return
      }

      navigate(href.startsWith('/') ? href : `/${href}`)
    }

    navigator.serviceWorker.addEventListener('message', handleMessage)

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage)
    }
  }, [navigate])
}
