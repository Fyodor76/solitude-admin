export interface SizeParameter {
  id?: string
  internationalSize: string
  russianSize: string
  lengthCm: number
  chestCircumferenceCm: number
  order: number
}

export interface EditableSizeParameter extends SizeParameter {
  isDeleted?: boolean
  isNewParameter?: boolean
  isUpdated?: boolean
  tempId?: string
}
