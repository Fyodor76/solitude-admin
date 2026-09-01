import React from 'react'

import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import { EditorTypeRequest, EditorTypeResponse, Variants } from '@/shared/lib/api/editor/types'
import { Button, Input, message, Select, Switch } from 'antd'

import { FormEditorType } from '../types'
import ButtonSave from './ButtonSave'

interface EditorsListProps {
  activeConfigurationId: string | null
  categories: BaseCategoryTree[] | undefined
  formEditor: FormEditorType | undefined
  configurations: EditorTypeResponse[]
  originalVariants: Variants[]
  onSave: () => void
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
  onSave,
  handleSave,
  handleSelectConfiguration,
  handleInput,
  setActiveConfigurationId,
}: EditorsListProps) => {
  return (
    <>
      <div className="line" />
      <div className="categories-editor-container">
        {configurations && (
          <div className="categories-editor">
            <h3 className="configuration-title">Конфигурации</h3>
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
        <div className="line-editor" />
        {configurations.length > 0 ? (
          <div className="editor-base-info">
            <span className="input-title-editor">Название</span>
            <Input
              type="text"
              value={formEditor?.title}
              onChange={e => handleInput(e.target.value, 'title')}
            />
            <span className="input-title-editor">Категория</span>
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
            <div className="title-and-switch">
              <span>Активен</span>
              <Switch
                checked={formEditor?.isActive === true}
                onChange={checked => handleInput(checked, 'isActive')}
                className="switch-editor"
              />
            </div>{' '}
            <span className="input-title-editor">
              Включите, чтоб конфигурация была доступна в конструкторе.
            </span>
            <ButtonSave onSave={onSave} />
          </div>
        ) : (
          <div>Пока нет редактора</div>
        )}
      </div>
    </>
  )
}

export default EditorsList
