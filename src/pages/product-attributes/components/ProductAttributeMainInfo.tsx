import React, { useState } from 'react'

import {
  ProductAttributeRequest,
  ProductAttributeResponse,
} from '@/shared/lib/api/product-attributes/types'
import Icon from '@/shared/ui/icons/Icon'
import { Button, Input, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import { typeOptions } from '../const/const'
import { useHandlerPoductAttribute } from '../hooks/useHandlerProductAttribute'
import ProductAttributeValues from './ProductAttributeValues'

interface ProductAttributeMainInfoProps {
  allProdAttr: ProductAttributeResponse[]
  selectedAttributeId: string | null
  isLoading: boolean
  isEdit: boolean
  formOption: ProductAttributeRequest

  setAllProdAttr: React.Dispatch<React.SetStateAction<ProductAttributeResponse[]>>
  setSelectedAttributeId: React.Dispatch<React.SetStateAction<string | null>>
  setFilteredOptions: React.Dispatch<React.SetStateAction<ProductAttributeResponse[]>>
  handlerEditOption: (selectAttr: ProductAttributeResponse | undefined) => void
}
const ProductAttributeMainInfo = ({
  allProdAttr,

  selectedAttributeId,
  isLoading,
  isEdit,
  setAllProdAttr,
  setFilteredOptions,
  setSelectedAttributeId,
  handlerEditOption,
}: ProductAttributeMainInfoProps) => {
  const { deleteProdAttr } = useHandlerPoductAttribute({
    allProdAttr,
    selectedAttributeId,
    setAllProdAttr,
    setFilteredOptions,
    setSelectedAttributeId,
  })

  const selectAttr = allProdAttr.find(prodAttr => prodAttr.id === selectedAttributeId)
  const [editFormLocal, setEditFormLocal] = useState<ProductAttributeResponse | undefined>(
    selectAttr
  )
  const handlerInputsSelect = (failed: keyof ProductAttributeResponse, value: any) => {
    setEditFormLocal(prev => ({
      ...prev!,
      [failed]: value,
    }))
  }
  return (
    <>
      <div className="product-attribute">
        <div className="title-and-btns">
          <h4 className="middle-title">Информация об опции</h4>
          {selectedAttributeId && (
            <div className="product-attribute-btns">
              <Button
                className="product-attribute-btns-delete"
                onClick={() => deleteProdAttr(selectedAttributeId)}
              >
                Удалить
              </Button>
              <Button
                className="product-attribute-btns-edite"
                onClick={() => handlerEditOption(selectAttr)}
              >
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
                <Input
                  value={editFormLocal?.name}
                  onChange={e => handlerInputsSelect('name', e.target.value)}
                />
              </div>
              <div className="select-attr-inputs-title-and-input">
                <span className="select-attr-inputs-title">Slug</span>
                <Input
                  value={editFormLocal?.slug}
                  onChange={e => handlerInputsSelect('slug', e.target.value)}
                />
              </div>
              <div className="select-attr-inputs-title-and-input">
                <span className="select-attr-inputs-title">Тип</span>
                <Select
                  value={editFormLocal?.type}
                  onChange={v => handlerInputsSelect('type', v)}
                  options={typeOptions}
                />
              </div>
              <div className="select-attr-inputs-title-and-input">
                <span className="select-attr-inputs-title">Порядок сортировки</span>
                <Input
                  value={editFormLocal?.sortOrder}
                  onChange={e => handlerInputsSelect('sortOrder', e.target.value)}
                />
              </div>
            </div>
            <div className="select-attr-description">
              <span className="select-attr-inputs-title-description">Описание</span>
              <TextArea
                value={editFormLocal?.description}
                rows={11}
                onChange={e => handlerInputsSelect('description', e.target.value)}
              />
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
