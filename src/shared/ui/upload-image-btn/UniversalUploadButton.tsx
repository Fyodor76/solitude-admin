import React from 'react'

import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload } from 'antd'

import { API_URL } from '@/app/constans/url'

interface UseUploadImg {
  folder: string
  buttonText?: string
  buttonClassName?: string
  keyValue?: string
  onFileUploaded: (fileId: string, fileData: any) => void
  onFileRemoved: () => void
  onFileError?: (error: any) => void
}

const UniversalUploadButton = ({
  folder,
  keyValue,
  onFileUploaded,
  onFileRemoved,
  onFileError,
  buttonText,
  buttonClassName,
}: UseUploadImg) => {
  const uploadProps = {
    name: 'file',
    action: `${API_URL}/cdn/upload`,
    data: { folder },
    headers: {
      authorization: 'authorization-text',
    },
    onChange: (info: any) => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.fileList.length === 0) {
        onFileRemoved()
        return
      }
      if (info.file.status === 'done') {
        const fileId = info.file.response?.data?.fileId
        const fileData = info.file.response?.data
        onFileUploaded(fileId, fileData)
      }
      if (info.file.status === 'error') {
        onFileError?.(info.file.error)
      }
    },
  }
  return (
    <Upload key={keyValue} {...uploadProps}>
      <Button icon={<UploadOutlined />} className={buttonClassName}>
        {buttonText}
      </Button>
    </Upload>
  )
}

export default UniversalUploadButton
