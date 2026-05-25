import { NOTIFICATIONS_PAGE_COPY } from '@/shared/lib/notifications'
import type { AdminNotificationKind } from '@/shared/lib/notifications'
import { Button, Segmented, Select } from 'antd'

import { type NotificationsFilter, TYPE_FILTER_OPTIONS } from '../constants'

type NotificationsToolbarProps = {
  filter: NotificationsFilter
  typeFilter: AdminNotificationKind | ''
  hasActiveFilters: boolean
  onFilterChange: (value: NotificationsFilter) => void
  onTypeFilterChange: (value: AdminNotificationKind | '') => void
  onResetFilters: () => void
}

export function NotificationsToolbar({
  filter,
  typeFilter,
  hasActiveFilters,
  onFilterChange,
  onTypeFilterChange,
  onResetFilters,
}: NotificationsToolbarProps) {
  return (
    <div className="notifications-page__toolbar">
      <Segmented
        value={filter}
        onChange={value => onFilterChange(value as NotificationsFilter)}
        options={[
          { label: NOTIFICATIONS_PAGE_COPY.FILTER_ALL, value: 'all' },
          { label: NOTIFICATIONS_PAGE_COPY.FILTER_UNREAD, value: 'unread' },
        ]}
      />

      <Select
        className="notifications-page__type-filter"
        value={typeFilter}
        onChange={value => onTypeFilterChange((value as AdminNotificationKind | '') ?? '')}
        options={[...TYPE_FILTER_OPTIONS]}
      />

      {hasActiveFilters ? (
        <Button type="link" onClick={onResetFilters}>
          {NOTIFICATIONS_PAGE_COPY.RESET_FILTERS}
        </Button>
      ) : null}
    </div>
  )
}
