import { EditorTypeResponse } from '@/shared/lib/api/editor/types'

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
  isActive: true,
  colors: [],
  variants: [],
  specifications: [],
  createdAt: '',
  updatedAt: '',
}
