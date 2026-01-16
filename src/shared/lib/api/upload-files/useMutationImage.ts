import { useDeleteFileByIdMutation, useUploadImageMutation } from './uploadFiles'

export const useUploadImage = () => {
  const [uploadMutation, mutation] = useUploadImageMutation()
  return {
    uploadImg: (file: File, folder = '') => uploadMutation({ file, folder }).unwrap(),
    ...mutation,
  }
}
export const useDeleteImage = () => {
  const [deleteMutation, mutation] = useDeleteFileByIdMutation()
  return {
    deleteImg: (fileId: string, folder: string) => deleteMutation({ fileId, folder }).unwrap(),
    ...mutation,
  }
}
