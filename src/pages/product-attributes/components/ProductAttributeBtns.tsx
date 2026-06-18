import React from 'react'

import { Button } from 'antd'

interface ProductAttributeBtnsProps {
  saveAllChanges: () => Promise<void>
}
const ProductAttributeBtns = ({ saveAllChanges }: ProductAttributeBtnsProps) => {
  return (
    <div className="product-attributes-btn">
      <Button className="product-attributes-btn-cancel" type="text">
        Отмена
      </Button>
      <Button onClick={saveAllChanges} className="product-attributes-btn-save" type="primary">
        Сохранить изменения
      </Button>
    </div>
  )
}

export default ProductAttributeBtns
