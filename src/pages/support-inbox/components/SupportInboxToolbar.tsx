import { Segmented, Select, Space } from 'antd'

import {
  SUPPORT_INBOX_COPY,
  SUPPORT_INBOX_SEGMENT_OPTIONS,
  SUPPORT_INBOX_STATUS_FILTER_OPTIONS,
  type SupportInboxChannelFilter,
  type SupportInboxListTab,
  type SupportInboxStatusFilter,
} from '../constants'

interface SupportInboxToolbarProps {
  listTab: SupportInboxListTab
  channelFilter: SupportInboxChannelFilter
  statusFilter: SupportInboxStatusFilter
  isClosedTab: boolean
  listCount: number
  waitingCount: number
  onListTabChange: (tab: SupportInboxListTab) => void
  onChannelFilterChange: (channel: SupportInboxChannelFilter) => void
  onStatusFilterChange: (status: SupportInboxStatusFilter) => void
}

export function SupportInboxToolbar({
  listTab,
  channelFilter,
  statusFilter,
  isClosedTab,
  listCount,
  waitingCount,
  onListTabChange,
  onChannelFilterChange,
  onStatusFilterChange,
}: SupportInboxToolbarProps) {
  return (
    <div className="support-inbox__toolbar">
      <Space wrap size="middle">
        <Segmented
          value={listTab}
          onChange={value => onListTabChange(value as SupportInboxListTab)}
          options={[...SUPPORT_INBOX_SEGMENT_OPTIONS.LIST_TAB]}
        />
        <Segmented
          value={channelFilter}
          onChange={value => onChannelFilterChange(value as SupportInboxChannelFilter)}
          options={[...SUPPORT_INBOX_SEGMENT_OPTIONS.CHANNEL]}
        />
        {!isClosedTab && (
          <Select
            className="support-inbox__status-select"
            value={statusFilter}
            onChange={value => onStatusFilterChange(value as SupportInboxStatusFilter)}
            options={SUPPORT_INBOX_STATUS_FILTER_OPTIONS}
            popupMatchSelectWidth={false}
          />
        )}
      </Space>
      <div className="support-inbox__toolbar-stats">
        <span>
          {listCount} {SUPPORT_INBOX_COPY.LIST_COUNT}
        </span>
        {waitingCount > 0 && (
          <span
            className="support-inbox__waiting-pill"
            title={SUPPORT_INBOX_COPY.WAITING_PILL_TITLE}
          >
            <span className="support-inbox__waiting-pill-count">{waitingCount}</span>
            <span className="support-inbox__waiting-pill-label">
              {SUPPORT_INBOX_COPY.WAITING_PILL_LABEL}
            </span>
          </span>
        )}
      </div>
    </div>
  )
}
