export interface LandingStage {
  id: string
  imageDesktop: string
  imageMobile: string
  alt: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface LandingStageRequest {
  imageDesktop: string
  imageMobile: string
  alt?: string | null
  sortOrder?: number
  isActive?: boolean
}

export interface DeleteLandingStageResponse {
  success: boolean
  id: string
  message?: string
}
