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

/** Стабильный ключ: звук только при новом сообщении в «ждут оператора», не при простом наличии непрочитанных. */
function getSnapshotKey(snapshot: InboxSnapshot): string {
  return Array.from(snapshot.waitingIds)
    .sort((a, b) => a - b)
    .map(id => `${id}:${snapshot.lastMessageAt.get(id) ?? ''}`)
    .join('|')
}

export function useSupportInboxAlerts(options?: { enableSound?: boolean }) {
  const enableSound = options?.enableSound ?? true
  const { data, isFetching, isSuccess } = useGetSupportInboxQuery(
    { limit: SUPPORT_ALERTS_INBOX_LIMIT },
    { pollingInterval: SUPPORT_ALERTS_POLL_MS }
  )

  const conversations = data?.data ?? []
  const waitingCount = conversations.filter(
    c => c.status === SUPPORT_CONVERSATION_STATUS.WAITING_OPERATOR
  ).length

  const snapshotKeyRef = useRef('')
  const readyRef = useRef(false)

  useEffect(() => {
    if (!isSuccess || !conversations.length) {
      return
    }

    const next = buildSnapshot(conversations)
    const nextKey = getSnapshotKey(next)

    if (!enableSound) {
      snapshotKeyRef.current = nextKey
      readyRef.current = true
      return
    }

    if (isFetching && !readyRef.current) {
      return
    }

    if (!readyRef.current) {
      snapshotKeyRef.current = nextKey
      readyRef.current = true
      return
    }

    if (nextKey !== snapshotKeyRef.current) {
      playSupportAlertSound()
      snapshotKeyRef.current = nextKey
    }
  }, [conversations, enableSound, isFetching, isSuccess])

  return { waitingCount }
}
