import { ApiResponse, baseApi } from '../baseApi'

export interface CategoryRequest {
  name: string
  slug: string
  description: string
  parentId: null
  imageId: string
  sortOrder: number
  type: string
}

export interface CategoryResponse {
  id: string
  name: string
  slug: string
  description: string
  parentId: null
  imageId: string
  isActive: boolean
  sortOrder: number
  type: string
  createdAt: string
  updatedAt: string
}

export const apiCategories = baseApi.injectEndpoints({
  endpoints: builder => ({
    createCategory: builder.mutation<ApiResponse<CategoryResponse, any>, CategoryRequest>({
      query: newCategory => ({
        url: `/categories`,
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: ['Category'],
    }),
  }),
})
