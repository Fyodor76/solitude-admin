import { ApiResponse, baseApi } from '../baseApi'
import { deleteResponse } from '../size-charts/types'
import { AttributeValueRequest, AttributeValueResponse } from './types'

export const AttributeValues = baseApi.injectEndpoints({
  endpoints: builder => ({
    createAttributeValue: builder.mutation<
      ApiResponse<AttributeValueResponse, any>,
      { data: AttributeValueRequest; attributeId: string }
    >({
      query: ({ data, attributeId }) => ({
        url: `/product-attributes/${attributeId}/values`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { attributeId }) => [
        { type: 'Product-attributes', id: attributeId },
        { type: 'Product-attributes', id: 'ALL_PRODUCT-ATTRIBUTES' },
      ],
    }),
    getAttributeValues: builder.query<ApiResponse<AttributeValueResponse[], any>, string>({
      query: attributeId => ({
        url: `/product-attributes/${attributeId}/values`,
        method: 'GET',
      }),
      providesTags: (_result, _error, attributeId) => [
        { type: 'Product-attributes', id: attributeId },
      ],
    }),
    updateAttributeValue: builder.mutation<
      ApiResponse<AttributeValueResponse, any>,
      { data: Partial<AttributeValueRequest>; attributeId: string; valueId: string }
    >({
      query: ({ data, attributeId, valueId }) => ({
        url: `/product-attributes/${attributeId}/values/${valueId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { attributeId }) => [
        { type: 'Product-attributes', id: attributeId },
        { type: 'Product-attributes', id: 'ALL_PRODUCT-ATTRIBUTES' },
      ],
    }),
    deleteAttributeValueById: builder.mutation<
      ApiResponse<deleteResponse, any>,
      { attrId: string; valueId: string }
    >({
      query: ({ attrId, valueId }) => ({
        url: `/product-attributes/${attrId}/values/${valueId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { attrId }) => [
        { type: 'Product-attributes', id: attrId },
        {
          type: 'Product-attributes',
          id: 'ALL_PRODUCT-ATTRIBUTES',
        },
      ],
    }),
  }),
})
export const {
  useCreateAttributeValueMutation,
  useGetAttributeValuesQuery,
  useUpdateAttributeValueMutation,
  useDeleteAttributeValueByIdMutation,
} = AttributeValues
