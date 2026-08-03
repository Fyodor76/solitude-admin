import React, { useState } from 'react'

import { Select } from 'antd'

import { useAllCategories } from '../size-charts/hooks/useGetAllCategories'

interface FormState {
  categoryId: string
  title: string
  variants: any[]
  specifications: any[]
}
const initialState = {
  categoryId: '',
  title: '',
  variants: [],
  specifications: [],
}

const Editor = () => {
  const { error, isLoading, categories } = useAllCategories()

  const [formEditor, setFormEditor] = useState<FormState>(initialState)
  return (
    <div>
      <h1 style={{ fontSize: 32, color: '#000', marginBottom: 24 }}>🎨 Конструктор товара</h1>
      <Select
        className="editor-select"
        style={{ width: 400 }}
        value={formEditor.categoryId || undefined}
        placeholder="Выберете категорию"
        showSearch
        onChange={value => {
          setFormEditor({
            ...formEditor,
            categoryId: value,
          })
        }}
        allowClear
      >
        {categories &&
          categories.map(cat => (
            <Select.Option key={cat.id} value={cat.id} label={cat.name}>
              {cat.name}
            </Select.Option>
          ))}
      </Select>
    </div>
  )
}

export default Editor
