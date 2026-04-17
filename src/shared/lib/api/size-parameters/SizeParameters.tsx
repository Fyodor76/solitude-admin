import { ApiResponse, baseApi } from '../baseApi'
import { SizeParameter } from './type'

export const SizeParameters = baseApi.injectEndpoints({
  endpoints: builder => ({
    createSizeParameter: builder.mutation<
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
  }),
})
