import { ApiResponse, baseApi } from '../baseApi'

export interface imgUpload {
  fileId: string
  url: string
  folder?: string
}

export const uploadFiles = baseApi.injectEndpoints({
  endpoints: builder => ({
    getFileUrlById: builder.query<ApiResponse<imgUpload, any>, { fileId: string; folder?: string }>(
      {
        query: ({ fileId, folder }) => ({
          url: `/cdn/url/${fileId}`,
          method: 'GET',
          params: folder ? { folder } : undefined,
        }),
        providesTags: (result, error, { fileId }) => (result ? [{ type: 'File', id: fileId }] : []),
      }
    ),

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

    deleteFileById: builder.mutation<
      ApiResponse<imgUpload, any>,
      { fileId: string; folder: string }
    >({
      query: ({ fileId, folder }) => ({
        url: `/cdn/${fileId}`,
        method: 'DELETE',
        body: { folder },
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      }),
      invalidatesTags: (result, error, { fileId }) => [{ type: 'File', id: fileId }],
    }),
  }),
})

export const {
  useGetFileUrlByIdQuery,
  useUploadImageMutation,
  useDeleteFileByIdMutation,
  useLazyGetFileUrlByIdQuery,
} = uploadFiles
