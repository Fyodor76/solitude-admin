import { ChangeEvent, useState } from 'react'

export const useForm = <T extends Record<string, string>>(initialState: T) => {
  const [form, setForm] = useState<T>(initialState)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const clearAllFormFields = () => {
    setForm(initialState)
  }

  return { form, handleChange, clearAllFormFields }
}
