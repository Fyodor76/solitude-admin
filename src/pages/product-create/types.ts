export type WizardStep = 0 | 1 | 2 | 3

export interface ProductImageItem {
  fileId: string
  url: string
}

export interface ProductBasicsForm {
  name: string
  slug: string
  /** true после ручного ввода slug — больше не синкать с названием */
  slugLocked?: boolean
  description: string
  price: number | null
  categoryId: string
  brand: string
  material: string
  modelParameters: string
  isActive: boolean
  isFeatured: boolean
  showOnLanding: boolean
}

export interface DraftVariation {
  key: string
  /** id существующей вариации; нет — ещё не создана */
  id?: string
  name: string
  slug: string
  sku: string
  slugLocked?: boolean
  skuLocked?: boolean
  price: number | null
  comparePrice: number | null
  colorId: string
  description: string
  modelParameters?: string
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
  /** id существующей складской позиции */
  id?: string
  reserved?: number
  location?: string
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
