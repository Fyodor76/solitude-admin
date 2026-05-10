import { ChangeEvent, useState } from 'react'

export const useForm = <T extends Record<string, string>>(initialState: T) => {
  const [form, setForm] = useState<T>(initialState)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name.split('.'), 'nameee')

    const res = e.target.name.split('.').reduce((acc, cur) => {
      acc[cur] = {}
      console.log(acc, '1234')
      return acc
    }, {})

    console.log(res, 'res')

    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const clearAllFormFields = () => {
    setForm(initialState)
  }

  return { form, handleChange, clearAllFormFields }
}
