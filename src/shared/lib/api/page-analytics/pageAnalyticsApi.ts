import { ApiResponse, baseApi } from '../baseApi'
import type { HeatmapClick, TrackedPageSummary } from './types'

export type { HeatmapClick, TrackedPageSummary } from './types'

export const pageAnalyticsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getTrackedPages: builder.query<ApiResponse<TrackedPageSummary[], unknown>, number>({
      query: (limit = 200) => ({
        url: '/events/pages',
        params: { limit },
      }),
    }),

    getHeatmapClicks: builder.query<ApiResponse<{ clicks: HeatmapClick[] }, unknown>, string>({
      query: pageId => ({
        url: '/events/clicks',
        params: { page_id: pageId },
      }),
    }),
  }),
})

export const { useGetTrackedPagesQuery, useLazyGetHeatmapClicksQuery } = pageAnalyticsApi
