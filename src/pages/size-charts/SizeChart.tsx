import React, { useMemo, useState } from 'react'

import { useGetCategoriesTreeQuery } from '@/shared/lib/api/categories/Categories'
import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import { useCreateSizeChartMutation } from '@/shared/lib/api/size-charts/SizeCharts'
import { SizeChartRequest } from '@/shared/lib/api/size-charts/types'
import { Button, Select } from 'antd'

import './SizeChart.scss'

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
  const { data: categoriesTreeData } = useGetCategoriesTreeQuery()
  const [formSizeChart, setFormSizeChart] = useState<SizeChartRequest>(initialData)

  const getAllCategories = (categories: BaseCategoryTree[]): BaseCategoryTree[] => {
    let result: BaseCategoryTree[] = []
    for (const category of categories) {
      result.push(category)
      if (category.children?.length) {
        result = [...result, ...getAllCategories(category.children)]
      }
    }
    return result
  }
  const allCategories = useMemo(() => {
    if (!categoriesTreeData?.data) return []
    return getAllCategories(categoriesTreeData.data)
  }, [categoriesTreeData])

  const createNewSizeChart = async () => {
    if (!formSizeChart.categoryId) {
      alert('Выберете категорию!')
      return
    }
    try {
      await createSizeChart(formSizeChart).unwrap()
      console.log('✅ Таблица размеров создана, обновляем данные...')
    } catch (error) {
      console.log('Ошибка создания таблицы категории!', error)
      throw error
    }
  }
  return (
    <div className="size-chart-wrapper">
      <span className="size-chart-title"> Тест страница для размеров</span>
      <Select
        className="size-chart-select"
        value={formSizeChart.categoryId || undefined}
        placeholder="Выберете категорию"
        onChange={value =>
          setFormSizeChart({
            ...formSizeChart,
            categoryId: value,
          })
        }
        allowClear
      >
        {allCategories &&
          allCategories.map(cat => (
            <Select.Option key={cat.id} value={cat.id}>
              {cat.name}
            </Select.Option>
          ))}
      </Select>

      {formSizeChart.categoryId && (
        <span>
          {' '}
          Выбрано: {allCategories.find(cat => cat.id === formSizeChart.categoryId)?.name}
        </span>
      )}

      <Button className="size-chart-btn" onClick={createNewSizeChart}>
        Создать таблицу размеров для категории
      </Button>
    </div>
  )
}

export default SizeChart
