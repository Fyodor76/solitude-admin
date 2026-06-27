import { ReactNode } from 'react'

export interface ServerValidationError {
  id: string
  code: string
  titles: string[]
  params: Record<string, unknown>
}

export interface ValidationField {
  route: string
  required: boolean
  text: string[]
}

export interface Props {
  children: ReactNode
}

export interface ValidationContextValue {
  errors: ValidationField[]
  setErrors: React.Dispatch<React.SetStateAction<ValidationField[]>>
  applyServerErrors: (errorsFromServer: Record<string, ServerValidationError>) => void
}
