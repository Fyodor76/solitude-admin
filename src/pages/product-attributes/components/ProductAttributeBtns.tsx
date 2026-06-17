import React from 'react'

import { Button } from 'antd'

const ProductAttributeBtns = () => {
  return (
    <div className="product-attributes-btn">
      <Button className="product-attributes-btn-cancel" type="text">
        Отмена
      </Button>
      <Button className="product-attributes-btn-save" type="primary">
        Сохранить изменения
      </Button>
    </div>
  )
}

export default ProductAttributeBtns
