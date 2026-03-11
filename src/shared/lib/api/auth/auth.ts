import { ApiResponse, baseApi } from '../baseApi'
import {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
} from './types'

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    register: build.mutation<ApiResponse<RegisterResponse, any>, RegisterRequest>({
      query: data => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
    }),

    login: build.mutation<LoginResponse, LoginRequest>({
      query: data => ({
        url: '/auth',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<LoginResponse, any>) => response.data,
    }),

    logout: build.mutation<LogoutResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    refresh: build.mutation<ApiResponse<RefreshResponse, any>, RefreshRequest>({
      query: data => ({
        url: '/auth/refresh',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useRefreshMutation } =
  authApi
