import React from 'react'

import { ProductAttributeResponse } from '@/shared/lib/api/product-attributes/types'
import Icon from '@/shared/ui/icons/Icon'
import { Button, Table } from 'antd'
import { div } from 'framer-motion/client'

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
  const hasValues = selectedAttributeId && editFormLocal?.values && editFormLocal.values.length > 0

  return (
    <div className="attribute-value">
      <div className="title-and-btn">
        <h4 className="middle-title">Значение опции</h4>
        <Button onClick={addValue} type="link">
          + Добавить значение
        </Button>
      </div>
      {hasValues ? (
        <Table
          dataSource={editFormLocal?.values}
          columns={columns}
          loading={isLoading}
          rowKey="id"
          pagination={false}
        />
      ) : (
        <div className="attribute-value-empty">
          <Icon name="boxOpen" className="attribute-value-empty-icon"></Icon>
          <h3>У этой опции пока нет значений</h3>
          <span className="attribute-value-empty-info">
            Добавьте значение, что бы использовать опцию в товарах.
          </span>
          <Button onClick={addValue} type="primary">
            + Добавить значение
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProductAttributeValues
