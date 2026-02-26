import { Product } from '../../../../app/types/typesProduct'
import { ApiResponse, baseApi } from '../baseApi'

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
  }),
})

export const { useGetProductsByCategoryIdQuery } = apiProducts
