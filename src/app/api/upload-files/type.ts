export interface ApiResponse<T, M> {
  success: boolean
  data: T
  meta: M
  message?: string
}
