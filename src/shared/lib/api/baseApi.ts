import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface ApiResponse<T, M> {
  success: boolean
  data: T
  meta: M
  message?: string
}

const baseUrl = import.meta.env.VITE_API_URL

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  prepareHeaders: headers => {
    headers.set('Content-Type', 'application/json')
    return headers
  },
})
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['File', 'Category'],
  endpoints: () => ({}),
})
