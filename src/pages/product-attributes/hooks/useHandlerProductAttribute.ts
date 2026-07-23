import {
  useCreateProductAttributesMutation,
  useDeleteProductAttributeByIdMutation,
  useUpdateProductAttributesMutation,
} from '@/shared/lib/api/product-attributes/ProductAttributes'
import {
  ProductAttributeRequest,
  ProductAttributeResponse,
} from '@/shared/lib/api/product-attributes/types'
import { useModal } from '@/shared/lib/hooks/useModal'
import { message, Modal } from 'antd'

import { initialState } from '../const/const'

interface useHandlerPoductAttributeProps {
  allProdAttr: ProductAttributeResponse[]
  formOption: ProductAttributeRequest
  selectedAttributeId: string | null
  modal: ReturnType<typeof useModal>
  setEditFormLocal: React.Dispatch<React.SetStateAction<ProductAttributeResponse | undefined>>
  setFormOption: React.Dispatch<React.SetStateAction<ProductAttributeRequest>>
  setAllProdAttr: React.Dispatch<React.SetStateAction<ProductAttributeResponse[]>>
  setSelectedAttributeId: React.Dispatch<React.SetStateAction<string | null>>
  setFilteredOptions: React.Dispatch<React.SetStateAction<ProductAttributeResponse[]>>
}
export const useHandlerPoductAttribute = ({
  allProdAttr,
  selectedAttributeId,
  formOption,
  modal,
  setEditFormLocal,
  setFormOption,
  setAllProdAttr,
  setFilteredOptions,
  setSelectedAttributeId,
}: useHandlerPoductAttributeProps) => {
  const [deleteProductAttributeById] = useDeleteProductAttributeByIdMutation()
  const [updateProductAttributes] = useUpdateProductAttributesMutation()
  const [createProductAttributes] = useCreateProductAttributesMutation()

  const localDeleteOption = (id: string) => {
    const newAllProdAttr = allProdAttr.filter(prodAttr => prodAttr.id !== id)
    setAllProdAttr(newAllProdAttr)
    setFilteredOptions(newAllProdAttr)
    if (selectedAttributeId === id) {
      setSelectedAttributeId(null)
    }
  }

  const deleteOption = async (id: string) => {
    Modal.confirm({
      title: 'Удалить опцию?',
      content: 'Это действие удалит опцию и все её значения. Восстановить будет невозможно.',
      okText: 'Да, удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        try {
          await deleteProductAttributeById(id).unwrap()
          localDeleteOption(id)
          message.success(`Опция успешно удалена`)
          console.log(`Успешное удаление аттрибута продукта с id:${id}`)
        } catch (error) {
          console.log('Ошибка удаления аттрибута продукта!', error)
        }
      },
    })
  }
  const onSaveEditedOption = async (data: Partial<ProductAttributeRequest>, id: string) => {
    try {
      const response = await updateProductAttributes({ data, id }).unwrap()
      setAllProdAttr(prev => prev.map(prodAttr => (prodAttr.id === id ? response.data : prodAttr)))
      setFilteredOptions(prev =>
        prev.map(filterProdAttr => (filterProdAttr.id === id ? response.data : filterProdAttr))
      )
      setEditFormLocal(response.data)
      console.log(`Отредактировала опцию: ${response.data.name}`)
    } catch (error) {
      console.log('Ошибка редактирования опции...', error)
    }
  }

  const onSaveCreatedOption = async () => {
    try {
      const newOption: ProductAttributeRequest = {
        name: formOption.name,
        slug: formOption.slug,
        type: formOption.type,
        description: formOption.description,
        sortOrder: formOption.sortOrder,
      }
      const response = await createProductAttributes({ data: newOption }).unwrap()
      setAllProdAttr(prev => {
        return [...prev, response.data]
      })
      setFilteredOptions(prev => [...prev, response.data])
      setFormOption(initialState)
      modal.onClose()
      console.log('Создала новую опцию!')
    } catch (error) {
      console.log('Ошибка создания новой опции...', error)
    }
  }

  return {
    deleteOption,
    onSaveEditedOption,
    onSaveCreatedOption,
  }
}
