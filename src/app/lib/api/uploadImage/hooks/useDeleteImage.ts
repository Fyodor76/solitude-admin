import { useDeleteFileForIdMutation } from '../upload-files'

export const useDeleteImage = () => {
  const [deleteMutation, { isLoading: deleteLoading }] = useDeleteFileForIdMutation()

  const deleteImage = async (fileId: string) => {
    try {
      await deleteMutation(fileId).unwrap()
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }
  return {
    deleteImage,
    deleteLoading,
  }
}
