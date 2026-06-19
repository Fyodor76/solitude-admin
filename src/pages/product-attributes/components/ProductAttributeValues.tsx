import React from 'react'

import { ProductAttributeResponse } from '@/shared/lib/api/product-attributes/types'
import { Button, Table } from 'antd'

import { AttributeValue } from '@/app/types/product'

import { valueColumns } from '../helpers/ColumnsAttr'

interface ProductAttributeValuesProps {
  selectedAttributeId: string | null
  isLoading: boolean
  editFormLocal: ProductAttributeResponse | undefined
  valueId: string | null
  addValue: () => void
  localDeleteValue: (id: string) => void
  localEditValue: (id: string, failed: keyof AttributeValue, value: any) => void
  setValueId: React.Dispatch<React.SetStateAction<string | null>>
  setEditFormLocal: React.Dispatch<React.SetStateAction<ProductAttributeResponse | undefined>>
}
const ProductAttributeValues = ({
  selectedAttributeId,
  editFormLocal,
  isLoading,
  valueId,
  addValue,
  localDeleteValue,
  localEditValue,
}: ProductAttributeValuesProps) => {
  const columns = valueColumns(
    localDeleteValue,
    localEditValue,
    editFormLocal?.values || [],
    valueId
  )
  return (
    <div className="attribute-value">
      <div className="title-and-btn">
        <h4 className="middle-title">Значение опции</h4>
        <Button onClick={addValue} type="link">
          + Добавить значение
        </Button>
      </div>
      {selectedAttributeId && editFormLocal ? (
        <Table
          dataSource={editFormLocal?.values}
          columns={columns}
          loading={isLoading}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      ) : (
        'Ничего не выбрано'
      )}
    </div>
  )
}

export default ProductAttributeValues
