import { useState } from 'react'

import { Modal, Select } from 'antd'

import { ColorWithStatus, FormEditorType } from '../types'

interface ModalEditorProps {
  formEditor: FormEditorType
  isOpen: boolean
  colors: ColorWithStatus[]
  localAddColor: (colorId: string[], colors: ColorWithStatus[]) => void
  selectedColorIds: string[]
  setSelectedColorIds: React.Dispatch<React.SetStateAction<string[]>>
  closeModal: () => void
  handleInput: (v: any, field: keyof FormEditorType) => void
}
const ModalAddColor = ({
  closeModal,
  isOpen,
  formEditor,
  selectedColorIds,
  setSelectedColorIds,
  localAddColor,
  colors,
  handleInput,
}: ModalEditorProps) => {
  const handleOk = () => {
    if (selectedColorIds.length === 0) {
      return
    }
    localAddColor(selectedColorIds, colors)

    setSelectedColorIds([])
    closeModal()
  }

  const handleCancel = () => {
    setSelectedColorIds([])
    closeModal()
  }
  const availableColors =
    colors?.filter(color => {
      const isAlreadyAdded = formEditor.colors?.some(c => c.id === color.id)
      return !isAlreadyAdded
    }) || []

  return (
    <Modal
      onOk={handleOk}
      okText="Добавить"
      cancelText="Отмена"
      title="Выберете цвет для добавления"
      open={isOpen}
      onCancel={handleCancel}
    >
      <div className="modal-editor-form">
        <Select
          mode="multiple"
          value={selectedColorIds}
          onChange={setSelectedColorIds}
          placeholder="Выберите цвета"
          style={{ width: '100%' }}
        >
          {availableColors.map(color => {
            if (!color) return null
            return (
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
            )
          })}
        </Select>
        <span className="hint">Выберите цвета, которые будут доступны в конструкторе</span>
      </div>
    </Modal>
  )
}

export default ModalAddColor
