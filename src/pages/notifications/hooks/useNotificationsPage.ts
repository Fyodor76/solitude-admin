import { useEffect, useMemo, useState } from 'react'

import {
  useGetAdminNotificationsQuery,
  useGetAdminNotificationsSummaryQuery,
  useMarkAdminNotificationReadMutation,
  useMarkAllAdminNotificationsReadMutation,
} from '@/shared/lib/api/admin-notifications/adminNotificationsApi'
import {
  ADMIN_NOTIFICATIONS_PAGE_SIZE,
  ADMIN_NOTIFICATIONS_POLL_MS,
  type AdminNotificationItem,
  type AdminNotificationKind,
  mapAdminNotificationDto,
  NOTIFICATIONS_PAGE_COPY,
} from '@/shared/lib/notifications'
import { formatUnreadCount } from '@/shared/lib/notifications/formatUnreadCount'

import type { NotificationsFilter } from '../constants'

export function useNotificationsPage() {
  const [filter, setFilter] = useState<NotificationsFilter>('unread')
  const [typeFilter, setTypeFilter] = useState<AdminNotificationKind | ''>('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [filter, typeFilter])

  const listParams = useMemo(
    () => ({
      unreadOnly: filter === 'unread',
      type: typeFilter || undefined,
      limit: ADMIN_NOTIFICATIONS_PAGE_SIZE,
      offset: (page - 1) * ADMIN_NOTIFICATIONS_PAGE_SIZE,
    }),
    [filter, typeFilter, page]
  )

  const { data: summaryResponse } = useGetAdminNotificationsSummaryQuery(undefined, {
    pollingInterval: ADMIN_NOTIFICATIONS_POLL_MS,
  })

  const { data, isLoading, isFetching } = useGetAdminNotificationsQuery(listParams, {
    pollingInterval: ADMIN_NOTIFICATIONS_POLL_MS,
  })

  const [markRead] = useMarkAdminNotificationReadMutation()
  const [markAllRead, { isLoading: markingAll }] = useMarkAllAdminNotificationsReadMutation()

  const items = useMemo(() => (data?.data ?? []).map(mapAdminNotificationDto), [data?.data])

  const total = data?.meta?.total ?? 0
  const globalUnread = summaryResponse?.data?.unreadCount ?? 0

  const handleItemClick = (item: AdminNotificationItem) => {
    const numericId = Number(item.id)
    if (!item.readAt && Number.isFinite(numericId)) {
      void markRead(numericId)
    }
  }

  const handleResetFilters = () => {
    setFilter('unread')
    setTypeFilter('')
    setPage(1)
  }

  const hasActiveFilters = filter !== 'unread' || typeFilter !== ''

  const subtitle =
    globalUnread > 0
      ? `${NOTIFICATIONS_PAGE_COPY.SUBTITLE} ${formatUnreadCount(globalUnread)}.`
      : NOTIFICATIONS_PAGE_COPY.SUBTITLE

  const emptyDescription =
    filter === 'unread' ? NOTIFICATIONS_PAGE_COPY.EMPTY_UNREAD : NOTIFICATIONS_PAGE_COPY.EMPTY_ALL

  return {
    filter,
    setFilter,
    typeFilter,
    setTypeFilter,
    page,
    setPage,
    items,
    total,
    globalUnread,
    isLoading,
    isFetching,
    markingAll,
    hasActiveFilters,
    subtitle,
    emptyDescription,
    handleItemClick,
    handleResetFilters,
    markAllRead,
  }
}
