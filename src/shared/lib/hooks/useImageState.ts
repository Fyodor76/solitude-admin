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
    try {
      const result = await upload.uploadImage(file, folder)
      const newImage: imgUpload = {
        fileId: result.data.fileId,
        url: result.data.url,
      }
      setImages(prev => [...prev, newImage])
      return result
    } catch (error) {
      console.error('Ошибка загрузки:', error)
      throw error
    }
  }

  const deleteImage = async (fileId: string) => {
    try {
      await deleteImg.deleteImage(fileId)
      setImages(prev => prev.filter(img => img.fileId !== fileId))
    } catch (error) {
      console.error('Ошибка удаления:', error)
      throw error
    }
  }

  const getImageUrlById = async (fileId: string) => {
    try {
      const result = await getUrl.getUrlById(fileId)
      if (result.data) {
        return result.data.data.url
      }
      throw new Error('Url не найден')
    } catch (error) {
      console.error('Ошибка получения Url', error)
      throw error
    }
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
