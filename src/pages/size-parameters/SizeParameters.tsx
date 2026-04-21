import React, { useState } from 'react'

import { EditableSizeParameter, SizeParameter } from '@/shared/lib/api/size-parameters/type'
import Icon from '@/shared/ui/icons/Icon'
import { Button, Input, Space, Table } from 'antd'

import './SizeParameters.scss'

interface SizeParametesProps {
  dataParameters?: SizeParameter[]
  editParameter: EditableSizeParameter[]
  setEditParameter: React.Dispatch<React.SetStateAction<EditableSizeParameter[]>>
}

const SizeParameters = ({
  dataParameters,
  editParameter,
  setEditParameter,
}: SizeParametesProps) => {
  const handleParameterChange = (index: number, field: keyof EditableSizeParameter, value: any) => {
    const updated = [...editParameter]
    updated[index] = { ...updated[index], [field]: value }
    setEditParameter(updated)
  }
  const columns = [
    {
      title: 'Размер',
      dataIndex: 'internationalSize',
      key: 'internationalSize',
      render: (text: string, record: EditableSizeParameter, index: number) => (
        <Input
          value={text}
          onChange={e => handleParameterChange(index, 'internationalSize', e.target.value)}
        />
      ),
    },
    {
      title: 'Российский размер',
      dataIndex: 'russianSize',
      key: 'russianSize',
      render: (text: string, record: EditableSizeParameter, index: number) => (
        <Input
          value={text}
          onChange={e => handleParameterChange(index, 'russianSize', e.target.value)}
        />
      ),
    },
    {
      title: 'Длина(см)',
      dataIndex: 'lengthCm',
      key: 'lengthCm',
      render: (text: string, record: EditableSizeParameter, index: number) => (
        <Input
          value={text}
          onChange={e => handleParameterChange(index, 'lengthCm', Number(e.target.value))}
        />
      ),
    },
    {
      title: 'Обхват груди(см)',
      dataIndex: 'chestCircumferenceCm',
      key: 'chestCircumferenceCm',
      render: (text: string, record: EditableSizeParameter, index: number) => (
        <Input
          value={text}
          onChange={e =>
            handleParameterChange(index, 'chestCircumferenceCm', Number(e.target.value))
          }
        />
      ),
    },
    {
      title: 'Порядок',
      dataIndex: 'order',
      key: 'order',
      render: (text: number, record: EditableSizeParameter, index: number) => (
        <Input
          value={text}
          onChange={e => handleParameterChange(index, 'order', Number(e.target.value))}
        />
      ),
    },
    {
      title: 'Действия',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: any, record: EditableSizeParameter, index: number) => (
        <Space>
          <Button>
            <Icon name="editing" width="18px"></Icon>
          </Button>
          <Button>
            <Icon name="delete" width="18px"></Icon>
          </Button>
        </Space>
      ),
    },
  ]
  return (
    <div>
      <Table columns={columns} dataSource={dataParameters} rowKey="id" pagination={false} />
    </div>
  )
}

export default SizeParameters
