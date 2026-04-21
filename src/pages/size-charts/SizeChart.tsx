import React, { useEffect, useMemo, useState } from 'react'

import { useGetCategoriesTreeQuery } from '@/shared/lib/api/categories/Categories'
import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import {
  useCreateSizeChartMutation,
  useGetSizeChartByCategoryIdQuery,
} from '@/shared/lib/api/size-charts/SizeCharts'
import { SizeChartRequest } from '@/shared/lib/api/size-charts/types'
import { useCreateSizeParameterBySizeChartIdMutation } from '@/shared/lib/api/size-parameters/SizeParameters'
import { EditableSizeParameter, SizeParameter } from '@/shared/lib/api/size-parameters/type'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Select, Space, Table } from 'antd'

import SizeParameters from '../size-parameters/SizeParameters'
import { initialData } from './const'
import './SizeChart.scss'

const SizeChart = () => {
  const [createSizeChart] = useCreateSizeChartMutation()

  const { data: categoriesTreeData } = useGetCategoriesTreeQuery()
  const [createNewParameter] = useCreateSizeParameterBySizeChartIdMutation()
  const [formSizeChart, setFormSizeChart] = useState<SizeChartRequest>(initialData)
  const [editParameter, setEditParameter] = useState<EditableSizeParameter[]>([])
  const { isFetching, currentData } = useGetSizeChartByCategoryIdQuery(
    formSizeChart.categoryId || '',
    {
      skip: !formSizeChart.categoryId,
    }
  )
  console.log(currentData?.data)

  const dataParameters = currentData?.data?.sizeParameters
  const sizeChartId = currentData?.data?.id
  useEffect(() => {
    if (dataParameters) {
      setEditParameter([...dataParameters])
    }
  }, [currentData])

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

  const createNewSizeParameter = async (data: SizeParameter, sizeChartId: string) => {
    try {
      const newParameter = await createNewParameter({
        data: {
          ...data,
        },
        sizeChartId: sizeChartId,
      }).unwrap()

      setEditParameter([...editParameter, newParameter.data])
      console.log(newParameter)
      return newParameter
    } catch (error) {
      console.log('Ошибка создания параметра таблицы !', error)
      throw error
    }
  }
  const handleAddSize = async () => {
    if (!sizeChartId) {
      console.error('Нет таблицы размеров')
      return
    }
    const newSize: SizeParameter = {
      internationalSize: '',
      russianSize: '',
      lengthCm: 0,
      chestCircumferenceCm: 0,
      order: (editParameter?.length || 0) + 1,
    }
    await createNewSizeParameter(newSize, sizeChartId)
  }

  const onSave = () => {}

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

      {formSizeChart.categoryId && (
        <>
          {isFetching && <span> Загружаю таблицу! Ждите...</span>}
          {!isFetching && currentData?.data?.id && (
            <>
              <h2> {currentData.data.name}</h2>
              <span>{currentData.data.description}</span>
              <span>{currentData.data.metricsText}</span>
              <span>{currentData.data.imageId}</span>
              <SizeParameters
                dataParameters={dataParameters}
                editParameter={editParameter}
                setEditParameter={setEditParameter}
              />
              <Space style={{ marginTop: 16, marginBottom: 16 }}>
                <Button onClick={handleAddSize} type="dashed" icon={<PlusOutlined />}>
                  Добавить размер
                </Button>
                <Button onClick={onSave} type="primary">
                  Сохранить изменения
                </Button>
              </Space>
            </>
          )}
          {!isFetching && !currentData?.data.id && (
            <div>
              <span>У данной категории еще нет таблицы размеров...</span>
              <Button type="default" className="size-chart-btn" onClick={createNewSizeChart}>
                Создать
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SizeChart
