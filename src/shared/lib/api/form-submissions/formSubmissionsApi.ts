import { ApiResponse, baseApi } from '../baseApi'
import type { FormSubmissionDto, FormSubmissionsStats } from './types'

export const formSubmissionsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getFormSubmissions: builder.query<ApiResponse<FormSubmissionDto[], unknown>, void>({
      query: () => '/forms',
      providesTags: result =>
        result?.data
          ? [
              'FormSubmissions',
              ...result.data.map(item => ({
                type: 'FormSubmission' as const,
                id: item.id,
              })),
            ]
          : ['FormSubmissions'],
    }),

    getFormSubmissionsStats: builder.query<ApiResponse<FormSubmissionsStats, unknown>, void>({
      query: () => '/forms/stats',
      providesTags: ['FormSubmissionsStats'],
    }),

    markFormSubmissionProcessed: builder.mutation<ApiResponse<FormSubmissionDto, unknown>, string>({
      query: id => ({
        url: `/forms/${id}/process`,
        method: 'PUT',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          formSubmissionsApi.util.updateQueryData('getFormSubmissions', undefined, draft => {
            const item = draft.data.find(submission => submission.id === id)
            if (item) {
              item.status = 'processed'
            }
          })
        )
        try {
          const { data: response } = await queryFulfilled
          dispatch(
            formSubmissionsApi.util.updateQueryData('getFormSubmissions', undefined, draft => {
              const item = draft.data.find(submission => submission.id === id)
              if (item && response.data) {
                Object.assign(item, response.data)
              }
            })
          )
        } catch {
          patch.undo()
        }
      },
      invalidatesTags: ['FormSubmissionsStats'],
    }),

    markFormSubmissionRejected: builder.mutation<ApiResponse<FormSubmissionDto, unknown>, string>({
      query: id => ({
        url: `/forms/${id}/reject`,
        method: 'PUT',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          formSubmissionsApi.util.updateQueryData('getFormSubmissions', undefined, draft => {
            const item = draft.data.find(submission => submission.id === id)
            if (item) {
              item.status = 'rejected'
            }
          })
        )
        try {
          const { data: response } = await queryFulfilled
          dispatch(
            formSubmissionsApi.util.updateQueryData('getFormSubmissions', undefined, draft => {
              const item = draft.data.find(submission => submission.id === id)
              if (item && response.data) {
                Object.assign(item, response.data)
              }
            })
          )
        } catch {
          patch.undo()
        }
      },
      invalidatesTags: ['FormSubmissionsStats'],
    }),
  }),
})

export const {
  useGetFormSubmissionsQuery,
  useGetFormSubmissionsStatsQuery,
  useMarkFormSubmissionProcessedMutation,
  useMarkFormSubmissionRejectedMutation,
} = formSubmissionsApi
