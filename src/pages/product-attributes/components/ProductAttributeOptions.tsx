import React, { useCallback, useState } from 'react'

import { ProductAttributeResponse } from '@/shared/lib/api/product-attributes/types'
import Icon from '@/shared/ui/icons/Icon'
import { Button, Input } from 'antd'
import { div } from 'framer-motion/client'

import { getIconForAttribute } from '@/app/constans/getIconForAttribute'

interface ProductAttributeOptionsProps {
  filteredOptions: ProductAttributeResponse[]
  allProdAttr: ProductAttributeResponse[]
  selectedAttributeId: string | null
  setSelectedAttributeId: React.Dispatch<React.SetStateAction<string | null>>
  setFilteredOptions: React.Dispatch<React.SetStateAction<ProductAttributeResponse[]>>
  handlerCreateOption: () => void
}
const ProductAttributeOptions = ({
  filteredOptions,
  allProdAttr,
  selectedAttributeId,
  setSelectedAttributeId,
  setFilteredOptions,
  handlerCreateOption,
}: ProductAttributeOptionsProps) => {
  const [searchOption, setSearchOption] = useState<string>('')

  const handlerClickOption = (attributeId: string) => {
    setSelectedAttributeId(attributeId)
  }
  const handlerSearch = useCallback(() => {
    if (searchOption.trim() === '') {
      setFilteredOptions(allProdAttr)
      return
    } else {
      const filterOptions = allProdAttr.filter(option =>
        option.name.toLowerCase().includes(searchOption.toLowerCase())
      )
      setFilteredOptions(filterOptions)
    }
  }, [allProdAttr, searchOption])

  return (
    <div className="all-product-attributes">
      <h4 className="middle-title">Опции</h4>
      <div className="input-search">
        <Input
          suffix={<Icon name="search" color="#87898D" onClick={handlerSearch} />}
          placeholder="Поиск опции..."
          onChange={e => setSearchOption(e.target.value)}
          onPressEnter={handlerSearch}
          value={searchOption}
        ></Input>
      </div>
      <div className="prod-attr-container">
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
      </div>
      <div className="createdOptionBtn">
        <Button onClick={handlerCreateOption} type="link">
          + Создать опцию
        </Button>
      </div>
    </div>
  )
}

export default ProductAttributeOptions
