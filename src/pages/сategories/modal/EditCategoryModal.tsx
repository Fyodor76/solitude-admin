import React, { useState } from 'react'

import { CreateFormData, EditFormData } from '@/pages/сategories/Categories'
import { BaseCategoryTree } from '@/shared/lib/api/api-categories/types'
import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'
import { UploadOutlined } from '@ant-design/icons'
import { Button, message, Upload, UploadProps } from 'antd'
import { Modal, Select } from 'antd'

import './modal.scss'

interface EditCategoryModalProps {
  isOpen: boolean
  category: BaseCategoryTree
  mode: string
  valueEdit: EditFormData
  valueCreate: CreateFormData
  allCategories: BaseCategoryTree[]
  onClose: () => void
  onSaveEdit: (id: string, data: EditFormData) => void
  onSaveCreate: () => void
  setEditFormDataModal: React.Dispatch<React.SetStateAction<EditFormData>>
  setCreateFormDataModal: React.Dispatch<React.SetStateAction<CreateFormData>>
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
  setEditFormDataModal,
  setCreateFormDataModal,
  setMode,
}: EditCategoryModalProps) => {
  const isCreate = mode === 'create'
  const isEdit = mode === 'edit'
  const currentId = isEdit ? category?.id : undefined

  const [cdnData, setCdnData] = useState<imgUpload | null>(null)
  console.log(cdnData)
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

      if (info.file.status === 'done') {
        setCdnData(info.file.response?.data)

        message.success(`${info.file.name} Файл загружен successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }
  const currentUrl = cdnData?.url || imageUrl
  const handleInputCreateChange = (field: keyof CreateFormData) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target
      const value = target.value
      setCreateFormDataModal(prev => {
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

  const handleInputChange = (field: keyof EditFormData) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value

      setEditFormDataModal(prev => {
        return {
          ...prev,
          [field]: field === 'parentId' && value === '' ? null : value,
        }
      })
    }
  }
  const handleSelectChange = (value: string, option?: any) => {
    setEditFormDataModal(prev => ({
      ...prev,
      parentId: value === '' ? null : value,
    }))
  }

  const handleSaveEdit = () => {
    const updateValueEdit = {
      ...valueEdit,
      imageId: cdnData?.fileId || valueEdit.imageId,
    }
    onSaveEdit(category.id, updateValueEdit)
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
          <span>Изображение категории</span>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Загрузить</Button>
          </Upload>
          {currentUrl && (
            <>
              <img src={currentUrl} />
            </>
          )}
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
          <span>Изображение категории</span>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Загрузить</Button>
          </Upload>
          {cdnData && <img src={cdnData.url} />}
          <span>тип</span>
          <input type="text" value={valueCreate.type} onChange={handleInputCreateChange('type')} />
        </div>
      )}
    </Modal>
  )
}

export default EditCategoryModal
