import type { FormSubmissionDto } from '@/shared/lib/api/form-submissions/types'
import { Button, Space, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import { FORM_SUBMISSION_STATUS_COLOR, FORM_SUBMISSION_STATUS_LABEL } from '../constants'
import { formatSubmissionDate } from '../formatSubmissionDate'
import type { CallbackFormPendingAction } from '../hooks/useCallbackFormSubmissionsPage'

type GetCallbackFormColumnsParams = {
  pendingAction: CallbackFormPendingAction | null
  onProcess: (id: string) => void
  onReject: (id: string) => void
}

export function getCallbackFormColumns({
  pendingAction,
  onProcess,
  onReject,
}: GetCallbackFormColumnsParams): ColumnsType<FormSubmissionDto> {
  return [
    {
      title: 'Дата',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (value: string) => formatSubmissionDate(value),
    },
    {
      title: 'Имя',
      key: 'name',
      width: 140,
      render: (_value, record) => record.formData.name || '—',
    },
    {
      title: 'Телефон',
      key: 'phone',
      width: 160,
      render: (_value, record) => record.formData.phone || '—',
    },
    {
      title: 'Email',
      key: 'email',
      width: 200,
      render: (_value, record) => record.formData.email || '—',
    },
    {
      title: 'Комментарий',
      key: 'comment',
      ellipsis: true,
      render: (_value, record) => record.formData.comment?.trim() || '—',
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: FormSubmissionDto['status']) => (
        <Tag color={FORM_SUBMISSION_STATUS_COLOR[status]}>
          {FORM_SUBMISSION_STATUS_LABEL[status]}
        </Tag>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 220,
      className: 'callback-form-page__actions-cell',
      render: (_value, record) => {
        const isRowPending = pendingAction?.id === record.id
        const isProcessLoading = isRowPending && pendingAction?.action === 'process'
        const isRejectLoading = isRowPending && pendingAction?.action === 'reject'

        if (record.status !== 'new') {
          return <span className="callback-form-page__actions-placeholder">—</span>
        }

        return (
          <div className="callback-form-page__actions">
            <Space size="small">
              <Button
                type="primary"
                size="small"
                loading={isProcessLoading}
                disabled={isRowPending}
                onClick={() => onProcess(record.id)}
              >
                Обработать
              </Button>
              <Button
                size="small"
                loading={isRejectLoading}
                disabled={isRowPending}
                onClick={() => onReject(record.id)}
              >
                Отклонить
              </Button>
            </Space>
          </div>
        )
      },
    },
  ]
}
