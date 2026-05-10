import { ApiResponse, baseApi } from '../baseApi'

export interface imgUpload {
  fileId: string
  url: string
  folder?: string
}

export interface ListFilesMeta {
  limit: number
  isTruncated: boolean
  nextContinuationToken?: string
}

export const uploadFiles = baseApi.injectEndpoints({
  endpoints: builder => ({
    listFiles: builder.query<
      ApiResponse<imgUpload[], ListFilesMeta>,
      { folder?: string; limit?: number; continuationToken?: string }
    >({
      query: ({ folder, limit, continuationToken }) => ({
        url: `/cdn/list`,
        method: 'GET',
        params: {
          ...(folder ? { folder } : {}),
          ...(limit ? { limit } : {}),
          ...(continuationToken ? { continuationToken } : {}),
        },
      }),
      providesTags: result =>
        result?.data
          ? [...result.data.map(f => ({ type: 'File' as const, id: f.fileId })), 'File']
          : ['File'],
    }),

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
  useListFilesQuery,
  useLazyListFilesQuery,
  useGetFileUrlByIdQuery,
  useUploadImageMutation,
  useDeleteFileByIdMutation,
  useLazyGetFileUrlByIdQuery,
} = uploadFiles
