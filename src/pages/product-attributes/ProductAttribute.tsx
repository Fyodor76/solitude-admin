import { useEffect, useState } from 'react'

import { useGetAllProductAttributesQuery } from '@/shared/lib/api/product-attributes/ProductAttributes'
import {
  ProductAttributeRequest,
  ProductAttributeResponse,
} from '@/shared/lib/api/product-attributes/types'
import { useModal } from '@/shared/lib/hooks/useModal'

import { MODES } from '../categories/const/constans'
import EditCategoryModal from '../categories/modal/EditCategoryModal'
import ProductAttributeBtns from './components/ProductAttributeBtns'
import ProductAttributeMainInfo from './components/ProductAttributeMainInfo'
import ProductAttributeOptions from './components/ProductAttributeOptions'
import { initialState } from './const/const'
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
  const [valueId, setValueId] = useState<string | null>(null)
  const selectAttr = allProdAttr.find(prodAttr => prodAttr.id === selectedAttributeId)
  const [editFormLocal, setEditFormLocal] = useState<ProductAttributeResponse | undefined>(
    selectAttr
  )
  const modal = useModal()
  const mode = modal.mode
  const isCreate = mode === MODES.CREATE
  const isEdit = mode === MODES.EDIT
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

  const { onSaveEditedValue } = useHandlerProductAttributeValues({ setValueId, setEditFormLocal })
  useEffect(() => {
    if (productAttributes?.data) {
      setAllProdAttr(productAttributes?.data)
      setFilteredOptions(productAttributes?.data)
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
    modal.setMode(MODES.CREATE)
    setFormOption(initialState)
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
          <ProductAttributeMainInfo
            selectedAttributeId={selectedAttributeId}
            formOption={formOption}
            isLoading={isLoading}
            editFormLocal={editFormLocal}
            setEditFormLocal={setEditFormLocal}
            setAllProdAttr={setAllProdAttr}
            setFilteredOptions={setFilteredOptions}
            setSelectedAttributeId={setSelectedAttributeId}
            deleteOption={deleteOption}
            valueId={valueId}
            setValueId={setValueId}
          />
        </div>
      </div>
      <ProductAttributeBtns saveAllChanges={saveAllChanges} />
      <ProductAttributeModal
        isCreate={isCreate}
        selectedAttributeId={selectedAttributeId}
        formOption={formOption}
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        setFormOption={setFormOption}
        onSaveCreatedOption={onSaveCreatedOption}
      />
    </div>
  )
}

export default ProductAttribute
