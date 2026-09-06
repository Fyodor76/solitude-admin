import { Product, ProductVariation } from '../../../../app/types/product'
import { ApiResponse, baseApi } from '../baseApi'
import {
  CreateStockBulkPayload,
  CreateStockItemPayload,
  ProductCreatePayload,
  ProductSearchFilters,
  ProductsPaginationMeta,
  ProductUpdatePayload,
  ProductVariationCreatePayload,
  ProductVariationUpdatePayload,
  StockItem,
  UpdateStockItemPayload,
} from './types'

export const apiProducts = baseApi.injectEndpoints({
  endpoints: builder => ({
    getProductsByCategoryId: builder.query<ApiResponse<Product[], any>, string>({
      query: (categoryId: string) => ({
        url: `/products/category/${categoryId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, categoryId) => [
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
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
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
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    deleteProduct: builder.mutation<ApiResponse<{ id: string }, any>, string>({
      query: id => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    createStockBulk: builder.mutation<ApiResponse<StockItem[], any>, CreateStockBulkPayload>({
      query: body => ({
        url: `/stock/bulk`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, body) => {
        const variationIds = [...new Set(body.items.map(item => item.variationId))]
        const productIds = [...new Set(body.items.map(item => item.productId))]
        return [
          ...variationIds.map(id => ({ type: 'Stock' as const, id })),
          ...productIds.map(id => ({ type: 'Stock' as const, id: `PRODUCT_${id}` })),
          { type: 'Stock', id: 'LIST' },
        ]
      },
    }),

    createStockItem: builder.mutation<ApiResponse<StockItem, any>, CreateStockItemPayload>({
      query: body => ({
        url: `/stock`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, body) => [
        { type: 'Stock', id: body.variationId },
        { type: 'Stock', id: 'LIST' },
      ],
    }),

    getStockByVariation: builder.query<ApiResponse<StockItem[], any>, string>({
      query: variationId => ({
        url: `/stock/variation/${variationId}`,
        method: 'GET',
      }),
      providesTags: (result, _error, variationId) => [
        { type: 'Stock', id: variationId },
        ...(result?.data?.map(item => ({ type: 'Stock' as const, id: item.id })) ?? []),
      ],
    }),

    getStockByProduct: builder.query<ApiResponse<StockItem[], any>, string>({
      query: productId => ({
        url: `/stock/product/${productId}`,
        method: 'GET',
      }),
      providesTags: (result, _error, productId) => [
        { type: 'Stock', id: `PRODUCT_${productId}` },
        ...(result?.data?.map(item => ({ type: 'Stock' as const, id: item.id })) ?? []),
      ],
    }),

    getStockByVariationIds: builder.query<ApiResponse<StockItem[], any>, string[]>({
      query: variationIds => ({
        url: `/stock/batch/variations`,
        method: 'POST',
        body: { variationIds },
      }),
      providesTags: result => [
        { type: 'Stock', id: 'LIST' },
        ...(result?.data?.map(item => ({ type: 'Stock' as const, id: item.id })) ?? []),
      ],
    }),

    updateStockItem: builder.mutation<
      ApiResponse<StockItem, any>,
      { id: string; body: UpdateStockItemPayload; variationId?: string }
    >({
      query: ({ id, body }) => ({
        url: `/stock/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id, variationId }) => [
        { type: 'Stock', id },
        ...(variationId ? [{ type: 'Stock' as const, id: variationId }] : []),
        { type: 'Stock', id: 'LIST' },
      ],
    }),

    deleteStockItem: builder.mutation<
      ApiResponse<{ id: string }, any>,
      { id: string; variationId?: string }
    >({
      query: ({ id }) => ({
        url: `/stock/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id, variationId }) => [
        { type: 'Stock', id },
        ...(variationId ? [{ type: 'Stock' as const, id: variationId }] : []),
        { type: 'Stock', id: 'LIST' },
      ],
    }),

    getProductVariationById: builder.query<ApiResponse<ProductVariation, any>, string>({
      query: id => ({
        url: `/product-variations/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Product', id: `VARIATION_${id}` }],
    }),

    createProductVariation: builder.mutation<
      ApiResponse<ProductVariation, any>,
      ProductVariationCreatePayload
    >({
      query: body => ({
        url: `/product-variations`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, body) => [
        { type: 'Product', id: body.productId },
        { type: 'Product', id: 'LIST' },
      ],
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
      invalidatesTags: (_result, _error, { id, productId }) => [
        { type: 'Product', id: `VARIATION_${id}` },
        { type: 'Product', id: 'LIST' },
        ...(productId ? [{ type: 'Product' as const, id: productId }] : []),
      ],
    }),

    deleteProductVariation: builder.mutation<
      ApiResponse<{ id: string }, any>,
      { id: string; productId: string }
    >({
      query: ({ id }) => ({
        url: `/product-variations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id, productId }) => [
        { type: 'Product', id: `VARIATION_${id}` },
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' },
        { type: 'Stock', id },
        { type: 'Stock', id: 'LIST' },
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
      invalidatesTags: (_result, _error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    reorderProducts: builder.mutation<
      ApiResponse<Product[], any>,
      { orderedIds: string[]; startOrder?: number }
    >({
      query: body => ({
        url: `/products/reorder`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
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
  useCreateStockItemMutation,
  useGetStockByVariationQuery,
  useLazyGetStockByVariationQuery,
  useGetStockByProductQuery,
  useGetStockByVariationIdsQuery,
  useUpdateStockItemMutation,
  useDeleteStockItemMutation,
  useGetProductVariationByIdQuery,
  useCreateProductVariationMutation,
  useUpdateProductVariationMutation,
  useDeleteProductVariationMutation,
  useReorderProductVariationsMutation,
  useReorderProductsMutation,
} = apiProducts
