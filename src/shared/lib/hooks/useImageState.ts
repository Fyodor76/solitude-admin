import { useState } from 'react'

import { imgUpload } from '../api/upload-files/uploadFiles'
import { useDeleteImage, useUploadImage } from '../api/upload-files/useMutationImage'
import { useGetFileUrlById } from '../api/upload-files/useQueryImage'
import { useErrorHandler } from './useErrorHandler'

export const useImageState = () => {
  const [images, setImages] = useState<imgUpload[]>([])
  const upload = useUploadImage()
  const deleteImg = useDeleteImage()
  const getUrl = useGetFileUrlById()
  const { catchErrors } = useErrorHandler()

  const isLoading = upload.isLoading || deleteImg.isLoading || getUrl.isLoading

  const uploadImage = (file: File, folder?: string) => {
    return catchErrors(async () => {
      const result = await upload.uploadImage(file, folder)
      const newImage: imgUpload = {
        fileId: result.data.fileId,
        url: result.data.url,
      }
      setImages(prev => [...prev, newImage])
      return result
    }, 'useImageState.uploadImage')
  }

  const deleteImage = (fileId: string) => {
    return catchErrors(async () => {
      const result = await deleteImg.deleteImage(fileId)
      setImages(prev => prev.filter(img => img.fileId !== fileId))
      return result
    }, 'useImageState.deleteImage')
  }

  const getImageUrlById = (fileId: string) => {
    return catchErrors(async () => {
      const result = await getUrl.getUrlById(fileId)
      if (result.data) {
        return result.data.data.url
      }
      throw new Error('Url не найден')
    }, 'useImageState.getImageUrlById')
  }
  return {
    images,
    isLoading,
    setImages,
    uploadImage,
    deleteImage,
    getImageUrlById,
  }
}
