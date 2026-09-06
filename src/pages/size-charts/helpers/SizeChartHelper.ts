import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import { SizeChartRequest } from '@/shared/lib/api/size-charts/types'
import { EditableSizeParameter } from '@/shared/lib/api/size-parameters/type'

import { MAX_CHEST, MAX_LENGTH, MIN_CHEST, MIN_LENGTH } from '../size-parameters/constans/const'

export const prepareCreateData = (data: SizeChartRequest) => ({
  categoryId: data.categoryId,
  name: data.name,
  description: data.description || undefined,
  imageId: data.imageId || undefined,
  productType: data.productType,
  metricsText: data.metricsText || undefined,
  ...(data.sizeParameters?.length
    ? {
        sizeParameters: data.sizeParameters.map(p => ({
          internationalSize: p.internationalSize,
          russianSize: p.russianSize,
          lengthCm: Number(p.lengthCm),
          chestCircumferenceCm: Number(p.chestCircumferenceCm),
          order: Number(p.order),
        })),
      }
    : {}),
})

export const prepareUpdateData = (
  data: Partial<SizeChartRequest>,
  editParameter: EditableSizeParameter[]
) => ({
  name: data.name,
  description: data.description,
  imageId: data.imageId,
  productType: data.productType,
  metricsText: data.metricsText,
  sizeParameters: editParameter.map(p => ({
    id: p.id,
    internationalSize: p.internationalSize,
    russianSize: p.russianSize,
    lengthCm: Number(p.lengthCm),
    chestCircumferenceCm: Number(p.chestCircumferenceCm),
    order: Number(p.order),
  })),
})

export const prepareResetData = (sizeChart: SizeChartRequest | null) => ({
  name: sizeChart?.name || '',
  description: sizeChart?.description || '',
  metricsText: sizeChart?.metricsText || '',
  productType: sizeChart?.productType || '',
  imageId: sizeChart?.imageId || null,
})

export const hasAnyData = (
  editParameter: EditableSizeParameter[],
  formSizeChart: SizeChartRequest
) => {
  const hasSizeParameters = editParameter.length > 0
  const hasBasicData = !!(
    formSizeChart.name ||
    formSizeChart.description ||
    formSizeChart.imageId ||
    formSizeChart.productType
  )
  return hasBasicData || hasSizeParameters
}

export const isValidateParemeters = (editParameter: EditableSizeParameter[]) => {
  return editParameter.some(
    p =>
      p.lengthCm < MIN_LENGTH ||
      p.lengthCm > MAX_LENGTH ||
      p.chestCircumferenceCm < MIN_CHEST ||
      p.chestCircumferenceCm > MAX_CHEST
  )
}

export const getAllCategories = (categories: BaseCategoryTree[]): BaseCategoryTree[] => {
  let result: BaseCategoryTree[] = []
  for (const category of categories) {
    result.push(category)
    if (category.children?.length) {
      result = [...result, ...getAllCategories(category.children)]
    }
  }
  return result
}
