import { Dispatch, SetStateAction, useState } from 'react'

import {
  useDeleteAttributeValueByIdMutation,
  useUpdateAttributeValueMutation,
} from '@/shared/lib/api/product-attributes/AttributeValues'
import {
  AttributeValueResponse,
  ProductAttributeResponse,
} from '@/shared/lib/api/product-attributes/types'

import { AttributeValue } from '@/app/types/product'

interface UseHandlerProductAttributeValuesProps {
  setValueId: Dispatch<SetStateAction<string | null>>
  setEditFormLocal: Dispatch<SetStateAction<ProductAttributeResponse | undefined>>
}

export const useHandlerProductAttributeValues = ({
  setValueId,
  setEditFormLocal,
}: UseHandlerProductAttributeValuesProps) => {
  const [updateValues] = useUpdateAttributeValueMutation()
  const [deleteValue] = useDeleteAttributeValueByIdMutation()
  const [deletedValueIds, setDeletedValueIds] = useState<string[]>([])

  const localEditValue = (id: string, failed: keyof AttributeValue, value: any) => {
    setValueId(id)
    setEditFormLocal(prev => {
      if (!prev) return prev
      const updateValues = prev.values.map(v => (v.id === id ? { ...v, [failed]: value } : v))
      return {
        ...prev,
        values: updateValues,
      }
    })
  }

  const localDeleteValue = (id: string) => {
    setDeletedValueIds(prev => [...prev, id])
    setEditFormLocal(prev => {
      if (!prev) return prev
      const values = prev.values || []
      const newValues = values.filter(value => value.id !== id)
      return {
        ...prev,
        values: newValues,
      }
    })
    setValueId(null)
  }
  const onSaveEditedValue = async (
    attributeId: string,
    editFormLocal: ProductAttributeResponse | undefined
  ) => {
    if (!attributeId) {
      console.error('ID опции не найден')
      return
    }
    if (!editFormLocal) {
      console.error('Нет данных для сохранения')
      return
    }
    try {
      if (deletedValueIds.length > 0) {
        for (const valueId of deletedValueIds) {
          await deleteValue({
            attrId: attributeId,
            valueId: valueId,
          }).unwrap()
        }
        setDeletedValueIds([])
        console.log(`Удалены значения: ${deletedValueIds.join(', ')}`)
      }
      const currentValues = editFormLocal.values || []
      for (const value of currentValues) {
        if (value.id) {
          await updateValues({
            attributeId: attributeId,
            valueId: value.id,
            data: {
              value: value.value,
              displayName: value.displayName,
              hexCode: value.hexCode,
              isActive: value.isActive,
            },
          }).unwrap()
        }
      }
      setValueId(null)
    } catch (error) {
      console.error('Ошибка сохранения:', error)
    }
  }
  return {
    localDeleteValue,
    localEditValue,
    onSaveEditedValue,
  }
}
