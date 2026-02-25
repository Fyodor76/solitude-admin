import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'

export interface HttpErrorResponse {
  statusCode: number
  timestamp: string
  path: string
  error: string
}
export interface ApiResponse<T, M> {
  success: boolean
  data: T
  meta: M
  message?: string
}

const baseUrl = import.meta.env.VITE_API_URL

const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  HttpErrorResponse
> = async (args, api, extraOptions) => {
  const result = await fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: headers => {
      headers.set('Accept', 'application/json')
      headers.set('Content-Type', 'application/json')
      return headers
    },
  })(args, api, extraOptions)

  if (result.error) {
    const error = result.error as FetchBaseQueryError

    const httpError: HttpErrorResponse = {
      statusCode: typeof error.status === 'number' ? error.status : 500,
      timestamp: new Date().toISOString(),
      path: typeof args === 'string' ? args : args.url || '',
      error: getErrorMessage(error),
    }

    return {
      error: httpError,
    }
  }

  return result
}

const getErrorMessage = (error: FetchBaseQueryError): string => {
  if (error.data && typeof error.data === 'object') {
    const data = error.data as any
    return data.error || data.message || 'Произошла ошибка'
  }

  if (error.status === 'FETCH_ERROR') return 'Ошибка сети'
  if (error.status === 'PARSING_ERROR') return 'Ошибка обработки ответа'

  return 'Произошла ошибка'
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['File', 'Category', 'Collection', 'Product'],
  endpoints: () => ({}),
})
