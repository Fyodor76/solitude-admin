import Icon from '@/shared/ui/icons/Icon'
import { Button } from 'antd'

import './ColumnsAttr.scss'

export const valueColumns = [
  {
    title: 'Значение',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: 'Отображаемое имя',
    dataIndex: 'displayName',
    key: 'displayName',
  },
  {
    title: 'Цвет',
    dataIndex: 'hexCode',
    key: 'color',
    render: (hexCode: string) => (
      <div className="table-color-container">
        <div
          className="table-color"
          style={{
            backgroundColor: hexCode,
          }}
        />
      </div>
    ),
  },
  {
    title: 'HEX код',
    dataIndex: 'hexCode',
    key: 'hexCode',
  },
  {
    title: 'Активен',
    dataIndex: 'isActive',
    key: 'isActive',
    render: (isActive: boolean) => (
      <span className={isActive ? 'active-true' : 'active-false'}>{isActive ? 'Да' : 'Нет'}</span>
    ),
  },
  {
    title: 'Действия',
    key: 'actions',
    render: (_: any, record: any) => (
      <div className="table-actions">
        <div className="table-actions-edit">
          <Button type="link" size="small">
            <Icon name="editing" />
          </Button>
        </div>
        <div className="table-actions-delete">
          <Button type="link" size="small">
            <Icon color="red" name="delete" />
          </Button>
        </div>
      </div>
    ),
  },
]
