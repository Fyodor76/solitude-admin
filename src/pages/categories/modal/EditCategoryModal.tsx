import React, { useState } from 'react'

import { BaseCategoryTree, CategoryRequest } from '@/shared/lib/api/categories/types'
import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'
import UniversalUploadButton from '@/shared/ui/upload-image-btn/UniversalUploadButton'
import { Form, Input, message, Modal, Select } from 'antd'

import { CDN_URL } from '@/app/constans/url'

import { CategoryType, InitialFormData } from '../const/constans'
import { mapFormToRequest } from '../mappers/categoryMappers'
import { FormData } from '../types/type'
import './EditCategoryModal.scss'

const CATEGORY_VISIBILITY_OPTIONS = [
  { value: 'visible', label: 'На сайте' },
  { value: 'hidden', label: 'Скрыта' },
] as const

interface EditCategoryModalProps {
  isOpen: boolean
  category: BaseCategoryTree
  value: FormData
  allCategories: BaseCategoryTree[]
  edit: string
  create: string
  mode: string
  categoryTypeOptions: { value: CategoryType; label: string }[]
  setMode: React.Dispatch<React.SetStateAction<string>>
  onClose: () => void
  onSaveEdit: (id: string, data: CategoryRequest) => void
  onSaveCreate: (data: CategoryRequest) => void
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
  categoryTypeOptions,
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

  const imageUrl = isEdit && value.imageId ? `${CDN_URL}/${value.imageId}` : null
  const currentUrl = uploadImg?.url || imageUrl

  const handleClose = () => {
    setUploadImg(null)
    setImgError(false)
    onClose()
  }

  const checkCategory = (catId: string, categories: BaseCategoryTree[]) => {
    return categories.find(cat => cat.id === catId)
  }

  const checkChild = (categoryId: string, categories: BaseCategoryTree[]) => {
    let result: BaseCategoryTree[] = []
    const childCategories = categories.filter(
      cat => (cat.parentId ?? cat.entity?.parentId) === categoryId
    )
    result = [...childCategories]
    childCategories.forEach(cat => {
      result = [...result, ...checkChild(cat.id, categories)]
    })
    return result
  }

  const filterSelect = (categories: BaseCategoryTree[], id?: string) => {
    if (!id) return categories
    const thisCategory = checkCategory(id, categories)
    if (!thisCategory) return categories

    const childIds = checkChild(thisCategory.id, categories).map(el => el.id)

    return isEdit
      ? categories.filter(cat => cat.id !== thisCategory.id && !childIds.includes(cat.id))
      : categories
  }

  const parentOptions = filterSelect(allCategories, currentId)

  const handleStringAndSelectChange = (field: keyof FormData) => {
    return (
      valueOrEvent: string | null | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      if (valueOrEvent === null) {
        setFormDataModal(prev => ({ ...prev, [field]: null }))
        return
      }

      const nextValue = typeof valueOrEvent === 'string' ? valueOrEvent : valueOrEvent.target.value

      setFormDataModal(prev => ({
        ...prev,
        [field]: field === 'parentId' && nextValue === '' ? null : nextValue,
      }))
    }
  }

  const handleSave = async () => {
    try {
      const payload = mapFormToRequest(value, uploadImg)

      if (isEdit) {
        onSaveEdit(category.id, payload)
      } else {
        await onSaveCreate(payload)
        setFormDataModal(InitialFormData)
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
      className="category-edit-modal"
      open={isOpen}
      width={400}
      centered
      destroyOnClose
      okText="Сохранить"
      cancelText="Отмена"
      onCancel={handleClose}
      onOk={handleSave}
      title={isEdit ? 'Редактировать категорию' : 'Новая категория'}
    >
      <Form
        layout="vertical"
        colon={false}
        requiredMark={false}
        className="category-edit-modal__form"
      >
        <Form.Item label="Название">
          <Input
            placeholder="Футболки"
            value={value.name}
            onChange={handleStringAndSelectChange('name')}
          />
        </Form.Item>

        <Form.Item label="Описание">
          <Input
            placeholder="Необязательно"
            value={value.description}
            onChange={handleStringAndSelectChange('description')}
          />
        </Form.Item>

        <div className="category-edit-modal__row">
          <Form.Item label="Порядок" extra="меньше — выше">
            <Input
              type="number"
              placeholder="0"
              value={value.sortOrder}
              onChange={event => {
                const num = parseInt(event.target.value, 10)
                setFormDataModal(prev => ({
                  ...prev,
                  sortOrder: Number.isNaN(num) || num < 0 ? 0 : num,
                }))
              }}
              min={0}
            />
          </Form.Item>

          <Form.Item label="Витрина">
            <Select
              value={value.isActive ? 'visible' : 'hidden'}
              options={[...CATEGORY_VISIBILITY_OPTIONS]}
              onChange={visibility =>
                setFormDataModal(prev => ({
                  ...prev,
                  isActive: visibility === 'visible',
                }))
              }
            />
          </Form.Item>
        </div>

        <Form.Item label="Родитель">
          <Select
            value={value.parentId}
            placeholder="Корневая"
            allowClear
            showSearch={{
              filterOption: (input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase()),
            }}
            onChange={handleStringAndSelectChange('parentId')}
            options={parentOptions.map(cat => ({
              value: cat.id,
              label: cat.name,
            }))}
          />
        </Form.Item>

        {isCreate ? (
          <Form.Item label="Тип">
            <Select
              value={value.type || categoryTypeOptions[0]?.value}
              onChange={handleStringAndSelectChange('type')}
              options={categoryTypeOptions.map(option => ({
                value: option.value,
                label: option.label,
              }))}
            />
          </Form.Item>
        ) : null}

        <Form.Item label="Изображение">
          <UniversalUploadButton
            folder=""
            key={isEdit ? `edit-${category?.id}` : 'create'}
            buttonClassName="category-edit-modal__upload"
            buttonText="Загрузить"
            onFileRemoved={() => {
              setFormDataModal(prev => ({ ...prev, imageId: null }))
              setUploadImg(null)
              setImgError(true)
            }}
            onFileUploaded={(fileId, fileData) => {
              setUploadImg(fileData)
              if (isEdit) {
                setFormDataModal(prev => ({ ...prev, imageId: fileId || null }))
              }
              setImgError(false)
            }}
            onFileError={() => message.error('Ошибка загрузки')}
          />
          {currentUrl && !imgError ? (
            <img
              className="category-edit-modal__preview"
              src={currentUrl}
              alt=""
              onError={() => setImgError(true)}
            />
          ) : null}
          {imgError ? <div className="category-edit-modal__img-error">Нет изображения</div> : null}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditCategoryModal
