import { SizeChartResponse } from '@/app/types/size-chart'

import { ApiResponse, baseApi } from '../baseApi'
import { deleteSizeChartResponse, SizeChartRequest } from './types'

export const SizeCharts = baseApi.injectEndpoints({
  endpoints: builder => ({
    createSizeChart: builder.mutation<ApiResponse<SizeChartResponse, any>, SizeChartRequest>({
      query: newSizeChart => ({
        url: `/size-charts`,
        method: 'POST',
        body: newSizeChart,
      }),
      invalidatesTags: [{ type: 'Size-chart' as const, id: 'ALL_SIZE-CHARTS' }],
    }),
    getAllSizeCharts: builder.query<ApiResponse<SizeChartResponse[], any>, void>({
      query: () => ({
        url: `/size-charts`,
        method: 'GET',
      }),
      providesTags: [{ type: 'Size-chart' as const, id: 'ALL_SIZE-CHARTS' }],
    }),
    getSizeChartById: builder.query<ApiResponse<SizeChartResponse, any>, string>({
      query: sizeChartId => ({
        url: `/size-charts/${sizeChartId}`,
        method: 'GET',
      }),
      providesTags: (result, error, sizeChartId) => [{ type: 'Size-chart', sizeChartId }],
    }),
    updateSizeChartById: builder.mutation<
      ApiResponse<SizeChartResponse, any>,
      { id: string; data: Partial<SizeChartRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/size-charts/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Size-chart', id },
        { type: 'Size-chart', id: 'ALL_SIZE-CHARTS' },
      ],
    }),
    deleteSizeChartById: builder.mutation<ApiResponse<deleteSizeChartResponse, any>, string>({
      query: id => ({
        url: `/size-charts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Size-chart', id },
        { type: 'Size-chart', id: 'ALL_SIZE-CHARTS' },
      ],
    }),
    getSizeChartByCategoryId: builder.query<ApiResponse<SizeChartResponse, any>, string>({
      query: categoryId => ({
        url: `/size-charts/category/${categoryId}`,
        method: 'GET',
      }),
      providesTags: (result, error, categoryId) => [
        { type: 'Size-chart', id: `CATEGORY_${categoryId}` },
      ],
    }),
    getSizeChartByProductType: builder.query<ApiResponse<SizeChartResponse, any>, string>({
      query: productType => ({
        url: `/size-charts/product-type/${productType}`,
        method: 'GET',
      }),
      providesTags: (result, error, productType) => [{ type: 'Size-chart', productType }],
    }),
  }),
})
export const {
  useCreateSizeChartMutation,
  useDeleteSizeChartByIdMutation,
  useGetAllSizeChartsQuery,
  useGetSizeChartByCategoryIdQuery,
  useGetSizeChartByIdQuery,
  useGetSizeChartByProductTypeQuery,
  useUpdateSizeChartByIdMutation,
} = SizeCharts
