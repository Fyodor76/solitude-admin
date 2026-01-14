import React, { useEffect } from 'react'

import { useDeleteFileByIdMutation } from '../api/upload-files/uploadFiles'

const CheckBaseApi: React.FC = () => {
  const [deleteFile, { isLoading, error }] = useDeleteFileByIdMutation()

  useEffect(() => {
    if (error) {
      console.log('🔄 Хук вернул ошибку:', error)
    }
  }, [error])

  const testApi = async () => {
    console.clear()
    console.log('=== 🔍 ПРОВЕРКА BASEAPI ===')

    try {
      // 1. Пробуем удалить несуществующий файл
      const result = await deleteFile('test-non-existent-id-' + Date.now()).unwrap()
      console.log('🤔 Результат (не должен быть успех):', result)
    } catch (error: any) {
      console.log('✅ Поймана ошибка:', error)

      // Проверяем формат ошибки
      console.log('Формат ошибки:')
      console.log('- statusCode:', error?.statusCode)
      console.log('- timestamp:', error?.timestamp)
      console.log('- path:', error?.path)
      console.log('- error:', error?.error)

      // Проверяем это HttpErrorResponse?
      if (error?.statusCode && error?.timestamp && error?.path) {
        console.log('🎉 Ошибка в формате HttpErrorResponse! baseApi работает!')
      } else {
        console.log('❌ Ошибка НЕ в формате HttpErrorResponse')
      }
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h3>🔍 Проверка baseApi</h3>
      <button onClick={testApi} disabled={isLoading}>
        Проверить обработку ошибок
      </button>
      {isLoading && <p>⏳ Загружаю...</p>}
      <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
        Откройте консоль (F12) чтобы увидеть логи
      </p>
    </div>
  )
}
export default CheckBaseApi
