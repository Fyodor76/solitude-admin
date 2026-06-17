import { useEffect, useState } from 'react'

import {
  useCreateProductAttributesMutation,
  useGetAllProductAttributesQuery,
} from '@/shared/lib/api/product-attributes/ProductAttributes'
import {
  ProductAttributeRequest,
  ProductAttributeResponse,
} from '@/shared/lib/api/product-attributes/types'
import { useModal } from '@/shared/lib/hooks/useModal'
import { Button } from 'antd'

import ProductAttributeBtns from './components/ProductAttributeBtns'
import ProductAttributeMainInfo from './components/ProductAttributeMainInfo'
import ProductAttributeOptions from './components/ProductAttributeOptions'
import { initialState } from './const/const'
import ProductAttributeModal from './product-attribute-modal/ProductAttributeModal'
import './ProductAttributes.scss'

const ProductAttribute = () => {
  const { data: productAttributes, isLoading, isError, refetch } = useGetAllProductAttributesQuery()
  const [createProductAttributes] = useCreateProductAttributesMutation()
  const [allProdAttr, setAllProdAttr] = useState<ProductAttributeResponse[]>([])
  const [selectedAttributeId, setSelectedAttributeId] = useState<string | null>(null)
  const [filteredOptions, setFilteredOptions] = useState<ProductAttributeResponse[]>([])
  const [formOption, setFormOption] = useState<ProductAttributeRequest>(initialState)

  const modal = useModal()

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
      setFormOption(initialState)

      modal.onClose()
      console.log('Создала новую опцию!')
    } catch (error) {
      console.log('Ошибка создания новой опции...', error)
    }
  }

  const handlerCreateOption = () => {
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
            isLoading={isLoading}
          />
        </div>
      </div>
      <ProductAttributeBtns />
      <ProductAttributeModal
        formOption={formOption}
        isOpen={modal.isOpen}
        onClose={modal.onClose}
        setFormOption={setFormOption}
        onSave={onSaveCreated}
      />
    </div>
  )
}

export default ProductAttribute
