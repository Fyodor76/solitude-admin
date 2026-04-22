import React, { useEffect, useMemo, useState } from 'react'

import { useGetCategoriesTreeQuery } from '@/shared/lib/api/categories/Categories'
import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import {
  useCreateSizeChartMutation,
  useGetSizeChartByCategoryIdQuery,
  useUpdateSizeChartByIdMutation,
} from '@/shared/lib/api/size-charts/SizeCharts'
import { SizeChartRequest } from '@/shared/lib/api/size-charts/types'
import {
  useCreateSizeParameterBySizeChartIdMutation,
  useDeleteSizeParameterByIdMutation,
} from '@/shared/lib/api/size-parameters/SizeParameters'
import { EditableSizeParameter, SizeParameter } from '@/shared/lib/api/size-parameters/type'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Select, Space } from 'antd'

import { ALL_RU_SIZES, DEFAULT_MEASUREMENTS } from '../size-parameters/const'
import SizeParameters from '../size-parameters/SizeParameters'
import { initialData } from './const'
import './SizeChart.scss'

const SizeChart = () => {
  const [createSizeChart] = useCreateSizeChartMutation()
  const { data: categoriesTreeData } = useGetCategoriesTreeQuery()
  const [createNewParameter] = useCreateSizeParameterBySizeChartIdMutation()
  const [deleteSizeParameter] = useDeleteSizeParameterByIdMutation()
  const [updateSizeChart] = useUpdateSizeChartByIdMutation()

  const [formSizeChartCreate, setFormSizeChartCreate] = useState<SizeChartRequest>(initialData)
  const [editParameter, setEditParameter] = useState<EditableSizeParameter[]>([])
  const [selectedSizeToAdd, setSelectedSizeToAdd] = useState<string | null>(null)
  const { isFetching, currentData, refetch } = useGetSizeChartByCategoryIdQuery(
    formSizeChartCreate.categoryId || '',
    {
      skip: !formSizeChartCreate.categoryId,
    }
  )

  const dataParameters = currentData?.data?.sizeParameters
  const sizeChartId = currentData?.data?.id
  console.log(dataParameters)

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
    if (!formSizeChartCreate.categoryId) {
      alert('Выберете категорию!')
      return
    }
    try {
      await createSizeChart(formSizeChartCreate).unwrap()
      console.log('✅ Таблица размеров создана, обновляем данные...')
    } catch (error) {
      console.log('Ошибка создания таблицы категории!', error)
      throw error
    }
  }

  const reOrderParameter = (array: EditableSizeParameter[]): EditableSizeParameter[] => {
    const newArr = array.map((el, index) => {
      return {
        ...el,
        order: index + 1,
      }
    })
    return newArr
  }

  const createNewSizeParameter = async () => {
    if (!selectedSizeToAdd) {
      alert('Выберите размер для добавления!')
      return
    }

    if (!sizeChartId) {
      console.error('Нет таблицы размеров')
      return
    }
    const newSize: SizeParameter = {
      internationalSize: selectedSizeToAdd,
      russianSize: ALL_RU_SIZES[selectedSizeToAdd],
      lengthCm: DEFAULT_MEASUREMENTS[selectedSizeToAdd].lengthCm,
      chestCircumferenceCm: DEFAULT_MEASUREMENTS[selectedSizeToAdd].chestCircumferenceCm,
      order: (editParameter?.length || 0) + 1,
    }
    try {
      const result = await createNewParameter({
        data: newSize,
        sizeChartId: sizeChartId,
      }).unwrap()
      const newParameters = [...editParameter, result.data]
      setEditParameter(reOrderParameter(newParameters))
      refetch()
      setSelectedSizeToAdd(null)
      console.log('Создала новый размер!')
    } catch (error) {
      console.log('Ошибка создания параметра таблицы!', error)
    }
  }

  const deleteSize = async (index: number) => {
    const sizeToDelete = editParameter[index]
    const isConfirmed = confirm(`Удалить размер "${sizeToDelete.internationalSize}"?`)
    if (!isConfirmed) return

    try {
      if (sizeToDelete.id) await deleteSizeParameter(sizeToDelete.id).unwrap()

      const newParameters = editParameter.filter((_, i) => {
        return i !== index
      })
      setEditParameter(reOrderParameter(newParameters))
      refetch()
      console.log('Удаление прошло успешно!')
    } catch (error) {
      console.log('Ошибка удаления размера...', error)
    }
  }
  const onSaveAllChanges = async (data: Partial<SizeChartRequest>) => {
    if (!sizeChartId) {
      console.error('Нет таблицы для сохранения')
      return
    }
    if (editParameter.length === 0) {
      alert('Нет данных для сохранения')
      return
    }
    try {
      await updateSizeChart({
        id: sizeChartId,
        data: {
          name: data.name,
          description: data.description,
          imageId: data.imageId,
          productType: data.productType,

          sizeParameters: editParameter.map(p => ({
            id: p.id,
            internationalSize: p.internationalSize,
            russianSize: p.russianSize,
            lengthCm: Number(p.lengthCm),
            chestCircumferenceCm: Number(p.chestCircumferenceCm),
            order: Number(p.order),
          })),
        },
      }).unwrap()
      alert('✅ Изменения сохранены!')
      refetch()
    } catch (error) {
      console.log('Ошибка созханения изменений в таблице...')
    }
  }

  return (
    <div className="size-chart-wrapper">
      <span className="size-chart-title"> Тест страница для размеров</span>
      <Select
        className="size-chart-select"
        value={formSizeChartCreate.categoryId || undefined}
        placeholder="Выберете категорию"
        onChange={value =>
          setFormSizeChartCreate({
            ...formSizeChartCreate,
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

      {formSizeChartCreate.categoryId && (
        <span>
          {' '}
          Выбрано: {allCategories.find(cat => cat.id === formSizeChartCreate.categoryId)?.name}
        </span>
      )}

      {formSizeChartCreate.categoryId && (
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
                selectedSizeToAdd={selectedSizeToAdd}
                setSelectedSizeToAdd={setSelectedSizeToAdd}
                setEditParameter={setEditParameter}
                deleteSize={deleteSize}
              />
              <Space style={{ marginTop: 16, marginBottom: 16 }}>
                <Button onClick={createNewSizeParameter} type="dashed" icon={<PlusOutlined />}>
                  Добавить размер
                </Button>
                <Button onClick={() => onSaveAllChanges(currentData.data)} type="primary">
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
