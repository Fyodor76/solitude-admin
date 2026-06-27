import type { CSSProperties } from 'react'

import { notification, NotificationArgsProps } from 'antd'

type NotificationType = 'success' | 'info' | 'warning' | 'error'
const getNoticeStyle = (type: NotificationType): CSSProperties => {
  if (type === 'error') {
    return {
      backgroundColor: '#fff1f0',
      border: '1px solid #ffccc7',
    }
  }

  if (type === 'success') {
    return {
      backgroundColor: '#f6ffed',
      border: '1px solid #b7eb8f',
    }
  }

  return {
    borderRadius: 8,
  }
}

export const useNotificationHandler = () => {
  const [api, contextHolder] = notification.useNotification({
    stack: false,
  })

  const sharedProps: NotificationArgsProps = {
    title: 'Notification Title',
    description: 'This is a notification description.',
    duration: 3,
  }

  const openNotification = (
    type: NotificationType,
    notificationMessages: string[],
    duration: number | false = 3,
    onClose?: () => void
  ) => {
    api[type]({
      ...sharedProps,
      title: '',
      description: (
        <div>
          {notificationMessages.map(message => (
            <div>{message}</div>
          ))}
        </div>
      ),
      duration: duration,
      style: getNoticeStyle(type),
      onClose: onClose,
    })
  }

  return { contextHolder, openNotification }
}
