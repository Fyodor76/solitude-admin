import type { FormSubmissionStatus } from '@/shared/lib/api/form-submissions/types'

export const CALLBACK_FORM_TYPE = 'callback'

export const FORM_SUBMISSION_STATUS_LABEL: Record<FormSubmissionStatus, string> = {
  new: 'Новая',
  processed: 'Обработана',
  rejected: 'Отклонена',
}

export const FORM_SUBMISSION_STATUS_COLOR: Record<
  FormSubmissionStatus,
  'processing' | 'success' | 'default'
> = {
  new: 'processing',
  processed: 'success',
  rejected: 'default',
}
