import { useMemo, useState } from 'react'

import {
  useMarkAdminNotificationReadMutation,
  useMarkAllAdminNotificationsReadMutation,
} from '@/shared/lib/api/admin-notifications/adminNotificationsApi'
import {
  ADMIN_NOTIFICATION_KIND,
  ADMIN_NOTIFICATION_KIND_LABELS,
  type AdminNotificationItem,
  NOTIFICATION_BELL_COPY,
} from '@/shared/lib/notifications'
import { Badge, Button, Empty, Popover, Typography } from 'antd'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/app/lib/config/navigation'

import Icon from '../icons/Icon'
import './NotificationBell.scss'

function formatNotificationTime(value: string): string {
  try {
    return new Date(value).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return value
  }
}

function getKindLabel(kind: AdminNotificationItem['kind']): string {
  return ADMIN_NOTIFICATION_KIND_LABELS[kind] ?? ''
}

type NotificationBellProps = {
  items: AdminNotificationItem[]
  count: number
}

export function NotificationBell({ items, count }: NotificationBellProps) {
  const [open, setOpen] = useState(false)
  const [markRead] = useMarkAdminNotificationReadMutation()
  const [markAllRead, { isLoading: markingAll }] = useMarkAllAdminNotificationsReadMutation()

  const hasSupportItems = useMemo(
    () => items.some(item => item.kind === ADMIN_NOTIFICATION_KIND.SUPPORT),
    [items]
  )

  const handleItemClick = (item: AdminNotificationItem) => {
    setOpen(false)
    const numericId = Number(item.id)
    if (Number.isFinite(numericId)) {
      void markRead(numericId)
    }
  }

  const handleMarkAllRead = () => {
    void markAllRead()
  }

  const content = (
    <div className="notification-bell-panel">
      <div className="notification-bell-panel__header">
        <div className="notification-bell-panel__header-main">
          <Typography.Text strong className="notification-bell-panel__title">
            {NOTIFICATION_BELL_COPY.TITLE}
          </Typography.Text>
          {count > 0 ? (
            <Typography.Text type="secondary" className="notification-bell-panel__count">
              {NOTIFICATION_BELL_COPY.unreadCount(count)}
            </Typography.Text>
          ) : null}
        </div>
        {count > 0 ? (
          <Button type="link" size="small" loading={markingAll} onClick={handleMarkAllRead}>
            {NOTIFICATION_BELL_COPY.MARK_ALL_READ}
          </Button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <Empty
          className="notification-bell-panel__empty"
          description={NOTIFICATION_BELL_COPY.EMPTY}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <ul className="notification-bell-panel__list">
          {items.map(item => (
            <li key={item.id}>
              <Link
                to={item.href}
                className="notification-bell-panel__item"
                onClick={() => handleItemClick(item)}
              >
                <span className="notification-bell-panel__item-kind">
                  {getKindLabel(item.kind)}
                </span>
                <span className="notification-bell-panel__item-title">{item.title}</span>
                <span className="notification-bell-panel__item-desc">{item.description}</span>
                <Typography.Text type="secondary" className="notification-bell-panel__item-time">
                  {formatNotificationTime(item.createdAt)}
                </Typography.Text>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {hasSupportItems ? (
        <Link
          to={ROUTES.SUPPORT.path}
          className="notification-bell-panel__footer"
          onClick={() => setOpen(false)}
        >
          {NOTIFICATION_BELL_COPY.SUPPORT_FOOTER}
        </Link>
      ) : null}
    </div>
  )

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottomRight"
      open={open}
      onOpenChange={setOpen}
      overlayClassName="notification-bell-popover"
      arrow={false}
    >
      <button type="button" className="notification-bell" aria-label={NOTIFICATION_BELL_COPY.TITLE}>
        <Badge count={count > 0 ? (count > 99 ? '99+' : count) : 0} size="small" offset={[-2, 2]}>
          <Icon name="notify" />
        </Badge>
      </button>
    </Popover>
  )
}
