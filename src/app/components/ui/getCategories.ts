import { baseApi } from '../../store/api/baseApi'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  parentId: string | null
  imageId: string
  isActive: boolean
  sortOrder: number
  type: string
  createdAt: string
  updatedAt: string
}

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      transformResponse: (response: { success: boolean; data: Category[] }) => response.data,
      providesTags: ['Category'],
    }),
  }),
})
export const { useGetCategoriesQuery, useLazyGetCategoriesQuery } = categoriesApi
