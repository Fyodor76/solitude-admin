import React, { useState } from 'react'

import { BaseCategoryTree } from '@/shared/lib/api/api-categories/types'
import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'
import { Modal, Select } from 'antd'

import { CDN_URL } from '@/app/constans/url'

import { InitialFormData } from '../const/constans'
import { mapFormToRequest } from '../mappers/categoryMappers'
import { FormData } from '../types/type'
import ButtonUploadImg from './ButtonUploadImg'
import './EditCategoryModal.scss'

interface EditCategoryModalProps {
  isOpen: boolean
  category: BaseCategoryTree
  value: FormData
  allCategories: BaseCategoryTree[]
  edit: string
  create: string
  mode: string
  setMode: React.Dispatch<React.SetStateAction<string>>
  onClose: () => void
  onSaveEdit: (id: string, data: FormData) => void
  onSaveCreate: (data: FormData) => void
  setFormDataModal: React.Dispatch<React.SetStateAction<FormData>>
}

const EditCategoryModal = ({
  isOpen,
  category,
  value,
  allCategories,
  edit,
  create,
  mode,
  setMode,
  onClose,
  onSaveEdit,
  onSaveCreate,
  setFormDataModal,
}: EditCategoryModalProps) => {
  const isCreate = mode === create
  const isEdit = mode === edit
  const currentId = isEdit ? category?.id : undefined

  const [cdnData, setCdnData] = useState<imgUpload | null>(null)
  const [imgError, setImgError] = useState(false)
  const handleImageError = () => {
    setImgError(true)
  }

  const imageUrl = isEdit && value.imageId ? `${CDN_URL}/${value.imageId}` : null
  const currentUrl = cdnData?.url || imageUrl

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

  const handleInputAndSelectChange = (field: keyof FormData) => {
    return (valueOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = typeof valueOrEvent === 'string' ? valueOrEvent : valueOrEvent.target.value

      setFormDataModal(prev => {
        return {
          ...prev,
          [field]: field === 'parentId' && value === '' ? null : value,
        }
      })
    }
  }

  const handleSaveEdit = () => {
    const updateData = mapFormToRequest(value, cdnData)
    onSaveEdit(category.id, updateData)
  }

  const handleSaveCreate = async () => {
    await onSaveCreate(value)
    setFormDataModal(InitialFormData)
  }

  const handleSave = async () => {
    try {
      if (isEdit) {
        await handleSaveEdit()
      } else {
        await handleSaveCreate()
      }
      setMode(edit)
      setCdnData(null)
      onClose()
    } catch (error) {
      console.error('Ошибка при сохранении:', error)
    }
  }

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      onOk={async () => {
        await handleSave()
      }}
      title={isEdit ? 'Редактировать категорию' : 'Создать новую категорию'}
    >
      <div className="editModal">
        <span>Название</span>
        <input type="text" value={value.name} onChange={handleInputAndSelectChange('name')} />
        <span>Описание</span>{' '}
        <input
          type="text"
          value={value.description}
          onChange={handleInputAndSelectChange('description')}
        />
        <span>Адрес</span>{' '}
        <input type="text" value={value.slug} onChange={handleInputAndSelectChange('slug')} />
        <span>Порядок сортировки</span>
        <input
          type="number"
          value={value.sortOrder}
          onChange={handleInputAndSelectChange('sortOrder')}
        />
        <Select
          value={value.parentId}
          placeholder="Выберете родительскую категорию"
          onChange={handleInputAndSelectChange('parentId')}
          allowClear
        >
          {select &&
            select.map(cat => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
        </Select>
        <span>Изображение категории</span>
        <ButtonUploadImg
          category={category}
          isEdit={isEdit}
          setFormDataModal={setFormDataModal}
          setCdnData={setCdnData}
          setImgError={setImgError}
        />
        {currentUrl && !imgError && (
          <>
            <img onError={handleImageError} src={currentUrl} />
          </>
        )}
        {isCreate && (
          <>
            <span>тип</span>
            <input type="text" value={value.type} onChange={handleInputAndSelectChange('type')} />
          </>
        )}
        {imgError && (
          <div
            style={{
              color: 'red',
              padding: '10px',
              border: '1px solid #ffccc7',
              background: '#fff2f0',
              marginTop: 10,
            }}
          >
            ⚠️ Изображение не найдено (тестовый режим)
          </div>
        )}
      </div>
    </Modal>
  )
}

export default EditCategoryModal
