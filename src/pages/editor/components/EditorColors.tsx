import React from 'react'

import { Colors } from '@/shared/lib/api/editor/types'
import { Button, Table } from 'antd'

import { ColumnsColorEditor } from '../helpers/ColumnsColorEditor'
import { ColorWithStatus } from '../types'

interface EditorColorsProps {
  colors: ColorWithStatus[]
  localUpdatedColor: <K extends keyof ColorWithStatus>(
    colorId: string,
    field: K,
    value: ColorWithStatus[K]
  ) => void
  localDeleteColor: (id: string) => void
  handleToggleStatus: (id: string) => void
}
const EditorColors = ({
  colors,
  localDeleteColor,
  localUpdatedColor,
  handleToggleStatus,
}: EditorColorsProps) => {
  return (
    <div className="editor-color-container">
      <div className="editor-color-container-btn-add">
        <Button type="primary">Добавить цвет</Button>
      </div>
      <Table
        dataSource={colors}
        columns={ColumnsColorEditor({ localUpdatedColor, localDeleteColor, handleToggleStatus })}
        rowKey="id"
        pagination={false}
        size="middle"
      />
      <div className="editor-color-container-btn-save">
        <Button type="primary">Сохранить</Button>
      </div>
    </div>
  )
}

export default EditorColors
