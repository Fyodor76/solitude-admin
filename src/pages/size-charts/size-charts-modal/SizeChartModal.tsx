import React, { useEffect, useState } from 'react'

import { ApiResponse } from '@/shared/lib/api/baseApi'
import { SizeChartRequest } from '@/shared/lib/api/size-charts/types'
import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'
import UniversalUploadButton from '@/shared/ui/upload-image-btn/UniversalUploadButton'
import { Input, message, Modal } from 'antd'

import { MODES } from '../../categories/const/constans'
import './SizeChartsModal.scss'

interface SizeChartModalProps {
  isOpen: boolean
  isCreated: boolean
  isEdit: boolean
  uploadImg: imgUpload | null
  formSizeChart: SizeChartRequest
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
    <div className="sizeChartModal">
      <Modal open={isOpen} onCancel={onClose} onOk={onSave}>
        <span>Название</span>
        <Input
          type="text"
          placeholder="Введите название таблицы (например: Мужские футболки)"
          id="size-chart-name"
          value={formSizeChart.name}
          onChange={e => handleInputChange('name', e.target.value)}
        ></Input>
        <span>Описание</span>
        <Input
          type="text"
          placeholder="Введите описание таблицы (необязательно)"
          id="size-chart-description"
          value={formSizeChart.description}
          onChange={e => handleInputChange('description', e.target.value)}
        ></Input>
        <span>Замеры</span>
        <Input
          type="text"
          placeholder="A - длина изделия, B - обхват груди, C - длина рукава"
          id="size-chart-metricsText"
          value={formSizeChart.metricsText}
          onChange={e => handleInputChange('metricsText', e.target.value)}
        ></Input>
        <span>Тип</span>
        <Input
          type="text"
          placeholder="Например: футболка, свитшот, платье"
          id="size-chart-productType"
          value={formSizeChart.productType}
          onChange={e => handleInputChange('productType', e.target.value)}
        ></Input>

        <UniversalUploadButton
          folder=""
          buttonText="Загрузить изображение"
          buttonClassName="btn-upload-img-size"
          key={isEdit ? `edit-${formSizeChart.id}` : 'create'}
          onFileRemoved={() => {
            setUploadImg(null)
            setFormSizeChart(prev => ({ ...prev, imageId: null }))
          }}
          onFileUploaded={(fileId, fileData) => {
            setUploadImg(fileData)

            setFormSizeChart(prev => ({
              ...prev,
              imageId: fileId || null,
            }))
            message.success('Файл загружен')
          }}
        />
        {currentUrl ? (
          <img className="imgSizeChart" src={currentUrl} alt="Category preview"></img>
        ) : (
          <img className="imgSizeChart" src="/visily-image.png" alt="Category preview"></img>
        )}
      </Modal>
    </div>
  )
}

export default SizeChartModal
