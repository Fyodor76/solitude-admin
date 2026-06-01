import type { FormSubmissionDto } from '@/shared/lib/api/form-submissions/types'
import { Button, Tag } from 'antd'

import { FORM_SUBMISSION_STATUS_COLOR, FORM_SUBMISSION_STATUS_LABEL } from '../constants'
import { formatSubmissionDate } from '../formatSubmissionDate'
import type { CallbackFormPendingAction } from '../hooks/useCallbackFormSubmissionsPage'

type CallbackFormSubmissionCardProps = {
  record: FormSubmissionDto
  pendingAction: CallbackFormPendingAction | null
  onProcess: (id: string) => void
  onReject: (id: string) => void
}

export function CallbackFormSubmissionCard({
  record,
  pendingAction,
  onProcess,
  onReject,
}: CallbackFormSubmissionCardProps) {
  const isRowPending = pendingAction?.id === record.id
  const isProcessLoading = isRowPending && pendingAction?.action === 'process'
  const isRejectLoading = isRowPending && pendingAction?.action === 'reject'

  return (
    <article className="callback-form-page__card">
      <div className="callback-form-page__card-head">
        <Tag color={FORM_SUBMISSION_STATUS_COLOR[record.status]}>
          {FORM_SUBMISSION_STATUS_LABEL[record.status]}
        </Tag>
        <time className="callback-form-page__card-date">
          {formatSubmissionDate(record.createdAt)}
        </time>
      </div>

      <dl className="callback-form-page__card-fields">
        <div className="callback-form-page__card-field">
          <dt>Имя</dt>
          <dd>{record.formData.name || '—'}</dd>
        </div>
        <div className="callback-form-page__card-field">
          <dt>Телефон</dt>
          <dd>{record.formData.phone || '—'}</dd>
        </div>
        <div className="callback-form-page__card-field">
          <dt>Email</dt>
          <dd>{record.formData.email || '—'}</dd>
        </div>
        {record.formData.comment?.trim() ? (
          <div className="callback-form-page__card-field callback-form-page__card-field--full">
            <dt>Комментарий</dt>
            <dd>{record.formData.comment.trim()}</dd>
          </div>
        ) : null}
      </dl>

      {record.status === 'new' ? (
        <div className="callback-form-page__card-actions">
          <Button
            type="primary"
            loading={isProcessLoading}
            disabled={isRowPending}
            onClick={() => onProcess(record.id)}
          >
            Обработать
          </Button>
          <Button
            loading={isRejectLoading}
            disabled={isRowPending}
            onClick={() => onReject(record.id)}
          >
            Отклонить
          </Button>
        </div>
      ) : null}
    </article>
  )
}
