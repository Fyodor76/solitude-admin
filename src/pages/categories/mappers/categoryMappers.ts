import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'

import { CategoryType } from '../const/constans'
import { FormData } from '../types/type'

export const mapTreeToForm = (category: BaseCategoryTree): FormData => {
  return {
    name: category.name,
    description: category.description,
    sortOrder: category.sortOrder,
    parentId: category.entity?.parentId ?? null,
    imageId: category.imageId,
    isActive: category.isActive,
    type: category.type,
  }
}

export const mapFormToRequest = (formData: FormData, cdnData?: imgUpload | null) => {
  return {
    name: formData.name,
    description: formData.description,
    sortOrder: Number(formData.sortOrder),
    parentId: formData.parentId,
    imageId: cdnData?.fileId || formData.imageId,
    isActive: formData.isActive,
    ...(formData.type ? { type: formData.type } : {}),
  }
}

export const mapToСategoriesOptions = () => {
  return [
    { value: CategoryType.CATEGORY, label: 'Категория' },
    { value: CategoryType.COLLECTION, label: 'Коллекция' },
  ]
}
