import React, { useState } from 'react'

import { useCreateSizeChartMutation } from '@/shared/lib/api/size-charts/SizeCharts'
import { SizeChartRequest } from '@/shared/lib/api/size-charts/types'
import { Button } from 'antd'

const initialData = {
  categoryId: '',
  name: 'Тестовая таблица ',
  description: 'Тестовая таблица размеров',
  imageId: 'test-id',
  productType: 'tshirt',
  metricsText: 'A - длина\nB - грудь',
  sizeParameters: [],
}
const SizeChart = () => {
  const [createSizeChart] = useCreateSizeChartMutation()
  const [formSizeChart, setFormSizeChart] = useState<SizeChartRequest>(initialData)
  const createNewSizeChart = async () => {
    try {
      await createSizeChart(formSizeChart).unwrap()
      console.log('✅ Категория создана, обновляем данные...')
    } catch (error) {
      console.log('Ошибка создания категории!', error)
      throw error
    }
  }
  return (
    <div>
      Тест страница для размеров
      <Button onClick={createNewSizeChart}>Создать таблицу размеров для категории</Button>
    </div>
  )
}

export default SizeChart
