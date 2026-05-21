import type { SupportConversation } from '@/shared/lib/api/support/types'
import { Input } from 'antd'

import { SUPPORT_INBOX_COPY } from '../constants'
import { SupportInboxConversationList } from './SupportInboxConversationList'

interface SupportInboxSidebarProps {
  conversations: SupportConversation[]
  selectedId: number | null
  isLoading: boolean
  searchQuery: string
  emptyDescription: string
  onSearchChange: (value: string) => void
  onSelect: (id: number) => void
}

export function SupportInboxSidebar({
  conversations,
  selectedId,
  isLoading,
  searchQuery,
  emptyDescription,
  onSearchChange,
  onSelect,
}: SupportInboxSidebarProps) {
  return (
    <aside className="support-inbox__sidebar support-inbox__sidebar--scroll">
      <div className="support-inbox__sidebar-search">
        <Input.Search
          allowClear
          placeholder={SUPPORT_INBOX_COPY.SEARCH_PLACEHOLDER}
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <SupportInboxConversationList
        conversations={conversations}
        selectedId={selectedId}
        isLoading={isLoading}
        onSelect={onSelect}
        emptyDescription={emptyDescription}
      />
    </aside>
  )
}
