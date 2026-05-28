import React, { useMemo } from 'react'

import { EditableSizeParameter, SizeParameter } from '@/shared/lib/api/size-parameters/type'
import { Button, message, Table } from 'antd'

import { getColumns } from './components/Columns'
import { ALL_SIZES } from './constans/const'
import SizeParameterAddModal from './modal/SizeParameterAddModal'
import './SizeParameters.scss'

interface SizeParametesProps {
  dataParameters?: SizeParameter[]
  editParameter: EditableSizeParameter[]
  selectedSizeToAdd?: string | null
  changedRows: Record<string, boolean>
  isOpen: boolean
  onOpen: (data: unknown) => void
  onClose: () => void
  setChangedRows: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  setEditParameter: React.Dispatch<React.SetStateAction<EditableSizeParameter[]>>
  setSelectedSizeToAdd: React.Dispatch<React.SetStateAction<string | null>>
  deleteSize: (id: string | undefined) => void | Promise<void>
  createNewSizeParameter: () => void | Promise<void>
}

const SizeParameters = ({
  changedRows,
  editParameter,
  selectedSizeToAdd,
  isOpen,
  onClose,
  onOpen,
  setChangedRows,
  setEditParameter,
  setSelectedSizeToAdd,
  deleteSize,
  createNewSizeParameter,
}: SizeParametesProps) => {
  const handleParameterChange = (id: string, field: keyof EditableSizeParameter, value: any) => {
    const numValue = Number(value)
    const updated = editParameter.map(p =>
      p.id === id || p.tempId === id
        ? {
            ...p,
            [field]: field === 'lengthCm' || field === 'chestCircumferenceCm' ? numValue : value,
          }
        : p
    )
    setEditParameter(updated)
    setChangedRows(prev => ({ ...prev, [id]: true }))
  }

  const getRowClassName = (record: EditableSizeParameter) => {
    const id = record.id || record.tempId

    return id && changedRows[id] ? 'changed-row' : ''
  }

  const columns = getColumns(handleParameterChange, deleteSize)

  const existingParameters = editParameter.map(p => p.internationalSize)
  const filterParameters = ALL_SIZES.filter(size => !existingParameters.includes(size))
  const sortedData = useMemo(() => {
    return [...editParameter].sort((a, b) => {
      return ALL_SIZES.indexOf(a.internationalSize) - ALL_SIZES.indexOf(b.internationalSize)
    })
  }, [editParameter])
  console.log(sortedData)

  const handleAddSize = () => {
    if (filterParameters.length === 0) {
      message.warning(
        'Все возможные размеры уже добавлены. Удалите хотя бы один размер, чтобы добавить новый.'
      )
      return
    }
    onOpen(filterParameters)
  }

  return (
    <div className="tableAndAddParameter">
      <div className="addParameter">
        <h3 className="information-title">Таблица размеров</h3>
        <Button onClick={handleAddSize} type="link">
          + Добавить размер
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={sortedData}
        rowKey="id"
        pagination={false}
        rowClassName={getRowClassName}
      />
      <SizeParameterAddModal
        onClose={onClose}
        isOpen={isOpen}
        selectedSizeToAdd={selectedSizeToAdd}
        setSelectedSizeToAdd={setSelectedSizeToAdd}
        createNewSizeParameter={createNewSizeParameter}
        filterParameters={filterParameters}
      />
    </div>
  )
}

export default React.memo(SizeParameters)
