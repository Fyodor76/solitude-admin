import { useEffect, useState } from 'react'

import { adminNotificationsApi } from '@/shared/lib/api/admin-notifications/adminNotificationsApi'
import { supportApi } from '@/shared/lib/api/support/supportApi'
import { io, Socket } from 'socket.io-client'

import { useAppDispatch } from '@/app/store/hook'

const SUPPORT_WS_EVENTS = {
  inbox: 'support:inbox',
  conversation: 'support:conversation',
  adminNotification: 'admin:notification',
} as const

function getWsBaseUrl(): string {
  const api = import.meta.env.VITE_API_URL ?? ''
  return api.replace(/\/$/, '')
}

export function useSupportRealtime(enabled = true) {
  const dispatch = useAppDispatch()
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setConnected(false)
      return
    }

    const token = localStorage.getItem('access')
    if (!token) {
      setConnected(false)
      return
    }

    const socket: Socket = io(`${getWsBaseUrl()}/support`, {
      auth: { token },
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    const invalidateSupport = (conversationId?: number) => {
      dispatch(
        supportApi.util.invalidateTags(
          conversationId
            ? [
                'SupportInbox',
                { type: 'SupportConversation', id: conversationId },
                { type: 'SupportMessages', id: conversationId },
              ]
            : ['SupportInbox']
        )
      )
    }

    const invalidateNotifications = () => {
      dispatch(
        adminNotificationsApi.util.invalidateTags([
          'AdminNotifications',
          'AdminNotificationsSummary',
        ])
      )
    }

    socket.on(SUPPORT_WS_EVENTS.inbox, () => {
      invalidateSupport()
      invalidateNotifications()
    })

    socket.on(SUPPORT_WS_EVENTS.conversation, (payload: { conversationId?: number }) => {
      invalidateSupport(payload?.conversationId)
      invalidateNotifications()
    })

    socket.on(SUPPORT_WS_EVENTS.adminNotification, () => {
      invalidateNotifications()
    })

    return () => {
      socket.disconnect()
      setConnected(false)
    }
  }, [dispatch, enabled])

  return { connected }
}
