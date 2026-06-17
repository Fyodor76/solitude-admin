import { useEffect, useState } from 'react'

import {
  useCreateProductAttributesMutation,
  useGetAllProductAttributesQuery,
  useUpdateProductAttributesMutation,
} from '@/shared/lib/api/product-attributes/ProductAttributes'
import {
  ProductAttributeRequest,
  ProductAttributeResponse,
} from '@/shared/lib/api/product-attributes/types'
import { useModal } from '@/shared/lib/hooks/useModal'

import { MODES } from '../categories/const/constans'
import ProductAttributeBtns from './components/ProductAttributeBtns'
import ProductAttributeMainInfo from './components/ProductAttributeMainInfo'
import ProductAttributeOptions from './components/ProductAttributeOptions'
import { initialState } from './const/const'
import { useHandlerPoductAttribute } from './hooks/useHandlerProductAttribute'
import ProductAttributeModal from './product-attribute-modal/ProductAttributeModal'
import './ProductAttributes.scss'

const ProductAttribute = () => {
  const { data: productAttributes, isLoading, isError, refetch } = useGetAllProductAttributesQuery()
  const [createProductAttributes] = useCreateProductAttributesMutation()
  const [updateProductAttributes] = useUpdateProductAttributesMutation()
  const [allProdAttr, setAllProdAttr] = useState<ProductAttributeResponse[]>([])
  const [selectedAttributeId, setSelectedAttributeId] = useState<string | null>(null)
  const [filteredOptions, setFilteredOptions] = useState<ProductAttributeResponse[]>([])
  const [formOption, setFormOption] = useState<ProductAttributeRequest>(initialState)
  const modal = useModal()
  const mode = modal.mode
  const isCreate = mode === MODES.CREATE
  const isEdit = mode === MODES.EDIT

  useEffect(() => {
    if (productAttributes?.data) {
      setAllProdAttr(productAttributes?.data)
      setFilteredOptions(productAttributes?.data)
    }
  }, [productAttributes?.data])

  console.log(productAttributes?.data)

  const onSaveCreated = async () => {
    try {
      const newOption: ProductAttributeRequest = {
        name: formOption.name,
        slug: formOption.slug,
        type: formOption.type,
        description: formOption.description,
        sortOrder: formOption.sortOrder,
      }
      const response = await createProductAttributes({ data: newOption }).unwrap()
      setAllProdAttr(prev => {
        return [...prev, response.data]
      })
      setFilteredOptions(prev => [...prev, response.data])
      setFormOption(initialState)

      modal.onClose()
      console.log('Создала новую опцию!')
    } catch (error) {
      console.log('Ошибка создания новой опции...', error)
    }
  }

  const onSaveEdited = async (data: Partial<ProductAttributeRequest>, id: string) => {
    try {
      const response = await updateProductAttributes({ data, id }).unwrap()
      setAllProdAttr(prev => prev.map(prodAttr => (prodAttr.id === id ? response.data : prodAttr)))
      setFilteredOptions(prev =>
        prev.map(filterProdAttr => (filterProdAttr.id === id ? response.data : filterProdAttr))
      )
      setFormOption(initialState)
      console.log(`Отредактировала опцию: ${response.data.name}`)
      modal.onClose()
    } catch (error) {
      console.log('Ошибка редактирования опции...', error)
    }
  }

  const handlerCreateOption = () => {
    modal.setMode(MODES.CREATE)
    setFormOption(initialState)
    modal.onOpen(formOption)
  }

  const handlerEditOption = (selectAttr: ProductAttributeResponse | undefined) => {
    if (!selectAttr) return
    modal.setMode(MODES.EDIT)
    setFormOption({
      name: selectAttr.name,
      slug: selectAttr.slug,
      type: selectAttr.type,
      description: selectAttr.description,
      sortOrder: selectAttr.sortOrder,
    })
    modal.onOpen(formOption)
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
            allProdAttr={allProdAttr}
            selectedAttributeId={selectedAttributeId}
            formOption={formOption}
            isLoading={isLoading}
            setAllProdAttr={setAllProdAttr}
            setFilteredOptions={setFilteredOptions}
            setSelectedAttributeId={setSelectedAttributeId}
            handlerEditOption={handlerEditOption}
            isEdit={isEdit}
          />
        </div>
      </div>
      <ProductAttributeBtns />
      <ProductAttributeModal
        isCreate={isCreate}
        selectedAttributeId={selectedAttributeId}
        formOption={formOption}
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        setFormOption={setFormOption}
        onSaveCreated={onSaveCreated}
        onSaveEdited={onSaveEdited}
      />
    </div>
  )
}

export default ProductAttribute
