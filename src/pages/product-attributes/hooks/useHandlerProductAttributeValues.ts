import { Dispatch, SetStateAction, useState } from 'react'

import {
  useCreateAttributeValueMutation,
  useDeleteAttributeValueByIdMutation,
  useUpdateAttributeValueMutation,
} from '@/shared/lib/api/product-attributes/AttributeValues'
import {
  AttributeValueRequest,
  ProductAttributeResponse,
} from '@/shared/lib/api/product-attributes/types'
import { message, Modal } from 'antd'

import { AttributeValue } from '@/app/types/product'

import { initialStateValue } from '../const/const'

interface UseHandlerProductAttributeValuesProps {
  editFormLocal: ProductAttributeResponse | undefined
  formValue: AttributeValueRequest
  selectedAttributeId: string | null
  modal: {
    isOpen: boolean
    content: any
    mode: string
    setMode: (mode: string) => void
    onOpen: (content?: any) => void
    onClose: () => void
    onToggle: () => void
  }
  setFormValue: React.Dispatch<React.SetStateAction<AttributeValueRequest>>
  setValueId: Dispatch<SetStateAction<string | null>>
  setEditFormLocal: Dispatch<SetStateAction<ProductAttributeResponse | undefined>>
  setAllProdAttr: React.Dispatch<React.SetStateAction<ProductAttributeResponse[]>>
}

export const useHandlerProductAttributeValues = ({
  editFormLocal,
  formValue,
  selectedAttributeId,
  modal,
  setAllProdAttr,
  setFormValue,
  setValueId,
  setEditFormLocal,
}: UseHandlerProductAttributeValuesProps) => {
  const [updateValues] = useUpdateAttributeValueMutation()
  const [deleteValue] = useDeleteAttributeValueByIdMutation()
  const [createAttributeValue] = useCreateAttributeValueMutation()
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
    const valueToDelete = editFormLocal?.values?.find(v => v.id === id)

    Modal.confirm({
      title: 'Удалить значение?',
      content: `Вы уверены, что хотите удалить значение "${valueToDelete?.value || 'без названия'}"? Это действие нельзя отменить.`,
      okText: 'Да, удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: () => {
        setDeletedValueIds(prev => {
          console.log('Добавляем ID:', id)
          console.log('Предыдущий массив:', prev)
          return [...prev, id]
        })
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
        message.success(`Значение "${valueToDelete?.value}" удалено`)
      },
      onCancel: () => {
        console.log('Удаление отменено')
      },
    })
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
          try {
            console.log('🗑️ Удаляем valueId:', valueId)
            await deleteValue({
              attrId: attributeId,
              valueId: valueId,
            }).unwrap()
            console.log(`✅ Значение ${valueId} удалено`)
          } catch (error: any) {
            if (error?.data?.generalErrors?.[0]?.code === 'db.foreign_key') {
              message.error(`Значение используется в товарах и не может быть удалено`)
              console.log(` Значение ${valueId} используется, пропускаем`)
            } else {
              console.error('Ошибка удаления:', error)
              throw error
            }
          }
        }

        setDeletedValueIds([])
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
      message.success('Все изменения сохранены')
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      message.error('Ошибка при сохранении изменений')
    }
  }

  const onSaveCreatedValue = async () => {
    try {
      const newValue: AttributeValueRequest = {
        value: formValue.value,
        displayName: formValue.displayName,
        hexCode: formValue.hexCode,
        isActive: formValue.isActive,
      }
      const response = await createAttributeValue({
        data: newValue,
        attributeId: selectedAttributeId!,
      }).unwrap()
      setAllProdAttr(prev =>
        prev.map(prodAttr =>
          prodAttr.id === selectedAttributeId
            ? {
                ...prodAttr,
                values: [...prodAttr.values, response.data],
              }
            : prodAttr
        )
      )

      setFormValue(initialStateValue)
      modal.onClose()
      console.log('Создала новое значение!')
    } catch (error) {
      console.log('Ошибка создания новой опции...', error)
    }
  }
  return {
    localDeleteValue,
    localEditValue,
    onSaveEditedValue,
    onSaveCreatedValue,
  }
}
