import { ProductBasicsForm, WizardStep } from './types'

export const STEP_LABELS: Record<WizardStep, string> = {
  0: 'Товар',
  1: 'Вариации',
  2: 'Атрибуты и размеры',
  3: 'Сток',
}

export const INITIAL_BASICS: ProductBasicsForm = {
  name: '',
  slug: '',
  description: '',
  price: null,
  categoryId: '',
  brand: 'solitude',
  material: '',
  modelParameters: '',
  imagesText: '',
  isActive: false,
  isFeatured: false,
}
