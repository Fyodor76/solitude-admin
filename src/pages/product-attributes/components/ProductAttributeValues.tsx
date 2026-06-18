import React, { useState } from 'react'

import { ProductAttributeResponse } from '@/shared/lib/api/product-attributes/types'
import { Button, Table } from 'antd'

import { valueColumns } from '../helpers/ColumnsAttr'
import { useHandlerProductAttributeValues } from '../hooks/useHandlerProductAttributeValues'

interface ProductAttributeValuesProps {
  selectedAttributeId: string | null
  isLoading: boolean
  editFormLocal: ProductAttributeResponse | undefined
  valueId: string | null
  setValueId: React.Dispatch<React.SetStateAction<string | null>>
  setEditFormLocal: React.Dispatch<React.SetStateAction<ProductAttributeResponse | undefined>>
}
const ProductAttributeValues = ({
  selectedAttributeId,
  editFormLocal,
  isLoading,
  valueId,
  setValueId,
  setEditFormLocal,
}: ProductAttributeValuesProps) => {
  const { localDeleteValue, localEditValue } = useHandlerProductAttributeValues({
    setValueId,
    setEditFormLocal,
  })

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
        <Button type="link">+ Добавить значение</Button>
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
