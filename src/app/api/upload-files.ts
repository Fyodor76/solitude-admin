import { ApiResponse } from '../lib/api/type'
import { baseApi } from '../store/api/baseApi'

//import { apiClient } from '../lib/api/client';
export interface imgUpload {
  fileId: string
  url: string
}

export const uploadFiles = baseApi.injectEndpoints({
  endpoints: builder => ({
    getFileUrlForId: builder.query<ApiResponse<imgUpload, any>, string>({
      query: fileId => ({
        url: `/cdn/url/${fileId}`,
        method: 'GET',
      }),
      providesTags: (result, error, fileId) => (result ? [{ type: 'File', id: fileId }] : []),
    }),

    uploadFileToCdn: builder.mutation<ApiResponse<imgUpload, any>, { file: File; folder?: string }>(
      {
        query: ({ file, folder }) => {
          const formData = new FormData()
          formData.append('file', file)
          if (folder) formData.append('folder', folder)
          return {
            url: `/cdn/upload`,
            method: 'POST',
            body: formData,
          }
        },
        invalidatesTags: ['File'],
      }
    ),

    deleteFileForId: builder.mutation<ApiResponse<imgUpload, any>, string>({
      query: fileId => ({
        url: `/cdn/${fileId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, fileId) => [{ type: 'File', id: fileId }],
    }),
  }),
})

export const {
  useGetFileUrlForIdQuery,
  useUploadFileToCdnMutation,
  useDeleteFileForIdMutation,
  useLazyGetFileUrlForIdQuery,
} = uploadFiles

/*export const deleteFileForId = async (fileId: string): Promise<ApiResponse<imgUpload, any>> => {
  try {
    const respons = await apiClient.delete(`/cdn/${fileId}`)
    return respons
  } catch (error) {
    console.error('❌ Ошибка удаления файла:', error)
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
    console.error('❌ Ошибка загрузки файла:', error)
    throw error
  }
}*/
