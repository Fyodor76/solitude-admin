import type { Dispatch, SetStateAction } from 'react'

import {
  AttributeValueRequest,
  AttributeValueResponse,
  ProductAttributeRequest,
  ProductAttributeResponse,
} from '@/shared/lib/api/product-attributes/types'

import { ErrorsProps, ErrorsValueProps, RowErrorsProps } from '../types/productAttributesTypes'

interface useValidateFormsProps {
  errors: ErrorsProps
  errorsValue: ErrorsValueProps
  allProdAttr: ProductAttributeResponse[]
  excludeAttributeId?: string | null
  setErrors: Dispatch<SetStateAction<ErrorsProps>>
  setErrorsValue: Dispatch<SetStateAction<ErrorsValueProps>>
  setRowErrors: Dispatch<SetStateAction<RowErrorsProps>>
}

const normalizeName = (value: string) => value.trim().toLowerCase()
const normalizeSlug = (value: string) => value.trim().toLowerCase()

export const useValidateForms = ({
  errors,
  errorsValue,
  allProdAttr,
  excludeAttributeId,
  setErrors,
  setErrorsValue,
  setRowErrors,
}: useValidateFormsProps) => {
  const isDuplicateName = (value: string) => {
    const normalized = normalizeName(value)
    if (!normalized) return false
    return allProdAttr.some(
      attr => attr.id !== excludeAttributeId && normalizeName(attr.name) === normalized
    )
  }

  const isDuplicateSlug = (value: string) => {
    const normalized = normalizeSlug(value)
    if (!normalized) return false
    return allProdAttr.some(
      attr => attr.id !== excludeAttributeId && normalizeSlug(attr.slug) === normalized
    )
  }

  const validateForm = (field: keyof ProductAttributeRequest, value: any) => {
    const newErrors = { ...errors }
    if (field === 'name') {
      if (!value || value.trim() === '') {
        newErrors.name = 'Введите название опции'
      } else if (isDuplicateName(value)) {
        newErrors.name = 'Опция с таким названием уже есть'
      } else {
        delete newErrors.name
      }
    }
    if (field === 'slug') {
      if (!value || value.trim() === '') {
        newErrors.slug = 'Введите slug опции'
      } else if (!/^[a-zA-Z0-9-]+$/.test(value)) {
        newErrors.slug = 'Только латинские буквы, цифры и дефисы'
      } else if (isDuplicateSlug(value)) {
        newErrors.slug = 'Опция с таким slug уже есть'
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

  const validateAttributeBeforeSave = (data: ProductAttributeRequest): boolean => {
    const next: ErrorsProps = {}

    if (!data.name?.trim()) {
      next.name = 'Введите название опции'
    } else if (isDuplicateName(data.name)) {
      next.name = 'Опция с таким названием уже есть'
    }

    if (!data.slug?.trim()) {
      next.slug = 'Введите slug опции'
    } else if (!/^[a-zA-Z0-9-]+$/.test(data.slug)) {
      next.slug = 'Только латинские буквы, цифры и дефисы'
    } else if (isDuplicateSlug(data.slug)) {
      next.slug = 'Опция с таким slug уже есть'
    }

    setErrors(next)
    return Object.keys(next).length === 0
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
    validateAttributeBeforeSave,
    validateValueForm,
    validateRowField,
  }
}
