import { ApiResponse, baseApi } from '../baseApi'
import { deleteSizeParametersResponse, SizeParameter } from './type'

export const SizeParameters = baseApi.injectEndpoints({
  endpoints: builder => ({
    createSizeParameterBySizeChartId: builder.mutation<
      ApiResponse<SizeParameter, any>,
      { data: SizeParameter; sizeChartId: string }
    >({
      query: ({ data, sizeChartId }) => ({
        url: `/size-parameters/${sizeChartId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Size-parameter' as const, id: 'ALL_SIZE-PARAMETER' }],
    }),

    createSizeParametersBySizeChartIdBulk: builder.mutation<
      ApiResponse<SizeParameter[], any>,
      { data: SizeParameter[]; sizeChartId: string }
    >({
      query: ({ data, sizeChartId }) => ({
        url: `/size-parameters/${sizeChartId}/bulk`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Size-parameter' as const, id: 'ALL_SIZE-PARAMETER' }],
    }),
    getSizeParameterById: builder.query<ApiResponse<SizeParameter, any>, string>({
      query: id => ({
        url: `/size-parameters/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Size-parameter', id }],
    }),
    deleteSizeParameterById: builder.mutation<
      ApiResponse<deleteSizeParametersResponse, any>,
      string
    >({
      query: id => ({
        url: `/size-parameters/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Size-parameter', id },
        { type: 'Size-parameter', id: 'ALL_SIZE-PARAMETER' },
      ],
    }),
    getAllSizeParameters: builder.query<ApiResponse<SizeParameter[], any>, void>({
      query: () => ({
        url: `/size-parameters`,
        method: 'GET',
      }),
      providesTags: [{ type: 'Size-parameter' as const, id: 'ALL_SIZE-PARAMETER' }],
    }),
    getSizeParametersBySizeChartId: builder.query<ApiResponse<SizeParameter[], any>, string>({
      query: sizeChartId => ({
        url: `/size-parameters/size-chart/${sizeChartId}`,
        method: 'GET',
      }),
      providesTags: (result, error, sizeChartId) => [{ type: 'Size-parameter', sizeChartId }],
    }),
  }),
})
