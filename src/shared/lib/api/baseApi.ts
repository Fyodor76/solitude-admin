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

const API_BASE_URL = import.meta.env.VITE_API_URL

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
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
let subscribers: ((token: string | null) => void)[] = []

function buildErrorResponse(path: string, statusCode: number, error: string) {
  return {
    error: {
      statusCode,
      timestamp: new Date().toISOString(),
      path,
      error,
    },
  }
}

function onRefreshed(token: string | null) {
  subscribers.forEach(callback => callback(token))
  subscribers = []
}

function subscribeTokenRefresh(callback: (token: string | null) => void) {
  subscribers.push(callback)
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refresh')

  if (!refreshToken) {
    throw new Error('No refresh token')
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
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

  const newAccessToken = data.accessToken
  const newRefreshToken = data.refreshToken

  if (!newAccessToken) {
    throw new Error('No access token in response')
  }

  localStorage.setItem('access', newAccessToken)
  localStorage.setItem('refresh', newRefreshToken)

  return newAccessToken
}

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, HttpErrorResponse> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions)
  const currentPath = typeof args === 'string' ? args : args.url || ''

  if (result.error?.status === 401 && !currentPath.includes('/auth/refresh')) {
    const refreshToken = localStorage.getItem('refresh')

    if (!refreshToken) {
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }

      return buildErrorResponse(currentPath, 401, getErrorMessage(result.error))
    }

    return new Promise(resolve => {
      subscribeTokenRefresh(async newToken => {
        if (!newToken) {
          resolve(buildErrorResponse(currentPath, 401, 'Session expired'))
          return
        }

        try {
          const retryResult = await fetchBaseQuery({
            baseUrl: API_BASE_URL,
            prepareHeaders: headers => {
              headers.set('Accept', 'application/json')
              headers.set('Content-Type', 'application/json')
              headers.set('authorization', `Bearer ${newToken}`)
              return headers
            },
          })(args, api, extraOptions)

          if (retryResult.error) {
            resolve(
              buildErrorResponse(
                currentPath,
                retryResult.error.status === 'FETCH_ERROR'
                  ? 500
                  : Number(retryResult.error.status) || 500,
                getErrorMessage(retryResult.error)
              )
            )
          } else {
            resolve(retryResult)
          }
        } catch {
          resolve(buildErrorResponse(currentPath, 500, 'Request failed'))
        }
      })

      if (!isRefreshing) {
        isRefreshing = true
        refreshAccessToken()
          .then(newToken => {
            onRefreshed(newToken)
          })
          .catch(() => {
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')

            resolve({
              error: {
                statusCode: 401,
                timestamp: new Date().toISOString(),
                path: currentPath,
                error: 'Session expired',
              },
            })

            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login'
            }
          })
          .finally(() => {
            isRefreshing = false
          })
      }
    })
  }

  if (result.error) {
    return buildErrorResponse(
      currentPath,
      result.error.status === 'FETCH_ERROR' ? 500 : Number(result.error.status) || 500,

      getErrorMessage(result.error)
    )
  }

  return result
}

const getErrorMessage = (error: FetchBaseQueryError) => {
  if (error.data && typeof error.data === 'object') {
    const data = error.data as any
    if (Object.keys(data.fieldErrors).length || data.fieldErrors.length) {
      return data.fieldErrors
    } else {
      return data.generalErrors
    }
  }
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'File',
    'Category',
    'Collection',
    'Product',
    'Size-chart',
    'Size-parameter',
    'Product-attributes',
    'SupportInbox',
    'SupportConversation',
    'SupportMessages',
    'AdminNotifications',
    'AdminNotificationsSummary',
    'AdminNotification',
    'FormSubmissions',
    'FormSubmissionsStats',
    'FormSubmission',
  ],
  endpoints: () => ({}),
})
