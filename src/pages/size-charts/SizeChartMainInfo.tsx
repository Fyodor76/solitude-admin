import React from 'react'

import { SizeChartRequest } from '@/shared/lib/api/size-charts/types'
import Icon from '@/shared/ui/icons/Icon'
import { Button, Input } from 'antd'
import TextArea from 'antd/es/input/TextArea'

interface SizeChartMainInfoProps {
  formSizeChart: SizeChartRequest
  imageUrl: string
  handleSizeChartChange: (field: keyof SizeChartRequest, value: string) => void
  onSaveAllChanges: (data: Partial<SizeChartRequest>) => void
  deleteSizeChart: (id: string | undefined) => void
}

const SizeChartMainInfo = () => {
  return (
    <div className="size-chart-select-empty-container">
      <h2 className="empty-table">Информация о таблице размеров</h2>
      <div className="main-info">
        <div className="size-chart">
          <span className="size-chart-title-text">Название</span>
          <Input
            className="size-chart-input"
            value={formSizeChart.name}
            onChange={e => handleSizeChartChange('name', e.target.value)}
          ></Input>
          <span className="size-chart-title-text">Замеры</span>
          <Input
            className="size-chart-input"
            value={formSizeChart.metricsText}
            onChange={e => handleSizeChartChange('metricsText', e.target.value)}
          ></Input>
          <span className="size-chart-title-text">Тип</span>
          <Input
            className="size-chart-input"
            value={formSizeChart.productType}
            onChange={e => handleSizeChartChange('productType', e.target.value)}
          ></Input>
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
            <BtnUploadImgForSizeChart
              isEdit={isEdit}
              formSizeChartCreate={formSizeChart}
              setFormSizeChartCreate={setFormSizeChart}
              setUploadImg={setUploadImg}
            />
          </div>

          <div className="size-chart-text-container">
            <span className="size-chart-title-text">
              Рекомендуемый размер: 1200 x 800 px. Форматы: JPG,PNG, WEBP, до 5 МБ
            </span>
          </div>
        </div>

        <div className="size-chart-btn">
          <Button className="btn-save-size" onClick={() => onSaveAllChanges(formSizeChart)}>
            <Icon name="save" width="24px" color="#414243"></Icon>
          </Button>
          <Button onClick={() => deleteSizeChart(formSizeChart.id)} className="btn-delete-size">
            <Icon name="delete" width="24px" color="#505253"></Icon>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SizeChartMainInfo
