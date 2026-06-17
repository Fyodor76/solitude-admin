import React from 'react'

import { ProductAttributeResponse } from '@/shared/lib/api/product-attributes/types'
import { Button, Table } from 'antd'

import { valueColumns } from '../helpers/ColumnsAttr'

interface ProductAttributeValuesProps {
  selectedAttributeId: string | null
  isLoading: boolean
  selectAttr: ProductAttributeResponse | undefined
}
const ProductAttributeValues = ({
  selectedAttributeId,
  selectAttr,
  isLoading,
}: ProductAttributeValuesProps) => {
  return (
    <div className="attribute-value">
      <div className="title-and-btn">
        <h4 className="middle-title">Значение опции</h4>
        <Button type="link">+ Добавить значение</Button>
      </div>
      {selectedAttributeId && selectAttr ? (
        <Table
          dataSource={selectAttr?.values}
          columns={valueColumns}
          loading={isLoading}
          rowKey={selectAttr.id}
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
