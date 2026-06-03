import React from 'react'

import {
  useCreateAttributeValueMutation,
  useUpdateAttributeValueMutation,
} from '@/shared/lib/api/product-attributes/AttributeValues'
import {
  useCreateProductAttributesMutation,
  useDeleteProductAttributeByIdMutation,
  useUpdateProductAttributesMutation,
} from '@/shared/lib/api/product-attributes/ProductAttributes'
import {
  AttributeValueRequest,
  ProductAttributeRequest,
} from '@/shared/lib/api/product-attributes/types'
import { Button } from 'antd'

const Test = () => {
  const [updateAttributeValue] = useUpdateAttributeValueMutation()
  const [createAttributeValue] = useCreateAttributeValueMutation()
  const [createProductAttributes] = useCreateProductAttributesMutation()
  const [updateProductAttributes] = useUpdateProductAttributesMutation()
  const [deleteProductAttributeById] = useDeleteProductAttributeByIdMutation()

  const attrId = 'e434eec9-1f2b-4ef6-9147-28ac4055a3c0'
  const createProdAttr = async () => {
    try {
      const newProdAttr: ProductAttributeRequest = {
        name: 'Цвет48',
        slug: 'attribut-tsvet48',
        type: 'color',
        description: 'Цвет товара',
        sortOrder: 0,
      }
      const result = await createProductAttributes({ data: newProdAttr })
      console.log(result.data)
    } catch (error) {
      console.log('Ошибка создания аттрибута продукта!', error)
    }
  }

  const createAttrValue = async () => {
    try {
      const newAttr: AttributeValueRequest = {
        value: 'green',
        displayName: 'Зеленый',
        slug: 'attribute-val-4757575037',
        sortOrder: 0,
        hexCode: '#00FF00',
        isActive: true,
      }
      const result = await createAttributeValue({ data: newAttr, attributeId: attrId })
      console.log(result.data)
    } catch (error) {
      console.log('Ошибка создания аттрибута продукта!', error)
    }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Button onClick={createProdAttr}>создать аттрибут продукта</Button>
      <Button onClick={createAttrValue}>создать значение атрибута для продукта</Button>
    </div>
  )
}

export default Test
