import { ApiResponse, baseApi } from '../baseApi'

export interface imgUpload {
  fileId: string
  url: string
}

export const uploadFiles = baseApi.injectEndpoints({
  endpoints: builder => ({
    getFileUrlById: builder.query<ApiResponse<imgUpload, any>, string>({
      query: fileId => ({
        url: `/cdn/url/${fileId}`,
        method: 'GET',
      }),
      providesTags: (result, error, fileId) => (result ? [{ type: 'File', id: fileId }] : []),
    }),

    uploadImage: builder.mutation<ApiResponse<imgUpload, any>, { file: File; folder?: string }>({
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
    }),

    deleteFileById: builder.mutation<ApiResponse<imgUpload, any>, string>({
      query: fileId => ({
        url: `/cdn/${fileId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, fileId) => [{ type: 'File', id: fileId }],
    }),
  }),
})

export const {
  useGetFileUrlByIdQuery,
  useUploadImageMutation,
  useDeleteFileByIdMutation,
  useLazyGetFileUrlByIdQuery,
} = uploadFiles
