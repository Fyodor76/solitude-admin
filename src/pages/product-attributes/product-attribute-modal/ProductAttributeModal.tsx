import React from 'react'

import {
  AttributeValueRequest,
  ProductAttributeRequest,
} from '@/shared/lib/api/product-attributes/types'
import { ColorPicker, Input, Modal, Select, Switch } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import { typeOptions } from '../const/const'

interface ProductAttributeModalProp {
  formOption: ProductAttributeRequest
  isOpen: boolean
  isCreateOption: boolean
  selectedAttributeId: string | null
  formValue: AttributeValueRequest
  setFormValue: React.Dispatch<React.SetStateAction<AttributeValueRequest>>
  onClose: () => void
  setFormOption: React.Dispatch<React.SetStateAction<ProductAttributeRequest>>
  onSaveCreatedOption: () => Promise<void>
  onSaveCreatedValue: () => Promise<void>
}
const ProductAttributeModal = ({
  formOption,
  isOpen,
  formValue,
  isCreateOption,
  setFormValue,
  onSaveCreatedValue,
  onClose,
  setFormOption,
  onSaveCreatedOption,
}: ProductAttributeModalProp) => {
  const handlerInputSelectOption = (failed: keyof ProductAttributeRequest, value: any) => {
    setFormOption({
      ...formOption,
      [failed]: value,
    })
  }

  const handlerInputSelectValue = (failed: keyof AttributeValueRequest, value: any) => {
    setFormValue({
      ...formValue,
      [failed]: value,
    })
  }

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title={isCreateOption ? 'Создать опцию' : 'Добавить значение'}
      onOk={
        isCreateOption
          ? async () => await onSaveCreatedOption()
          : async () => await onSaveCreatedValue()
      }
    >
      {isCreateOption ? (
        <>
          <span>Название *</span>
          <Input
            value={formOption.name}
            placeholder="Введите название..."
            onChange={e => handlerInputSelectOption('name', e.target.value)}
          />
          <span>Slug *</span>
          <Input
            value={formOption.slug}
            placeholder="Введите slug"
            onChange={e => handlerInputSelectOption('slug', e.target.value)}
          />
          <span>Только латинские буквы, цифры и дефисы</span>
          <span>Тип *</span>
          <Select
            value={formOption.type}
            placeholder="Выберете тип опции"
            options={typeOptions}
            onChange={v => handlerInputSelectOption('type', v)}
          />
          <span>Описание</span>
          <TextArea
            value={formOption.description}
            placeholder="Введите описание (необязательно)"
            onChange={e => handlerInputSelectOption('description', e.target.value)}
          />
          <span>Порядок сортировки</span>
          <Input
            value={formOption.sortOrder}
            onChange={e => handlerInputSelectOption('sortOrder', e.target.value)}
          />
          <span>Меньшее значение имеет больший преоритет</span>
        </>
      ) : (
        <>
          <span>Значение (латиница) *</span>
          <Input
            value={formValue.value}
            placeholder="Введите значение"
            onChange={e => handlerInputSelectValue('value', e.target.value)}
          />
          <span>Отображаемое имя *</span>
          <Input
            value={formValue.displayName}
            placeholder="Введите отображаемое имя"
            onChange={e => handlerInputSelectValue('displayName', e.target.value)}
          />
          <span>HEX код цвета</span>
          <ColorPicker
            value={formValue.hexCode || '#000000'}
            onChange={(color, hex) => handlerInputSelectValue('hexCode', hex)}
            showText={color => (
              <span style={{ marginLeft: '8px' }}>{color.toHexString().toUpperCase()}</span>
            )}
            size="large"
          />
          <span>Выберете цвет или укажите HEX код</span>
          <Switch
            checked={formValue.isActive === true}
            onChange={checked => handlerInputSelectValue('isActive', checked)}
          />
          <span>Активно</span>
          {formValue.isActive ? (
            <span style={{ color: '#52c41a', marginLeft: '8px' }}>
              ✔ Значение активно и доступно для выбора
            </span>
          ) : (
            <span>Значение неактивно и скрыто для пользователя</span>
          )}
        </>
      )}
    </Modal>
  )
}

export default React.memo(ProductAttributeModal)
