import { CreateFormData } from '@/pages/сategories/Categories'

import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from '../api/api-categories/apiCategories'
import { useLazyGetProductsByCategoryIdQuery } from '../api/api-products/apiProducts'
import { useDeleteFileByIdMutation } from '../api/upload-files/uploadFiles'

export const useServerActions = () => {
  const [createCategory] = useCreateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [triggerGetProducts] = useLazyGetProductsByCategoryIdQuery()
  const [deleteFileById] = useDeleteFileByIdMutation()

  const createNewCategory = async (createFormDataModal: CreateFormData): Promise<void> => {
    try {
      await createCategory(createFormDataModal).unwrap()
      console.log('✅ Категория создана, обновляем данные...')
    } catch (error) {
      console.log('Ошибка создания категории!', error)
      throw error
    }
  }

  const handleDelete = async (categoryId: string, fileId?: string, folder?: string) => {
    const isConfirmed = window.confirm('Удалить эту категорию?')
    if (!isConfirmed) return

    try {
      const products = await triggerGetProducts(categoryId).unwrap()
      if (products?.data && products?.data.length > 0) {
        alert('Сначала удалите все товары в этой категории')
        return
      }

      if (fileId && folder) {
        try {
          await deleteFileById({ fileId, folder }).unwrap()
          console.log(' Изображение удалено с CDN')
        } catch (imageError) {
          console.log(' Не удалось удалить изображение, но продолжаем...', imageError)
        }
      }

      await deleteCategory(categoryId).unwrap()
      console.log('✅ Категория успешно удалена, ID:', categoryId)
      console.log('📝 Проверьте сеть вкладку Network для подтверждения запросов')
      alert(' Категория успешно удалена!')
    } catch (error) {
      console.log(' Ошибка удаления категории!', error)
      alert('Не удалось удалить категорию')
    }
  }

  return { createNewCategory, handleDelete }
}
