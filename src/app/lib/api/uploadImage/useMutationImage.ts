import { useDeleteFileForIdMutation, useUploadFileToCdnMutation } from './upload-files'

export const useUploadImage = () => {
  const [uploadMutation, mutation] = useUploadFileToCdnMutation()
  return {
    uploadImage: (file: File, folder = '') => uploadMutation({ file, folder }).unwrap(),
    ...mutation,
  }
}
export const useDeleteImage = () => {
  const [deleteMutation, mutation] = useDeleteFileForIdMutation()
  return {
    deleteImage: (fileId: string) => deleteMutation(fileId).unwrap(),
    ...mutation,
  }
}
