import React, { useState } from 'react'

import { BaseCategoryTree, CategoryRequest } from '@/shared/lib/api/categories/types'
import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'
import UniversalUploadButton from '@/shared/ui/upload-image-btn/UniversalUploadButton'
import { Input, message, Modal, Select } from 'antd'

import { CDN_URL } from '@/app/constans/url'

import { CategoryType, InitialFormData } from '../const/constans'
import { mapFormToRequest } from '../mappers/categoryMappers'
import { FormData } from '../types/type'
import './EditCategoryModal.scss'

const CATEGORY_VISIBILITY_OPTIONS = [
  { value: 'visible', label: 'Показывается на сайте' },
  { value: 'hidden', label: 'Скрыта с сайта' },
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

type EditModalFieldProps = {
  label: string
  hint?: string
  htmlFor?: string
  children: React.ReactNode
}

function EditModalField({ label, hint, htmlFor, children }: EditModalFieldProps) {
  return (
    <div className="editModal-field">
      <label className="editModal-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint ? <span className="editModal-hint">{hint}</span> : null}
    </div>
  )
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
      let nextValue = typeof valueOrEvent === 'string' ? valueOrEvent : valueOrEvent.target.value

      setFormDataModal(prev => {
        return {
          ...prev,
          [field]: field === 'parentId' && nextValue === '' ? null : nextValue,
        }
      })
    }
  }

  const handleNumberChange = (field: keyof FormData) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      let stringValue = event.target.value
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
      className="categoryModal"
      open={isOpen}
      width={560}
      centered
      destroyOnClose
      okText="Сохранить"
      cancelText="Отмена"
      onCancel={handleClose}
      onOk={handleSave}
      title={
        <span className="mainTitle">
          {isEdit ? 'Редактировать категорию' : 'Создать новую категорию'}
        </span>
      }
    >
      <div className="editModal">
        <EditModalField label="Название" htmlFor="category-name">
          <Input
            id="category-name"
            size="large"
            placeholder="Например, Футболки"
            value={value.name}
            onChange={handleStringAndSelectChange('name')}
          />
        </EditModalField>

        <EditModalField label="Описание" htmlFor="category-description">
          <Input
            id="category-description"
            size="large"
            placeholder="Краткое описание для админки (необязательно)"
            value={value.description}
            onChange={handleStringAndSelectChange('description')}
          />
        </EditModalField>

        <EditModalField
          label="Порядок сортировки"
          htmlFor="category-sort-order"
          hint="Меньшее число — выше в списке"
        >
          <Input
            id="category-sort-order"
            size="large"
            type="number"
            placeholder="0"
            value={value.sortOrder}
            onChange={handleNumberChange('sortOrder')}
            min={0}
            step={1}
          />
        </EditModalField>

        <EditModalField label="Видимость на сайте">
          <Select
            size="large"
            className="editModal-control"
            value={value.isActive ? 'visible' : 'hidden'}
            options={[...CATEGORY_VISIBILITY_OPTIONS]}
            onChange={visibility =>
              setFormDataModal(prev => ({
                ...prev,
                isActive: visibility === 'visible',
              }))
            }
          />
        </EditModalField>

        <EditModalField label="Родительская категория">
          <Select
            size="large"
            className="editModal-control"
            id="category-parent"
            value={value.parentId}
            placeholder="Без родителя — корневая категория"
            onChange={handleStringAndSelectChange('parentId')}
            allowClear
            getPopupContainer={trigger => trigger.parentNode}
            placement="bottomLeft"
            showSearch={{
              filterOption: (input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase()),
            }}
            options={
              select?.map(cat => ({
                value: cat.id,
                label: cat.name,
              })) ?? []
            }
          />
        </EditModalField>

        {isCreate ? (
          <EditModalField label="Тип">
            <Select
              size="large"
              className="editModal-control"
              placeholder="Выберите тип"
              value={value.type || categoryTypeOptions[0]?.value}
              onChange={handleStringAndSelectChange('type')}
              options={categoryTypeOptions.map(option => ({
                value: option.value,
                label: option.label,
              }))}
            />
          </EditModalField>
        ) : null}

        <EditModalField label="Изображение категории">
          <UniversalUploadButton
            folder=""
            key={isEdit ? `edit-${category?.id}` : 'create'}
            buttonClassName="editModal-upload-btn"
            buttonText="Загрузить изображение"
            onFileRemoved={() => {
              setFormDataModal(prev => ({
                ...prev,
                imageId: null,
              }))
              setUploadImg(null)
              setImgError(true)
              message.info('Файл удален')
            }}
            onFileUploaded={(fileId, fileData) => {
              setUploadImg(fileData)
              if (isEdit) {
                setFormDataModal(prev => ({
                  ...prev,
                  imageId: fileId || null,
                }))
              }

              setImgError(false)
              message.success('Файл загружен')
            }}
            onFileError={() => {
              message.error('Ошибка загрузки файла.')
            }}
          />
          {currentUrl && !imgError ? (
            <img
              className="editModal-preview"
              onError={handleImageError}
              src={currentUrl}
              alt="Превью категории"
            />
          ) : null}
          {imgError ? <div className="editModal-img-error">Изображение не найдено</div> : null}
        </EditModalField>
      </div>
    </Modal>
  )
}

export default EditCategoryModal
