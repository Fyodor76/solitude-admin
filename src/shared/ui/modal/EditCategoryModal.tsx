import React from 'react'

import { InputFormData } from '@/pages/сategories/Categories'
import { CategoryMenuItem } from '@/shared/lib/api/api-categories/types'
import { Modal } from 'antd'

import './modal.scss'

interface EditCategoryModalProps {
  isOpen: boolean
  category: CategoryMenuItem
  onClose: () => void
  value: InputFormData
  onSave: (id: string, data: InputFormData) => void
  setEditInput: React.Dispatch<React.SetStateAction<InputFormData>>
}

const EditCategoryModal = ({
  isOpen,
  category,
  value,
  onClose,
  onSave,
  setEditInput,
}: EditCategoryModalProps) => {
  const handleInputChange = (field: keyof InputFormData) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target
      const value =
        target instanceof HTMLInputElement && target.type === 'checkbox'
          ? target.checked
          : target.value
      setEditInput(prev => {
        return {
          ...prev,
          [field]: value,
        }
      })
    }
  }
  const handleSave = () => {
    onSave(category.id, value)
    onClose()
  }
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      onOk={() => handleSave()}
      title="Редактировать категорию"
    >
      <div className="editModal">
        <span>название</span>
        <input type="text" value={value.name} onChange={handleInputChange('name')} />
        <span>описание</span>{' '}
        <input type="text" value={value.description} onChange={handleInputChange('description')} />
        <span>url</span>{' '}
        <input type="text" value={value.slug} onChange={handleInputChange('slug')} />
        <span>номер заказа</span>
        <input type="number" value={value.sortOrder} onChange={handleInputChange('sortOrder')} />
        <span>родительская категория</span>
        <input type="text" value={value.parentId || ''} onChange={handleInputChange('parentId')} />
        <span>активизация</span>
        {/*<input type="checkbox" checked={value.isActive} onChange={handleInputChange('isActive')} />*/}
      </div>
    </Modal>
  )
}

export default EditCategoryModal
