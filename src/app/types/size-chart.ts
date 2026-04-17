import { SizeParameter } from '@/shared/lib/api/size-charts/types'

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
