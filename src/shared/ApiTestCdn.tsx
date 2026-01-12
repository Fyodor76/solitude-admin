import React, { useState } from 'react'

import { deleteFileForId, getFileUrlForId, uploadFileToCdn } from '../lib/api/upload-files'

const ApiTestCdn: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [uploadResult, setUploadResult] = useState<any>(null)

  const testData = {
    fileId: '1701234567890-abc123def456',
    folder: 'products',
  }

  const getUrl = async () => {
    setLoading(true)
    console.log('Начинаю запрос получения урла...')
    try {
      const response = await getFileUrlForId(testData.fileId)
      console.log(response)
    } catch (error: any) {
      console.log('Ошибочка вышла по ПОЛУЧЕНИЮ URL(а)...')
    } finally {
      setLoading(false)
    }
  }

  const uploadFile = async () => {
    setLoading(true)
    setUploadResult(null)
    console.log('Начинаю загрузку файла...')
    try {
      const imgUrl = '	https://cdn1.ozone.ru/s3/multimedia-e/6128376446.jpg'
      const response = await fetch(imgUrl)
      const blob = await response.blob()
      const testFile = new File([blob], 'test-image.jpg', { type: 'image/jpeg' })
      const result = await uploadFileToCdn(testFile, 'test-folder')
      console.log(result)
      setUploadResult(result)
    } catch (error: any) {
      console.log('Ошибочка вышла по ЗАГРУЗКЕ...')
    } finally {
      setLoading(false)
    }
  }

  const testId = '1766481374909-eq55bffgaa5'
  const deleteFile = async () => {
    setLoading(true)
    console.log('Начинаю удаление...')
    try {
      const response = await deleteFileForId(testId)
      console.log(response)
    } catch (error: any) {
      console.log('Ошибочка вышла по УДАЛЕНИЮ...')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <button onClick={getUrl}>Проверь cdn getUrl</button>
        <button onClick={uploadFile}>Проверь cdn , загрузи </button>
        <button onClick={deleteFile}>Проверь cdn delete</button>
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
