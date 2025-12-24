import { AxiosRequestConfig } from 'axios'

export interface ApiResponse<T, M> {
  success: boolean
  data: T
  meta: M
  message?: string
}

export interface CustomApiClient {
  get<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<T>
  post<T = any, D = any>(url: string, data?: any, config?: AxiosRequestConfig<D>): Promise<T>
  put<T = any, D = any>(url: string, data?: any, config?: AxiosRequestConfig<D>): Promise<T>
  patch<T = any, D = any>(url: string, data?: any, config?: AxiosRequestConfig<D>): Promise<T>
  delete<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<T>
  head<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<T>

  options<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<T>

  request<T = any, D = any>(config: AxiosRequestConfig<D>): Promise<T>

  getUri(config?: AxiosRequestConfig): string

  defaults: AxiosRequestConfig
  interceptors: {
    request: any
    response: any
  }

  [key: string]: any
}
