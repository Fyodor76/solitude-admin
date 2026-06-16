import { ProductAttributeRequest } from '@/shared/lib/api/product-attributes/types'

export const initialState: ProductAttributeRequest = {
  name: '',
  slug: '',
  type: 'color' || 'size' || 'volume' || 'weight' || 'dimension' || 'other',
  description: '',
  sortOrder: 0,
}
