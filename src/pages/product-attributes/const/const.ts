import { ProductAttributeRequest } from '@/shared/lib/api/product-attributes/types'

export const initialState: ProductAttributeRequest = {
  name: '',
  slug: '',
  type: 'color' || 'size' || 'volume' || 'weight' || 'dimension' || 'other',
  description: '',
  sortOrder: 0,
}

export const typeOptions = [
  { value: 'color', label: 'Цвет' },
  { value: 'size', label: 'Размер' },
  { value: 'volume', label: 'Объем' },
  { value: 'weight', label: 'Вес' },
  { value: 'dimension', label: 'Габариты' },
  { value: 'other', label: 'Другое' },
]
