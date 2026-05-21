import {
  MAX_CHEST,
  MAX_LENGTH,
  MIN_CHEST,
  MIN_LENGTH,
} from '@/pages/size-parameters/constans/const'
import { BaseCategoryTree } from '@/shared/lib/api/categories/types'
import { SizeChartRequest } from '@/shared/lib/api/size-charts/types'
import { EditableSizeParameter } from '@/shared/lib/api/size-parameters/type'

export const prepareUpdateData = (
  data: Partial<SizeChartRequest>,
  editParameter: EditableSizeParameter[]
) => ({
  name: data.name,
  description: data.description,
  imageId: data.imageId,
  productType: data.productType,
  sizeParameters: editParameter.map(p => ({
    id: p.id,
    internationalSize: p.internationalSize,
    russianSize: p.russianSize,
    lengthCm: Number(p.lengthCm),
    chestCircumferenceCm: Number(p.chestCircumferenceCm),
    order: Number(p.order),
  })),
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
