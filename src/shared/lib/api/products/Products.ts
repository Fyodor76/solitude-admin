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

    createStockBulk: builder.mutation<ApiResponse<StockItem[], any>, CreateStockBulkPayload>({
      query: body => ({
        url: `/stock/bulk`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, body) => {
        const variationIds = [...new Set(body.items.map(item => item.variationId))]
        return [
          ...variationIds.map(id => ({ type: 'Stock' as const, id })),
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
      invalidatesTags: (result, error, body) => [
        { type: 'Stock', id: body.variationId },
        { type: 'Stock', id: 'LIST' },
      ],
    }),

    getStockByVariation: builder.query<ApiResponse<StockItem[], any>, string>({
      query: variationId => ({
        url: `/stock/variation/${variationId}`,
        method: 'GET',
      }),
      providesTags: (result, error, variationId) => [
        { type: 'Stock', id: variationId },
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
      invalidatesTags: (result, error, { id, variationId }) => [
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
      invalidatesTags: (result, error, { id, variationId }) => [
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
      providesTags: (result, error, id) => [{ type: 'Product', id: `VARIATION_${id}` }],
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
      invalidatesTags: (result, error, body) => [
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
  useUpdateStockItemMutation,
  useDeleteStockItemMutation,
  useGetProductVariationByIdQuery,
  useCreateProductVariationMutation,
  useUpdateProductVariationMutation,
  useReorderProductVariationsMutation,
  useReorderProductsMutation,
} = apiProducts
