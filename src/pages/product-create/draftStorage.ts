import { INITIAL_BASICS } from './constants'
import { ProductCreateWizardState, WizardStep } from './types'

export const PRODUCT_CREATE_DRAFT_KEY = 'solitude-admin:product-create-draft'

const emptyState = (): ProductCreateWizardState => ({
  step: 0,
  maxReachedStep: 0,
  basics: { ...INITIAL_BASICS },
  variations: [],
  attributeSelections: [],
  selectedSizeIds: [],
  stockRows: [],
})

function isWizardStep(value: unknown): value is WizardStep {
  return value === 0 || value === 1 || value === 2 || value === 3
}

export function loadProductCreateDraft(): ProductCreateWizardState | null {
  try {
    const raw = localStorage.getItem(PRODUCT_CREATE_DRAFT_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<ProductCreateWizardState>
    const base = emptyState()

    return {
      ...base,
      ...parsed,
      step: isWizardStep(parsed.step) ? parsed.step : 0,
      maxReachedStep: isWizardStep(parsed.maxReachedStep) ? parsed.maxReachedStep : 0,
      basics: { ...base.basics, ...(parsed.basics || {}) },
      variations: Array.isArray(parsed.variations) ? parsed.variations : [],
      attributeSelections: Array.isArray(parsed.attributeSelections)
        ? parsed.attributeSelections
        : [],
      selectedSizeIds: Array.isArray(parsed.selectedSizeIds) ? parsed.selectedSizeIds : [],
      stockRows: Array.isArray(parsed.stockRows) ? parsed.stockRows : [],
    }
  } catch {
    return null
  }
}

export function saveProductCreateDraft(state: ProductCreateWizardState): void {
  try {
    localStorage.setItem(PRODUCT_CREATE_DRAFT_KEY, JSON.stringify(state))
  } catch {
    // quota / private mode — черновик просто не сохранится
  }
}

export function clearProductCreateDraft(): void {
  try {
    localStorage.removeItem(PRODUCT_CREATE_DRAFT_KEY)
  } catch {
    // ignore
  }
}

export function hasProductCreateDraftContent(state: ProductCreateWizardState): boolean {
  return Boolean(
    state.basics.name.trim() ||
    state.basics.categoryId ||
    state.variations.length ||
    state.attributeSelections.length ||
    state.selectedSizeIds.length ||
    state.stockRows.length ||
    state.step > 0
  )
}
