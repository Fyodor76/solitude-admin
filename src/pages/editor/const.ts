import { FormEditorType } from './types'

export const EDITOR_TABS = {
  BASE: 'base',
  COLORS: 'colors',
  SIDES: 'sides',
  SPECIFICATIONS: 'specifications',
} as const

export const initialStateEditor: FormEditorType = {
  id: '',
  categoryId: '',
  title: '',
  isActive: false,
  colors: [],
  variants: [],
  specifications: [],
  createdAt: '',
  updatedAt: '',
}
