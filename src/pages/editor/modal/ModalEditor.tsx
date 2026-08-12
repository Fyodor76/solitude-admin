import React from 'react'

import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import { Colors, EditorTypeRequest } from '@/shared/lib/api/editor/types'
import { Input, Modal, Select, Switch } from 'antd'

import { FormEditorType } from '../types'

interface ModalEditorProps {
  formEditor: FormEditorType
  isOpen: boolean
  categories: BaseCategoryTree[] | undefined
  colors: Colors[]
  onSaveCreated: (data: FormEditorType) => Promise<void>
  closeModal: () => void
  handleInput: (v: any, field: keyof FormEditorType) => void
}
const ModalEditor = ({
  closeModal,
  isOpen,
  formEditor,
  handleInput,
  onSaveCreated,
  categories,
  colors,
}: ModalEditorProps) => {
  return (
    <Modal
      onOk={() => onSaveCreated(formEditor)}
      title="Создание нового редактора"
      open={isOpen}
      onCancel={closeModal}
    >
      <div className="modal-editor-form">
        <div className="field">
          <label>Название</label>
          <Input
            value={formEditor.title}
            onChange={e => handleInput(e.target.value, 'title')}
            placeholder="Введите название редактора"
          />
        </div>

        <div className="field">
          <label>Категория *</label>
          <Select
            value={formEditor.categoryId}
            onChange={v => handleInput(v, 'categoryId')}
            placeholder="Выберите категорию"
            style={{ width: '100%' }}
          >
            {categories?.map(cat => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* 3. Цвета */}
        <div className="field">
          <label>Цвета</label>
          <Select
            mode="multiple"
            value={formEditor.colors?.map(c => c.id)}
            onChange={selectedIds => {
              // Находим полные объекты цветов по id
              const selectedColors = colors.filter(c => selectedIds.includes(c.id))
              // ✅ Сохраняем в formEditor.colors
              handleInput(selectedColors, 'colors')
            }}
            placeholder="Выберите цвета"
            style={{ width: '100%' }}
          >
            {colors.map(color => (
              <Select.Option key={color.id} value={color.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      backgroundColor: color.hexCode,
                      borderRadius: 4,
                      border: '1px solid #ddd',
                    }}
                  />
                  {color.value}
                </div>
              </Select.Option>
            ))}
          </Select>
          <span className="hint">Выберите цвета, которые будут доступны в конструкторе</span>
        </div>

        {/* 4. Активен */}
        <div className="field">
          <label>Активен</label>
          <Switch
            checked={formEditor.isActive}
            onChange={checked => handleInput(checked, 'isActive')}
          />
          <span className="hint">Включите, чтобы конфигурация была доступна в конструкторе</span>
        </div>
      </div>
    </Modal>
  )
}

export default ModalEditor
