import React from 'react'

import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import { EditorTypeResponse } from '@/shared/lib/api/editor/types'
import { Input, Select } from 'antd'

import { FormEditorType } from './types'

interface EditorsListProps {
  activeConfigurationId: string | null
  categories: BaseCategoryTree[] | undefined
  formEditor: FormEditorType | undefined
  configurations: EditorTypeResponse[]
  handleInput: (v: any, field: keyof FormEditorType) => void
  setActiveConfigurationId: React.Dispatch<React.SetStateAction<string | null>>
}
const EditorsList = ({
  activeConfigurationId,
  categories,
  formEditor,
  configurations,
  handleInput,
  setActiveConfigurationId,
}: EditorsListProps) => {
  return (
    <div className="categories-editor-container">
      {configurations && (
        <div className="categories-editor">
          <h3>Конфигурации</h3>
          {configurations.map(configuration => (
            <div
              onClick={() => setActiveConfigurationId(configuration.id)}
              className="categories-editor-cat"
              key={configuration.id}
            >
              {configuration.title}
            </div>
          ))}
        </div>
      )}

      {configurations.length > 0 ? (
        <div>
          <span>Название</span>
          <Input
            type="text"
            value={formEditor?.title}
            onChange={e => handleInput(e.target.value, 'title')}
          />
          <Select
            placeholder="Выберите категорию"
            value={formEditor?.categoryId}
            onChange={v => handleInput(v, 'categoryId')}
          >
            {categories &&
              categories.map(cat => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
          </Select>
        </div>
      ) : (
        <div>Пока нет редактора</div>
      )}
    </div>
  )
}

export default EditorsList
