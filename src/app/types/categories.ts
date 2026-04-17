export interface CategoryMenuItem {
  id: string
  name: string
  slug?: string
  description: string
  parentId: string | null
  imageId: string | null
  isActive: boolean
  sortOrder: number
  type: 'category'
  createdAt: string
  updatedAt: string
}
