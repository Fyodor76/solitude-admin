import { useMatchMedia } from '@/shared/hooks/useMatchMedia'
import type { FormSubmissionStatus } from '@/shared/lib/api/form-submissions/types'
import Container from '@/shared/ui/container/Container'
import { PageHeader } from '@/shared/ui/page-header'
import { Button, Empty, Segmented, Spin, Table } from 'antd'

import { ADMIN_MOBILE_SIDEBAR_MEDIA_QUERY } from '@/app/constans/layout'

import './CallbackFormPage.scss'
import { CallbackFormSubmissionCard } from './components/CallbackFormSubmissionCard'
import { getCallbackFormColumns } from './components/getCallbackFormColumns'
import { FORM_SUBMISSION_STATUS_LABEL } from './constants'
import { useCallbackFormSubmissionsPage } from './hooks/useCallbackFormSubmissionsPage'

const CallbackFormPage = () => {
  const isMobile = useMatchMedia(ADMIN_MOBILE_SIDEBAR_MEDIA_QUERY)
  const page = useCallbackFormSubmissionsPage()

  const columns = getCallbackFormColumns({
    pendingAction: page.pendingAction,
    onProcess: id => void page.updateStatus(id, 'process'),
    onReject: id => void page.updateStatus(id, 'reject'),
  })

  const statusOptions: { label: string; value: FormSubmissionStatus | 'all' }[] = [
    { label: `Все (${page.totalCount})`, value: 'all' },
    {
      label: `${FORM_SUBMISSION_STATUS_LABEL.new} (${page.statusCounts.new})`,
      value: 'new',
    },
    {
      label: `${FORM_SUBMISSION_STATUS_LABEL.processed} (${page.statusCounts.processed})`,
      value: 'processed',
    },
    {
      label: `${FORM_SUBMISSION_STATUS_LABEL.rejected} (${page.statusCounts.rejected})`,
      value: 'rejected',
    },
  ]

  return (
    <Container className="callback-form-page">
      <PageHeader
        title="Форма обратной связи"
        subtitle={page.subtitle}
        actions={
          <Button loading={page.isFetching} onClick={() => void page.refetch()}>
            Обновить
          </Button>
        }
      />

      <div className="callback-form-page__toolbar">
        <Segmented
          className="callback-form-page__segmented"
          options={statusOptions}
          value={page.statusFilter}
          onChange={value => page.setStatusFilter(value as FormSubmissionStatus | 'all')}
        />
      </div>

      {page.isLoading ? (
        <div className="callback-form-page__loading">
          <Spin />
        </div>
      ) : page.submissions.length === 0 ? (
        <Empty className="callback-form-page__empty" description={page.emptyDescription} />
      ) : isMobile ? (
        <div className="callback-form-page__cards">
          {page.submissions.map(record => (
            <CallbackFormSubmissionCard
              key={record.id}
              record={record}
              pendingAction={page.pendingAction}
              onProcess={id => void page.updateStatus(id, 'process')}
              onReject={id => void page.updateStatus(id, 'reject')}
            />
          ))}
        </div>
      ) : (
        <Table
          className="callback-form-page__table"
          rowKey="id"
          columns={columns}
          dataSource={page.submissions}
          loading={page.isLoading}
          pagination={{ pageSize: 20, showSizeChanger: false }}
          scroll={{ x: 960 }}
        />
      )}
    </Container>
  )
}

export default CallbackFormPage
