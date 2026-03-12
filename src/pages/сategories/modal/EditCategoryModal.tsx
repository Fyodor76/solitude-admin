import React, { useState } from 'react'

import { CreateFormData, EditFormData } from '@/pages/сategories/Categories'
import { BaseCategoryTree } from '@/shared/lib/api/api-categories/types'
import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'
import { UploadOutlined } from '@ant-design/icons'
import { Button, message, Upload, UploadProps } from 'antd'
import { Modal, Select } from 'antd'

import './EditCategoryModal.scss'

interface EditCategoryModalProps {
  isOpen: boolean
  category: BaseCategoryTree
  valueEdit: EditFormData
  valueCreate: CreateFormData
  allCategories: BaseCategoryTree[]
  edit: string
  create: string
  mode: string
  setMode: React.Dispatch<React.SetStateAction<string>>
  onClose: () => void
  onSaveEdit: (id: string, data: EditFormData) => void
  onSaveCreate: (data: CreateFormData) => void
  setEditFormDataModal: React.Dispatch<React.SetStateAction<EditFormData>>
  setCreateFormDataModal: React.Dispatch<React.SetStateAction<CreateFormData>>
}

const EditCategoryModal = ({
  isOpen,
  category,
  valueEdit,
  valueCreate,
  allCategories,
  edit,
  create,
  mode,
  setMode,
  onClose,
  onSaveEdit,
  onSaveCreate,
  setEditFormDataModal,
  setCreateFormDataModal,
}: EditCategoryModalProps) => {
  const isCreate = mode === create
  const isEdit = mode === edit
  const currentId = isEdit ? category?.id : undefined

  const [cdnData, setCdnData] = useState<imgUpload | null>(null)
  const [imgError, setImgError] = useState(false)
  const handleImageError = () => {
    setImgError(true)
  }
  const API_URL = import.meta.env.VITE_API_URL
  const CDN_URL = import.meta.env.VITE_CDN_URL
  const imageUrl = isEdit && valueEdit.imageId ? `${CDN_URL}/${valueEdit.imageId}` : null
  const props: UploadProps = {
    name: 'file',
    action: `${API_URL}/cdn/upload`,
    data: {
      folder: 'products',
    },
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }

      if (info.fileList.length === 0) {
        if (isEdit) {
          setEditFormDataModal(prev => ({
            ...prev,
            imageId: null,
          }))
        } else {
          setCreateFormDataModal(prev => ({
            ...prev,
            imageId: null,
          }))
        }
        setCdnData(null)
        return
      }
      if (info.file.status === 'done') {
        setCdnData(info.file.response?.data)
        setImgError(false)
        message.success(`${info.file.name} Файл загружен successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }
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

  const handleInputAndSelectChange = (field: keyof EditFormData | keyof CreateFormData) => {
    return (valueOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = typeof valueOrEvent === 'string' ? valueOrEvent : valueOrEvent.target.value
      if (isEdit) {
        setEditFormDataModal(prev => {
          return {
            ...prev,
            [field]: field === 'parentId' && value === '' ? null : value,
          }
        })
      } else {
        setCreateFormDataModal(prev => {
          return {
            ...prev,
            [field]: value,
          }
        })
      }
    }
  }

  const handleSaveEdit = () => {
    const updateValueEdit = {
      ...valueEdit,
      imageId: cdnData?.fileId || valueEdit.imageId,
    }
    onSaveEdit(category.id, updateValueEdit)
  }

  const handleSaveCreate = () => {
    onSaveCreate(valueCreate)
  }

  const handleSave = () => {
    isEdit ? handleSaveEdit() : handleSaveCreate()
    setMode(edit)
    setCdnData(null)
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
        <span>Название</span>
        <input
          type="text"
          value={isEdit ? valueEdit.name : valueCreate.name}
          onChange={handleInputAndSelectChange('name')}
        />
        <span>Описание</span>{' '}
        <input
          type="text"
          value={isEdit ? valueEdit.description : valueCreate.description}
          onChange={handleInputAndSelectChange('description')}
        />
        <span>Адрес</span>{' '}
        <input
          type="text"
          value={isEdit ? valueEdit.slug : valueCreate.slug}
          onChange={handleInputAndSelectChange('slug')}
        />
        <span>Номер заказа</span>
        <input
          type="number"
          value={isEdit ? valueEdit.sortOrder : valueCreate.sortOrder}
          onChange={handleInputAndSelectChange('sortOrder')}
        />
        <Select
          value={isEdit ? valueEdit.parentId : valueCreate.parentId}
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
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Загрузить</Button>
        </Upload>
        {currentUrl && !imgError && (
          <>
            <img onError={handleImageError} src={currentUrl} />
          </>
        )}
        {isCreate && (
          <>
            <span>тип</span>
            <input
              type="text"
              value={valueCreate.type}
              onChange={handleInputAndSelectChange('type')}
            />
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
