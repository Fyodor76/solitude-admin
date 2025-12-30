import { useUploadFileToCdnMutation } from '../upload-files'

export const useUploadImage = () => {
  const [uploadMutation, { isLoading: uploadLoading }] = useUploadFileToCdnMutation()

  const uploadImage = async (file: File, folder = 'icons') => {
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

  return {
    uploadImage,
    uploadLoading,
  }
}
