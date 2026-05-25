import { NOTIFICATIONS_PAGE_COPY } from '@/shared/lib/notifications'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { Button } from 'antd'

import { NotificationsList, NotificationsTotal } from './components/NotificationsList'
import { NotificationsToolbar } from './components/NotificationsToolbar'
import { useNotificationsPage } from './hooks/useNotificationsPage'
import './NotificationsPage.scss'

const NotificationsPage = () => {
  const page = useNotificationsPage()

  return (
    <Container className="notifications-page">
      <PageHeader
        title={NOTIFICATIONS_PAGE_COPY.TITLE}
        subtitle={page.subtitle}
        actions={
          page.globalUnread > 0 ? (
            <Button loading={page.markingAll} onClick={() => void page.markAllRead()}>
              {NOTIFICATIONS_PAGE_COPY.MARK_ALL_READ}
            </Button>
          ) : null
        }
      />

      <NotificationsToolbar
        filter={page.filter}
        typeFilter={page.typeFilter}
        hasActiveFilters={page.hasActiveFilters}
        onFilterChange={page.setFilter}
        onTypeFilterChange={page.setTypeFilter}
        onResetFilters={page.handleResetFilters}
      />

      <NotificationsTotal total={page.total} />

      <NotificationsList
        items={page.items}
        total={page.total}
        page={page.page}
        isLoading={page.isLoading}
        isFetching={page.isFetching}
        emptyDescription={page.emptyDescription}
        onPageChange={page.setPage}
        onItemClick={page.handleItemClick}
      />
    </Container>
  )
}

export default NotificationsPage
