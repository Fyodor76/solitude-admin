import { ApiResponse, baseApi } from '../baseApi'
import {
  BaseCategoryTree,
  CategoryMenuItem,
  CategoryRequest,
  CollectionItem,
  DeleteCategoryResponse,
} from './types'

export const apiCategories = baseApi.injectEndpoints({
  endpoints: builder => ({
    createCategory: builder.mutation<ApiResponse<CategoryMenuItem, any>, CategoryRequest>({
      query: newCategory => ({
        url: `/categories`,
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: [{ type: 'Category' as const, id: 'ALL_CATEGORIES' }],
    }),

    getCategories: builder.query<ApiResponse<CategoryMenuItem[], any>, void>({
      query: () => ({
        url: `/categories`,
        method: 'GET',
      }),
      providesTags: result => {
        const tags = [{ type: 'Category' as const, id: 'ALL_CATEGORIES' }]

        if (result?.data) {
          return [...result.data.map(({ id }) => ({ type: 'Category' as const, id })), ...tags]
        }

        return tags
      },
    }),

    getCategoriesTree: builder.query<ApiResponse<BaseCategoryTree[], any>, void>({
      query: () => ({
        url: `/categories/tree`,
        method: 'GET',
      }),
      providesTags: result => [{ type: 'Category' as const, id: 'ALL_CATEGORIES' }],
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
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
    updateCategoryById: builder.mutation<
      ApiResponse<CategoryMenuItem, any>,
      { id: string; data: Partial<CategoryRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'ALL_CATEGORIES' },
      ],
    }),
    deleteCategory: builder.mutation<ApiResponse<DeleteCategoryResponse, any>, string>({
      query: (id: string) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Category', id },
        { type: 'Category', id: 'ALL_CATEGORIES' },
      ],
    }),
    getCategoryBySlug: builder.query<ApiResponse<CategoryMenuItem, any>, string>({
      query: (slug: string) => ({
        url: `/categories/slug/${slug}`,
        method: 'GET',
      }),
      providesTags: (result, error, slug) =>
        result?.data?.id ? [{ type: 'Category', id: result.data.id }] : [],
    }),

    getChildCategories: builder.query<ApiResponse<CategoryMenuItem[], any>, string>({
      query: (id: string) => ({
        url: `/categories/${id}/children`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Category', id: `CHILDREN_OF_${id}` }],
    }),
    deactivateCategory: builder.mutation<ApiResponse<CategoryMenuItem, any>, string>({
      query: (id: string) => ({
        url: `/categories/${id}/deactivate`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Category', id },
        { type: 'Category', id: 'ALL_CATEGORIES' },
      ],
    }),
  }),
})
export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetCollectionsQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryByIdMutation,
  useDeleteCategoryMutation,
  useGetCategoryBySlugQuery,
  useGetChildCategoriesQuery,
  useDeactivateCategoryMutation,
  useGetCategoriesTreeQuery,
} = apiCategories
