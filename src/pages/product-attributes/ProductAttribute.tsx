import { useEffect, useState } from 'react'

import { useGetAllProductAttributesQuery } from '@/shared/lib/api/product-attributes/ProductAttributes'
import { ProductAttributeResponse } from '@/shared/lib/api/product-attributes/types'
import { div } from 'framer-motion/client'

import './ProductAttributes.scss'

const ProductAttribute = () => {
  const [allProdAttr, setAllProdAttr] = useState<ProductAttributeResponse[]>([])
  const { data: productAttributes, isLoading, isError, refetch } = useGetAllProductAttributesQuery()

  useEffect(() => {
    if (productAttributes?.data) {
      setAllProdAttr(productAttributes?.data)
    }
  }, [productAttributes?.data])
  console.log(productAttributes?.data)
  return (
    <div className="product-attributes-wrap">
      <h1 className="main-title">Управление опциями товаров</h1>
      <div className="product-attributes-main">
        <div className="all-product-attributes">
          <h4 className="middle-title">Опции</h4>
          {allProdAttr &&
            allProdAttr.map(prodAttr => (
              <div key={prodAttr.id} className="prodAttr">
                <span>{prodAttr.name}</span>
                <span>{prodAttr.values.length}</span>
              </div>
            ))}
        </div>
        <div className="product-attribute-info">
          <div className="product-attribute"></div>
          <div className="attribute-value"></div>
        </div>
      </div>
      <div className="product-attributes-btn"></div>
    </div>
  )
}

export default ProductAttribute
