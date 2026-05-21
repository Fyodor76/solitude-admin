import { useEffect, useState } from 'react'

import { useGetSupportMessagesQuery } from '@/shared/lib/api/support/supportApi'

import { SUPPORT_INBOX_POLL } from '../constants'

export function useSupportInboxMessages(selectedId: number | null) {
  const {
    data: messagesResponse,
    isLoading: messagesLoading,
    isFetching: messagesFetching,
  } = useGetSupportMessagesQuery(selectedId ?? 0, {
    skip: !selectedId,
    pollingInterval: selectedId ? SUPPORT_INBOX_POLL.MESSAGES_MS : 0,
    refetchOnMountOrArgChange: true,
  })

  const [messagesReadyForId, setMessagesReadyForId] = useState<number | null>(null)

  useEffect(() => {
    setMessagesReadyForId(null)
  }, [selectedId])

  useEffect(() => {
    if (!selectedId || messagesFetching) return
    if (messagesResponse) {
      setMessagesReadyForId(selectedId)
    }
  }, [selectedId, messagesFetching, messagesResponse])

  const messagesSwitching = Boolean(
    selectedId && messagesReadyForId !== selectedId && (messagesLoading || messagesFetching)
  )

  const visibleMessages =
    selectedId && messagesReadyForId === selectedId ? (messagesResponse?.data ?? []) : []

  return {
    messagesLoading,
    messagesFetching,
    messagesSwitching,
    visibleMessages,
  }
}
