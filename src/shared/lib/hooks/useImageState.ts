import { useState } from 'react'

import { imgUpload } from '../api/upload-files/uploadFiles'
import { useDeleteImage, useUploadImage } from '../api/upload-files/useMutationImage'
import { useGetFileUrlById } from '../api/upload-files/useQueryImage'

export const useImageState = () => {
  const [images, setImages] = useState<imgUpload[]>([])
  const upload = useUploadImage()
  const deleteImg = useDeleteImage()
  const getUrl = useGetFileUrlById()

  const isLoading = upload.isLoading || deleteImg.isLoading || getUrl.isLoading

  const uploadImage = async (file: File, folder?: string) => {
    const result = await upload.uploadImage(file, folder)
    const newImage: imgUpload = {
      fileId: result.data.fileId,
      url: result.data.url,
    }
    setImages(prev => [...prev, newImage])
    return result
  }

  const deleteImage = async (fileId: string) => {
    const result = await deleteImg.deleteImage(fileId)
    setImages(prev => prev.filter(img => img.fileId !== fileId))
    return result
  }

  const getImageUrlById = async (fileId: string) => {
    const result = await getUrl.getUrlById(fileId)
    if (result.data) {
      return result.data.data.url
    }
    throw new Error('Url не найден')
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
