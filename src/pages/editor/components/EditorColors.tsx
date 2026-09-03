import React, { useState } from 'react'

import { Button, Table } from 'antd'
import { useNavigate } from 'react-router-dom'

import { ColumnsColorEditor } from '../helpers/ColumnsColorEditor'
import ModalAddColor from '../modal/ModalAddColor'
import { ColorWithStatus, FormEditorType } from '../types'

interface EditorColorsProps {
  colors: ColorWithStatus[]
  colorsAttributies: ColorWithStatus[]
  formEditor: FormEditorType
  isOpen: boolean
  handleInput: (v: any, field: keyof FormEditorType) => void
  closeModal: () => void
  localDeleteColor: (id: string) => void
  localAddColor: (colorId: string[], colors: ColorWithStatus[]) => void
  onSave: () => void
  modalOpen: () => void
}
const EditorColors = ({
  colors,
  colorsAttributies,
  localDeleteColor,
  localAddColor,
  onSave,
  closeModal,
  modalOpen,
  isOpen,
  formEditor,
  handleInput,
}: EditorColorsProps) => {
  const navigate = useNavigate()
  const [selectedColorIds, setSelectedColorIds] = useState<string[]>([])
  const handleOpenColor = (colorId: string) => {
    navigate(`/product-attributes?attributeId=${colorId}`)
  }

  const onOpenModalForColor = () => {
    setSelectedColorIds([])
    modalOpen()
  }
  return (
    <div className="editor-color-container">
      <div className="editor-color-container-btn-add">
        <Button onClick={onOpenModalForColor} type="primary">
          Добавить цвет
        </Button>
      </div>
      <Table
        dataSource={colors}
        columns={ColumnsColorEditor({ localDeleteColor, onOpenColor: handleOpenColor })}
        rowKey="id"
        pagination={false}
        size="middle"
      />
      <div className="editor-color-container-btn-save">
        <Button onClick={onSave} type="primary">
          Сохранить
        </Button>
      </div>
      <ModalAddColor
        colors={colorsAttributies}
        formEditor={formEditor}
        isOpen={isOpen}
        selectedColorIds={selectedColorIds}
        setSelectedColorIds={setSelectedColorIds}
        closeModal={closeModal}
        localAddColor={localAddColor}
        handleInput={handleInput}
      />
    </div>
  )
}

export default EditorColors
