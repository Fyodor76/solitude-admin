import React, { useEffect, useState } from 'react'

import {
  useCreateAttributeValueMutation,
  useDeleteAttributeValueByIdMutation,
  useUpdateAttributeValueMutation,
} from '@/shared/lib/api/product-attributes/AttributeValues'
import {
  useCreateProductAttributesMutation,
  useDeleteProductAttributeByIdMutation,
  useGetAllProductAttributesQuery,
  useUpdateProductAttributesMutation,
} from '@/shared/lib/api/product-attributes/ProductAttributes'
import {
  AttributeValueRequest,
  AttributeValueResponse,
  ProductAttributeRequest,
  ProductAttributeResponse,
} from '@/shared/lib/api/product-attributes/types'
import Icon from '@/shared/ui/icons/Icon'
import { Button, Input, message } from 'antd'
import { div } from 'framer-motion/client'
import { h4 } from 'framer-motion/m'

const initialData: ProductAttributeResponse = {
  id: '',
  isActive: true,
  values: [],
  createdAt: '',
  updatedAt: '',
  name: '',
  slug: '',
  type: 'color' || 'size' || 'volume' || 'weight' || 'dimension' || 'other',
  description: '',
  sortOrder: 0,
}
const Test = () => {
  const [updateAttributeValue] = useUpdateAttributeValueMutation()
  const [createAttributeValue] = useCreateAttributeValueMutation()
  const [createProductAttributes] = useCreateProductAttributesMutation()
  const [updateProductAttributes] = useUpdateProductAttributesMutation()
  const [deleteProductAttributeById] = useDeleteProductAttributeByIdMutation()
  const [deleteAttributeValueById] = useDeleteAttributeValueByIdMutation()
  const { data: productAttributes, isLoading, isError, refetch } = useGetAllProductAttributesQuery()
  const [prodAttr, setProdAttr] = useState<ProductAttributeResponse[]>([])

  useEffect(() => {
    if (productAttributes?.data) {
      setProdAttr(productAttributes?.data)
    }
  }, [productAttributes?.data])
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
      refetch()
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
  const handleInputChange = (
    id: string,
    field: keyof ProductAttributeResponse,
    value: string | number
  ) => {
    setProdAttr(prev => prev.map(attr => (attr.id === id ? { ...attr, [field]: value } : attr)))
  }
  const save = async () => {
    if (!prodAttr.length) return
    try {
      for (const attr of prodAttr) {
        await updateProductAttributes({
          data: {
            name: attr.name,
            slug: attr.slug,
            type: attr.type,
            description: attr.description || '',
            sortOrder: attr.sortOrder || 0,
          },
          id: attr.id,
        }).unwrap()

        for (const value of attr.values) {
          await updateAttributeValue({
            data: {
              value: value.value,
              displayName: value.displayName,
              slug: value.slug || `${attr.slug}-${value.value}`,
              sortOrder: value.sortOrder || 0,
              hexCode: value.hexCode,
              isActive: value.isActive,
            },
            attributeId: attr.id,
            valueId: value.id,
          }).unwrap()
        }
      }
      console.log('✅ Изменения сохранены!')
      refetch()
    } catch (error) {
      console.log('Ошибка редактирования атрибута товара', error)
    }
  }

  const handleValueChange = (
    attrId: string,
    valueId: string,
    field: keyof AttributeValueResponse,
    newValue: string
  ) => {
    setProdAttr(prev =>
      prev.map(attr =>
        attr.id === attrId
          ? {
              ...attr,
              values: attr.values.map(val =>
                val.id === valueId ? { ...val, [field]: newValue } : val
              ),
            }
          : attr
      )
    )
  }

  const deleteProductAttr = async (id: string) => {
    try {
      await deleteProductAttributeById(id).unwrap()
      refetch()
      console.log('Аттрибут удален')
    } catch (error) {
      console.log('Ошибка удаления аттрибута', error)
    }
  }
  const deleteAttr = async (attrId: string, valueId: string) => {
    try {
      await deleteAttributeValueById({ attrId, valueId }).unwrap()
      refetch()
      console.log('Значение аттрибута удалено')
    } catch (error) {
      console.log('Ошибка удаления значения аттрибута', error)
    }
  }

  if (isLoading) return <div>Загрузка...</div>
  if (isError) return <div>Ошибка загрузки атрибутов</div>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '50px' }}>
      <Button onClick={createProdAttr}>создать аттрибут продукта</Button>
      <Button onClick={createAttrValue}>создать значение атрибута для продукта</Button>
      {prodAttr &&
        prodAttr.map((prodAttr, index) => (
          <div
            style={{ display: 'flex', flexDirection: 'column', padding: '8px' }}
            key={prodAttr.id}
          >
            <h3>Аттрибут товара №{index + 1}</h3>
            <div style={{ display: 'flex' }}>
              <span>Название:</span>
              <Input
                type="text"
                placeholder="Введите название аттрибута"
                value={prodAttr.name}
                onChange={e => handleInputChange(prodAttr.id, 'name', e.target.value)}
              />
            </div>

            <div style={{ display: 'flex' }}>
              <span>Описание:</span>
              <Input
                type="text"
                placeholder="Введите описание аттрибута"
                value={prodAttr.description}
                onChange={e => handleInputChange(prodAttr.id, 'description', e.target.value)}
              />
            </div>
            <div style={{ display: 'flex' }}>
              <span>Тип:</span>
              <Input
                type="text"
                placeholder="Введите тип аттрибута"
                value={prodAttr.type}
                onChange={e => handleInputChange(prodAttr.id, 'type', e.target.value)}
              />
            </div>

            {prodAttr.values.length > 0 &&
              prodAttr.values.map(v => (
                <div
                  style={{ display: 'flex', flexDirection: 'column', marginLeft: '30px' }}
                  key={v.id}
                >
                  <h4>Значение атрибута:</h4>
                  <div
                    key={v.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      flexDirection: 'column',
                    }}
                  >
                    <div>
                      <span style={{ width: '80px' }}>Значение:</span>
                      <Input
                        type="text"
                        value={v.displayName}
                        onChange={e =>
                          handleValueChange(prodAttr.id, v.id, 'displayName', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <span style={{ width: '80px' }}>Код:</span>
                      <Input
                        type="text"
                        value={v.hexCode}
                        onChange={e =>
                          handleValueChange(prodAttr.id, v.id, 'hexCode', e.target.value)
                        }
                      />
                    </div>
                    <Button onClick={() => deleteAttr(prodAttr.id, v.id)}>
                      <Icon name="delete" />
                    </Button>
                  </div>
                </div>
              ))}
            <Button onClick={() => deleteProductAttr(prodAttr.id)}>
              <Icon name="delete" />
            </Button>
          </div>
        ))}
      <Button onClick={save}>сохранить изменения</Button>
    </div>
  )
}

export default Test
