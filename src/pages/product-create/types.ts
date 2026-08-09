export type WizardStep = 0 | 1 | 2 | 3

export interface ProductImageItem {
  fileId: string
  url: string
}

export interface ProductBasicsForm {
  name: string
  slug: string
  description: string
  price: number | null
  categoryId: string
  brand: string
  material: string
  modelParameters: string
  isActive: boolean
  isFeatured: boolean
}

export interface DraftVariation {
  key: string
  name: string
  slug: string
  sku: string
  price: number | null
  comparePrice: number | null
  colorId: string
  description: string
  mainImage: ProductImageItem | null
  images: ProductImageItem[]
  /** fileId для product.images / карточки коллекции */
  showcaseFileIds: string[]
}

export interface AttributeSelection {
  attributeId: string
  valueIds: string[]
}

export interface StockDraftRow {
  key: string
  variationKey: string
  sizeId: string
  quantity: number
  sku: string
}

export interface ProductCreateWizardState {
  step: WizardStep
  maxReachedStep: WizardStep
  basics: ProductBasicsForm
  variations: DraftVariation[]
  attributeSelections: AttributeSelection[]
  selectedSizeIds: string[]
  stockRows: StockDraftRow[]
}
