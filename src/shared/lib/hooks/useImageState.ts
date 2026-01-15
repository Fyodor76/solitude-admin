import { useState } from 'react'

import { HttpErrorResponse } from '../api/baseApi'
import { imgUpload } from '../api/upload-files/uploadFiles'
import { useDeleteImage, useUploadImage } from '../api/upload-files/useMutationImage'
import { useGetFileUrlById } from '../api/upload-files/useQueryImage'

export const useImageState = () => {
  const [images, setImages] = useState<imgUpload[]>([])
  const upload = useUploadImage()
  const deleteImg = useDeleteImage()
  const getUrl = useGetFileUrlById()

  const isLoading = upload.isLoading || deleteImg.isLoading || getUrl.isLoading
  const error = (upload.error || deleteImg.error || getUrl.error) as HttpErrorResponse | null

  const uploadImage = async (file: File, folder?: string) => {
    const result = await upload.uploadImage(file, folder)
    const newImage: imgUpload = {
      fileId: result.data.fileId,
      url: result.data.url,
    }
    setImages(prev => [...prev, newImage])
    return result
  }

  const deleteImage = async (fileId: string, folder: string) => {
    const result = await deleteImg.deleteImage(fileId, folder)
    setImages(prev => prev.filter(img => img.fileId !== fileId))
    return result
  }

  const getImageUrlById = async (fileId: string, folder?: string) => {
    const result = await getUrl.getUrlById({ fileId, folder })
    if (result.error) {
      throw result.error
    }
    if (result.data?.data?.url) {
      return result.data.data.url
    }
    throw new Error('URL не найден в ответе сервера')
  }

  return {
    images,
    error,
    isLoading,
    setImages,
    uploadImage,
    deleteImage,
    getImageUrlById,
  }
}
