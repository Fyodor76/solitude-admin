import {
  AttributeValueRequest,
  AttributeValueResponse,
} from '@/shared/lib/api/product-attributes/types'
import Icon from '@/shared/ui/icons/Icon'
import { Button, Input } from 'antd'

import { RowErrorsProps } from '../types/productAttributesTypes'
import './ColumnsAttr.scss'

export const valueColumns = (
  handleDeleteValue: (id: string) => void,
  handleEditValue: (id: string, field: keyof AttributeValueResponse, value: string) => void,
  validateRowField: (id: string, field: keyof AttributeValueRequest, value: any) => void,
  rowErrors: RowErrorsProps,
  editValues: AttributeValueResponse[],
  valueId: string | null
) => [
  {
    title: 'Значение',
    dataIndex: 'value',
    key: 'value',
    width: 200,
    render: (text: string, record: any) => (
      <>
        <Input
          value={valueId === record.id ? (editValues[record.id]?.value ?? text) : text}
          onChange={e => {
            handleEditValue(record.id, 'value', e.target.value)
            validateRowField(record.id, 'value', e.target.value)
          }}
          status={rowErrors[record.id]?.value ? 'error' : ''}
        />
        {rowErrors[record.id]?.value && (
          <span className="error-text">{rowErrors[record.id].value}</span>
        )}
      </>
    ),
  },
  {
    title: 'Отображаемое имя',
    dataIndex: 'displayName',
    key: 'displayName',
    width: 200,
    render: (text: string, record: any) => (
      <>
        <Input
          value={valueId === record.id ? (editValues[record.id]?.displayName ?? text) : text}
          onChange={e => {
            handleEditValue(record.id, 'displayName', e.target.value)
            validateRowField(record.id, 'displayName', e.target.value)
          }}
          status={rowErrors[record.id]?.displayName ? 'error' : ''}
        />
        {rowErrors[record.id]?.displayName && (
          <span className="error-text">{rowErrors[record.id].displayName}</span>
        )}
      </>
    ),
  },
  {
    title: 'Цвет',
    dataIndex: 'hexCode',
    key: 'color',
    width: 60,
    render: (hexCode: string, record: any) => (
      <div className="table-color-container" style={{}}>
        <input
          type="color"
          value={editValues[record.id]?.hexCode ?? hexCode}
          onChange={e => handleEditValue(record.id, 'hexCode', e.target.value)}
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
    title: 'HEX код',
    dataIndex: 'hexCode',
    key: 'hexCode',
    width: 120,
    render: (text: string, record: any) => (
      <>
        <Input
          value={editValues[record.id]?.hexCode ?? text}
          onChange={e => {
            handleEditValue(record.id, 'hexCode', e.target.value)
            validateRowField(record.id, 'hexCode', e.target.value)
          }}
          placeholder="#000000"
          size="small"
          style={{ minWidth: 80 }}
          status={rowErrors[record.id]?.hexCode ? 'error' : ''}
        />
        {rowErrors[record.id]?.hexCode && (
          <span className="error-text">{rowErrors[record.id].hexCode}</span>
        )}
      </>
    ),
  },
  {
    title: 'Активен',
    dataIndex: 'isActive',
    key: 'isActive',
    width: 100,
    render: (isActive: boolean) => (
      <span className={isActive ? 'active-true' : 'active-false'}>{isActive ? 'Да' : 'Нет'}</span>
    ),
  },
  {
    title: 'Действия',
    key: 'actions',
    width: 80,
    render: (_: any, record: any) => (
      <div className="table-actions">
        <div className="table-actions-delete">
          <Button type="link" size="small">
            <Icon color="red" name="delete" onClick={() => handleDeleteValue(record.id)} />
          </Button>
        </div>
      </div>
    ),
  },
]
