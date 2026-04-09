import { BaseCategoryTree } from '@/shared/lib/api/api-categories/types'
import { imgUpload } from '@/shared/lib/api/upload-files/uploadFiles'

import { FormData } from '../types/type'

export const mapTreeToForm = (category: BaseCategoryTree): FormData => {
  return {
    name: category.name,

    description: category.description,
    sortOrder: category.sortOrder,
    parentId: category.entity?.parentId ?? null,
    imageId: category.imageId,
  }
}

export const mapFormToRequest = (formData: FormData, cdnData?: imgUpload | null) => {
  return {
    name: formData.name,
    description: formData.description,
    sortOrder: Number(formData.sortOrder),
    parentId: formData.parentId,
    imageId: cdnData?.fileId || formData.imageId,
  }
}
