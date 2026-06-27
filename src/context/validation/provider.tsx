import { useState } from 'react'

import { ValidationContext } from './context'
import { Props, ServerValidationError, ValidationField } from './types'

export const ValidationProvider = ({ children }: Props) => {
  const [errors, setErrors] = useState<ValidationField[]>([])

  const applyServerErrors = (errorsFromServer: Record<string, ServerValidationError>) => {
    const mappedErrors: ValidationField[] = Object.entries(errorsFromServer).map(
      ([route, value]) => {
        return {
          route,
          text: value.titles,
          required: !!value.titles.length,
        }
      }
    )

    setErrors(mappedErrors)
  }

  return (
    <ValidationContext.Provider value={{ errors, setErrors, applyServerErrors }}>
      {children}
    </ValidationContext.Provider>
  )
}
