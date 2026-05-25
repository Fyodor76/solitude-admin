import {
  ADMIN_NOTIFICATION_KIND_LABELS,
  type AdminNotificationItem,
} from '@/shared/lib/notifications'
import { formatNotificationTime } from '@/shared/lib/notifications/formatNotificationTime'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

type NotificationListItemProps = {
  item: AdminNotificationItem
  onClick: (item: AdminNotificationItem) => void
}

function getKindLabel(kind: AdminNotificationItem['kind']): string {
  return ADMIN_NOTIFICATION_KIND_LABELS[kind] ?? ''
}

export function NotificationListItem({ item, onClick }: NotificationListItemProps) {
  return (
    <li>
      <Link
        to={item.href}
        className={classNames('notifications-page__item', {
          'notifications-page__item--unread': !item.readAt,
        })}
        onClick={() => onClick(item)}
      >
        <div className="notifications-page__item-top">
          <span className="notifications-page__item-kind">{getKindLabel(item.kind)}</span>
          <time className="notifications-page__item-time" dateTime={item.createdAt}>
            {formatNotificationTime(item.createdAt)}
          </time>
        </div>
        <span className="notifications-page__item-title">{item.title}</span>
        <span className="notifications-page__item-desc">{item.description}</span>
        {!item.readAt ? (
          <span className="notifications-page__item-badge" aria-hidden>
            Новое
          </span>
        ) : null}
      </Link>
    </li>
  )
}
