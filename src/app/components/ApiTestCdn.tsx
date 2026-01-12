import React, { useState } from 'react'

import {
  useDeleteFileByIdMutation,
  useLazyGetFileUrlByIdQuery,
  useUploadImageMutation,
} from '../lib/api/upload-files/upload-files'

const ApiTestCdn: React.FC = () => {
  const [getUrl, { isLoading: isLoadingGetUrl }] = useLazyGetFileUrlByIdQuery()
  const [uploadFile, { isLoading: isLoadingUpload }] = useUploadImageMutation()
  const [deleteFile, { isLoading: isLoadingDelete }] = useDeleteFileByIdMutation()

  const [uploadResult, setUploadResult] = useState<any>(null)

  const testData = {
    fileId: '1701234567890-abc123def456',
    folder: 'products',
  }

  const handleGetUrl = async () => {
    console.log('Начинаю запрос получения урла...')
    try {
      const response = await getUrl(testData.fileId).unwrap()
      console.log(response)
    } catch (error: any) {
      console.log('Ошибочка вышла по ПОЛУЧЕНИЮ URL(а)...')
    }
  }

  const handleUploadFile = async () => {
    setUploadResult(null)
    console.log('Начинаю загрузку файла...')
    try {
      const imgUrl = '	https://cdn1.ozone.ru/s3/multimedia-e/6128376446.jpg'
      const response = await fetch(imgUrl)
      const blob = await response.blob()
      const testFile = new File([blob], 'test-image.jpg', { type: 'image/jpeg' })
      const result = await uploadFile({
        file: testFile,
        folder: 'test-folder',
      }).unwrap()
      console.log(result)
      setUploadResult(result)
    } catch (error: any) {
      console.log('Ошибочка вышла по ЗАГРУЗКЕ...')
    }
  }

  const testId = '1766481374909-eq55bffgaa5'
  const handleDeleteFile = async () => {
    console.log('Начинаю удаление...')
    try {
      const response = await deleteFile(testId).unwrap()
      console.log(response)
    } catch (error: any) {
      console.log('Ошибочка вышла по УДАЛЕНИЮ...')
    }
  }
  const isLoading = isLoadingDelete || isLoadingGetUrl || isLoadingUpload
  return (
    <div>
      {isLoading && <div>Пока загрузочка...</div>}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <button onClick={handleGetUrl}>Проверь cdn getUrl</button>
        <button onClick={handleUploadFile}>Проверь cdn , загрузи </button>
        <button onClick={handleDeleteFile}>Проверь cdn delete</button>
      </div>
      {uploadResult && (
        <img
          style={{
            maxWidth: '300px',
            height: 'auto',
            border: '2px solid green',
          }}
          src={uploadResult.data.url}
          alt="футболка"
        />
      )}
    </div>
  )
}
export default ApiTestCdn
