import { useEffect, useState } from 'react'

import { useGetAllProductAttributesQuery } from '@/shared/lib/api/product-attributes/ProductAttributes'
import {
  AttributeValueRequest,
  ProductAttributeRequest,
  ProductAttributeResponse,
} from '@/shared/lib/api/product-attributes/types'
import { useModal } from '@/shared/lib/hooks/useModal'
import Icon from '@/shared/ui/icons/Icon'
import { message } from 'antd'

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
  const [errors, setErrors] = useState<{
    name?: string
    slug?: string
    type?: string
    sortOrder?: string
  }>({})
  const [errorsValue, setErrorsValue] = useState<{
    value?: string
    displayName?: string
    hexCode?: string
  }>({})
  const modal = useModal()
  const mode = modal.mode
  const isCreateOption = mode === MODES.CREATE
  console.log(editFormLocal)
  console.log(formOption)
  console.log(formValue)
  const { onSaveCreatedOption, onSaveEditedOption, deleteOption } = useHandlerPoductAttribute({
    allProdAttr,
    selectedAttributeId,
    formOption,
    modal,
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
    setErrors({})
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

  const handleCancel = () => {
    if (selectAttr) {
      setEditFormLocal(selectAttr)
      setErrors({})
      message.info('Все изменения отменены')
    }
  }

  const validateForm = (field: keyof ProductAttributeRequest, value: any) => {
    const newErrors = { ...errors }
    if (field === 'name') {
      if (!value || value.trim() === '') {
        newErrors.name = 'Введите название опции'
      } else {
        delete newErrors.name
      }
    }
    if (field === 'slug') {
      if (!value || value.trim() === '') {
        newErrors.slug = 'Введите slug опции'
      } else if (!/^[a-zA-Z0-9-]+$/.test(value)) {
        newErrors.slug = 'Только латинские буквы, цифры и дефисы'
      } else {
        delete newErrors.slug
      }
    }

    if (field === 'sortOrder') {
      if (value !== undefined && value !== null && value !== '') {
        const num = Number(value)
        if (isNaN(num)) {
          newErrors.sortOrder = 'Порядок сортировки должен быть числом'
        } else if (num < 0 || num > 10) {
          newErrors.sortOrder = 'Номер сортировки не должен быть отрицательным числом или больше 10'
        } else {
          delete newErrors.sortOrder
        }
      } else {
        delete newErrors.sortOrder
      }
    }
    setErrors(newErrors)
  }

  const validateValueForm = (field: keyof AttributeValueRequest, value: any) => {
    const newErrors = { ...errorsValue }
    if (field === 'value') {
      if (!value || value.trim() === '') {
        newErrors.value = 'Введите значение'
      } else if (!/^[a-zA-Z0-9-_]+$/.test(value)) {
        newErrors.value = 'Только латинские буквы, цифры, дефис и подчеркивание'
      } else {
        delete newErrors.value
      }
    }
    if (field === 'displayName') {
      if (!value || value.trim() === '') {
        newErrors.displayName = 'Введите название на русском языке'
      } else if (!/^[А-Яа-яёЁ0-9-_]+$/.test(value)) {
        newErrors.displayName = 'Только русские буквы, цифры, дефис и подчеркивание'
      } else {
        delete newErrors.displayName
      }
    }
    if (field === 'hexCode') {
      if (value && !/^#[0-9A-Fa-f]{6}$/.test(value)) {
        newErrors.hexCode = 'Введите корректный HEX код (например, #FF0000)'
      } else {
        delete newErrors.hexCode
      }
    }
    setErrorsValue(newErrors)
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
              errors={errors}
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
      </div>
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
    </div>
  )
}

export default ProductAttribute
