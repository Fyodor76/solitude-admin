import { Colors } from '@/shared/lib/api/editor/types'
import { DeleteOutlined } from '@ant-design/icons'
import { Button } from 'antd'

import { ColorWithStatus } from '../types'

interface ColumnsColorEditorProps {
  localDeleteColor: (id: string) => void
  onOpenColor: (colorId: string) => void
}

export const ColumnsColorEditor = ({ localDeleteColor, onOpenColor }: ColumnsColorEditorProps) => [
  {
    title: 'Цвет',
    dataIndex: 'hexCode',
    key: 'color',
    width: 60,
    render: (hexCode: string) => (
      <div className="table-color-container">
        <div
          style={{
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            padding: 0,
            border: 'none',
            backgroundColor: hexCode,
          }}
        />
      </div>
    ),
  },
  {
    title: 'Название',
    dataIndex: 'value',
    key: 'name',
    render: (value: string) => <span>{value}</span>,
  },
  {
    title: 'HEX код',
    dataIndex: 'hexCode',
    key: 'hexCode',
    render: (hexCode: string) => <span>{hexCode}</span>,
  },
  {
    title: 'Статус',
    dataIndex: 'isActive',
    key: 'status',

    render: (isActive: boolean) => {
      console.log('isActive:', isActive, 'тип:', typeof isActive)
      return (
        <span
          style={{
            color: isActive ? 'var(--color-blue)' : '',
          }}
        >
          {isActive ? 'Активен' : 'Не активен'}
        </span>
      )
    },
  },
  {
    title: 'Действия',
    key: 'actions',
    width: 120,
    render: (_: any, record: ColorWithStatus) => (
      <div style={{ display: 'flex', gap: 4 }}>
        <Button type="link" onClick={() => onOpenColor(record.id)}>
          Открыть
        </Button>
        <Button
          type="text"
          size="small"
          danger
          icon={<DeleteOutlined />}
          title="Удалить"
          onClick={() => localDeleteColor(record.id)}
        />
      </div>
    ),
  },
]
