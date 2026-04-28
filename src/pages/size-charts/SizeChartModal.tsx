import React from 'react'

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
  formSizeChart: SizeChartRequest
  // mode: string
  imageUrl: string | null
  setUploadImg: React.Dispatch<React.SetStateAction<imgUpload | null>>
  setModes: React.Dispatch<React.SetStateAction<string>>
  setFormSizeChart: React.Dispatch<React.SetStateAction<SizeChartRequest>>
  saveAllChanges: (data: Partial<SizeChartRequest>) => Promise<void>
  onClose: () => void
  createNewSizeChart: (data: SizeChartRequest) => Promise<ApiResponse<SizeChartRequest, any>>
}
const SizeChartModal = ({
  isOpen,
  formSizeChart,
  isEdit,
  isCreated,
  uploadImg,
  imageUrl,
  setUploadImg,
  setModes,
  onClose,
  setFormSizeChart,
  saveAllChanges,
  createNewSizeChart,
}: SizeChartModalProps) => {
  const currentUrl = uploadImg?.url || imageUrl

  const handleInputChange = (name: keyof SizeChartRequest, value: string | number) => {
    setFormSizeChart(prev => {
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const onSave = async () => {
    try {
      if (isEdit) {
        await saveAllChanges(formSizeChart)
      } else {
        await createNewSizeChart(formSizeChart)
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
        value={formSizeChart.name}
        onChange={e => handleInputChange('name', e.target.value)}
      ></Input>
      <span>Описание</span>
      <Input
        type="text"
        id="size-chart-description"
        value={formSizeChart.description}
        onChange={e => handleInputChange('description', e.target.value)}
      ></Input>
      <span>Замеры</span>
      <Input
        type="text"
        id="size-chart-metricsText"
        value={formSizeChart.metricsText}
        onChange={e => handleInputChange('metricsText', e.target.value)}
      ></Input>
      <span>Тип</span>
      <Input
        type="text"
        id="size-chart-productType"
        value={formSizeChart.productType}
        onChange={e => handleInputChange('productType', e.target.value)}
      ></Input>
      <BtnUploadImgForSizeChart
        setFormSizeChartCreate={setFormSizeChart}
        setUploadImg={setUploadImg}
        formSizeChartCreate={formSizeChart}
        isEdit={isEdit}
      />
      {currentUrl && <img className="imgSizeChart" src={currentUrl} alt="Category preview"></img>}
    </Modal>
  )
}

export default SizeChartModal
