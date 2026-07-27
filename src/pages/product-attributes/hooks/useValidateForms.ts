import React from 'react'

import {
  AttributeValueRequest,
  AttributeValueResponse,
  ProductAttributeRequest,
} from '@/shared/lib/api/product-attributes/types'

import { ErrorsProps, ErrorsValueProps, RowErrorsProps } from '../productAttributesTypes'

interface useValidateFormsProps {
  errors: ErrorsProps
  errorsValue: ErrorsValueProps
  setErrors: React.Dispatch<React.SetStateAction<ErrorsProps>>
  setErrorsValue: React.Dispatch<React.SetStateAction<ErrorsValueProps>>
  setRowErrors: React.Dispatch<React.SetStateAction<RowErrorsProps>>
}

export const useValidateForms = ({
  errors,
  errorsValue,
  setErrors,
  setErrorsValue,
  setRowErrors,
}: useValidateFormsProps) => {
  const validateForm = (field: keyof ProductAttributeRequest, value: any) => {
    const newErrors = { ...errors }
    if (field === 'name') {
      if (!value || value.trim() === '') {
        newErrors.name = 'Введите название опции'
      } else {
        delete newErrors.name
      }
    }
    if (field === 'slug') {
      if (!value || value.trim() === '') {
        newErrors.slug = 'Введите slug опции'
      } else if (!/^[a-zA-Z0-9-]+$/.test(value)) {
        newErrors.slug = 'Только латинские буквы, цифры и дефисы'
      } else {
        delete newErrors.slug
      }
    }

    if (field === 'sortOrder') {
      if (value !== undefined && value !== null && value !== '') {
        const num = Number(value)
        if (isNaN(num)) {
          newErrors.sortOrder = 'Порядок сортировки должен быть числом'
        } else if (num < 0 || num > 10) {
          newErrors.sortOrder = 'Номер сортировки не должен быть отрицательным числом или больше 10'
        } else {
          delete newErrors.sortOrder
        }
      } else {
        delete newErrors.sortOrder
      }
    }
    setErrors(newErrors)
  }

  const validateValueForm = (field: keyof AttributeValueRequest, value: any) => {
    const newErrors = { ...errorsValue }
    if (field === 'value') {
      if (!value || value.trim() === '') {
        newErrors.value = 'Введите значение'
      } else if (!/^[a-zA-Z0-9-_]+$/.test(value)) {
        newErrors.value = 'Только латинские буквы, цифры, дефис и подчеркивание'
      } else {
        delete newErrors.value
      }
    }
    if (field === 'displayName') {
      if (!value || value.trim() === '') {
        newErrors.displayName = 'Введите название на русском языке'
      } else if (!/^[А-Яа-яёЁ0-9-_]+$/.test(value)) {
        newErrors.displayName = 'Только русские буквы, цифры, дефис и подчеркивание'
      } else {
        delete newErrors.displayName
      }
    }
    if (field === 'hexCode') {
      if (value && !/^#[0-9A-Fa-f]{6}$/.test(value)) {
        newErrors.hexCode = 'Введите корректный HEX код (например, #FF0000)'
      } else {
        delete newErrors.hexCode
      }
    }
    setErrorsValue(newErrors)
  }

  const validateRowField = (id: string, field: keyof AttributeValueResponse, value: any) => {
    setRowErrors(prev => {
      const newErrors = { ...prev }
      if (!newErrors[id]) newErrors[id] = {}

      if (field === 'value') {
        if (!value || value.trim() === '') {
          newErrors[id].value = 'Введите значение'
        } else if (!/^[a-zA-Z0-9-_]+$/.test(value)) {
          newErrors[id].value = 'Только латинские буквы, цифры, дефис и подчеркивание'
        } else {
          delete newErrors[id].value
        }
      }
      if (field === 'displayName') {
        if (!value || value.trim() === '') {
          newErrors[id].displayName = 'Введите отображаемое имя'
        } else if (!/^[А-Яа-яёЁ0-9\s\-]+$/.test(value)) {
          newErrors[id].displayName = 'Только русские буквы, цифры, пробелы и дефис'
        } else {
          delete newErrors[id].displayName
        }
      }

      if (field === 'hexCode') {
        if (value && !/^#[0-9A-Fa-f]{6}$/.test(value)) {
          newErrors[id].hexCode = 'Введите корректный HEX код (например, #FF0000)'
        } else {
          delete newErrors[id].hexCode
        }
      }

      if (Object.keys(newErrors[id]).length === 0) {
        delete newErrors[id]
      }

      return newErrors
    })
  }
  return {
    validateForm,
    validateValueForm,
    validateRowField,
  }
}
