import {
  AttributeValueRequest,
  ProductAttributeRequest,
} from '@/shared/lib/api/product-attributes/types'

import { AttributeValue } from '@/app/types/product'

export const initialState: ProductAttributeRequest = {
  name: '',
  slug: '',
  type: 'color' || 'size' || 'volume' || 'weight' || 'dimension' || 'other',
  description: '',
  sortOrder: 0,
}

export const initialStateValue: AttributeValueRequest = {
  value: '',
  displayName: '',
  slug: '',
  sortOrder: 0,
  hexCode: '#000000',
  isActive: true,
}

export const typeOptions = [
  { value: 'color', label: 'Цвет' },
  { value: 'size', label: 'Размер' },
  { value: 'volume', label: 'Объем' },
  { value: 'weight', label: 'Вес' },
  { value: 'dimension', label: 'Габариты' },
  { value: 'other', label: 'Другое' },
]
