import React from 'react'

import { SizeChartRequest } from '@/shared/lib/api/size-charts/types'
import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'
import { UploadOutlined } from '@ant-design/icons'
import { Button, message, Upload, UploadProps } from 'antd'

import { API_URL } from '@/app/constans/url'

interface BtnUploadImgForSizeChartProps {
  isEdit: boolean
  formSizeChartCreate: SizeChartRequest
  setFormSizeChartCreate: React.Dispatch<React.SetStateAction<SizeChartRequest>>
  setUploadImg: React.Dispatch<React.SetStateAction<imgUpload | null>>
}

const BtnUploadImgForSizeChart = ({
  setFormSizeChartCreate,
  setUploadImg,
  formSizeChartCreate,
  isEdit,
}: BtnUploadImgForSizeChartProps) => {
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
        setFormSizeChartCreate(prev => ({
          ...prev,
          imageId: null,
        }))
        setUploadImg(null)
        return
      }
      if (info.file.status === 'done') {
        setUploadImg(info.file.response?.data)

        setFormSizeChartCreate(prev => ({
          ...prev,
          imageId: info.file.response?.data.fileId || null,
        }))

        message.success(`${info.file.name} Файл загружен successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }
  return (
    <Upload {...props} key={isEdit ? `edit-${formSizeChartCreate.id}` : 'create'}>
      <Button icon={<UploadOutlined />} className="btn-upload-img-size">
        Загрузить
      </Button>
    </Upload>
  )
}

export default BtnUploadImgForSizeChart
