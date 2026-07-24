import React from 'react'

import {
  AttributeValueRequest,
  ProductAttributeRequest,
} from '@/shared/lib/api/product-attributes/types'
import { ColorPicker, Input, Modal, Select, Switch } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import { typeOptions } from '../const/const'
import './ProductAttributeModal.scss'

interface ProductAttributeModalProp {
  formOption: ProductAttributeRequest
  isOpen: boolean
  isCreateOption: boolean
  selectedAttributeId: string | null
  formValue: AttributeValueRequest
  errors: {
    name?: string
    slug?: string
    type?: string
    sortOrder?: string
  }
  errorsValue: {
    value?: string
    displayName?: string
    hexCode?: string
  }
  validateForm: (field: keyof ProductAttributeRequest, value: any) => void
  validateValueForm: (field: keyof AttributeValueRequest, value: any) => void
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
  errors,
  errorsValue,
  validateForm,
  validateValueForm,
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
      className="product-attribute-modal"
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
          <span className="input-name">Название *</span>
          <Input
            value={formOption.name}
            placeholder="Введите название..."
            onChange={e => {
              handlerInputSelectOption('name', e.target.value)
              validateForm('name', e.target.value)
            }}
            status={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
          <span className="input-name">Slug *</span>
          <Input
            value={formOption.slug}
            placeholder="Введите slug"
            onChange={e => {
              handlerInputSelectOption('slug', e.target.value)
              validateForm('slug', e.target.value)
            }}
            status={errors.slug ? 'error' : ''}
          />
          {errors.slug && <span className="error-text">{errors.slug}</span>}
          <span className="hint">Только латинские буквы, цифры и дефисы</span>
          <span className="input-name">Тип *</span>
          <Select
            value={formOption.type}
            placeholder="Выберете тип опции"
            options={typeOptions}
            onChange={v => {
              handlerInputSelectOption('type', v)
            }}
          />

          <span className="input-name">Описание</span>
          <TextArea
            value={formOption.description}
            placeholder="Введите описание (необязательно)"
            onChange={e => handlerInputSelectOption('description', e.target.value)}
          />
          <span className="input-name">Порядок сортировки</span>
          <Input
            value={formOption.sortOrder}
            onChange={e => {
              handlerInputSelectOption('sortOrder', e.target.value)
              validateForm('sortOrder', e.target.value)
            }}
            status={errors.sortOrder ? 'error' : ''}
          />
          {errors.sortOrder && <span className="error-text">{errors.sortOrder}</span>}
          <span className="hint">Меньшее значение имеет больший преоритет</span>
        </>
      ) : (
        <>
          <span className="input-name">Значение (латиница) *</span>
          <Input
            value={formValue.value}
            placeholder="Введите значение"
            onChange={e => {
              handlerInputSelectValue('value', e.target.value)
              validateValueForm('value', e.target.value)
            }}
            status={errorsValue.value ? 'error' : ''}
          />
          {errorsValue.value && <span className="error-text">{errorsValue.value}</span>}
          <span className="input-name">Отображаемое имя *</span>
          <Input
            value={formValue.displayName}
            placeholder="Введите отображаемое имя"
            onChange={e => {
              handlerInputSelectValue('displayName', e.target.value)
              validateValueForm('displayName', e.target.value)
            }}
            status={errorsValue.displayName ? 'error' : ''}
          />
          {errorsValue.displayName && <span className="error-text">{errorsValue.displayName}</span>}

          <span className="input-name">HEX код цвета</span>
          <ColorPicker
            value={formValue.hexCode || '#000000'}
            onChange={(color, hex) => {
              validateValueForm('hexCode', hex)
            }}
            showText={color => <span>{color.toHexString().toUpperCase()}</span>}
            size="large"
          />
          {errorsValue.hexCode && <span className="error-text">{errorsValue.hexCode}</span>}
          <span className="hint">Выберете цвет или укажите HEX код</span>
          <span className="switch-and-text">
            <Switch
              checked={formValue.isActive === true}
              onChange={checked => handlerInputSelectValue('isActive', checked)}
              className="switch"
            />
            <span>Активно</span>
          </span>
          {formValue.isActive ? (
            <span className="hint">
              <span style={{ color: 'blue' }}>✔</span> Значение активно и доступно для выбора
            </span>
          ) : (
            <span className="hint">Значение неактивно и скрыто для пользователя</span>
          )}
        </>
      )}
    </Modal>
  )
}

export default React.memo(ProductAttributeModal)
