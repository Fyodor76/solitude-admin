import { useEffect, useState } from 'react'

import { useGetAllProductAttributesQuery } from '@/shared/lib/api/product-attributes/ProductAttributes'
import {
  AttributeValueRequest,
  ProductAttributeRequest,
  ProductAttributeResponse,
} from '@/shared/lib/api/product-attributes/types'
import { useModal } from '@/shared/lib/hooks/useModal'
import Icon from '@/shared/ui/icons/Icon'

import { MODES } from '../categories/const/constans'
import ProductAttributeBtns from './components/ProductAttributeBtns'
import ProductAttributeMainInfo from './components/ProductAttributeMainInfo'
import ProductAttributeOptions from './components/ProductAttributeOptions'
import { initialState, initialStateValue } from './const/const'
import { useHandlerPoductAttribute } from './hooks/useHandlerProductAttribute'
import { useHandlerProductAttributeValues } from './hooks/useHandlerProductAttributeValues'
import ProductAttributeModal from './product-attribute-modal/ProductAttributeModal'
import './ProductAttributes.scss'

const ProductAttribute = () => {
  const { data: productAttributes, isLoading, isError, refetch } = useGetAllProductAttributesQuery()

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
  const modal = useModal()
  const mode = modal.mode
  const isCreateOption = mode === MODES.CREATE

  const { onSaveCreatedOption, onSaveEditedOption, deleteOption } = useHandlerPoductAttribute({
    allProdAttr,
    selectedAttributeId,
    formOption,
    setAllProdAttr,
    setFilteredOptions,
    setSelectedAttributeId,
    setEditFormLocal,
    setFormOption,
  })

  const { onSaveEditedValue, localDeleteValue, localEditValue, onSaveCreatedValue } =
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

  console.log(productAttributes?.data)

  const handlerCreateOption = () => {
    setFormOption(initialState)
    modal.setMode(MODES.CREATE)
    modal.onOpen(formOption)
  }

  const saveAllChanges = async () => {
    try {
      if (selectedAttributeId && editFormLocal) {
        const { id, values, isActive, createdAt, updatedAt, ...optionData } = editFormLocal

        await onSaveEditedOption(optionData, selectedAttributeId)
      }
      if (selectedAttributeId && editFormLocal) {
        await onSaveEditedValue(selectedAttributeId, editFormLocal)
      }
      console.log('Все изменения сохранены!')
    } catch (error) {
      console.error('Ошибка сохранения:', error)
    }
  }

  const addValue = () => {
    setFormValue(initialStateValue)
    modal.setMode(MODES.EDIT)
    modal.onOpen(formValue)
  }
  return (
    <div className="product-attributes-wrap">
      <h1 className="main-title">Управление опциями товаров</h1>
      <div className="product-attributes-main">
        <ProductAttributeOptions
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
      </div>
      <ProductAttributeBtns saveAllChanges={saveAllChanges} />
      <ProductAttributeModal
        isCreateOption={isCreateOption}
        selectedAttributeId={selectedAttributeId}
        formOption={formOption}
        formValue={formValue}
        setFormValue={setFormValue}
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        setFormOption={setFormOption}
        onSaveCreatedOption={onSaveCreatedOption}
        onSaveCreatedValue={onSaveCreatedValue}
      />
    </div>
  )
}

export default ProductAttribute
