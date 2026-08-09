import React from 'react'

import {
  AttributeValueResponse,
  ProductAttributeRequest,
  ProductAttributeResponse,
} from '@/shared/lib/api/product-attributes/types'
import { Button, Input, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import { AttributeValue } from '@/app/types/product'

import { typeOptions } from '../const/const'
import { ErrorsProps, RowErrorsProps } from '../types/productAttributesTypes'
import ProductAttributeValues from './ProductAttributeValues'

interface ProductAttributeMainInfoProps {
  editFormLocal: ProductAttributeResponse | undefined
  selectedAttributeId: string | null
  isLoading: boolean
  formOption: ProductAttributeRequest
  valueId: string | null
  errors: ErrorsProps
  rowErrors: RowErrorsProps

  validateForm: (field: keyof ProductAttributeRequest, value: any) => void
  validateRowField: (id: string, field: keyof AttributeValueResponse, value: any) => void
  addValue: () => void
  localDeleteValue: (id: string) => void
  localEditValue: (id: string, failed: keyof AttributeValue, value: any) => void
  setEditFormLocal: React.Dispatch<React.SetStateAction<ProductAttributeResponse | undefined>>
  setValueId: React.Dispatch<React.SetStateAction<string | null>>
  deleteOption: (id: string) => Promise<void>
  setAllProdAttr: React.Dispatch<React.SetStateAction<ProductAttributeResponse[]>>
  setSelectedAttributeId: React.Dispatch<React.SetStateAction<string | null>>
  setFilteredOptions: React.Dispatch<React.SetStateAction<ProductAttributeResponse[]>>
}
const ProductAttributeMainInfo = ({
  editFormLocal,
  selectedAttributeId,
  isLoading,
  valueId,
  errors,
  rowErrors,
  validateRowField,

  addValue,
  validateForm,
  localDeleteValue,
  localEditValue,
  setEditFormLocal,
  setValueId,
  deleteOption,
}: ProductAttributeMainInfoProps) => {
  const handlerInputsSelect = (failed: keyof ProductAttributeResponse, value: any) => {
    setEditFormLocal(prev => ({
      ...prev!,
      [failed]: failed === 'sortOrder' ? Number(value) : value,
    }))
  }
  return (
    <div className="product-attribute-info-split">
      <div className="product-attribute">
        <div className="title-and-btns">
          <h4 className="middle-title">Информация об опции</h4>
          {selectedAttributeId && (
            <div className="product-attribute-btns">
              <Button
                className="product-attribute-btns-delete"
                onClick={() => deleteOption(selectedAttributeId)}
              >
                Удалить
              </Button>
            </div>
          )}
        </div>

        {selectedAttributeId && editFormLocal ? (
          <div className="select-attr-main-info">
            <div className="select-attr-inputs">
              <div className="select-attr-inputs-title-and-input">
                <span className="select-attr-inputs-title">Название</span>
                <Input
                  value={editFormLocal?.name}
                  onChange={e => {
                    handlerInputsSelect('name', e.target.value)
                    validateForm('name', e.target.value)
                  }}
                  status={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
              <div className="select-attr-inputs-title-and-input">
                <span className="select-attr-inputs-title">Slug</span>
                <Input
                  value={editFormLocal?.slug}
                  onChange={e => {
                    handlerInputsSelect('slug', e.target.value)
                    validateForm('slug', e.target.value)
                  }}
                  status={errors.slug ? 'error' : ''}
                />
                {errors.slug && <span className="error-text">{errors.slug}</span>}
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
                  type="number"
                  min={0}
                  value={editFormLocal?.sortOrder}
                  onChange={e => {
                    const value = e.target.value

                    const numValue = value === '' ? undefined : Number(value)
                    handlerInputsSelect('sortOrder', numValue)
                    validateForm('sortOrder', numValue)
                  }}
                  status={errors.sortOrder ? 'error' : ''}
                />
                {errors.sortOrder && <span className="error-text">{errors.sortOrder}</span>}
              </div>
            </div>
            <div className="select-attr-description">
              <span className="select-attr-inputs-title-description">Описание</span>
              <TextArea
                value={editFormLocal?.description}
                rows={5}
                onChange={e => handlerInputsSelect('description', e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="select-attr-main-info-empty"></div>
        )}
      </div>
      <ProductAttributeValues
        isLoading={isLoading}
        editFormLocal={editFormLocal}
        selectedAttributeId={selectedAttributeId}
        valueId={valueId}
        rowErrors={rowErrors}
        validateRowField={validateRowField}
        addValue={addValue}
        setValueId={setValueId}
        setEditFormLocal={setEditFormLocal}
        localDeleteValue={localDeleteValue}
        localEditValue={localEditValue}
      />
    </div>
  )
}

export default ProductAttributeMainInfo
