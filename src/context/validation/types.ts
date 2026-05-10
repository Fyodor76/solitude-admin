import { ReactNode } from 'react'

export interface ValidationField {
  route: string
  required: boolean
  text: string
}

export interface Props {
  children: ReactNode
}

export interface ValidationContextValue {
  errors: ValidationField[]
  setErrors: React.Dispatch<React.SetStateAction<ValidationField[]>>
  applyServerErrors: (errorsFromServer: Record<string, any>) => void
}
