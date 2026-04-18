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

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  prepareHeaders: headers => {
    const token = localStorage.getItem('access')

    headers.set('Accept', 'application/json')
    headers.set('Content-Type', 'application/json')

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }

    return headers
  },
})

let isRefreshing = false
let subscribers: ((token: string) => void)[] = []

function onRefreshed(token: string) {
  subscribers.forEach(callback => callback(token))
  subscribers = []
}

function subscribeTokenRefresh(callback: (token: string) => void) {
  subscribers.push(callback)
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refresh')

  if (!refreshToken) {
    throw new Error('No refresh token')
  }

  const response = await fetch(`${baseUrl}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh token')
  }

  const { data } = await response.json()

  const newAccessToken = data.accessToken || data.token || data.access_token

  if (!newAccessToken) {
    throw new Error('No access token in response')
  }

  localStorage.setItem('access', newAccessToken)

  return newAccessToken
}

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, HttpErrorResponse> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions)

  if (
    result.error?.status === 401 &&
    !(typeof args === 'string' ? args : args.url).includes('/auth/refresh')
  ) {
    const refreshToken = localStorage.getItem('refresh')
    const currentPath = typeof args === 'string' ? args : args.url || ''

    if (!refreshToken) {
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }

      return result.error
    }

    return new Promise((resolve, reject) => {
      subscribeTokenRefresh(async (newToken: string) => {
        try {
          const retryResult = await fetchBaseQuery({
            baseUrl: baseUrl,
            prepareHeaders: headers => {
              headers.set('Accept', 'application/json')
              headers.set('Content-Type', 'application/json')
              headers.set('authorization', `Bearer ${newToken}`)
              return headers
            },
          })(args, api, extraOptions)

          if (retryResult.error) {
            reject({
              error: {
                statusCode:
                  retryResult.error.status === 'FETCH_ERROR'
                    ? 500
                    : Number(retryResult.error.status) || 500,
                timestamp: new Date().toISOString(),
                path: currentPath,
                error: getErrorMessage(retryResult.error),
              },
            })
          } else {
            resolve(retryResult)
          }
        } catch (error) {
          reject({
            error: {
              statusCode: 500,
              timestamp: new Date().toISOString(),
              path: currentPath,
              error: 'Request failed',
            },
          })
        }
      })

      if (!isRefreshing) {
        isRefreshing = true
        refreshAccessToken()
          .then(newToken => {
            onRefreshed(newToken)
          })
          .catch(() => {
            subscribers = []
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            window.location.href = '/login'
          })
          .finally(() => {
            isRefreshing = false
          })
      }
    })
  }

  if (result.error) {
    const currentPath = typeof args === 'string' ? args : args.url || ''

    return {
      error: {
        statusCode:
          result.error.status === 'FETCH_ERROR' ? 500 : Number(result.error.status) || 500,
        timestamp: new Date().toISOString(),
        path: currentPath,
        error: getErrorMessage(result.error),
      },
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
  baseQuery: baseQueryWithReauth,
  tagTypes: ['File', 'Category', 'Collection', 'Product'],
  endpoints: () => ({}),
})
