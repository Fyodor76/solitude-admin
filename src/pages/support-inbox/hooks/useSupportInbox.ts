import { useEffect, useMemo, useState } from 'react'

import { useMatchMedia } from '@/shared/hooks/useMatchMedia'
import { useMarkAdminNotificationReadBySourceMutation } from '@/shared/lib/api/admin-notifications/adminNotificationsApi'
import { SUPPORT_CONVERSATION_STATUS } from '@/shared/lib/api/support/constants'
import {
  useCloseSupportConversationMutation,
  useGetSupportConversationQuery,
  useGetSupportInboxQuery,
  useOpenSupportConversationMutation,
} from '@/shared/lib/api/support/supportApi'
import { buildSupportNotificationSourceId } from '@/shared/lib/notifications/supportSourceId'
import { useSearchParams } from 'react-router-dom'

import {
  SUPPORT_INBOX_CHANNEL_FILTER,
  SUPPORT_INBOX_LIST_TAB,
  SUPPORT_INBOX_MOBILE_MEDIA_QUERY,
  SUPPORT_INBOX_POLL,
  SUPPORT_INBOX_STATUS_FILTER,
  type SupportInboxChannelFilter,
  type SupportInboxListTab,
  type SupportInboxStatusFilter,
} from '../constants'
import { buildInboxQueryParams } from '../helpers/buildInboxQueryParams'
import { filterSupportConversations } from '../helpers/filterConversations'
import { getEmptyListDescription } from '../helpers/getEmptyListDescription'
import { scrollSupportInboxChatIntoView } from '../helpers/scrollMessagesToBottom'
import { sortConversationsByLastMessage } from '../helpers/sortConversations'
import { useSupportInboxMessages } from './useSupportInboxMessages'

const DEFAULT_CHANNEL_FILTER = SUPPORT_INBOX_CHANNEL_FILTER.ALL
const DEFAULT_LIST_TAB = SUPPORT_INBOX_LIST_TAB.ACTIVE

