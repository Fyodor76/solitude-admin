export type FormSubmissionStatus = 'new' | 'processed' | 'rejected'

export type FormSubmissionType = 'callback' | 'order' | string

export interface CallbackFormSubmissionData {
  name: string
  phone: string
  email: string
  comment?: string
  agreeToPolicy: boolean
}

export interface FormSubmissionDto {
  id: string
  formType: FormSubmissionType
  formData: CallbackFormSubmissionData & Record<string, unknown>
  status: FormSubmissionStatus
  source: string
  createdAt: string
  updatedAt: string
}

export interface FormSubmissionsStats {
  new: number
  processed: number
  rejected: number
  total: number
}
