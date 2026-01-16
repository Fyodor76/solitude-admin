import { useState } from 'react'

import { HttpErrorResponse } from '../api/baseApi'
import { imgUpload } from '../api/upload-files/uploadFiles'
import { useDeleteImage, useUploadImage } from '../api/upload-files/useMutationImage'
import { useGetFileUrlById } from '../api/upload-files/useQueryImage'

export const useImageState = () => {
  const [images, setImages] = useState<imgUpload[]>([])
  const { uploadImg, isLoading: isUploadLoading, error: uploadError } = useUploadImage()
  const { deleteImg, isLoading: isDeleteLoading, error: deleteError } = useDeleteImage()
  const { getUrlById, isLoading: isGetUrlLoading, error: getUrlError } = useGetFileUrlById()

  const error = (uploadError || deleteError || getUrlError) as HttpErrorResponse | null

  const uploadImage = async (file: File, folder?: string) => {
    const result = await uploadImg(file, folder)
    const newImage: imgUpload = {
      fileId: result.data.fileId,
      url: result.data.url,
    }
    setImages(prev => [...prev, newImage])
    return result
  }

  const deleteImage = async (fileId: string, folder: string) => {
    const result = await deleteImg(fileId, folder)
    setImages(prev => prev.filter(img => img.fileId !== fileId))
    return result
  }

  const getImageUrlById = async (fileId: string, folder?: string) => {
    const result = await getUrlById({ fileId, folder })
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
    isUploadLoading,
    isGetUrlLoading,
    isDeleteLoading,
    setImages,
    uploadImage,
    deleteImage,
    getImageUrlById,
  }
}
