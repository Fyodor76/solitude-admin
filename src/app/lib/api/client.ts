import axios, { AxiosInstance } from 'axios'
import { CustomApiClient } from './type'

const instance: AxiosInstance = axios.create({
baseURL: 'https://api.solitude-store.ru',
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



