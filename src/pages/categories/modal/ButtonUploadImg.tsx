import React from 'react'

import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'
import { ImageUploadButton } from '@/shared/ui/image-upload'
import { message, UploadProps } from 'antd'

import { API_URL } from '@/app/constans/url'

import type { FormData } from '../types/type'

interface ButtonUploadImgProps {
  category: BaseCategoryTree
  isEdit: boolean
  setFormDataModal: React.Dispatch<React.SetStateAction<FormData>>
  setUploadImg: React.Dispatch<React.SetStateAction<imgUpload | null>>
  setImgError: React.Dispatch<React.SetStateAction<boolean>>
}

const ButtonUploadImg = ({
  category,
  isEdit,
  setFormDataModal,
  setUploadImg,
  setImgError,
}: ButtonUploadImgProps) => {
  const props: UploadProps = {
    name: 'file',
    action: `${API_URL}/cdn/upload`,
    data: {
      folder: '',
    },
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.fileList.length === 0) {
        setFormDataModal(prev => ({
          ...prev,
          imageId: null,
        }))
        setUploadImg(null)
        return
      }

      if (info.file.status === 'done') {
        setUploadImg(info.file.response?.data)
        if (isEdit) {
          setFormDataModal(prev => ({
            ...prev,
            imageId: info.file.response?.data.fileId || null,
          }))
        }

        setImgError(false)
        message.success(`${info.file.name} загружен`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} не удалось загрузить`)
      }
    },
  }

  return (
    <ImageUploadButton
      {...props}
      key={isEdit ? `edit-${category?.id}` : 'create'}
      buttonText="Загрузить"
    />
  )
}

export default ButtonUploadImg
