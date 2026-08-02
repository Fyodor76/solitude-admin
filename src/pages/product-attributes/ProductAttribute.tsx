import { useEffect, useState } from 'react'

import { useGetAllProductAttributesQuery } from '@/shared/lib/api/product-attributes/ProductAttributes'
import {
  AttributeValueRequest,
  ProductAttributeRequest,
  ProductAttributeResponse,
} from '@/shared/lib/api/product-attributes/types'
import { useModal } from '@/shared/lib/hooks/useModal'
import Icon from '@/shared/ui/icons/Icon'
import { Spin } from 'antd'

import { MODES } from '../categories/const/constans'
import ProductAttributeBtns from './components/ProductAttributeBtns'
import ProductAttributeMainInfo from './components/ProductAttributeMainInfo'
import ProductAttributeOptions from './components/ProductAttributeOptions'
import { initialState, initialStateValue } from './const/const'
import { useHandlerPoductAttribute } from './hooks/useHandlerProductAttribute'
import { useHandlerProductAttributeValues } from './hooks/useHandlerProductAttributeValues'
import useProductAttributeActions from './hooks/useProductAttributeActions'
import { useValidateForms } from './hooks/useValidateForms'
import ProductAttributeModal from './product-attribute-modal/ProductAttributeModal'
import './ProductAttributes.scss'
import { ErrorsProps, ErrorsValueProps, RowErrorsProps } from './types/productAttributesTypes'

const ProductAttribute = () => {
  const { data: productAttributes, isLoading } = useGetAllProductAttributesQuery()

  const [allProdAttr, setAllProdAttr] = useState<ProductAttributeResponse[]>([])
  const [selectedAttributeId, setSelectedAttributeId] = useState<string | null>(null)
  const [filteredOptions, setFilteredOptions] = useState<ProductAttributeResponse[]>([])
  const [formOption, setFormOption] = useState<ProductAttributeRequest>(initialState)
  const [formValue, setFormValue] = useState<AttributeValueRequest>(initialStateValue)
  const [valueId, setValueId] = useState<string | null>(null)
  const selectAttr = allProdAttr.find(prodAttr => prodAttr.id === selectedAttributeId)
  const [editFormLocal, setEditFormLocal] = useState<ProductAttributeResponse | undefined>(
    selectAttr
  )
  const [errors, setErrors] = useState<ErrorsProps>({})
  const [errorsValue, setErrorsValue] = useState<ErrorsValueProps>({})
  const [rowErrors, setRowErrors] = useState<RowErrorsProps>({})
  const modal = useModal()
  const mode = modal.mode
  const isCreateOption = mode === MODES.CREATE

  const { onSaveCreatedOption, onSaveEditedOption, deleteOption, handlerCreateOption } =
    useHandlerPoductAttribute({
      allProdAttr,
      selectedAttributeId,
      formOption,
      modal,
      setErrors,
      setAllProdAttr,
      setFilteredOptions,
      setSelectedAttributeId,
      setEditFormLocal,
      setFormOption,
    })

  const { onSaveEditedValue, localDeleteValue, addValue, localEditValue, onSaveCreatedValue } =
    useHandlerProductAttributeValues({
      editFormLocal,
      formValue,
      selectedAttributeId,
      modal,
      setFormValue,
      setValueId,
      setEditFormLocal,
      setAllProdAttr,
    })

  const { saveAllChanges, handleCancel } = useProductAttributeActions({
    selectAttr,
    editFormLocal,
    selectedAttributeId,
    onSaveEditedValue,
    setEditFormLocal,
    onSaveEditedOption,
    setErrors,
    setErrorsValue,
    setRowErrors,
  })

  const { validateForm, validateValueForm, validateRowField } = useValidateForms({
    errors,
    errorsValue,
    setErrors,
    setErrorsValue,
    setRowErrors,
  })
  useEffect(() => {
    if (productAttributes?.data) {
      const data = productAttributes?.data
      setAllProdAttr(data)
      setFilteredOptions(data)

      if (data.length > 0 && !selectedAttributeId) {
        setSelectedAttributeId(data[0].id)
      }
    }
  }, [productAttributes?.data])

  useEffect(() => {
    if (selectAttr) {
      setEditFormLocal(selectAttr)
    } else {
      setEditFormLocal(undefined)
    }
  }, [selectAttr])

  return (
    <div className="product-attributes-wrap">
      <h1 className="main-title">Управление опциями товаров</h1>
      <div className="product-attributes-main">
        {isLoading ? (
          <div className="prod-attr-loading">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <ProductAttributeOptions
              isLoading={isLoading}
              filteredOptions={filteredOptions}
              allProdAttr={allProdAttr}
              selectedAttributeId={selectedAttributeId}
              setSelectedAttributeId={setSelectedAttributeId}
              setFilteredOptions={setFilteredOptions}
              handlerCreateOption={handlerCreateOption}
            />
            <div className="product-attribute-info">
              {filteredOptions.length === 0 ? (
                <div className="product-attribute-info-empty">
                  <Icon name="boxOpen" className="no-results-icon-options"></Icon>
                  <h3>Опции товаров отсутствуют</h3>
                  <span className="no-results-info">
                    Создайте первую опцию товара, чтобы начать работу.
                  </span>
                </div>
              ) : (
                <ProductAttributeMainInfo
                  selectedAttributeId={selectedAttributeId}
                  formOption={formOption}
                  isLoading={isLoading}
                  editFormLocal={editFormLocal}
                  errors={errors}
                  rowErrors={rowErrors}
                  validateRowField={validateRowField}
                  validateForm={validateForm}
                  localDeleteValue={localDeleteValue}
                  localEditValue={localEditValue}
                  setEditFormLocal={setEditFormLocal}
                  setAllProdAttr={setAllProdAttr}
                  setFilteredOptions={setFilteredOptions}
                  setSelectedAttributeId={setSelectedAttributeId}
                  deleteOption={deleteOption}
                  valueId={valueId}
                  setValueId={setValueId}
                  addValue={addValue}
                />
              )}
            </div>
          </>
        )}
      </div>

      {!isLoading && (
        <>
          <ProductAttributeBtns saveAllChanges={saveAllChanges} handleCancel={handleCancel} />
          <ProductAttributeModal
            isCreateOption={isCreateOption}
            selectedAttributeId={selectedAttributeId}
            formOption={formOption}
            formValue={formValue}
            errors={errors}
            errorsValue={errorsValue}
            validateForm={validateForm}
            validateValueForm={validateValueForm}
            setFormValue={setFormValue}
            isOpen={modal.isOpen}
            onClose={modal.onClose}
            setFormOption={setFormOption}
            onSaveCreatedOption={onSaveCreatedOption}
            onSaveCreatedValue={onSaveCreatedValue}
          />
        </>
      )}
    </div>
  )
}

export default ProductAttribute
