import { ApiResponse, baseApi } from '../baseApi'
import { deleteResponse } from '../size-charts/types'
import { ProductAttributeRequest, ProductAttributeResponse } from './types'

export const ProductAttributes = baseApi.injectEndpoints({
  endpoints: builder => ({
    createProductAttributes: builder.mutation<
      ApiResponse<ProductAttributeResponse, any>,
      { data: ProductAttributeRequest }
    >({
      query: ({ data }) => ({
        url: `/product-attributes`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Product-attributes', id: 'ALL_PRODUCT-ATTRIBUTES' }],
    }),
    getAllProductAttributes: builder.query<ApiResponse<ProductAttributeResponse[], any>, void>({
      query: () => ({
        url: `/product-attributes`,
        method: 'GET',
      }),
      providesTags: [{ type: 'Product-attributes', id: 'ALL_PRODUCT-ATTRIBUTES' }],
    }),

    getProductAttributeById: builder.query<ApiResponse<ProductAttributeResponse, any>, string>({
      query: id => ({
        url: `/product-attributes/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Product-attributes', id }],
    }),
    deleteProductAttributeById: builder.mutation<ApiResponse<deleteResponse, any>, string>({
      query: id => ({
        url: `/product-attributes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Product-attributes', id },
        {
          type: 'Product-attributes',
          id: 'ALL_PRODUCT-ATTRIBUTES',
        },
      ],
    }),
    getProductAttributeBySlug: builder.query<ApiResponse<ProductAttributeResponse, any>, string>({
      query: slug => ({
        url: `/product-attributes/slug/${slug}`,
        method: 'GET',
      }),
      providesTags: (result, error, slug) => [{ type: 'Product-attributes', id: slug }],
    }),
    getProductAttributeByType: builder.query<ApiResponse<ProductAttributeResponse[], any>, string>({
      query: productAttributeType => ({
        url: `/product-attributes/type/${productAttributeType}`,
        method: 'GET',
      }),
      providesTags: (result, error, productAttributeType) => [
        { type: 'Product-attributes', id: productAttributeType },
      ],
    }),
    updateProductAttributes: builder.mutation<
      ApiResponse<ProductAttributeResponse, any>,
      { data: Partial<ProductAttributeRequest>; id: string }
    >({
      query: ({ data, id }) => ({
        url: `/product-attributes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product-attributes', id },
        { type: 'Product-attributes', id: 'ALL_PRODUCT-ATTRIBUTES' },
      ],
    }),
  }),
})
export const {
  useCreateProductAttributesMutation,
  useDeleteProductAttributeByIdMutation,
  useGetAllProductAttributesQuery,
  useGetProductAttributeByIdQuery,
  useGetProductAttributeBySlugQuery,
  useGetProductAttributeByTypeQuery,
  useUpdateProductAttributesMutation,
} = ProductAttributes
