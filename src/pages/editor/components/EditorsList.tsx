import React from 'react'

import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import { EditorTypeRequest, EditorTypeResponse, Variants } from '@/shared/lib/api/editor/types'
import { Button, Input, message, Select, Switch } from 'antd'

import { toPatchPayload } from '../helpers/editorTransformers'
import { FormEditorType } from '../types'

interface EditorsListProps {
  activeConfigurationId: string | null
  categories: BaseCategoryTree[] | undefined
  formEditor: FormEditorType | undefined
  configurations: EditorTypeResponse[]
  originalVariants: Variants[]
  handleSelectConfiguration: (config: EditorTypeResponse) => void
  handleSave: (id: string, formEditor: EditorTypeRequest) => Promise<void>
  handleInput: (v: any, field: keyof FormEditorType) => void
  setActiveConfigurationId: React.Dispatch<React.SetStateAction<string | null>>
}
const EditorsList = ({
  activeConfigurationId,
  categories,
  formEditor,
  configurations,
  originalVariants,
  handleSave,
  handleSelectConfiguration,
  handleInput,
  setActiveConfigurationId,
}: EditorsListProps) => {
  return (
    <>
      <span className="line"></span>
      <div className="categories-editor-container">
        {configurations && (
          <div className="categories-editor">
            <h3>Конфигурации</h3>
            {configurations.map(configuration => (
              <div
                onClick={() => handleSelectConfiguration(configuration)}
                className={`categories-editor-cat ${
                  activeConfigurationId === configuration.id ? 'active' : ''
                }`}
                key={configuration.id}
              >
                {configuration.title}
              </div>
            ))}
          </div>
        )}

        {configurations.length > 0 ? (
          <div className="editor-base-info">
            <span>Название</span>
            <Input
              type="text"
              value={formEditor?.title}
              onChange={e => handleInput(e.target.value, 'title')}
            />
            <span>Категория</span>
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
            <span>Активно</span>
            <Switch
              checked={formEditor?.isActive === true}
              onChange={checked => handleInput(checked, 'isActive')}
              className="switch-editor"
            />
          </div>
        ) : (
          <div>Пока нет редактора</div>
        )}
      </div>
    </>
  )
}

export default EditorsList
