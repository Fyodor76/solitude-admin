export interface VariantSize {
  id: string
  internationalSize: string
  russianSize?: string
}
export interface VariantStock {
  sizeId: string
  count: number
  sku?: string
}
export interface VariantColor {
  id: string
  displayName: string
  hexCode?: string
}

export interface Variations {
  id: string
  name: string
  price: number
  comparePrice?: number | null
  images?: string[]
  mainImage?: string | null
  size?: VariantSize[]
  color?: VariantColor[]
  stock?: VariantStock[]
}
export interface Product {
  id: string
  name: string
  price: number
  isActive: boolean
  description?: string
  images: string[]
  brand: string
  categoryId: string
  material: string
  inStock: boolean
  variations: Variations[]
}
