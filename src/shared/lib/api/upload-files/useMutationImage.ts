import { useDeleteFileByIdMutation, useUploadImageMutation } from './uploadFiles'

export const useUploadImage = () => {
  const [uploadMutation, mutation] = useUploadImageMutation()
  return {
    uploadImage: (file: File, folder = '') => uploadMutation({ file, folder }).unwrap(),
    ...mutation,
  }
}
export const useDeleteImage = () => {
  const [deleteMutation, mutation] = useDeleteFileByIdMutation()
  return {
    deleteImage: (fileId: string) => deleteMutation(fileId).unwrap(),
    ...mutation,
  }
}