export function useSupportInbox() {
  const [channelFilter, setChannelFilter] =
    useState<SupportInboxChannelFilter>(DEFAULT_CHANNEL_FILTER)
  const [listTab, setListTab] = useState<SupportInboxListTab>(DEFAULT_LIST_TAB)
  const [statusFilter, setStatusFilter] = useState<SupportInboxStatusFilter>(
    SUPPORT_INBOX_STATUS_FILTER.ALL
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchParams] = useSearchParams()

  const deepLinkId = useMemo(() => {
    const raw = searchParams.get('c')
    if (!raw) {
      return null
    }
    const id = Number(raw)
    return Number.isFinite(id) && id > 0 ? id : null
  }, [searchParams])

  const isMobileLayout = useMatchMedia(SUPPORT_INBOX_MOBILE_MEDIA_QUERY)
  const showMobileChat = isMobileLayout && selectedId !== null
  const isClosedTab = listTab === SUPPORT_INBOX_LIST_TAB.CLOSED

  const inboxQueryParams = useMemo(
    () => buildInboxQueryParams({ channelFilter, listTab, statusFilter }),
    [channelFilter, listTab, statusFilter]
  )

  const {
    data: inboxResponse,
    isLoading: inboxLoading,
    refetch: refetchInbox,
  } = useGetSupportInboxQuery(inboxQueryParams, {
    pollingInterval: SUPPORT_INBOX_POLL.INBOX_MS,
  })

  const conversations = inboxResponse?.data ?? []

  const {
    data: deepLinkConversationResponse,
    isLoading: deepLinkLoading,
    isError: deepLinkError,
  } = useGetSupportConversationQuery(deepLinkId ?? 0, {
    skip: !deepLinkId,
  })

  const selected = useMemo(() => {
    if (selectedId === null) {
      return null
    }

    const fromInbox = conversations.find(c => c.id === selectedId)
    if (fromInbox) {
      return fromInbox
    }

    if (deepLinkId === selectedId && deepLinkConversationResponse?.data) {
      return deepLinkConversationResponse.data
    }

    return null
  }, [conversations, deepLinkConversationResponse?.data, deepLinkId, selectedId])

  const { messagesLoading, messagesSwitching, visibleMessages } =
    useSupportInboxMessages(selectedId)

  const [openConversation, { isLoading: opening }] = useOpenSupportConversationMutation()
  const [closeConversation, { isLoading: closing }] = useCloseSupportConversationMutation()
  const [markNotificationReadBySource] = useMarkAdminNotificationReadBySourceMutation()

  const filteredConversations = useMemo(
    () => filterSupportConversations(sortConversationsByLastMessage(conversations), searchQuery),
    [conversations, searchQuery]
  )

  const waitingInView = useMemo(
    () =>
      !isClosedTab
        ? filteredConversations.filter(
            c => c.status === SUPPORT_CONVERSATION_STATUS.WAITING_OPERATOR
          ).length
        : 0,
    [filteredConversations, isClosedTab]
  )

  const emptyDescription = getEmptyListDescription(searchQuery, isClosedTab)

  useEffect(() => {
    if (!deepLinkId) {
      return
    }

    setSelectedId(deepLinkId)
    void markNotificationReadBySource(buildSupportNotificationSourceId(deepLinkId))
  }, [deepLinkId, markNotificationReadBySource])

  useEffect(() => {
    const conversation = deepLinkConversationResponse?.data
    if (!conversation || deepLinkId !== conversation.id) {
      return
    }

    if (conversation.channel === 'telegram') {
      setChannelFilter(SUPPORT_INBOX_CHANNEL_FILTER.TELEGRAM)
    } else if (conversation.channel === 'web') {
      setChannelFilter(SUPPORT_INBOX_CHANNEL_FILTER.WEB)
    }

    if (conversation.status === SUPPORT_CONVERSATION_STATUS.CLOSED) {
      setListTab(SUPPORT_INBOX_LIST_TAB.CLOSED)
    } else {
      setListTab(SUPPORT_INBOX_LIST_TAB.ACTIVE)
    }

    requestAnimationFrame(() => scrollSupportInboxChatIntoView('smooth'))
  }, [deepLinkConversationResponse?.data, deepLinkId])

  useEffect(() => {
    if (!selectedId) {
      return
    }

    if (conversations.some(c => c.id === selectedId)) {
      return
    }

    if (deepLinkId === selectedId) {
      if (deepLinkLoading || inboxLoading) {
        return
      }

      if (deepLinkConversationResponse?.data) {
        return
      }

      if (deepLinkError) {
        setSelectedId(null)
      }

      return
    }

    setSelectedId(null)
  }, [
    conversations,
    deepLinkConversationResponse?.data,
    deepLinkError,
    deepLinkId,
    deepLinkLoading,
    inboxLoading,
    selectedId,
  ])

  const resetSelection = () => {
    setSelectedId(null)
  }

  const handleBackToList = () => {
    resetSelection()
  }

  const handleSelect = (id: number) => {
    setSelectedId(id)
    void markNotificationReadBySource(buildSupportNotificationSourceId(id))
    requestAnimationFrame(() => scrollSupportInboxChatIntoView('smooth'))
  }

  const handleOpen = async () => {
    if (!selectedId) return
    await openConversation(selectedId).unwrap()
    refetchInbox()
  }

  const handleClose = async () => {
    if (!selectedId) return
    await closeConversation(selectedId).unwrap()
    resetSelection()
    refetchInbox()
  }

  return {
    channelFilter,
    setChannelFilter,
    listTab,
    setListTab,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    selectedId,
    selected,
    showMobileChat,
    isClosedTab,
    inboxLoading,
    refetchInbox,
    filteredConversations,
    waitingInView,
    emptyDescription,
    visibleMessages,
    messagesLoading,
    messagesSwitching,
    opening,
    closing,
    resetSelection,
    handleBackToList,
    handleSelect,
    handleOpen,
    handleClose,
  }
}
