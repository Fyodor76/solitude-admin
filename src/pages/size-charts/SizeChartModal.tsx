import React, { useState } from 'react'

import { ApiResponse } from '@/shared/lib/api/baseApi'
import { SizeChartRequest } from '@/shared/lib/api/size-charts/types'
import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'
import { Input, Modal } from 'antd'

import { MODES } from '../categories/const/constans'
import BtnUploadImgForSizeChart from './BtnUploadImgForSizeChart'

interface SizeChartModalProps {
  isOpen: boolean
  isCreated: boolean
  isEdit: boolean
  uploadImg: imgUpload | null
  formSizeChartCreate: SizeChartRequest
  mode: string
  imageUrl: string | null
  setUploadImg: React.Dispatch<React.SetStateAction<imgUpload | null>>
  setModes: React.Dispatch<React.SetStateAction<string>>
  setFormSizeChartCreate: React.Dispatch<React.SetStateAction<SizeChartRequest>>
  saveAllChanges: (data: Partial<SizeChartRequest>) => Promise<void>
  onClose: () => void
  createNewSizeChart: (data: SizeChartRequest) => Promise<ApiResponse<SizeChartRequest, any>>
}
const SizeChartModal = ({
  isOpen,
  formSizeChartCreate,
  mode,
  isEdit,
  isCreated,
  uploadImg,
  imageUrl,
  setUploadImg,
  setModes,
  onClose,
  setFormSizeChartCreate,
  saveAllChanges,
  createNewSizeChart,
}: SizeChartModalProps) => {
  const currentUrl = uploadImg?.url || imageUrl

  const handleInputChange = (name: keyof SizeChartRequest, value: string | number) => {
    setFormSizeChartCreate(prev => {
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const onSave = async () => {
    try {
      if (isEdit) {
        await saveAllChanges(formSizeChartCreate)
      } else {
        await createNewSizeChart(formSizeChartCreate)
      }
      setModes(MODES.EDIT)
      onClose()
    } catch (error) {
      console.error('Ошибка сохранения:', error)
    }
  }

  return (
    <Modal className="sizeChartModal" open={isOpen} onCancel={onClose} onOk={onSave}>
      <span>Название</span>
      <Input
        type="text"
        id="size-chart-name"
        value={formSizeChartCreate.name}
        onChange={e => handleInputChange('name', e.target.value)}
      ></Input>
      <span>Описание</span>
      <Input
        type="text"
        id="size-chart-description"
        value={formSizeChartCreate.description}
        onChange={e => handleInputChange('description', e.target.value)}
      ></Input>
      <span>Замеры</span>
      <Input
        type="text"
        id="size-chart-metricsText"
        value={formSizeChartCreate.metricsText}
        onChange={e => handleInputChange('metricsText', e.target.value)}
      ></Input>
      <span>Тип</span>
      <Input
        type="text"
        id="size-chart-productType"
        value={formSizeChartCreate.productType}
        onChange={e => handleInputChange('productType', e.target.value)}
      ></Input>
      <BtnUploadImgForSizeChart
        setFormSizeChartCreate={setFormSizeChartCreate}
        setUploadImg={setUploadImg}
        formSizeChartCreate={formSizeChartCreate}
        isEdit={isEdit}
      />
      {currentUrl && <img className="imgSizeChart" src={currentUrl} alt="Category preview"></img>}
    </Modal>
  )
}

export default SizeChartModal
