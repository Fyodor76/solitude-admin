import axios, { AxiosInstance } from 'axios'

import { CustomApiClient } from './type'

const baseUrl = import.meta.env.VITE_API_URL

const instance: AxiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})
instance.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)
export const apiClient = instance as unknown as CustomApiClient
