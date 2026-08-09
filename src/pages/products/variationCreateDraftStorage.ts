import { ProductImageItem, StockDraftRow } from '../product-create/types'

export type VariationCreateStep = 0 | 1 | 2

export type VariationCreateFormDraft = {
  name?: string
  colorId?: string
  slug?: string
  sku?: string
  description?: string
  modelParameters?: string
  price?: number | null
  comparePrice?: number | null
}

export type VariationCreateDraft = {
  productId: string
  step: VariationCreateStep
  maxReachedStep: VariationCreateStep
  form: VariationCreateFormDraft
  imageItems: ProductImageItem[]
  showcaseFileIds: string[]
  selectedSizeIds: string[]
  stockRows: StockDraftRow[]
}

const STORAGE_PREFIX = 'solitude-admin:variation-create-draft:'

function storageKey(productId: string): string {
  return `${STORAGE_PREFIX}${productId}`
}

function isStep(value: unknown): value is VariationCreateStep {
  return value === 0 || value === 1 || value === 2
}

export function loadVariationCreateDraft(productId: string): VariationCreateDraft | null {
  if (!productId) return null

  try {
    const raw = localStorage.getItem(storageKey(productId))
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<VariationCreateDraft>
    if (parsed.productId && parsed.productId !== productId) return null

    return {
      productId,
      step: isStep(parsed.step) ? parsed.step : 0,
      maxReachedStep: isStep(parsed.maxReachedStep) ? parsed.maxReachedStep : 0,
      form: parsed.form && typeof parsed.form === 'object' ? parsed.form : {},
      imageItems: Array.isArray(parsed.imageItems) ? parsed.imageItems : [],
      showcaseFileIds: Array.isArray(parsed.showcaseFileIds) ? parsed.showcaseFileIds : [],
      selectedSizeIds: Array.isArray(parsed.selectedSizeIds) ? parsed.selectedSizeIds : [],
      stockRows: Array.isArray(parsed.stockRows) ? parsed.stockRows : [],
    }
  } catch {
    return null
  }
}

export function saveVariationCreateDraft(draft: VariationCreateDraft): void {
  try {
    localStorage.setItem(storageKey(draft.productId), JSON.stringify(draft))
  } catch {
    // quota / private mode
  }
}

export function clearVariationCreateDraft(productId: string): void {
  if (!productId) return
  try {
    localStorage.removeItem(storageKey(productId))
  } catch {
    // ignore
  }
}

export function hasVariationCreateDraftContent(draft: VariationCreateDraft): boolean {
  const form = draft.form || {}
  return Boolean(
    draft.step > 0 ||
    draft.maxReachedStep > 0 ||
    (typeof form.name === 'string' && form.name.trim()) ||
    form.colorId ||
    (typeof form.sku === 'string' && form.sku.trim()) ||
    (typeof form.slug === 'string' && form.slug.trim()) ||
    (typeof form.description === 'string' && form.description.trim()) ||
    draft.imageItems.length ||
    draft.selectedSizeIds.length ||
    draft.stockRows.length
  )
}
