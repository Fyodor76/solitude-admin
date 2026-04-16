import { useEffect } from 'react'

import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import { clearNotifications } from '@/store/slices/notificationsSlice'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '@/app/store'

export const NotificationHost = () => {
  const { openNotification, contextHolder } = useNotificationHandler()
  const notifications = useSelector((state: RootState) => state.notifications.items)
  const dispatch = useDispatch()

  const notification = notifications[notifications.length - 1]

  useEffect(() => {
    if (notifications?.length) {
      openNotification(notification.type, notification.message, 3, () =>
        dispatch(clearNotifications())
      )
    }
  }, [notifications])

  return <>{contextHolder}</>
}
