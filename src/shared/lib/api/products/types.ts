export interface ProductAttributeCreatePayload {
  attributeId: string
  valueIds?: string[]
  attributeValue?: string
}

export interface VariationAttributeCreatePayload {
  attributeId: string
  valueIds: string[]
}

export interface ProductVariationCreatePayload {
  productId: string
  colorId: string
  name: string
  description?: string
  modelParameters?: string
  slug?: string
  sku?: string
  price: number
  comparePrice?: number
  images?: string[]
  mainImage?: string
  attributes?: VariationAttributeCreatePayload[]
}

export interface ProductCreatePayload {
  name: string
  slug?: string
  description?: string
  price: number
  images?: string[]
  categoryId: string
  brand: string
  material: string
  isActive?: boolean
  isFeatured?: boolean
  modelParameters?: string
  attributes?: ProductAttributeCreatePayload[]
  variations?: ProductVariationCreatePayload[]
}

export type ProductUpdatePayload = ProductCreatePayload

export interface CreateStockItemPayload {
  productId: string
  variationId: string
  sizeId?: string
  sku?: string
  quantity: number
  reserved?: number
  location?: string
}

export interface CreateStockBulkPayload {
  items: CreateStockItemPayload[]
}

export interface ProductSearchFilters {
  categoryIds?: string[]
  brand?: string
  isFeatured?: boolean
  inStock?: boolean
  minPrice?: number
  maxPrice?: number
  isActive?: boolean
  isActiveFilter?: 'all' | 'active' | 'includes' | 'inactive'
  search?: string
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'
  page?: number
  limit?: number
}

export interface ProductsPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ProductVariationUpdatePayload {
  productId?: string
  colorId?: string
  name?: string
  description?: string
  modelParameters?: string
  slug?: string
  sku?: string
  price?: number
  comparePrice?: number
  images?: string[]
  mainImage?: string
  attributes?: VariationAttributeCreatePayload[]
  isActive?: boolean
}
