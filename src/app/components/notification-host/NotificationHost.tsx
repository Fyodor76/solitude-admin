import { useEffect } from 'react'

import { useNotificationHandler } from '@/shared/lib/hooks/useNotificationHandler'
import { clearNotifications } from '@/store/slices/notificationsSlice'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '@/app/store'

export const NotificationHost = () => {
  const { openNotification, contextHolder } = useNotificationHandler()
  const notifications = useSelector((state: RootState) => state.notifications.items)
  const dispatch = useDispatch()

  console.log(notifications, 'notifications')

  useEffect(() => {
    if (notifications?.length) {
      notifications.forEach(notification => {
        openNotification(notification.type, notification.messages, 8, () =>
          dispatch(clearNotifications())
        )
      })
    }
  }, [notifications])

  return <>{contextHolder}</>
}
