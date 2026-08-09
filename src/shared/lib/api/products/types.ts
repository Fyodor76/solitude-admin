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
