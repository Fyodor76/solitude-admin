import { ApiResponse, baseApi } from '../baseApi'
import { DeleteLandingStageResponse, LandingStage, LandingStageRequest } from './types'

export const LandingStagesApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAllLandingStages: builder.query<ApiResponse<LandingStage[], unknown>, void>({
      query: () => ({
        url: '/landing-stages',
        method: 'GET',
      }),
      providesTags: [{ type: 'LandingStages', id: 'LIST' }],
    }),
    getLandingStageById: builder.query<ApiResponse<LandingStage, unknown>, string>({
      query: id => ({
        url: `/landing-stages/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'LandingStages', id }],
    }),
    createLandingStage: builder.mutation<ApiResponse<LandingStage, unknown>, LandingStageRequest>({
      query: body => ({
        url: '/landing-stages',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'LandingStages', id: 'LIST' }],
    }),
    updateLandingStage: builder.mutation<
      ApiResponse<LandingStage, unknown>,
      { id: string; data: Partial<LandingStageRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/landing-stages/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'LandingStages', id: 'LIST' },
        { type: 'LandingStages', id },
      ],
    }),
    deleteLandingStage: builder.mutation<ApiResponse<DeleteLandingStageResponse, unknown>, string>({
      query: id => ({
        url: `/landing-stages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'LandingStages', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetAllLandingStagesQuery,
  useGetLandingStageByIdQuery,
  useCreateLandingStageMutation,
  useUpdateLandingStageMutation,
  useDeleteLandingStageMutation,
} = LandingStagesApi
