import { FormEditorType } from '@/pages/editor/types'
import { Colors, EditorTypeRequest, Variants } from '@/shared/lib/api/editor/types'
import { AttributeValueResponse } from '@/shared/lib/api/product-attributes/types'

// PATCH
export const toPatchPayload = (
  formData: FormEditorType,
  originalVariants: Variants[]
): EditorTypeRequest => {
  console.log('🔍 toPatchPayload вход:', { formData, originalVariants })
  const { isActive, ...cleanData } = formData
  const cleanColors =
    cleanData.colors?.map(color => ({
      id: color.id,
      value: color.value,
      hexCode: color.hexCode,
      slug: color.slug,
    })) || []
  const validColorIds = cleanColors?.map(c => c.id) || []
  const sourceVariants = cleanData.variants?.length > 0 ? cleanData.variants : originalVariants

  const filteredVariants = sourceVariants.filter(v => validColorIds.includes(v.colorId))
  return {
    categoryId: cleanData.categoryId,
    title: cleanData.title,
    variants: filteredVariants,
    specifications: cleanData.specifications || [],
  }
}

// POST
export const toCreatePayload = (formData: FormEditorType): EditorTypeRequest => {
  const firstColor = formData.colors?.[0]

  return {
    categoryId: formData.categoryId,
    title: formData.title,
    variants: firstColor
      ? [
          {
            colorId: firstColor.id,
            variants: [
              {
                image: 'https://via.placeholder.com/150',
                title: 'Изображение',
                id: '',
                order: 0,
              },
            ],
          },
        ]
      : [],
    specifications: (formData.specifications || []).map(spec => ({
      title: spec.title,
      content: spec.content,
      order: spec.order,
    })),
  }
}

export const toEditorColors = (
  attributeValues: AttributeValueResponse[]
): (Colors & { isActive?: boolean })[] => {
  console.log('🔍 toEditorColors вход:', attributeValues)
  const result = attributeValues.map(value => {
    console.log('🔍 value.isActive:', value.isActive)
    return {
      id: value.id,
      value: value.value,
      hexCode: value.hexCode || '#000000',
      slug: value.slug || value.value.toLowerCase().replace(/\s+/g, '-'),
      isActive: value.isActive,
    }
  })
  console.log('🔍 toEditorColors результат:', result) // ← добавить!
  return result
}
