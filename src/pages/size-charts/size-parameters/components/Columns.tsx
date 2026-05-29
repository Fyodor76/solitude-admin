import React from 'react'

import { EditableSizeParameter } from '@/shared/lib/api/size-parameters/type'
import Icon from '@/shared/ui/icons/Icon'
import { Button, InputNumber, Space, Tooltip } from 'antd'

import { MAX_CHEST, MAX_LENGTH, MIN_CHEST, MIN_LENGTH } from '../constans/const'

export const getColumns = (
  handleParameterChange: (id: string, field: keyof EditableSizeParameter, value: any) => void,
  deleteSize: (id: string | undefined) => void
) => [
  {
    title: 'Размер',
    dataIndex: 'internationalSize',
    key: 'internationalSize',
    render: (text: string, record: EditableSizeParameter) => <span>{text}</span>,
  },
  {
    title: 'Российский размер',
    dataIndex: 'russianSize',
    key: 'russianSize',
    render: (text: string, record: EditableSizeParameter) => <span>{text}</span>,
  },
  {
    title: 'Длина(см)',
    dataIndex: 'lengthCm',
    key: 'lengthCm',
    render: (text: number, record: EditableSizeParameter, index: number) => (
      <Tooltip title={`Допустимые значения: ${MIN_LENGTH} - ${MAX_LENGTH} см`}>
        <InputNumber
          min={MIN_LENGTH}
          max={MAX_LENGTH}
          precision={0}
          controls={true}
          value={text}
          onChange={e => {
            const id = record.id || record.tempId
            if (id) {
              handleParameterChange(id, 'lengthCm', e)
            }
          }}
        />
      </Tooltip>
    ),
  },
  {
    title: 'Обхват груди(см)',
    dataIndex: 'chestCircumferenceCm',
    key: 'chestCircumferenceCm',
    render: (text: number, record: EditableSizeParameter, index: number) => (
      <Tooltip title={`Допустимые значения: ${MIN_CHEST} - ${MAX_CHEST} см`}>
        <InputNumber
          min={MIN_CHEST}
          max={MAX_CHEST}
          precision={0}
          controls={true}
          value={text}
          placeholder="Например: 84-88 или 86"
          onChange={e => {
            const id = record.id || record.tempId
            if (id) {
              handleParameterChange(id, 'chestCircumferenceCm', e || 0)
            }
          }}
        />
      </Tooltip>
    ),
  },
  {
    title: 'Порядок',
    dataIndex: 'order',
    key: 'order',
    width: 80,
    render: (text: number) => <span style={{ textAlign: 'center' }}>{text}</span>,
  },

  {
    title: 'Действия',
    dataIndex: 'actions',
    key: 'actions',
    render: (_: any, record: EditableSizeParameter, index: number) => (
      <Space>
        <Button onClick={() => deleteSize(record.id)}>
          <Icon name="delete" width="18px"></Icon>
        </Button>
      </Space>
    ),
  },
]
