import React, { useState } from 'react'

import { useImageState } from '../hooks/useImageState'

const TestApiError: React.FC = () => {
  const {
    getImageUrlById,
    uploadImage,
    deleteImage,
    error,
    isUploadLoading,
    isDeleteLoading,
    isGetUrlLoading,
  } = useImageState()
  const [result, setResult] = useState<string>('')
  const fileId = '1768473405500-vu65snh7mqp' //'1768465458736-11699lntrug' //'1701234567890-abc123def456'
  const badFileId = 'hghghghghghgh'

  const testGetUrlSuccess = async () => {
    setResult('Начинаю запрашивать Url')
    try {
      const result = await getImageUrlById(fileId, 'test-folder')
      setResult(`Url:${result}`)
    } catch (error: any) {
      console.log('Ошибка в catch:', error)
      setResult(`Ошибка: ${error.message || JSON.stringify(error)}`)
    }
  }

  const testUploadImage = async () => {
    setResult('Начинаю отправлять файл')
    try {
      const base64Image =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      const respons = await fetch(base64Image)
      const blob = await respons.blob()
      const testFile = new File([blob], 'test-dot.png', { type: 'image/png' })
      const result = await uploadImage(testFile, 'test-folder')
      setResult('Успешно загрузилось изображение!')
      console.log(result)
      return result
    } catch (error) {
      console.error('Ошибка загрузки', error)
    }
  }

  const testGetUrlError = async () => {
    setResult('Начинаю запрашивать Url')
    try {
      const result = await getImageUrlById(badFileId)
      setResult(`Url:${result}`)
    } catch (error: any) {
      setResult(`Ошибка: ${error.message || JSON.stringify(error)}`)
    }
  }

  const testDelete = async () => {
    const fileIdDelete = '1768477979490-1uo48y3j4a3'
    setResult('Начинаю удалять...')
    try {
      const result = await deleteImage(fileIdDelete, 'test-folder')
      console.log('Результат удаления:', result)
      if (result.success) {
        setResult('Успех!')
      } else {
        setResult('success false...не удалилось')
      }
    } catch (error: any) {
      console.log('Ошибка удаления', error)
    }
  }

  return (
    <div>
      <div>
        <button style={{ fontSize: '18px' }} onClick={testGetUrlSuccess}>
          ✅ Тест: Успешный запрос
        </button>
        <button style={{ fontSize: '18px' }} onClick={testGetUrlError}>
          ❌ Тест: 404 ошибка
        </button>
        <button style={{ fontSize: '18px' }} onClick={testUploadImage}>
          !!!! Тест:загрузка
        </button>
        <button style={{ fontSize: '18px' }} onClick={testDelete}>
          !!!! Тест:удаление
        </button>
      </div>
      {isUploadLoading || isDeleteLoading || (isGetUrlLoading && <span>Загружаю</span>)}
      {result && <span> {result}</span>}
      {error && (
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '18px' }}>
          {' '}
          <p> Код ошибки: {error.statusCode}</p>
          <p>Дата: {error?.timestamp}</p>
          <p> Путь: {error?.path}</p>
          <p>Сообщение: {error.error}</p>
        </div>
      )}
    </div>
  )
}
export default TestApiError
