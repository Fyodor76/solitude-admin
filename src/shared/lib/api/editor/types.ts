export interface Specifications {
  title: string
  content: string
  order: number
}
export interface VariantsImage {
  image: string
  title: string
  id?: string
  order?: number
}
export interface Variants {
  colorId: string
  variants: VariantsImage[]
}
export interface Colors {
  id: string
  value: string
  hexCode: string
  slug: string
}
export interface Editor {
  id?: string
  categoryId: string
  title: string
  colors: Colors[]
  variants: Variants[]
  createdAt?: string
  updatedAt?: string
  specifications: Specifications[]
}
