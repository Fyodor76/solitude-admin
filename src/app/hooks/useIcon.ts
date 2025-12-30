import { useDeleteFileForIdMutation, useUploadFileToCdnMutation } from '../api/upload-files'

export const useIcon = () => {
  const [uploadMutation, { isLoading: uploadLoading }] = useUploadFileToCdnMutation()
  const [deleteMutation, { isLoading: deleteLoading }] = useDeleteFileForIdMutation()

  const uploadIcon = async (file: File, folder = 'icons') => {
    try {
      const result = await uploadMutation({ file, folder }).unwrap()
      return {
        success: true,
        data: result.data,
      }
    } catch (error) {
      return {
        success: false,
        error,
      }
    }
  }

  const deleteIcon = async (fileId: string) => {
    try {
      await deleteMutation(fileId).unwrap()
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  return {
    uploadIcon,
    deleteIcon,
    uploadLoading,
    deleteLoading,
  }
}
