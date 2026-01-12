import { apiClient } from '../../app/api/client'
import { ApiResponse } from '../../app/api/type'

export interface imgUpload {
  fileId: string
  url: string
}

export const getFileUrlForId = async (fileId: string): Promise<ApiResponse<imgUpload, any>> => {
  try {
    const respons = await apiClient.get(`/cdn/url/${fileId}`)
    return respons
  } catch (error) {
    console.error('Ошибка получения URL:', error)
    throw error
  }
}

export const deleteFileForId = async (fileId: string): Promise<ApiResponse<imgUpload, any>> => {
  try {
    const respons = await apiClient.delete(`/cdn/${fileId}`)
    return respons
  } catch (error) {
    console.error('Ошибка удаления файла:', error)
    throw error
  }
}

export const uploadFileToCdn = async (
  file: File,
  folder?: string
): Promise<ApiResponse<imgUpload, any>> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    if (folder) {
      formData.append('folder', folder)
    }
    const respons = await apiClient.post(`/cdn/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return respons
  } catch (error) {
    console.error('Ошибка загрузки файла:', error)
    throw error
  }
}
