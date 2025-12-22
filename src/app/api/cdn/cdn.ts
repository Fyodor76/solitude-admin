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
