import { Button } from 'antd'

interface ProductAttributeBtnsProps {
  saveAllChanges: () => Promise<void>
  handleCancel: () => void
}
const ProductAttributeBtns = ({ saveAllChanges, handleCancel }: ProductAttributeBtnsProps) => {
  return (
    <div className="product-attributes-btn">
      <Button onClick={handleCancel} className="product-attributes-btn-cancel" type="text">
        Отмена
      </Button>
      <Button onClick={saveAllChanges} className="product-attributes-btn-save" type="primary">
        Сохранить изменения
      </Button>
    </div>
  )
}

export default ProductAttributeBtns
