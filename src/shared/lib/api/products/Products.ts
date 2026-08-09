import { Product } from '../../../../app/types/product'
import { ApiResponse, baseApi } from '../baseApi'
import { CreateStockBulkPayload, ProductCreatePayload } from './types'

export const apiProducts = baseApi.injectEndpoints({
  endpoints: builder => ({
    getProductsByCategoryId: builder.query<ApiResponse<Product[], any>, string>({
      query: (categoryId: string) => ({
        url: `/products/category/${categoryId}`,
        method: 'GET',
      }),
      providesTags: (result, error, categoryId) => [
        { type: 'Product', id: `CATEGORY_${categoryId}` },
      ],
    }),

    createProduct: builder.mutation<ApiResponse<Product, any>, ProductCreatePayload>({
      query: body => ({
        url: `/products`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    createStockBulk: builder.mutation<ApiResponse<unknown, any>, CreateStockBulkPayload>({
      query: body => ({
        url: `/stock/bulk`,
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useGetProductsByCategoryIdQuery,
  useLazyGetProductsByCategoryIdQuery,
  useCreateProductMutation,
  useCreateStockBulkMutation,
} = apiProducts
