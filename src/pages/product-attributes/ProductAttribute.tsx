import { useEffect, useState } from 'react'

import { useGetAllProductAttributesQuery } from '@/shared/lib/api/product-attributes/ProductAttributes'
import { ProductAttributeResponse } from '@/shared/lib/api/product-attributes/types'
import Icon from '@/shared/ui/icons/Icon'
import { Button, Input } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { div } from 'framer-motion/client'

import { getIconForAttribute } from '@/app/constans/getIconForAttribute'

import './ProductAttributes.scss'

const ProductAttribute = () => {
  const [allProdAttr, setAllProdAttr] = useState<ProductAttributeResponse[]>([])
  const { data: productAttributes, isLoading, isError, refetch } = useGetAllProductAttributesQuery()
  const [selectedAttributeId, setSelectedAttributeId] = useState<string | null>(null)

  useEffect(() => {
    if (productAttributes?.data) {
      setAllProdAttr(productAttributes?.data)
    }
  }, [productAttributes?.data])
  console.log(productAttributes?.data)
  const handlerClickOption = (attributeId: string) => {
    setSelectedAttributeId(attributeId)
  }

  const selectAttr = allProdAttr.find(prodAttr => prodAttr.id === selectedAttributeId)
  return (
    <div className="product-attributes-wrap">
      <h1 className="main-title">Управление опциями товаров</h1>
      <div className="product-attributes-main">
        <div className="all-product-attributes">
          <h4 className="middle-title">Опции</h4>
          <Input
            suffix={<Icon name="search" color="#87898D" onClick={() => console.log('клик')} />}
            placeholder="Поиск опции..."
          ></Input>

          {allProdAttr &&
            allProdAttr.map(prodAttr => (
              <div
                onClick={() => handlerClickOption(prodAttr.id)}
                key={prodAttr.id}
                className={`prod-attr ${selectedAttributeId === prodAttr.id ? 'active' : ''}`}
              >
                <div className="prod-name-with-img">
                  <Icon name={getIconForAttribute(prodAttr.type)} />
                  <span>{prodAttr.name}</span>
                </div>
                <span>{prodAttr.values.length}</span>
              </div>
            ))}
          <Button type="dashed">+ Создать опцию</Button>
        </div>
        <div className="product-attribute-info">
          <div className="product-attribute">
            <div className="title-and-btns">
              <h4 className="middle-title">Информация об опции</h4>
              {selectedAttributeId && (
                <div className="product-attribute-btns">
                  <Button>Удалить</Button>
                  <Button>
                    <Icon name="editing" /> Редактировать
                  </Button>
                </div>
              )}
            </div>
            {selectedAttributeId && selectAttr ? (
              <div className="select-attr-main-info">
                <div className="select-attr-inputs">
                  <div>
                    <span>Название</span>
                    <Input value={selectAttr?.name} />
                  </div>
                  <div>
                    <span>Slug</span>
                    <Input value={selectAttr?.slug} />
                  </div>
                  <div>
                    <span>Тип</span>
                    <Input value={selectAttr?.type} />
                  </div>
                  <div>
                    <span>Порядок сортировки</span>
                    <Input value={selectAttr?.sortOrder} />
                  </div>
                </div>
                <div className="select-attr-description">
                  <span>Описание</span>
                  <TextArea value={selectAttr?.description} rows={6} />
                </div>
              </div>
            ) : (
              'Ничего не выбрано'
            )}
          </div>
          <div className="attribute-value">
            <h4 className="middle-title">Значение опции</h4>
          </div>
        </div>
      </div>
      <div className="product-attributes-btn">
        <Button type="text">Отмена</Button>
        <Button type="primary">Сохранить изменения</Button>
      </div>
    </div>
  )
}

export default ProductAttribute
