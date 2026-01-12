import React, { useState } from 'react'

import { useImageState } from '../lib/api/upload-files/useImageState'

const ApiTestCdn: React.FC = () => {
  const { uploadImage, deleteImage, getImageUrlById, isLoading, images } = useImageState()
  const [uploadLastImgId, setUploadLastId] = useState<string>('')
  const testData = {
    fileId: '1701234567890-abc123def456',
    folder: 'products',
  }

  const handleGetUrl = async () => {
    console.log('Начинаю запрос получения урла...')
    try {
      const response = await getImageUrlById(testData.fileId)
      console.log(response)
    } catch (error: any) {
      console.log('Ошибочка вышла по ПОЛУЧЕНИЮ URL(а)...')
    }
  }

  const handleUploadFile = async () => {
    console.log('Начинаю загрузку файла...')
    try {
      const imgUrl = 'https://cdn1.ozone.ru/s3/multimedia-e/6128376446.jpg'
      const response = await fetch(imgUrl)
      const blob = await response.blob()
      const testFile = new File([blob], 'test-image.jpg', { type: 'image/jpeg' })
      const result = await uploadImage(testFile, 'test-folder')
      console.log(result)
      setUploadLastId(result.data.fileId)
    } catch (error: any) {
      console.log('Ошибочка вышла по ЗАГРУЗКЕ...')
    }
  }

  const testId = '1766481374909-eq55bffgaa5'
  const handleDeleteFile = async () => {
    console.log('Начинаю удаление...')
    try {
      await deleteImage(testId)
      console.log('Удалено!')
    } catch (error: any) {
      console.log('Ошибочка вышла по УДАЛЕНИЮ...')
    }
  }

  const lastImage = uploadLastImgId ? images.find(img => img.fileId === uploadLastImgId) : null

  return (
    <div>
      {isLoading && <div>Пока загрузочка...</div>}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <button onClick={handleGetUrl}>Проверь cdn getUrl</button>
        <button onClick={handleUploadFile}>Проверь cdn , загрузи </button>
        <button onClick={handleDeleteFile}>Проверь cdn delete</button>
      </div>
      {lastImage && (
        <img
          style={{
            maxWidth: '300px',
            height: 'auto',
            border: '2px solid green',
          }}
          src={lastImage.url}
          alt="футболка"
        />
      )}
    </div>
  )
}
export default ApiTestCdn
