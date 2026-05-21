import {
  SUPPORT_INBOX_CHANNEL_FILTER,
  SUPPORT_INBOX_LIST_TAB,
  SUPPORT_INBOX_QUERY_LIMIT,
  SUPPORT_INBOX_STATUS_FILTER,
  type SupportInboxChannelFilter,
  type SupportInboxListTab,
  type SupportInboxStatusFilter,
} from '../constants'

export function buildInboxQueryParams(options: {
  channelFilter: SupportInboxChannelFilter
  listTab: SupportInboxListTab
  statusFilter: SupportInboxStatusFilter
}) {
  const channel =
    options.channelFilter === SUPPORT_INBOX_CHANNEL_FILTER.ALL ? undefined : options.channelFilter

  const isClosedTab = options.listTab === SUPPORT_INBOX_LIST_TAB.CLOSED

  return {
    channel,
    limit: SUPPORT_INBOX_QUERY_LIMIT,
    ...(isClosedTab
      ? { closedOnly: true }
      : options.statusFilter !== SUPPORT_INBOX_STATUS_FILTER.ALL
        ? { status: options.statusFilter }
        : {}),
  }
}
