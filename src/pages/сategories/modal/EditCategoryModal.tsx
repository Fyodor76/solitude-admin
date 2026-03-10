import React from 'react'

import { InputCreateData, InputFormData } from '@/pages/сategories/Categories'
import { BaseCategoryTree } from '@/shared/lib/api/api-categories/types'
import { Modal, Select } from 'antd'

import './modal.scss'

interface EditCategoryModalProps {
  isOpen: boolean
  category: BaseCategoryTree
  mode: string
  valueEdit: InputFormData
  valueCreate: InputCreateData
  allCategories: BaseCategoryTree[]
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
  allCategories,
  onClose,
  onSaveEdit,
  onSaveCreate,
  setEditInput,
  setCreateInput,
  setMode,
}: EditCategoryModalProps) => {
  const isCreate = mode === 'create'
  const isEdit = mode === 'edit'
  const currentId = isEdit ? category?.id : undefined
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

  const checkCategory = (catId: string, allCategories: BaseCategoryTree[]) => {
    return allCategories.find(cat => cat.id === catId)
  }
  const checkChild = (categoryId: string, allCategories: BaseCategoryTree[]) => {
    let result: BaseCategoryTree[] = []
    const childCategories = allCategories.filter(cat => cat.entity?.parentId === categoryId)
    result = [...childCategories]
    childCategories.forEach(cat => {
      const children = checkChild(cat.id, allCategories)
      result = [...result, ...children]
    })
    return result
  }

  const filterSelect = (allCategories: BaseCategoryTree[], currentId?: string) => {
    if (!currentId) return allCategories
    const thisCategory = checkCategory(currentId, allCategories)
    if (thisCategory) {
      const childThisCategory = checkChild(thisCategory?.id, allCategories)
      const getChildIds = childThisCategory.map(el => el.id)
      const select = isEdit
        ? allCategories.filter(cat => cat.id !== thisCategory.id && !getChildIds.includes(cat.id))
        : allCategories
      return select
    } else {
      return null
    }
  }
  const select = filterSelect(allCategories, currentId)

  const handleInputChange = (field: keyof InputFormData) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value

      setEditInput(prev => {
        return {
          ...prev,
          [field]: field === 'parentId' && value === '' ? null : value,
        }
      })
    }
  }
  const handleSelectChange = (value: string, option?: any) => {
    setEditInput(prev => ({
      ...prev,
      parentId: value === '' ? null : value,
    }))
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
          <Select placeholder="Выберете родительскую категорию" onChange={handleSelectChange}>
            {select &&
              select.map(cat => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
          </Select>
          <span>id изображения</span>
          <input
            type="text"
            value={valueEdit.imageId || ''}
            onChange={handleInputChange('imageId')}
          />
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
