import { SizeParameter } from '../size-parameters/type'

export interface SizeChartRequest {
  categoryId?: string
  name: string
  description: string
  imageId: string
  productType: string
  metricsText: string
  sizeParameters: SizeParameter[]
}

export interface deleteSizeChartResponse {
  message: string
}
