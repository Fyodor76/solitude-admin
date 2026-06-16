import { useEffect, useState } from 'react'

import { useGetAllProductAttributesQuery } from '@/shared/lib/api/product-attributes/ProductAttributes'
import {
  ProductAttributeRequest,
  ProductAttributeResponse,
} from '@/shared/lib/api/product-attributes/types'
import { useModal } from '@/shared/lib/hooks/useModal'
import Icon from '@/shared/ui/icons/Icon'
import { Button, Input, Table } from 'antd'
import TextArea from 'antd/es/input/TextArea'

import { getIconForAttribute } from '@/app/constans/getIconForAttribute'

import { initialState } from './const/const'
import { valueColumns } from './helpers/ColumnsAttr'
import './ProductAttributes.scss'

const ProductAttribute = () => {
  const [allProdAttr, setAllProdAttr] = useState<ProductAttributeResponse[]>([])
  const { data: productAttributes, isLoading, isError, refetch } = useGetAllProductAttributesQuery()
  const [selectedAttributeId, setSelectedAttributeId] = useState<string | null>(null)
  const [searchOption, setSearchOption] = useState<string>('')
  const [filteredOptions, setFilteredOptions] = useState<ProductAttributeResponse[]>([])
  const [formOption, setFormOption] = useState<ProductAttributeRequest>(initialState)

  const modal = useModal()

  useEffect(() => {
    if (productAttributes?.data) {
      setAllProdAttr(productAttributes?.data)
      setFilteredOptions(productAttributes.data)
    }
  }, [productAttributes?.data])
  console.log(productAttributes?.data)
  const handlerClickOption = (attributeId: string) => {
    setSelectedAttributeId(attributeId)
  }

  const selectAttr = allProdAttr.find(prodAttr => prodAttr.id === selectedAttributeId)

  const handlerSearch = () => {
    if (searchOption.trim() === '') {
      setFilteredOptions(allProdAttr)
      return
    } else {
      const filterOptions = allProdAttr.filter(option =>
        option.name.toLowerCase().includes(searchOption.toLowerCase())
      )
      setFilteredOptions(filterOptions)
    }
  }

  const handlerCreateOption = () => {
    modal.onOpen(formOption)
  }

  return (
    <div className="product-attributes-wrap">
      <h1 className="main-title">Управление опциями товаров</h1>
      <div className="product-attributes-main">
        <div className="all-product-attributes">
          <h4 className="middle-title">Опции</h4>
          <div className="input-search">
            <Input
              suffix={<Icon name="search" color="#87898D" onClick={handlerSearch} />}
              placeholder="Поиск опции..."
              onChange={e => setSearchOption(e.target.value)}
              onPressEnter={handlerSearch}
            ></Input>
          </div>

          {filteredOptions.length === 0 ? (
            <div className="no-results">Опции не найдены...</div>
          ) : (
            filteredOptions.map(prodAttr => (
              <div
                onClick={() => handlerClickOption(prodAttr.id)}
                key={prodAttr.id}
                className={`prod-attr ${selectedAttributeId === prodAttr.id ? 'active' : ''}`}
              >
                <div className="prod-name-with-img">
                  <Icon name={getIconForAttribute(prodAttr.type)} />
                  <span>{prodAttr.name}</span>
                </div>
                <span className="values-length">{prodAttr.values.length}</span>
              </div>
            ))
          )}
          <div className="createdOptionBtn">
            <Button onClick={handlerCreateOption} type="link">
              + Создать опцию
            </Button>
          </div>
        </div>
        <div className="product-attribute-info">
          <div className="product-attribute">
            <div className="title-and-btns">
              <h4 className="middle-title">Информация об опции</h4>
              {selectedAttributeId && (
                <div className="product-attribute-btns">
                  <Button className="product-attribute-btns-delete">Удалить</Button>
                  <Button className="product-attribute-btns-edite">
                    <Icon name="editing" /> Редактировать
                  </Button>
                </div>
              )}
            </div>
            {selectedAttributeId && selectAttr ? (
              <div className="select-attr-main-info">
                <div className="select-attr-inputs">
                  <div className="select-attr-inputs-title-and-input">
                    <span className="select-attr-inputs-title">Название</span>
                    <Input value={selectAttr?.name} />
                  </div>
                  <div className="select-attr-inputs-title-and-input">
                    <span className="select-attr-inputs-title">Slug</span>
                    <Input value={selectAttr?.slug} />
                  </div>
                  <div className="select-attr-inputs-title-and-input">
                    <span className="select-attr-inputs-title">Тип</span>
                    <Input value={selectAttr?.type} />
                  </div>
                  <div className="select-attr-inputs-title-and-input">
                    <span className="select-attr-inputs-title">Порядок сортировки</span>
                    <Input value={selectAttr?.sortOrder} />
                  </div>
                </div>
                <div className="select-attr-description">
                  <span className="select-attr-inputs-title-description">Описание</span>
                  <TextArea value={selectAttr?.description} rows={11} />
                </div>
              </div>
            ) : (
              'Ничего не выбрано'
            )}
          </div>
          <div className="attribute-value">
            <div className="title-and-btn">
              <h4 className="middle-title">Значение опции</h4>
              <Button type="link">+ Добавить значение</Button>
            </div>
            {selectedAttributeId && selectAttr ? (
              <Table
                dataSource={selectAttr?.values}
                columns={valueColumns}
                loading={isLoading}
                rowKey={selectAttr.id}
                scroll={{ x: 'max-content' }}
                pagination={false}
              />
            ) : (
              'Ничего не выбрано'
            )}
          </div>
        </div>
      </div>
      <div className="product-attributes-btn">
        <Button className="product-attributes-btn-cancel" type="text">
          Отмена
        </Button>
        <Button className="product-attributes-btn-save" type="primary">
          Сохранить изменения
        </Button>
      </div>
    </div>
  )
}

export default ProductAttribute
