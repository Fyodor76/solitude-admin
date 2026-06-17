import React from 'react'

import { ProductAttributeResponse } from '@/shared/lib/api/product-attributes/types'
import Icon from '@/shared/ui/icons/Icon'
import { Button, Input, Table } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import ProductAttributeValues from './ProductAttributeValues'

interface ProductAttributeMainInfoProps {
  allProdAttr: ProductAttributeResponse[]
  selectedAttributeId: string | null
  isLoading: boolean
}
const ProductAttributeMainInfo = ({
  allProdAttr,
  selectedAttributeId,
  isLoading,
}: ProductAttributeMainInfoProps) => {
  const selectAttr = allProdAttr.find(prodAttr => prodAttr.id === selectedAttributeId)
  return (
    <>
      <div className="product-attribute">
        <div className="title-and-btns">
          <h4 className="middle-title">Информация об опции</h4>
          {selectedAttributeId && (
            <div className="product-attribute-btns">
              <Button className="product-attribute-btns-delete">Удалить</Button>
              <Button className="product-attribute-btns-edite">
                <Icon name="editing" /> Редактировать
              </Button>
            </div>
          )}
        </div>
        {selectedAttributeId && selectAttr ? (
          <div className="select-attr-main-info">
            <div className="select-attr-inputs">
              <div className="select-attr-inputs-title-and-input">
                <span className="select-attr-inputs-title">Название</span>
                <Input value={selectAttr?.name} />
              </div>
              <div className="select-attr-inputs-title-and-input">
                <span className="select-attr-inputs-title">Slug</span>
                <Input value={selectAttr?.slug} />
              </div>
              <div className="select-attr-inputs-title-and-input">
                <span className="select-attr-inputs-title">Тип</span>
                <Input value={selectAttr?.type} />
              </div>
              <div className="select-attr-inputs-title-and-input">
                <span className="select-attr-inputs-title">Порядок сортировки</span>
                <Input value={selectAttr?.sortOrder} />
              </div>
            </div>
            <div className="select-attr-description">
              <span className="select-attr-inputs-title-description">Описание</span>
              <TextArea value={selectAttr?.description} rows={11} />
            </div>
          </div>
        ) : (
          'Ничего не выбрано'
        )}
      </div>
      <ProductAttributeValues
        isLoading={isLoading}
        selectAttr={selectAttr}
        selectedAttributeId={selectedAttributeId}
      />
    </>
  )
}

export default ProductAttributeMainInfo
