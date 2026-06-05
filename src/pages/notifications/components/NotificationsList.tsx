import {
  ADMIN_NOTIFICATIONS_PAGE_SIZE,
  type AdminNotificationItem,
  NOTIFICATIONS_PAGE_COPY,
} from '@/shared/lib/notifications'
import { Empty, Pagination, Spin } from 'antd'

import { NotificationListItem } from './NotificationListItem'

type NotificationsListProps = {
  items: AdminNotificationItem[]
  total: number
  page: number
  isLoading: boolean
  isFetching: boolean
  emptyDescription: string
  onPageChange: (page: number) => void
  onItemClick: (item: AdminNotificationItem) => void
}

export function NotificationsList({
  items,
  total,
  page,
  isLoading,
  isFetching,
  emptyDescription,
  onPageChange,
  onItemClick,
}: NotificationsListProps) {
  if (isLoading) {
    return (
      <div className="notifications-page__loading">
        <Spin />
      </div>
    )
  }

  if (items.length === 0) {
    return <Empty className="notifications-page__empty" description={emptyDescription} />
  }

  return (
    <>
      <ul className="notifications-page__list" aria-busy={isFetching}>
        {items.map(item => (
          <NotificationListItem key={item.id} item={item} onClick={onItemClick} />
        ))}
      </ul>

      {total > ADMIN_NOTIFICATIONS_PAGE_SIZE ? (
        <div className="notifications-page__pagination">
          <Pagination
            current={page}
            pageSize={ADMIN_NOTIFICATIONS_PAGE_SIZE}
            total={total}
            showSizeChanger={false}
            onChange={nextPage => onPageChange(nextPage)}
          />
        </div>
      ) : null}
    </>
  )
}

export function NotificationsTotal({ total }: { total: number }) {
  if (total <= 0) {
    return null
  }

  return <p className="notifications-page__total">{NOTIFICATIONS_PAGE_COPY.TOTAL(total)}</p>
}
