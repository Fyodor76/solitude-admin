import React from 'react'

import { InputCreateData, InputFormData } from '@/pages/сategories/Categories'
import { CategoryMenuItem } from '@/shared/lib/api/api-categories/types'
import { Modal } from 'antd'

import './modal.scss'

interface EditCategoryModalProps {
  isOpen: boolean
  category: CategoryMenuItem
  mode: string
  valueEdit: InputFormData
  valueCreate: InputCreateData
  onClose: () => void
  onSaveEdit: (id: string, data: InputFormData) => void
  onSaveCreate: () => void
  setEditInput: React.Dispatch<React.SetStateAction<InputFormData>>
  setCreateInput: React.Dispatch<React.SetStateAction<InputCreateData>>
  setMode: React.Dispatch<React.SetStateAction<string>>
}

const EditCategoryModal = ({
  isOpen,
  category,
  valueEdit,
  valueCreate,
  mode,
  onClose,
  onSaveEdit,
  onSaveCreate,
  setEditInput,
  setCreateInput,
  setMode,
}: EditCategoryModalProps) => {
  const isCreate = mode === 'create'
  const isEdit = mode === 'edit'

  const handleInputCreateChange = (field: keyof InputCreateData) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target
      const value = target.value
      setCreateInput(prev => {
        return {
          ...prev,
          [field]: value,
        }
      })
    }
  }

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

  const handleSaveEdit = () => {
    onSaveEdit(category.id, valueEdit)
  }

  const handleSaveCreate = () => {
    onSaveCreate()
  }

  const handleSave = () => {
    isEdit ? handleSaveEdit() : handleSaveCreate()
    setMode('edit')
    onClose()
  }
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      onOk={() => handleSave()}
      title="Редактировать категорию"
    >
      {isEdit && (
        <div className="editModal">
          <span>название</span>
          <input type="text" value={valueEdit.name} onChange={handleInputChange('name')} />
          <span>описание</span>{' '}
          <input
            type="text"
            value={valueEdit.description}
            onChange={handleInputChange('description')}
          />
          <span>url</span>{' '}
          <input type="text" value={valueEdit.slug} onChange={handleInputChange('slug')} />
          <span>номер заказа</span>
          <input
            type="number"
            value={valueEdit.sortOrder}
            onChange={handleInputChange('sortOrder')}
          />
          <span>родительская категория</span>
          <input
            type="text"
            value={valueEdit.parentId || ''}
            onChange={handleInputChange('parentId')}
          />
          <span>id изображения</span>
          <input
            type="text"
            value={valueEdit.imageId || ''}
            onChange={handleInputChange('imageId')}
          />
          {/* <span>активизация</span>*/}
          {/*<input type="checkbox" checked={value.isActive} onChange={handleInputChange('isActive')} />*/}
        </div>
      )}
      {isCreate && (
        <div className="editModal">
          <span>название</span>
          <input type="text" value={valueCreate.name} onChange={handleInputCreateChange('name')} />
          <span>url</span>{' '}
          <input type="text" value={valueCreate.slug} onChange={handleInputCreateChange('slug')} />
          <span>описание</span>{' '}
          <input
            type="text"
            value={valueCreate.description}
            onChange={handleInputCreateChange('description')}
          />
          <span>родительская категория</span>
          <input
            type="text"
            value={valueCreate.parentId || ''}
            onChange={handleInputCreateChange('parentId')}
          />
          <span>id изображения</span>
          <input
            type="text"
            value={valueCreate.imageId || ''}
            onChange={handleInputCreateChange('imageId')}
          />
          <span>тип</span>
          <input
            type="text"
            value={valueCreate.type}
            onChange={handleInputCreateChange('imageId')}
          />
        </div>
      )}
    </Modal>
  )
}

export default EditCategoryModal
