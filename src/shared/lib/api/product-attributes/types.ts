export interface AttributeValueRequest {
  value: string
  displayName: string
  slug: string
  sortOrder: number
  hexCode?: string
  isActive: boolean
}

export interface AttributeValueResponse extends AttributeValueRequest {
  id: string
  attributeId: string
}

export interface ProductAttributeRequest {
  name: string
  slug: string
  type: string
  description: string
  sortOrder: number
}

export interface ProductAttributeResponse extends ProductAttributeRequest {
  id: string
  isActive: boolean
  values: AttributeValueResponse[]
  createdAt: string
  updatedAt: string
}
