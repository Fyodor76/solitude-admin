import { PageHeader } from '@/shared/ui/page-header'
import { Button } from 'antd'
import classNames from 'classnames'

import { SupportInboxChatPanel } from './components/SupportInboxChatPanel'
import { SupportInboxSidebar } from './components/SupportInboxSidebar'
import { SupportInboxToolbar } from './components/SupportInboxToolbar'
import {
  SUPPORT_INBOX_COPY,
  SUPPORT_INBOX_LAYOUT_CLASS,
  type SupportInboxChannelFilter,
  type SupportInboxListTab,
  type SupportInboxStatusFilter,
} from './constants'
import { useSupportInbox } from './hooks/useSupportInbox'
import './SupportInbox.scss'

export function SupportInbox() {
  const inbox = useSupportInbox()

  const handleListTabChange = (tab: SupportInboxListTab) => {
    inbox.setListTab(tab)
    inbox.resetSelection()
  }

  const handleChannelChange = (channel: SupportInboxChannelFilter) => {
    inbox.setChannelFilter(channel)
    inbox.resetSelection()
  }

  const handleStatusChange = (status: SupportInboxStatusFilter) => {
    inbox.setStatusFilter(status)
    inbox.resetSelection()
  }

  return (
    <div
      className={classNames(SUPPORT_INBOX_LAYOUT_CLASS.ROOT, {
        [SUPPORT_INBOX_LAYOUT_CLASS.MOBILE_CHAT]: inbox.showMobileChat,
      })}
    >
      <div className="support-inbox__header-block">
        <PageHeader
          title={SUPPORT_INBOX_COPY.PAGE_TITLE}
          subtitle={SUPPORT_INBOX_COPY.PAGE_SUBTITLE}
          actions={
            <Button onClick={() => inbox.refetchInbox()}>{SUPPORT_INBOX_COPY.REFRESH_LIST}</Button>
          }
        />

        <SupportInboxToolbar
          listTab={inbox.listTab}
          channelFilter={inbox.channelFilter}
          statusFilter={inbox.statusFilter}
          isClosedTab={inbox.isClosedTab}
          listCount={inbox.filteredConversations.length}
          waitingCount={inbox.waitingInView}
          onListTabChange={handleListTabChange}
          onChannelFilterChange={handleChannelChange}
          onStatusFilterChange={handleStatusChange}
        />
      </div>

      <div className="support-inbox__layout">
        <SupportInboxSidebar
          conversations={inbox.filteredConversations}
          selectedId={inbox.selectedId}
          isLoading={inbox.inboxLoading}
          searchQuery={inbox.searchQuery}
          emptyDescription={inbox.emptyDescription}
          onSearchChange={inbox.setSearchQuery}
          onSelect={inbox.handleSelect}
        />

        <main className="support-inbox__main">
          <SupportInboxChatPanel
            conversation={inbox.selected}
            messages={inbox.visibleMessages}
            messagesLoading={inbox.messagesLoading}
            messagesSwitching={inbox.messagesSwitching}
            onOpen={inbox.handleOpen}
            onClose={inbox.handleClose}
            onReplySent={() => inbox.refetchInbox()}
            opening={inbox.opening}
            closing={inbox.closing}
            readOnly={inbox.isClosedTab}
            showBackToList={inbox.showMobileChat}
            onBackToList={inbox.handleBackToList}
          />
        </main>
      </div>
    </div>
  )
}
