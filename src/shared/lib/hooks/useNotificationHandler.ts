import { notification, NotificationArgsProps } from 'antd'

type NotificationType = 'success' | 'info' | 'warning' | 'error'

const styleFn: NotificationArgsProps['styles'] = ({ props }) => {
  if (props.type === 'error') {
    return {
      root: {
        backgroundColor: `rgba(255, 200, 200, 0.3)`,
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
      },
    } satisfies NotificationArgsProps['styles']
  }
  if (props.type === 'info') {
    return {
      root: {
        borderRadius: 8,
      },
    } satisfies NotificationArgsProps['styles']
  }
  return {}
}

export const useNotificationHandler = () => {
  const [api, contextHolder] = notification.useNotification()

  const sharedProps: NotificationArgsProps = {
    title: 'Notification Title',
    description: 'This is a notification description.',
    duration: 3,
  }

  const openNotification = (
    type: NotificationType,
    notificationText: string[],
    duration: number | false = 3,
    onClose?: () => void
  ) => {
    let error = ''

    notificationText.forEach(element => {})

    console.log(notificationText, 'notificationText')

    api[type]({
      ...sharedProps,
      title: '',
      description: notificationText,
      duration: duration,
      styles: styleFn,
      onClose: onClose,
    })
  }

  return { contextHolder, openNotification }
}
