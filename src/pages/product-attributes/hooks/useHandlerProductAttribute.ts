import { MODES } from '@/pages/categories/const/constans'
import { useDeleteProductAttributeByIdMutation } from '@/shared/lib/api/product-attributes/ProductAttributes'
import { ProductAttributeResponse } from '@/shared/lib/api/product-attributes/types'
import { message, Modal } from 'antd'

import { initialState } from '../const/const'

interface useHandlerPoductAttributeProps {
  allProdAttr: ProductAttributeResponse[]

  selectedAttributeId: string | null

  setAllProdAttr: React.Dispatch<React.SetStateAction<ProductAttributeResponse[]>>
  setSelectedAttributeId: React.Dispatch<React.SetStateAction<string | null>>
  setFilteredOptions: React.Dispatch<React.SetStateAction<ProductAttributeResponse[]>>
}
export const useHandlerPoductAttribute = ({
  allProdAttr,
  selectedAttributeId,
  setAllProdAttr,
  setFilteredOptions,
  setSelectedAttributeId,
}: useHandlerPoductAttributeProps) => {
  const [deleteProductAttributeById] = useDeleteProductAttributeByIdMutation()

  const localDelete = (id: string) => {
    const newAllProdAttr = allProdAttr.filter(prodAttr => prodAttr.id !== id)
    setAllProdAttr(newAllProdAttr)
    setFilteredOptions(newAllProdAttr)
    if (selectedAttributeId === id) {
      setSelectedAttributeId(null)
    }
  }

  const deleteProdAttr = async (id: string) => {
    Modal.confirm({
      title: 'Удалить опцию?',
      content: 'Это действие удалит опцию и все её значения. Восстановить будет невозможно.',
      okText: 'Да, удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await deleteProductAttributeById(id).unwrap()
          localDelete(id)
          message.success(`Опция успешно удалена`)
          console.log(`Успешное удаление аттрибута продукта с id:${id}`)
        } catch (error) {
          console.log('Ошибка удаления аттрибута продукта!', error)
        }
      },
    })
  }

  return {
    deleteProdAttr,
  }
}
