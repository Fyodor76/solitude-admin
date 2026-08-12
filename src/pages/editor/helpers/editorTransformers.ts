import { FormEditorType } from '@/pages/editor/types'
import { Colors, EditorTypeRequest, Variants } from '@/shared/lib/api/editor/types'
import { AttributeValueResponse } from '@/shared/lib/api/product-attributes/types'

// PATCH
export const toPatchPayload = (
  formData: FormEditorType,
  originalVariants: Variants[]
): EditorTypeRequest => {
  const validColorIds = formData.colors?.map(c => c.id) || []
  const validVariants = formData.variants?.filter(v => validColorIds.includes(v.colorId)) || []
  const variantsToSend = validVariants.length > 0 ? validVariants : originalVariants
  return {
    categoryId: formData.categoryId,
    title: formData.title,
    variants: variantsToSend,
    specifications: formData.specifications || [],
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

export const toEditorColors = (attributeValues: AttributeValueResponse[]): Colors[] => {
  return attributeValues.map(value => ({
    id: value.id,
    value: value.value,
    hexCode: value.hexCode || '#000000',
    slug: value.slug || value.value.toLowerCase().replace(/\s+/g, '-'),
  }))
}
