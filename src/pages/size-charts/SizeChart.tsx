import React, { useEffect, useMemo, useState } from 'react'

import { useGetCategoriesTreeQuery } from '@/shared/lib/api/categories/Categories'
import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import {
  useCreateSizeChartMutation,
  useGetSizeChartByCategoryIdQuery,
} from '@/shared/lib/api/size-charts/SizeCharts'
import { SizeChartRequest } from '@/shared/lib/api/size-charts/types'
import { EditableSizeParameter, SizeParameter } from '@/shared/lib/api/size-parameters/type'
import Icon from '@/shared/ui/icons/Icon'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, Select, Space, Table } from 'antd'
import { div } from 'framer-motion/client'

import './SizeChart.scss'

const initialData = {
  categoryId: '',
  name: 'Тестовая таблица ',
  description: 'Тестовая таблица размеров',
  imageId: 'test-id',
  productType: 'switshorts',
  metricsText: 'A - длина\nB - грудь',
  sizeParameters: [
    {
      internationalSize: 'S',
      russianSize: '44',
      lengthCm: 68,
      chestCircumferenceCm: 92,
      order: 1,
    },
  ],
}
const SizeChart = () => {
  const [createSizeChart] = useCreateSizeChartMutation()

  const { data: categoriesTreeData } = useGetCategoriesTreeQuery()
  const [formSizeChart, setFormSizeChart] = useState<SizeChartRequest>(initialData)
  const { isFetching, currentData } = useGetSizeChartByCategoryIdQuery(
    formSizeChart.categoryId || '',
    {
      skip: !formSizeChart.categoryId,
    }
  )
  console.log(currentData?.data)
  const [editParameter, setEditParameter] = useState<EditableSizeParameter[]>([])
  const data = currentData?.data?.sizeParameters

  useEffect(() => {
    if (data) {
      setEditParameter([...data])
    }
  }, [currentData])

  const columns = [
    {
      title: 'Размер',
      dataIndex: 'internationalSize',
      key: 'internationalSize',
      render: (text: string, record: EditableSizeParameter, index: number) => (
        <Input
          value={text}
          onChange={e => handleParameterChange(index, 'internationalSize', e.target.value)}
        />
      ),
    },
    {
      title: 'Российский размер',
      dataIndex: 'russianSize',
      key: 'russianSize',
      render: (text: string, record: EditableSizeParameter, index: number) => (
        <Input
          value={text}
          onChange={e => handleParameterChange(index, 'russianSize', e.target.value)}
        />
      ),
    },
    {
      title: 'Длина(см)',
      dataIndex: 'lengthCm',
      key: 'lengthCm',
      render: (text: string, record: EditableSizeParameter, index: number) => (
        <Input
          value={text}
          onChange={e => handleParameterChange(index, 'lengthCm', Number(e.target.value))}
        />
      ),
    },
    {
      title: 'Обхват груди(см)',
      dataIndex: 'chestCircumferenceCm',
      key: 'chestCircumferenceCm',
      render: (text: string, record: EditableSizeParameter, index: number) => (
        <Input
          value={text}
          onChange={e =>
            handleParameterChange(index, 'chestCircumferenceCm', Number(e.target.value))
          }
        />
      ),
    },
    {
      title: 'Порядок',
      dataIndex: 'order',
      key: 'order',
      render: (text: number, record: EditableSizeParameter, index: number) => (
        <Input
          value={text}
          onChange={e => handleParameterChange(index, 'order', Number(e.target.value))}
        />
      ),
    },
    {
      title: 'Действия',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: any, record: EditableSizeParameter, index: number) => (
        <Space>
          <Button>
            <Icon name="editing"></Icon>
          </Button>
          <Button>
            <Icon name="delete"></Icon>
          </Button>
        </Space>
      ),
    },
  ]

  const handleParameterChange = (index: number, field: keyof EditableSizeParameter, value: any) => {
    const updated = [...editParameter]
    updated[index] = { ...updated[index], [field]: value }
    setEditParameter(updated)
  }

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

      {formSizeChart.categoryId && (
        <>
          {isFetching && <span> Загружаю таблицу! Ждите...</span>}
          {!isFetching && currentData?.data?.id && (
            <>
              <h2> {currentData.data.name}</h2>
              <span>{currentData.data.description}</span>
              <span>{currentData.data.metricsText}</span>
              <span>{currentData.data.imageId}</span>
              <Table columns={columns} dataSource={data} rowKey="id" pagination={false} />
              <Space style={{ marginTop: 16 }}>
                <Button type="dashed" icon={<PlusOutlined />}>
                  Добавить размер
                </Button>
                <Button type="primary">Сохранить изменения</Button>
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
