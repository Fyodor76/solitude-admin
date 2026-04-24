import React from 'react'

import { EditableSizeParameter, SizeParameter } from '@/shared/lib/api/size-parameters/type'
import Icon from '@/shared/ui/icons/Icon'
import { Button, Input, Select, Space, Table } from 'antd'

import { ALL_RU_SIZES, ALL_SIZES } from './const'
import './SizeParameters.scss'

interface SizeParametesProps {
  dataParameters?: SizeParameter[]
  editParameter: EditableSizeParameter[]
  selectedSizeToAdd?: string | null
  changedRows: Record<string, boolean>
  setChangedRows: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  setEditParameter: React.Dispatch<React.SetStateAction<EditableSizeParameter[]>>
  setSelectedSizeToAdd: React.Dispatch<React.SetStateAction<string | null>>
  deleteSize: (index: number) => void | Promise<void>
  createNewSizeParameter: () => void | Promise<void>
}

const SizeParameters = ({
  changedRows,
  editParameter,
  selectedSizeToAdd,
  setChangedRows,
  setEditParameter,
  setSelectedSizeToAdd,
  deleteSize,
  createNewSizeParameter,
}: SizeParametesProps) => {
  const handleParameterChange = (id: string, field: keyof EditableSizeParameter, value: any) => {
    const updated = editParameter.map(p =>
      p.id === id || p.tempId === id ? { ...p, [field]: value } : p
    )
    setEditParameter(updated)
    setChangedRows(prev => ({ ...prev, [id]: true }))
  }

  const getRowClassName = (record: EditableSizeParameter) => {
    const id = record.id || record.tempId

    return id && changedRows[id] ? 'changed-row' : ''
  }

  const columns = [
    {
      title: 'Размер',
      dataIndex: 'internationalSize',
      key: 'internationalSize',
      render: (text: string, record: EditableSizeParameter) => (
        <Input
          value={text || ''}
          onChange={e => {
            const id = record.id || record.tempId
            if (id) {
              handleParameterChange(id, 'internationalSize', e.target.value)
            }
          }}
        />
      ),
    },
    {
      title: 'Российский размер',
      dataIndex: 'russianSize',
      key: 'russianSize',
      render: (text: string, record: EditableSizeParameter) => (
        <Input
          value={text || ''}
          onChange={e => {
            const id = record.id || record.tempId
            if (id) {
              handleParameterChange(id, 'russianSize', e.target.value)
            }
          }}
        />
      ),
    },
    {
      title: 'Длина(см)',
      dataIndex: 'lengthCm',
      key: 'lengthCm',
      render: (text: string, record: EditableSizeParameter, index: number) => (
        <Input
          type="number"
          value={text}
          onChange={e => {
            const id = record.id || record.tempId
            if (id) {
              handleParameterChange(id, 'lengthCm', Number(e.target.value))
            }
          }}
        />
      ),
    },
    {
      title: 'Обхват груди(см)',
      dataIndex: 'chestCircumferenceCm',
      key: 'chestCircumferenceCm',
      render: (text: number, record: EditableSizeParameter, index: number) => (
        <Input
          type="number"
          value={text || 0}
          onChange={e => {
            const id = record.id || record.tempId
            if (id) {
              handleParameterChange(id, 'chestCircumferenceCm', Number(e.target.value))
            }
          }}
        />
      ),
    },
    /* {
      title: 'Порядок',
      dataIndex: 'order',
      key: 'order',
      render: (text: number, record: EditableSizeParameter, index: number) => (
        <Input
          value={text}
          onChange={e => handleParameterChange(index, 'order', Number(e.target.value))}
        />
      ),
    },*/
    {
      title: 'Действия',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: any, record: EditableSizeParameter, index: number) => (
        <Space>
          <Button onClick={() => deleteSize(index)}>
            <Icon name="delete" width="18px"></Icon>
          </Button>
        </Space>
      ),
    },
  ]

  const existingParameters = editParameter.map(p => p.internationalSize)
  const filterParameters = ALL_SIZES.filter(size => !existingParameters.includes(size))
  const sortedData = [...editParameter].sort((a, b) => {
    return ALL_SIZES.indexOf(a.internationalSize) - ALL_SIZES.indexOf(b.internationalSize)
  })
  return (
    <div className="tableAndAddParameter">
      <div className="addParameter">
        <Select
          placeholder="Выберете размер, который хотите добавить"
          value={selectedSizeToAdd}
          onChange={setSelectedSizeToAdd}
          options={filterParameters.map(s => ({
            label: `${s} (${ALL_RU_SIZES[s]} p.)`,
            value: s,
          }))}
        ></Select>
        <Button onClick={createNewSizeParameter}>Добавить</Button>
      </div>
      <Table
        columns={columns}
        dataSource={sortedData}
        rowKey="id"
        pagination={false}
        rowClassName={getRowClassName}
      />
    </div>
  )
}

export default SizeParameters
