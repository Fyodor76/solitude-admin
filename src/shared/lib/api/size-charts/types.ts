import { SizeParameter } from '../size-parameters/type'

export interface SizeChartRequest {
  id?: string
  categoryId?: string
  name: string
  description: string
  imageId: string | null
  productType: string
  metricsText: string
  sizeParameters: SizeParameter[]
}

export interface deleteResponse {
  id: string
  message: string
}
