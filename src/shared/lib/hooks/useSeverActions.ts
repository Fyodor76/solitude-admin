import { useCreateCategoryMutation, useDeleteCategoryMutation } from '../api/categories/Categories'
import { CategoryRequest } from '../api/categories/types'
import { useLazyGetProductsByCategoryIdQuery } from '../api/products/Products'
import { useDeleteFileByIdMutation } from '../api/upload-files/uploadFiles'

export const useServerActions = () => {
  const [createCategory] = useCreateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [triggerGetProducts] = useLazyGetProductsByCategoryIdQuery()
  const [deleteFileById] = useDeleteFileByIdMutation()

  const createNewCategory = async (payload: CategoryRequest): Promise<void> => {
    try {
      await createCategory(payload).unwrap()
      console.log('✅ Категория создана, обновляем данные...')
    } catch (error) {
      throw error
    }
  }

  const handleDelete = async (categoryId: string, fileId?: string, folder?: string) => {
    const isConfirmed = window.confirm('Удалить эту категорию?')
    if (!isConfirmed) return

    const products = await triggerGetProducts(categoryId).unwrap()
    if (products?.data && products?.data.length > 0) {
      alert('Сначала удалите все товары в этой категории')
      return
    }

    if (fileId && folder) {
      try {
        await deleteFileById({ fileId, folder }).unwrap()
      } catch (imageError) {
        console.log(' Не удалось удалить изображение, но продолжаем...', imageError)
      }
    }

    await deleteCategory(categoryId).unwrap()
  }

  return { createNewCategory, handleDelete }
}
