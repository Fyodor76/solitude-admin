import { ApiResponse, baseApi } from '../baseApi'

export interface CategoryMenuItem {
  id: string
  name: string
  slug: string
  children?: CategoryMenuItem[]
  description: string
  parentId: null | string
  imageId: string | null
  isActive: boolean
  sortOrder: number
  type: 'category'
  createdAt: string
  updatedAt: string
}
export interface CategoryRequest {
  name: string
  slug: string
  description: string
  parentId: null | string
  imageId: string | null
  sortOrder: number
  type: string
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

export const apiCategories = baseApi.injectEndpoints({
  endpoints: builder => ({
    createCategory: builder.mutation<ApiResponse<CategoryMenuItem, any>, CategoryRequest>({
      query: newCategory => ({
        url: `/categories`,
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: [{ type: 'Category', id: 'ALL_CATEGORIES' }],
    }),
    getCategories: builder.query<ApiResponse<CategoryMenuItem[], any>, void>({
      query: () => ({
        url: `/categories`,
        method: 'GET',
      }),
      providesTags: [{ type: 'Category', id: 'ALL_CATEGORIES' }],
    }),
    getCollections: builder.query<ApiResponse<CollectionItem[], any>, void>({
      query: () => ({
        url: `/categories/collections`,
        method: 'GET',
      }),
      providesTags: [{ type: 'Collection', id: 'ALL_COLLECTIONS' }],
    }),
    getCategoryById: builder.query<ApiResponse<CategoryMenuItem, any>, string>({
      query: (id: string) => ({
        url: `/categories/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => (result ? [{ type: 'Category', id }] : []),
    }),
  }),
})
