import { apiClient } from '@/app/lib/api/client'

interface UploadResponse {
  success: boolean
  data: {
    fileId: string
    url: string
  }
  message: string
}

interface GetUrlResponse {
  success: boolean
  data: {
    fileId: string
    url: string
  }
}

interface DeleteFileResponse {
  success: boolean
  data: {
    message: string
  }
  message: string
}
export const getFileUrlForId = async (fileId: string): Promise<GetUrlResponse> => {
  try {
    const respons = await apiClient.get(`/cdn/url/${fileId}`)
    return respons
  } catch (error) {
    console.error('❌ Ошибка получения URL:', error)
    throw error
  }
}

export const deleteFileForId = async (fileId: string): Promise<DeleteFileResponse> => {
  try {
    const respons = await apiClient.delete(`/cdn/${fileId}`)
    return respons
  } catch (error) {
    console.error('❌ Ошибка удаления файла:', error)
    throw error
  }
}

export const uploadFileToCdn = async (file: File, folder?: string): Promise<UploadResponse> => {
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
    console.error('❌ Ошибка удаления файла:', error)
    throw error
  }
}
