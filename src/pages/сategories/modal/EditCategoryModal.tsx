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

  const [uploadImg, setUploadImg] = useState<imgUpload | null>(null)
  const [imgError, setImgError] = useState(false)
  const handleImageError = () => {
    setImgError(true)
  }

  const imageUrl = isEdit && value.imageId ? `${CDN_URL}/${value.imageId}` : null
  const currentUrl = uploadImg?.url || imageUrl
  const handleClose = () => {
    setUploadImg(null)
    setImgError(false)
    onClose()
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

  const handleStringAndSelectChange = (field: keyof FormData) => {
    return (
      valueOrEvent: string | null | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      if (valueOrEvent === null) {
        setFormDataModal(prev => ({
          ...prev,
          [field]: null,
        }))
        return
      }
      let value = typeof valueOrEvent === 'string' ? valueOrEvent : valueOrEvent.target.value

      setFormDataModal(prev => {
        return {
          ...prev,
          [field]: field === 'parentId' && value === '' ? null : value,
        }
      })
    }
  }

  const handleNumberChange = (field: keyof FormData) => {
    return (value: React.ChangeEvent<HTMLInputElement>) => {
      let stringValue = value.target.value
      let numValue = parseInt(stringValue, 10)

      if (isNaN(numValue) || numValue < 0) {
        numValue = 0
      }

      setFormDataModal(prev => {
        return {
          ...prev,
          [field]: numValue,
        }
      })
    }
  }

  const handleSaveEdit = () => {
    const updateData = mapFormToRequest(value, uploadImg)
    onSaveEdit(category.id, updateData)
  }

  const handleSaveCreate = async () => {
    const createData = mapFormToRequest(value, uploadImg)
    await onSaveCreate(createData)
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
      setUploadImg(null)
      onClose()
    } catch (error) {
      console.error('Ошибка при сохранении:', error)
    }
  }

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      onOk={async () => {
        await handleSave()
      }}
      title={isEdit ? 'Редактировать категорию' : 'Создать новую категорию'}
    >
      <div className="editModal">
        <span>Название</span>
        <input type="text" value={value.name} onChange={handleStringAndSelectChange('name')} />
        <span>Описание</span>{' '}
        <input
          type="text"
          value={value.description}
          onChange={handleStringAndSelectChange('description')}
        />
        <span>Порядок сортировки</span>
        <input
          type="number"
          value={value.sortOrder}
          onChange={handleNumberChange('sortOrder')}
          min="0"
          step="1"
        />
        <Select
          value={value.parentId}
          placeholder="Выберете родительскую категорию"
          onChange={handleStringAndSelectChange('parentId')}
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
          setUploadImg={setUploadImg}
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
            <input type="text" value={value.type} onChange={handleStringAndSelectChange('type')} />
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
