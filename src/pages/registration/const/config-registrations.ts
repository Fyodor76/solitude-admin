import { ConfigRegistrationsType } from '../types'

export const configRegistrations: ConfigRegistrationsType = {
  title: 'Admin Solitude',
  innerTitle: 'Register a new membership',
  subtitle: '',
  className: '',
  sections: [
    {
      className: 'input-container',
      fields: [
        {
          name: 'name',
          typeField: 'input',
          size: 'large',
          placeholder: 'Full name',
          type: 'name',
        },
        {
          name: 'email',
          typeField: 'input',
          size: 'large',
          placeholder: 'Email',
          type: 'email',
        },
        {
          name: 'password',
          typeField: 'input',
          size: 'large',
          placeholder: 'Password',
          type: 'password',
        },
        {
          name: 'repeat_password',
          typeField: 'input',
          size: 'large',
          placeholder: 'Retype password',
          type: 'password',
        },
      ],
    },
    {
      className: 'btns-container',
      fields: [
        {
          typeField: 'checkbox',
          children: 'I agree to the terms',
        },
        {
          typeField: 'button',
          children: 'Register',
          type: 'primary',
          size: 'large',
        },
      ],
    },
    {
      className: 'links-container',
      fields: [
        {
          typeField: 'link',
          children: 'I already have a membership',
          link: '/login',
        },
      ],
    },
  ],
}

// import {
//   BaseQueryFn,
//   createApi,
//   FetchArgs,
//   fetchBaseQuery,
//   FetchBaseQueryError,
// } from '@reduxjs/toolkit/query/react'

// export interface HttpErrorResponse {
//   statusCode: number
//   timestamp: string
//   path: string
//   error: string
// }

// const baseUrl = import.meta.env.VITE_API_URL

// // Создаем базовый fetchBaseQuery
// const baseQuery = fetchBaseQuery({
//   baseUrl: baseUrl,
//   prepareHeaders: headers => {
//     const token = localStorage.getItem('access')

//     headers.set('Accept', 'application/json')
//     headers.set('Content-Type', 'application/json')

//     if (token) {
//       headers.set('authorization', `Bearer ${token}`)
//     }

//     return headers
//   },
// })

// // 🚀 Функция для обновления токена
// let refreshPromise: Promise<string> | null = null

// const refreshAccessToken = async (): Promise<string> => {
//   const refreshToken = localStorage.getItem('refresh')

//   if (!refreshToken) {
//     throw new Error('No refresh token')
//   }

//   console.log('🔄 Refreshing access token...')

//   const response = await fetch(`${baseUrl}/auth/refresh`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ refreshToken }),
//   })

//   if (!response.ok) {
//     throw new Error('Failed to refresh token')
//   }

//   const data = await response.json()
//   const newAccessToken = data.accessToken || data.token || data.access_token

//   if (!newAccessToken) {
//     throw new Error('No access token in response')
//   }

//   localStorage.setItem('access', newAccessToken)
//   console.log('✅ Token refreshed successfully')

//   return newAccessToken
// }

// const baseQueryWithReauth: BaseQueryFn<
//   string | FetchArgs,
//   unknown,
//   HttpErrorResponse
// > = async (args, api, extraOptions) => {
//   // 1️⃣ Пробуем выполнить исходный запрос
//   let result = await baseQuery(args, api, extraOptions)

//   const refreshToken = localStorage.getItem('refresh')
//   console.log('Refresh token:', refreshToken ? '✅ есть' : '❌ нет')
//   console.log('Result:', result)

//   // 2️⃣ Если ошибка 401 и это не запрос на refresh
//   if (
//     result.error?.status === 401 &&
//     !(typeof args === 'string' ? args : args.url).includes('/auth/refresh')
//   ) {
//     console.log('⚠️ Got 401, trying to refresh token...')

//     try {
//       // 3️⃣ Обновляем токен
//       if (!refreshPromise) {
//         refreshPromise = refreshAccessToken()
//       }

//       const newAccessToken = await refreshPromise
//       refreshPromise = null

//       console.log('🔄 Retrying original request with new token')

//       // 4️⃣ 🔥 ВАЖНО: повторяем ТОТ ЖЕ САМЫЙ запрос (args)
//       // Не нужно создавать новый baseQuery, используем тот же с обновленными headers
//       const retryResult = await fetchBaseQuery({
//         baseUrl: baseUrl,
//         prepareHeaders: headers => {
//           headers.set('Accept', 'application/json')
//           headers.set('Content-Type', 'application/json')
//           headers.set('authorization', `Bearer ${newAccessToken}`)
//           return headers
//         },
//       })(args, api, extraOptions)  // ← Тот же args (урл, метод, body)

//       console.log('✅ Retry completed:', retryResult)

//       // 5️⃣ Возвращаем результат повторного запроса
//       if (!retryResult.error) {
//         return retryResult
//       }

//     } catch (refreshError) {
//       console.error('❌ Token refresh failed:', refreshError)
//       refreshPromise = null

//       // Очищаем токены
//       localStorage.removeItem('access')
//       localStorage.removeItem('refresh')

//       // Редирект на логин
//       // window.location.href = '/login'
//     }
//   }

//   // Обработка ошибок
//   if (result.error) {
//     const error = result.error as FetchBaseQueryError
//     console.log(error, 'error')

//     const httpError: HttpErrorResponse = {
//       statusCode: typeof error.status === 'number' ? error.status : 500,
//       timestamp: new Date().toISOString(),
//       path: typeof args === 'string' ? args : args.url || '',
//       error: getErrorMessage(error),
//     }

//     return {
//       error: httpError,
//     }
//   }

//   return result
// }

// const getErrorMessage = (error: FetchBaseQueryError): string => {
//   if (error.data && typeof error.data === 'object') {
//     const data = error.data as any
//     return data.error || data.message || 'Произошла ошибка'
//   }

//   if (error.status === 'FETCH_ERROR') return 'Ошибка сети'
//   if (error.status === 'PARSING_ERROR') return 'Ошибка обработки ответа'

//   return 'Произошла ошибка'
// }

// export const baseApi = createApi({
//   reducerPath: 'api',
//   baseQuery: baseQueryWithReauth,
//   tagTypes: ['File', 'Category', 'Collection'],
//   endpoints: () => ({}),
// })
