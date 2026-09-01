import { DeleteOutlined } from '@ant-design/icons'
import { Button, Input, Switch } from 'antd'

import { ColorWithStatus } from '../types'

interface ColumnsColorEditorProps {
  localUpdatedColor: <K extends keyof ColorWithStatus>(
    colorId: string,
    field: K,
    value: ColorWithStatus[K]
  ) => void
  localDeleteColor: (id: string) => void
  handleToggleStatus: (id: string) => void
}

export const ColumnsColorEditor = ({
  localUpdatedColor,
  localDeleteColor,
  handleToggleStatus,
}: ColumnsColorEditorProps) => [
  {
    title: 'Цвет',
    dataIndex: 'hexCode',
    key: 'color',
    width: 60,
    render: (hexCode: string, record: ColorWithStatus) => (
      <div className="table-color-container">
        <input
          type="color"
          value={hexCode}
          onChange={e => localUpdatedColor(record.id, 'hexCode', e.target.value)}
          style={{
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            padding: 0,
            border: 'none',
            background: 'none',
          }}
          className="circle-color-picker"
        />
      </div>
    ),
  },
  {
    title: 'Название',
    dataIndex: 'value',
    key: 'name',
    render: (value: string, record: ColorWithStatus) => (
      <Input
        value={value}
        onChange={e => localUpdatedColor(record.id, 'value', e.target.value)}
        size="small"
        style={{ maxWidth: 150 }}
      />
    ),
  },
  {
    title: 'HEX код',
    dataIndex: 'hexCode',
    key: 'hexCode',
    render: (hexCode: string, record: ColorWithStatus) => (
      <Input
        value={hexCode}
        onChange={e => localUpdatedColor(record.id, 'hexCode', e.target.value)}
        size="small"
        style={{ maxWidth: 150 }}
      />
    ),
  },
  {
    title: 'Статус',
    dataIndex: 'isActive',
    key: 'status',
    render: (isActive: boolean, record: ColorWithStatus) => (
      <Switch
        checked={isActive}
        onChange={() => handleToggleStatus(record.id)}
        size="small"
        checkedChildren="Активен"
        unCheckedChildren="Неактивен"
      />
    ),
  },
  {
    title: 'Действия',
    key: 'actions',
    width: 120,
    render: (_: any, record: ColorWithStatus) => (
      <div style={{ display: 'flex', gap: 4 }}>
        <Button type="link">Открыть</Button>
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
