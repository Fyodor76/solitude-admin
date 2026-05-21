import { useEffect, useRef } from 'react'

import { SUPPORT_CONVERSATION_STATUS } from '@/shared/lib/api/support/constants'
import { useGetSupportInboxQuery } from '@/shared/lib/api/support/supportApi'
import type { SupportConversation } from '@/shared/lib/api/support/types'

import { SUPPORT_ALERTS_INBOX_LIMIT, SUPPORT_ALERTS_POLL_MS } from './constants'
import { playSupportAlertSound } from './playSupportAlertSound'

type InboxSnapshot = {
  waitingIds: Set<number>
  lastMessageAt: Map<number, string>
}

function buildSnapshot(conversations: SupportConversation[]): InboxSnapshot {
  const waitingIds = new Set<number>()
  const lastMessageAt = new Map<number, string>()

  for (const c of conversations) {
    lastMessageAt.set(c.id, c.lastMessageAt)
    if (c.status === SUPPORT_CONVERSATION_STATUS.WAITING_OPERATOR) {
      waitingIds.add(c.id)
    }
  }

  return { waitingIds, lastMessageAt }
}

function hasNewAlert(prev: InboxSnapshot, next: InboxSnapshot): boolean {
  for (const id of next.waitingIds) {
    if (!prev.waitingIds.has(id)) return true
    if (prev.lastMessageAt.get(id) !== next.lastMessageAt.get(id)) return true
  }
  return false
}

export function useSupportInboxAlerts(options?: { enableSound?: boolean }) {
  const enableSound = options?.enableSound ?? true
  const { data } = useGetSupportInboxQuery(
    { limit: SUPPORT_ALERTS_INBOX_LIMIT },
    { pollingInterval: SUPPORT_ALERTS_POLL_MS }
  )

  const conversations = data?.data ?? []
  const waitingCount = conversations.filter(
    c => c.status === SUPPORT_CONVERSATION_STATUS.WAITING_OPERATOR
  ).length

  const snapshotRef = useRef<InboxSnapshot | null>(null)
  const readyRef = useRef(false)

  useEffect(() => {
    const next = buildSnapshot(conversations)

    if (!readyRef.current) {
      snapshotRef.current = next
      readyRef.current = true
      return
    }

    const prev = snapshotRef.current
    if (prev && enableSound && hasNewAlert(prev, next)) {
      playSupportAlertSound()
    }

    snapshotRef.current = next
  }, [conversations, enableSound])

  return { waitingCount }
}
