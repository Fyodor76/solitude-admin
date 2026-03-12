import { CreateFormData } from '@/pages/сategories/Categories'

import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from '../api/api-categories/apiCategories'
import { useLazyGetProductsByCategoryIdQuery } from '../api/api-products/apiProducts'

export const useServerActions = () => {
  const [createCategory] = useCreateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [triggerGetProducts] = useLazyGetProductsByCategoryIdQuery()

  const createNewCategory = async (createFormDataModal: CreateFormData) => {
    try {
      await createCategory(createFormDataModal).unwrap()
      console.log('✅ Категория создана, обновляем данные...')
    } catch (error) {
      console.log('Ошибка создания категории!', error)
    }
  }

  const handleDelete = async (categoryId: string) => {
    const isConfirmed = window.confirm('Удалить эту категорию?')
    if (!isConfirmed) return
    const products = await triggerGetProducts(categoryId).unwrap()
    if (products?.data && products?.data.length > 0) {
      alert('Сначала удалите все товары в этой категории')
    } else {
      try {
        await deleteCategory(categoryId).unwrap()

        alert('Категория успешно удалена!')
      } catch (error) {
        console.log('Ошибка удаления категории!', error)
      }
    }
  }
  return { createNewCategory, handleDelete }
}
