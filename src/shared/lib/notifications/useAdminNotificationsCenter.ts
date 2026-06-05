import { useEffect, useMemo, useRef } from 'react'

import {
  useGetAdminNotificationsQuery,
  useGetAdminNotificationsSummaryQuery,
} from '@/shared/lib/api/admin-notifications/adminNotificationsApi'
import { playSupportAlertSound } from '@/shared/lib/support/playSupportAlertSound'
import { addNotification } from '@/store/slices/notificationsSlice'

import { useAppDispatch } from '@/app/store/hook'

import { ADMIN_NOTIFICATIONS_LIST_LIMIT, ADMIN_NOTIFICATIONS_POLL_MS } from './constants'
import { mapAdminNotificationDto } from './mapNotificationDto'
import type { AdminNotificationItem } from './types'

type UseAdminNotificationsCenterOptions = {
  enableAlerts?: boolean
}

function buildAlertsKey(items: AdminNotificationItem[]): string {
  return items
    .filter(item => !item.readAt)
    .map(item => `${item.sourceId}:${item.createdAt}`)
    .sort()
    .join('|')
}

export function useAdminNotificationsCenter(options?: UseAdminNotificationsCenterOptions) {
  const enableAlerts = options?.enableAlerts ?? true
  const dispatch = useAppDispatch()

  const pollOptions = { pollingInterval: ADMIN_NOTIFICATIONS_POLL_MS }

  const { data: summaryResponse } = useGetAdminNotificationsSummaryQuery(undefined, pollOptions)
  const {
    data: listResponse,
    isFetching,
    isSuccess,
  } = useGetAdminNotificationsQuery(
    { unreadOnly: true, limit: ADMIN_NOTIFICATIONS_LIST_LIMIT },
    pollOptions
  )

  const unreadCount = summaryResponse?.data?.unreadCount ?? 0
  const supportUnreadCount = summaryResponse?.data?.supportUnreadCount ?? 0

  const notificationItems = useMemo(
    () => (listResponse?.data ?? []).map(mapAdminNotificationDto),
    [listResponse?.data]
  )

  const snapshotKeyRef = useRef('')
  const readyRef = useRef(false)

  useEffect(() => {
    if (!isSuccess) {
      return
    }

    const nextKey = buildAlertsKey(notificationItems)

    if (!enableAlerts) {
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

    if (nextKey !== snapshotKeyRef.current && nextKey.length > 0) {
      playSupportAlertSound()

      const latest = notificationItems[0]
      if (latest) {
        dispatch(
          addNotification({
            type: 'info',
            message: `${latest.title}: ${latest.description}`,
            duration: 5,
          })
        )
      }

      snapshotKeyRef.current = nextKey
    }
  }, [dispatch, enableAlerts, isFetching, isSuccess, notificationItems])

  return {
    unreadCount,
    supportUnreadCount,
    notificationItems,
  }
}
