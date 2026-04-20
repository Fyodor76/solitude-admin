export interface SizeParameter {
  id?: string
  internationalSize: string
  russianSize: string
  lengthCm: number
  chestCircumferenceCm: number
  order: number
}

export interface deleteSizeParametersResponse {
  id: string
  message: string
}
