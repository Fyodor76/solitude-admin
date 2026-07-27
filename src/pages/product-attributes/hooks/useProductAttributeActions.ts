import React from 'react'

import {
  ProductAttributeRequest,
  ProductAttributeResponse,
} from '@/shared/lib/api/product-attributes/types'
import { message } from 'antd'

import { ErrorsProps, ErrorsValueProps, RowErrorsProps } from '../productAttributesTypes'

interface useProductAttributeActionsProps {
  editFormLocal: ProductAttributeResponse | undefined
  selectedAttributeId: string | null
  selectAttr: ProductAttributeResponse | undefined
  setEditFormLocal: React.Dispatch<React.SetStateAction<ProductAttributeResponse | undefined>>
  onSaveEditedOption: (data: Partial<ProductAttributeRequest>, id: string) => Promise<void>
  onSaveEditedValue: (
    attributeId: string,
    editFormLocal: ProductAttributeResponse | undefined
  ) => Promise<void>
  setErrors: React.Dispatch<React.SetStateAction<ErrorsProps>>
  setErrorsValue: React.Dispatch<React.SetStateAction<ErrorsValueProps>>
  setRowErrors: React.Dispatch<React.SetStateAction<RowErrorsProps>>
}
const useProductAttributeActions = ({
  selectAttr,
  editFormLocal,
  selectedAttributeId,
  onSaveEditedValue,
  setEditFormLocal,
  onSaveEditedOption,
  setErrors,
  setErrorsValue,
  setRowErrors,
}: useProductAttributeActionsProps) => {
  const saveAllChanges = async () => {
    try {
      if (selectedAttributeId && editFormLocal) {
        const { id, values, isActive, createdAt, updatedAt, ...optionData } = editFormLocal

        await onSaveEditedOption(optionData, selectedAttributeId)
      }
      if (selectedAttributeId && editFormLocal) {
        await onSaveEditedValue(selectedAttributeId, editFormLocal)
      }
      console.log('Все изменения сохранены!')
    } catch (error) {
      console.error('Ошибка сохранения:', error)
    }
  }

  const handleCancel = () => {
    if (selectAttr) {
      setEditFormLocal(selectAttr)
      setErrors({})
      setRowErrors({})
      setErrorsValue({})
      message.info('Все изменения отменены')
    }
  }
  return {
    saveAllChanges,
    handleCancel,
  }
}

export default useProductAttributeActions
