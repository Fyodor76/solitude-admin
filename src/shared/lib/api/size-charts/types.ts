export interface SizeParameter {
  internationalSize: string
  russianSize: string
  lengthCm: number
  chestCircumferenceCm: number
  order: number
}
export interface SizeChartRequest {
  categoryId?: string
  name: string
  description: string
  imageId: string
  productType: string
  metricsText: string
  sizeParameters: SizeParameter[]
}

export interface SizeChartResponse {
  id?: string
  categoryId?: string
  name: string
  description: string
  imageId: string
  productType: string
  metricsText: string
  sizeParameters: (SizeParameter & {
    id: string
    sizeChartId?: string
    createdAt: string
    updatedAt: string
  })[]
}
export interface deleteSizeChartResponse {
  message: string
}
