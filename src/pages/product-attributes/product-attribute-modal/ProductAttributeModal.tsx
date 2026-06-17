import React from 'react'

import { ProductAttributeRequest } from '@/shared/lib/api/product-attributes/types'
import { Input, Modal, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import { typeOptions } from '../const/const'

interface ProductAttributeModalProp {
  formOption: ProductAttributeRequest
  isOpen: boolean
  isCreate: boolean
  selectedAttributeId: string | null
  onClose: () => void
  setFormOption: React.Dispatch<React.SetStateAction<ProductAttributeRequest>>
  onSaveCreated: () => Promise<void>
  onSaveEdited: (data: Partial<ProductAttributeRequest>, id: string) => Promise<void>
}
const ProductAttributeModal = ({
  formOption,
  isOpen,
  isCreate,
  selectedAttributeId,
  onClose,
  setFormOption,
  onSaveCreated,
  onSaveEdited,
}: ProductAttributeModalProp) => {
  const handlerSelect = (failed: keyof ProductAttributeRequest, value: any) => {
    setFormOption({
      ...formOption,
      [failed]: value,
    })
  }

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      onOk={async () => {
        if (isCreate) {
          await onSaveCreated()
        } else {
          if (!selectedAttributeId) return
          await onSaveEdited(formOption, selectedAttributeId)
        }
      }}
      title={isCreate ? 'Создать опцию' : 'Редактировать опцию'}
    >
      <span>Название *</span>
      <Input
        value={formOption.name}
        placeholder="Введите название..."
        onChange={e => handlerSelect('name', e.target.value)}
      />
      <span>Slug *</span>
      <Input
        value={formOption.slug}
        placeholder="Введите slug"
        onChange={e => handlerSelect('slug', e.target.value)}
      />
      <span>Только латинские буквы, цифры и дефисы</span>
      <span>Тип *</span>
      <Select
        value={formOption.type}
        placeholder="Выберете тип опции"
        options={typeOptions}
        onChange={v => handlerSelect('type', v)}
      />
      <span>Описание</span>
      <TextArea
        value={formOption.description}
        placeholder="Введите описание (необязательно)"
        onChange={e => handlerSelect('description', e.target.value)}
      />
      <span>Порядок сортировки</span>
      <Input
        value={formOption.sortOrder}
        onChange={e => handlerSelect('sortOrder', e.target.value)}
      />
      <span>Меньшее значение имеет больший преоритет</span>
    </Modal>
  )
}

export default React.memo(ProductAttributeModal)
