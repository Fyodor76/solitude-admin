import { Colors, EditorTypeResponse } from '@/shared/lib/api/editor/types'

import { EDITOR_TABS } from './const'

export type EditorTabType = (typeof EDITOR_TABS)[keyof typeof EDITOR_TABS]

export interface FormEditorType extends EditorTypeResponse {
  isActive?: false
}
export interface ColorWithStatus extends Colors {
  isActive?: boolean
}
