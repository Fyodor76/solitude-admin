export interface Specifications {
  id: string
  title: string
  content: string
  order: number
}
export interface Colors {
  id: string
  value: string
  hexCode: string
  slug: string
}

export interface Variants {
  colorId: string
  variants: VariantsImage[]
}

export interface VariantsImage {
  image: string
  title: string
  id: string
  order: number
}

export interface EditorTypeResponse {
  id: string
  categoryId: string
  title: string
  colors: Colors[]
  variants: Variants[]
  createdAt: string
  updatedAt: string
  specifications: Specifications[]
}

export interface EditorTypeRequest {
  categoryId: string
  title: string
  variants: Variants[]
  specifications: Omit<Specifications, 'id'>[]
}

export interface EditorPatchRequest {
  id: string
  categoryId?: string
  title?: string
  variants?: Variants[]
  specifications?: Specifications[]
}
