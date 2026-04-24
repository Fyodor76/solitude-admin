import React, { useState } from 'react'

import { SizeChartRequest } from '@/shared/lib/api/size-charts/types'
import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'
import { Input, Modal } from 'antd'

import BtnUploadImgForSizeChart from './BtnUploadImgForSizeChart'

interface SizeChartModalProps {
  isOpen: boolean
  formSizeChartCreate: SizeChartRequest
  setFormSizeChartCreate: React.Dispatch<React.SetStateAction<SizeChartRequest>>
  saveAllChanges: (data: Partial<SizeChartRequest>) => Promise<void>
  onClose: () => void
}
const SizeChartModal = ({
  isOpen,
  formSizeChartCreate,
  onClose,
  setFormSizeChartCreate,
  saveAllChanges,
}: SizeChartModalProps) => {
  const [uploadImg, setUploadImg] = useState<imgUpload | null>(null)

  const handleInputChange = (field: keyof SizeChartRequest) => {
    return (value: string) => {
      setFormSizeChartCreate(prev => {
        return {
          ...prev,
          [field]: value,
        }
      })
    }
  }

  const onSave = () => {
    saveAllChanges(formSizeChartCreate)
    onClose()
  }

  return (
    <Modal className="sizeChartModal" open={isOpen} onCancel={onClose} onOk={onSave}>
      <span>Название</span>
      <Input
        type="text"
        id="size-chart-name"
        value={formSizeChartCreate.name}
        onChange={e => handleInputChange('name')(e.target.value)}
      ></Input>
      <span>Описание</span>
      <Input
        type="text"
        id="size-chart-description"
        value={formSizeChartCreate.description}
        onChange={e => handleInputChange('description')(e.target.value)}
      ></Input>
      <span>Замеры</span>
      <Input
        type="text"
        id="size-chart-metricsText"
        value={formSizeChartCreate.metricsText}
        onChange={e => handleInputChange('metricsText')(e.target.value)}
      ></Input>
      <BtnUploadImgForSizeChart
        setFormSizeChartCreate={setFormSizeChartCreate}
        setUploadImg={setUploadImg}
        formSizeChartCreate={formSizeChartCreate}
      />
    </Modal>
  )
}

export default SizeChartModal
