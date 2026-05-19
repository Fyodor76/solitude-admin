import React from 'react'

import { SizeChartRequest } from '@/shared/lib/api/size-charts/types'
import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'
import Icon from '@/shared/ui/icons/Icon'
import UniversalUploadButton from '@/shared/ui/upload-image-btn/UniversalUploadButton'
import { Button, Input, message } from 'antd'

interface SizeChartMainInfoProps {
  isEdit: boolean
  sizeChart: SizeChartRequest
  formSizeChart: SizeChartRequest
  imageUrl: string | null
  handleSizeChartChange: (field: keyof SizeChartRequest, value: string) => void
  deleteSizeChart: (id: string | undefined) => void
  setFormSizeChart: React.Dispatch<React.SetStateAction<SizeChartRequest>>
  setUploadImg: React.Dispatch<React.SetStateAction<imgUpload | null>>
}

const SizeChartMainInfo = ({
  formSizeChart,
  imageUrl,
  isEdit,
  sizeChart,
  handleSizeChartChange,
  deleteSizeChart,
  setFormSizeChart,
  setUploadImg,
}: SizeChartMainInfoProps) => {
  const { TextArea } = Input
  return (
    <div className="size-chart-select-empty-container">
      <h2 className="empty-table">Информация о таблице размеров</h2>
      <div className="main-info">
        <div className="size-chart">
          <span className="size-chart-title-text">Название</span>
          <Input.TextArea
            className="size-chart-input"
            autoSize={{ minRows: 1, maxRows: 4 }}
            value={formSizeChart.name}
            onChange={e => handleSizeChartChange('name', e.target.value)}
          ></Input.TextArea>
          <span className="size-chart-title-text">Замеры</span>
          <Input.TextArea
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="size-chart-input"
            value={formSizeChart.metricsText}
            onChange={e => handleSizeChartChange('metricsText', e.target.value)}
          ></Input.TextArea>
          <span className="size-chart-title-text">Тип</span>
          <Input.TextArea
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="size-chart-input"
            value={formSizeChart.productType}
            onChange={e => handleSizeChartChange('productType', e.target.value)}
          ></Input.TextArea>
        </div>
        <div className="size-chart-description">
          <span className="size-chart-title-text">Описание (необязательно)</span>
          <TextArea
            className="size-chart-input-description"
            value={formSizeChart.description}
            rows={10}
            onChange={e => handleSizeChartChange('description', e.target.value)}
          ></TextArea>
        </div>
        <div className="size-chart-img-with-btn">
          <div className="size-chart-img">
            <span className="size-chart-title-text">Изображение с инструкцией (необязательно)</span>
            <div className="size-chart-container-img">
              <img
                src={imageUrl || '/visily-image.png'}
                alt="Size-chart preview"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src = '/visily-image.png'
                }}
              />
              <div className="image-edit-overlay">
                <Icon
                  name="editing"
                  width="20px"
                  color="#505253"
                  onClick={() => {
                    const button = document.querySelector('.btn-upload-img-size')
                    ;(button as HTMLElement)?.click()
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'none' }}>
              <UniversalUploadButton
                folder=""
                key={isEdit ? `edit-${sizeChart?.id}` : 'create'}
                buttonClassName="btn-upload-img-size"
                buttonText="Загрузить"
                onFileRemoved={() => {
                  setFormSizeChart(prev => ({
                    ...prev,
                    imageId: null,
                  }))
                  setUploadImg(null)
                  message.info('Файл удален')
                }}
                onFileUploaded={(fileId, fileData) => {
                  setUploadImg(fileData)
                  if (isEdit) {
                    setFormSizeChart(prev => ({
                      ...prev,
                      imageId: fileId || null,
                    }))
                  }

                  message.success('Файл загружен successfully')
                }}
                onFileError={() => {
                  message.error('Ошибка загрузки файла.')
                }}
              />
            </div>

            <div className="size-chart-text-container">
              <span className="size-chart-title-text">
                Рекомендуемый размер: 1200 x 800 px. Форматы: JPG,PNG, WEBP, до 5 МБ
              </span>
            </div>
          </div>

          <div className="size-chart-btn">
            <Button onClick={() => deleteSizeChart(formSizeChart.id)} className="btn-delete-size">
              <Icon name="delete" width="24px" color="#505253"></Icon>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SizeChartMainInfo
