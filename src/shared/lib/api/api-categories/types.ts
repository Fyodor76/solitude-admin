export interface CategoryMenuItem {
  //плоский список get запрос на полученик узловых категоий
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

export interface BaseCategoryTree {
  //дерево плюс дети[]
  id: string
  name: string
  slug?: string
  description: string
  imageId: string | null
  isActive: boolean
  sortOrder: number
  type: 'category'
  children: BaseCategoryTree[] | []
  entity?: CategoryMenuItem // только у детей
}

export interface CategoryRequest {
  name: string
  slug?: string
  description: string
  parentId: null | string
  imageId?: string | null
  sortOrder: number
}

export interface CollectionItem {
  id: string
  name: string
  slug: string
  description: string
  parentId: string | null
  imageId: string | null
  isActive: boolean
  sortOrder: number
  type: 'collection'
  createdAt: string
  updatedAt: string
}

export interface DeleteCategoryResponse {
  message: string
}
