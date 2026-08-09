import { Product, ProductVariation } from '../../../../app/types/product'
import { ApiResponse, baseApi } from '../baseApi'
import {
  CreateStockBulkPayload,
  ProductCreatePayload,
  ProductSearchFilters,
  ProductsPaginationMeta,
  ProductUpdatePayload,
  ProductVariationUpdatePayload,
} from './types'

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

    searchProducts: builder.query<
      ApiResponse<Product[], ProductsPaginationMeta>,
      ProductSearchFilters
    >({
      query: body => ({
        url: `/products/search`,
        method: 'POST',
        body,
      }),
      providesTags: result =>
        result?.data
          ? [
              ...result.data.map(product => ({ type: 'Product' as const, id: product.id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    getProductById: builder.query<ApiResponse<Product, any>, string>({
      query: id => ({
        url: `/products/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    createProduct: builder.mutation<ApiResponse<Product, any>, ProductCreatePayload>({
      query: body => ({
        url: `/products`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    updateProduct: builder.mutation<
      ApiResponse<Product, any>,
      { id: string; body: ProductUpdatePayload }
    >({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    deleteProduct: builder.mutation<ApiResponse<{ id: string }, any>, string>({
      query: id => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    createStockBulk: builder.mutation<ApiResponse<unknown, any>, CreateStockBulkPayload>({
      query: body => ({
        url: `/stock/bulk`,
        method: 'POST',
        body,
      }),
    }),

    getProductVariationById: builder.query<ApiResponse<ProductVariation, any>, string>({
      query: id => ({
        url: `/product-variations/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Product', id: `VARIATION_${id}` }],
    }),

    updateProductVariation: builder.mutation<
      ApiResponse<ProductVariation, any>,
      { id: string; body: ProductVariationUpdatePayload; productId?: string }
    >({
      query: ({ id, body }) => ({
        url: `/product-variations/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id, productId }) => [
        { type: 'Product', id: `VARIATION_${id}` },
        { type: 'Product', id: 'LIST' },
        ...(productId ? [{ type: 'Product' as const, id: productId }] : []),
      ],
    }),

    reorderProductVariations: builder.mutation<
      ApiResponse<ProductVariation[], any>,
      { productId: string; orderedIds: string[] }
    >({
      query: body => ({
        url: `/product-variations/reorder`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetProductsByCategoryIdQuery,
  useLazyGetProductsByCategoryIdQuery,
  useSearchProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateStockBulkMutation,
  useGetProductVariationByIdQuery,
  useUpdateProductVariationMutation,
  useReorderProductVariationsMutation,
} = apiProducts
