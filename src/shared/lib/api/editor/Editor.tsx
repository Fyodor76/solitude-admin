import { ApiResponse, baseApi } from '../baseApi'
import { deleteResponse } from '../size-charts/types'
import { EditorPatchRequest, EditorType } from './types'

export const Editor = baseApi.injectEndpoints({
  endpoints: builder => ({
    createNewEditor: builder.mutation<ApiResponse<EditorType, any>, EditorType>({
      query: newEditor => ({
        url: `/editors`,
        method: 'POST',
        body: newEditor,
      }),
      invalidatesTags: [{ type: 'Editor', id: 'LIST' }],
    }),
    getAllEditors: builder.query<ApiResponse<EditorType[], any>, void>({
      query: () => ({
        url: `/editors`,
        method: 'GET',
      }),
      providesTags: [{ type: 'Editor', id: 'LIST' }],
    }),
    getEditorById: builder.query<ApiResponse<EditorType, any>, string>({
      query: id => ({
        url: `/editors/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Editor', id }],
    }),
    updateEditor: builder.mutation<ApiResponse<EditorType, any>, EditorPatchRequest>({
      query: ({ id, ...patchData }) => ({
        url: `/editors/${id}`,
        method: 'PATCH',
        body: patchData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Editor', id }],
    }),
    deleteEditor: builder.mutation<ApiResponse<deleteResponse, any>, string>({
      query: id => ({
        url: `/editors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Editor', id: 'LIST' }],
    }),
  }),
})
export const {
  useCreateNewEditorMutation,
  useGetEditorByIdQuery,
  useDeleteEditorMutation,
  useGetAllEditorsQuery,
  useUpdateEditorMutation,
} = Editor
