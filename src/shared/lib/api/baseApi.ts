import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'

export interface HttpErrorResponse {
  statusCode: number // HTTP статус код: 400, 404, 500 и т.д.
  timestamp: string // ISO дата-время
  path: string // URL запроса
  error: string // Сообщение об ошибке
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
      headers.set('Content-Type', 'application/json')
      return headers
    },
  })(args, api, extraOptions)
  if (result.error) {
    const error = result.error as FetchBaseQueryError

    const httpError: HttpErrorResponse = {
      statusCode: getStatusCode(error),
      timestamp: new Date().toISOString(),
      path: getRequestPath(args, baseUrl),
      error: getErrorMessage(error),
    }
    logErrorToConsole(httpError, error)
    return {
      error: httpError,
    }
  }
  // Дополнительная проверка: если сервер вернул успешный ответ, но с success: false
  // или если это какая-то другая неожиданная структура
  if (result.data && typeof result.data === 'object') {
    const data = result.data as any

    // Проверяем, если сервер вернул success: false в ответе
    if (data.success === false) {
      const httpError: HttpErrorResponse = {
        statusCode: data.statusCode || 400,
        timestamp: new Date().toISOString(),
        path: getRequestPath(args, baseUrl),
        error: data.message || data.error || 'Операция не выполнена',
      }
      logErrorToConsole(httpError, { status: data.statusCode || 400, data: result.data } as any)
      return {
        error: httpError,
      }
    }
  }
  return result
}

const getStatusCode = (error: FetchBaseQueryError): number => {
  if (typeof error.status === 'number') {
    return error.status
  }
  if (error.status === 'FETCH_ERROR') return 0
  if (error.status === 'PARSING_ERROR') return 0

  return 500
}

const getRequestPath = (args: string | FetchArgs, baseUrl: string) => {
  if (typeof args === 'string') {
    return args
  }

  return args.url || ''
}

const getErrorMessage = (error: FetchBaseQueryError): string => {
  if (error.data && typeof error.data === 'object') {
    const data = error.data as any

    if (data.error) return data.error
    if (data.message) return data.message
    if (data.ditail) return data.ditail
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.map((err: any) => err.message || err).join(', ')
    }
  }
  if (error.status === 'FETCH_ERROR') {
    return 'Ошибка сети. Проверьте подключение к интернету.'
  }
  if (error.status === 'PARSING_ERROR') {
    return 'Ошибка при обработке ответа сервера.'
  }

  if (error.status === 'CUSTOM_ERROR') {
    return error.error || 'Произошла ошибка'
  }
  switch (error.status) {
    case 400:
      return 'Некорректный запрос'
    case 401:
      return 'Требуется авторизация'
    case 403:
      return 'Доступ запрещен'
    case 404:
      return 'Ресурс не найден'
    case 500:
      return 'Внутренняя ошибка сервера'
    default:
      return 'Произошла ошибка'
  }
}
const logErrorToConsole = (httpError: HttpErrorResponse, originalError: FetchBaseQueryError) => {
  console.group('=== 🚨 API ERROR ===')
  console.error('🕒 Время:', httpError.timestamp)
  console.error('🔢 Код:', httpError.statusCode)
  console.error('📍 Путь:', httpError.path)
  console.error('💬 Сообщение:', httpError.error)
  console.error('📄 Оригинальная ошибка:', originalError)
  console.groupEnd()
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['File', 'Category'],
  endpoints: () => ({}),
})
