import { useEffect, useState } from 'react'

import { NOTIFICATION_BELL_MOBILE_MEDIA_QUERY } from '@/shared/lib/notifications/constants'
import { ADMIN_PUSH_COPY, ADMIN_PUSH_PROMPT_DISMISSED_KEY } from '@/shared/lib/push/constants'
import { useAdminPushSubscription } from '@/shared/lib/push/useAdminPushSubscription'
import { Button } from 'antd'

import './AdminPushPrompt.scss'

export function AdminPushPrompt() {
  const [isMobile, setIsMobile] = useState(false)
  const [isDismissed, setIsDismissed] = useState(
    () => localStorage.getItem(ADMIN_PUSH_PROMPT_DISMISSED_KEY) === '1'
  )

  const { supported, pushEnabledOnServer, permission, isSubscribed, isWorking, subscribe } =
    useAdminPushSubscription()

  useEffect(() => {
    const mediaQuery = window.matchMedia(NOTIFICATION_BELL_MOBILE_MEDIA_QUERY)
    const sync = () => setIsMobile(mediaQuery.matches)

    sync()
    mediaQuery.addEventListener('change', sync)

    return () => mediaQuery.removeEventListener('change', sync)
  }, [])

  if (!isMobile || !supported || !pushEnabledOnServer || isDismissed || isSubscribed) {
    return null
  }

  if (permission === 'denied') {
    return null
  }

  const handleLater = () => {
    localStorage.setItem(ADMIN_PUSH_PROMPT_DISMISSED_KEY, '1')
    setIsDismissed(true)
  }

  return (
    <div className="admin-push-prompt" role="region" aria-label={ADMIN_PUSH_COPY.TITLE}>
      <div className="admin-push-prompt__content">
        <p className="admin-push-prompt__title">{ADMIN_PUSH_COPY.TITLE}</p>
        <p className="admin-push-prompt__description">{ADMIN_PUSH_COPY.DESCRIPTION}</p>
      </div>
      <div className="admin-push-prompt__actions">
        <Button type="primary" size="small" loading={isWorking} onClick={() => void subscribe()}>
          {ADMIN_PUSH_COPY.ENABLE}
        </Button>
        <Button type="text" size="small" onClick={handleLater}>
          {ADMIN_PUSH_COPY.LATER}
        </Button>
      </div>
    </div>
  )
}
