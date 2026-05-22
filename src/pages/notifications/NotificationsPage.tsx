import { useEffect, useMemo, useState } from 'react'

import {
  useGetAdminNotificationsQuery,
  useGetAdminNotificationsSummaryQuery,
  useMarkAdminNotificationReadMutation,
  useMarkAllAdminNotificationsReadMutation,
} from '@/shared/lib/api/admin-notifications/adminNotificationsApi'
import {
  ADMIN_NOTIFICATION_KIND,
  ADMIN_NOTIFICATION_KIND_LABELS,
  ADMIN_NOTIFICATIONS_PAGE_SIZE,
  ADMIN_NOTIFICATIONS_POLL_MS,
  type AdminNotificationItem,
  type AdminNotificationKind,
  mapAdminNotificationDto,
  NOTIFICATIONS_PAGE_COPY,
} from '@/shared/lib/notifications'
import { formatNotificationTime } from '@/shared/lib/notifications/formatNotificationTime'
import { formatUnreadCount } from '@/shared/lib/notifications/formatUnreadCount'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { Button, Empty, Pagination, Segmented, Select, Spin } from 'antd'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import './NotificationsPage.scss'

type NotificationsFilter = 'all' | 'unread'

const TYPE_FILTER_OPTIONS = [
  { value: '', label: NOTIFICATIONS_PAGE_COPY.FILTER_TYPE_ALL },
  {
    value: ADMIN_NOTIFICATION_KIND.SUPPORT,
    label: ADMIN_NOTIFICATION_KIND_LABELS.support,
  },
  {
    value: ADMIN_NOTIFICATION_KIND.ORDER,
    label: ADMIN_NOTIFICATION_KIND_LABELS.order,
  },
  {
    value: ADMIN_NOTIFICATION_KIND.SYSTEM,
    label: ADMIN_NOTIFICATION_KIND_LABELS.system,
  },
]

function getKindLabel(kind: AdminNotificationItem['kind']): string {
  return ADMIN_NOTIFICATION_KIND_LABELS[kind] ?? ''
}

const NotificationsPage = () => {
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

  return (
    <Container className="notifications-page">
      <PageHeader
        title={NOTIFICATIONS_PAGE_COPY.TITLE}
        subtitle={subtitle}
        actions={
          globalUnread > 0 ? (
            <Button loading={markingAll} onClick={() => void markAllRead()}>
              {NOTIFICATIONS_PAGE_COPY.MARK_ALL_READ}
            </Button>
          ) : null
        }
      />

      <div className="notifications-page__toolbar">
        <Segmented
          value={filter}
          onChange={value => setFilter(value as NotificationsFilter)}
          options={[
            { label: NOTIFICATIONS_PAGE_COPY.FILTER_ALL, value: 'all' },
            { label: NOTIFICATIONS_PAGE_COPY.FILTER_UNREAD, value: 'unread' },
          ]}
        />

        <Select
          className="notifications-page__type-filter"
          value={typeFilter}
          onChange={value => setTypeFilter((value as AdminNotificationKind | '') ?? '')}
          options={TYPE_FILTER_OPTIONS}
        />

        {hasActiveFilters ? (
          <Button type="link" onClick={handleResetFilters}>
            {NOTIFICATIONS_PAGE_COPY.RESET_FILTERS}
          </Button>
        ) : null}
      </div>

      {total > 0 ? (
        <p className="notifications-page__total">{NOTIFICATIONS_PAGE_COPY.TOTAL(total)}</p>
      ) : null}

      {isLoading ? (
        <div className="notifications-page__loading">
          <Spin />
        </div>
      ) : items.length === 0 ? (
        <Empty
          className="notifications-page__empty"
          description={
            filter === 'unread'
              ? NOTIFICATIONS_PAGE_COPY.EMPTY_UNREAD
              : NOTIFICATIONS_PAGE_COPY.EMPTY_ALL
          }
        />
      ) : (
        <>
          <ul className="notifications-page__list" aria-busy={isFetching}>
            {items.map(item => (
              <li key={item.id}>
                <Link
                  to={item.href}
                  className={classNames('notifications-page__item', {
                    'notifications-page__item--unread': !item.readAt,
                  })}
                  onClick={() => handleItemClick(item)}
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
            ))}
          </ul>

          {total > ADMIN_NOTIFICATIONS_PAGE_SIZE ? (
            <div className="notifications-page__pagination">
              <Pagination
                current={page}
                pageSize={ADMIN_NOTIFICATIONS_PAGE_SIZE}
                total={total}
                showSizeChanger={false}
                onChange={nextPage => setPage(nextPage)}
              />
            </div>
          ) : null}
        </>
      )}
    </Container>
  )
}

export default NotificationsPage
