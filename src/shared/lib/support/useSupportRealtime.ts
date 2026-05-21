import { useEffect, useState } from 'react'

import { supportApi } from '@/shared/lib/api/support/supportApi'
import { io, Socket } from 'socket.io-client'

import { useAppDispatch } from '@/app/store/hook'

const SUPPORT_WS_EVENTS = {
  inbox: 'support:inbox',
  conversation: 'support:conversation',
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

    socket.on(SUPPORT_WS_EVENTS.inbox, () => {
      dispatch(supportApi.util.invalidateTags(['SupportInbox']))
    })

    socket.on(SUPPORT_WS_EVENTS.conversation, (payload: { conversationId?: number }) => {
      const id = payload?.conversationId
      dispatch(
        supportApi.util.invalidateTags(
          id
            ? ['SupportInbox', { type: 'SupportConversation', id }, { type: 'SupportMessages', id }]
            : ['SupportInbox']
        )
      )
    })

    return () => {
      socket.disconnect()
      setConnected(false)
    }
  }, [dispatch, enabled])

  return { connected }
}
