import { FormData } from '@/pages/categories/types/type'

import { useCreateCategoryMutation, useDeleteCategoryMutation } from '../api/categories/Categories'
import { useLazyGetProductsByCategoryIdQuery } from '../api/products/Products'
import { useDeleteFileByIdMutation } from '../api/upload-files/uploadFiles'

export const useServerActions = () => {
  const [createCategory] = useCreateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [triggerGetProducts] = useLazyGetProductsByCategoryIdQuery()
  const [deleteFileById] = useDeleteFileByIdMutation()

  const createNewCategory = async (formDataModal: FormData): Promise<void> => {
    try {
      await createCategory(formDataModal).unwrap()
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
