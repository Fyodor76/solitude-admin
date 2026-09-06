export interface AttributeValue {
  id: string
  attributeId: string
  value: string
  displayName: string
  slug: string
  sortOrder: number
  isActive: boolean
  hexCode: string | null
  metadata: Record<string, any> | null
}

export interface ProductAttribute {
  id: string
  name: string
  slug: string
  type: string
  description: string
  isActive: boolean
  sortOrder: number
  values: AttributeValue[]
  createdAt?: string
  updatedAt?: string
}

export interface VariationAttribute {
  id: string
  attributeId?: string
  name: string
  slug: string
  type: string
  description: string
  isActive: boolean
  sortOrder: number
  values: AttributeValue[]
  valueSlug?: string
}

export interface ProductSize {
  id: string
  internationalSize: string
  russianSize: string
  lengthCm: string
  chestCircumferenceCm: string
  order: number
  createdAt?: string
  updatedAt?: string
}

export interface ProductVariation {
  id: string
  productId?: string
  colorId?: string
  name: string
  description: string
  modelParameters: string
  slug: string
  sku: string
  price: number
  comparePrice: number
  stock: number
  images: string[]
  mainImage: string
  attributes: VariationAttribute[]
  size: ProductSize[]
  color?: AttributeValue
  isActive: boolean
  sortOrder?: number
  inStock?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Product {
  id: string
  type?: string
  name: string
  slug: string
  description: string
  modelParameters: string
  price: number
  comparePrice: number | null
  categoryId: string
  brand: string
  material: string
  sku: string
  isActive: boolean
  isFeatured: boolean
  showOnLanding: boolean
  sortOrder?: number
  inStock: boolean
  images: string[]
  attributes: ProductAttribute[]
  variations: ProductVariation[]
  createdAt: string
  updatedAt: string
}
