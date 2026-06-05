import { ChangeEvent, useState } from 'react'

import { merge } from 'lodash'

type NestedRecord = { [key: string]: NestedRecord | string }

type ReducerAcc = string | { [key: string]: ReducerAcc }

export const useForm = <T extends NestedRecord>(initialState: T) => {
  const [form, setForm] = useState<T>(initialState)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentField = e.target.name.split('.').reduceRight<ReducerAcc>((acc, key) => {
      return { [key]: acc }
    }, e.target.value)

    setForm(prev => merge({}, prev, currentField))
  }

  const clearAllFormFields = () => {
    setForm(initialState)
  }

  return { form, handleChange, clearAllFormFields }
}
