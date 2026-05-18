import React from 'react'

import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import { SizeChartRequest } from '@/shared/lib/api/size-charts/types'
import { EditableSizeParameter } from '@/shared/lib/api/size-parameters/type'
import { Select } from 'antd'

import { initialData } from './const'

interface ChoosingCategoryProps {
  formSizeChart: SizeChartRequest
  allCategories: BaseCategoryTree[]
  setEditParameter: React.Dispatch<React.SetStateAction<EditableSizeParameter[]>>
  setFormSizeChart: React.Dispatch<React.SetStateAction<SizeChartRequest>>
  setSelectedSizeToAdd: React.Dispatch<React.SetStateAction<string | null>>
}

const ChoosingCategory = ({
  formSizeChart,
  allCategories,
  setEditParameter,
  setSelectedSizeToAdd,
  setFormSizeChart,
}: ChoosingCategoryProps) => {
  return (
    <div className="size-chart-select-container">
      <span className="size-chart-select-container-title">Выберете категорию</span>
      <div className="change-category">
        <Select
          className="size-chart-select"
          value={formSizeChart.categoryId || undefined}
          placeholder="Выберете категорию"
          onChange={value => {
            setFormSizeChart({
              ...initialData,
              categoryId: value,
            })
            setEditParameter([])
            setSelectedSizeToAdd(null)
          }}
          allowClear
          placement="bottomLeft"
          showSearch={{
            filterOption: (input, option) =>
              String(option?.label ?? '')
                .toLowerCase()
                .includes(input.toLowerCase()),
          }}
        >
          {allCategories &&
            allCategories.map(cat => (
              <Select.Option key={cat.id} value={cat.id} label={cat.name}>
                {cat.name}
              </Select.Option>
            ))}
        </Select>
        {formSizeChart.categoryId && (
          <span className="changeCategoryName">
            Выбрано:{' '}
            <span className="category-name-change">
              {allCategories.find(cat => cat.id === formSizeChart.categoryId)?.name}
            </span>
          </span>
        )}
      </div>
      {!formSizeChart.categoryId && (
        <span className="size-chart-select-label">
          Выберете категорию, чтобы посмотреть или редактировать таблицу размеров
        </span>
      )}
    </div>
  )
}

export default ChoosingCategory
