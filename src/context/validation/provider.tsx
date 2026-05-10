import { useState } from 'react'

import { ValidationContext } from './context'
import { Props, ValidationField } from './types'

export const ValidationProvider = ({ children }: Props) => {
  const [errors, setErrors] = useState<ValidationField[]>([])

  const applyServerErrors = <T extends Record<string, any>>(
    errorsFromServer: Record<string, any>
  ) => {
    const mappedErrors: ValidationField[] = Object.entries(errorsFromServer).map(
      ([route, value]: any) => {
        console.log(route, 'route')

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
