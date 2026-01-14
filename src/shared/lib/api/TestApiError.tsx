import React, { useState } from 'react'

import { useImageState } from '../hooks/useImageState'

const TestApiError: React.FC = () => {
  const { getImageUrlById, uploadImage, deleteImage, isLoading } = useImageState()
  const [result, setResult] = useState<string>('')

  // 1. Тест с несуществующим ID для удаления (должна быть 404)
  const testDeleteNonExistent = async () => {
    console.clear()
    console.log('=== 🧪 ТЕСТ: Удаление несуществующего файла ===')

    setResult('Пробую удалить несуществующий файл...')

    try {
      await deleteImage('non-existent-delete-id-12345')
      setResult('✅ Удалено (не должно быть!)')
    } catch (error: any) {
      console.error('✅ ОШИБКА API ПОЙМАНА!', error)
      setResult(`✅ API ошибка удаления: ${error.message}`)
    }
  }

  // 2. Тест загрузки файла с невалидным расширением
  const testInvalidFileType = async () => {
    console.clear()
    console.log('=== 🧪 ТЕСТ: Невалидный тип файла ===')

    setResult('Пробую загрузить .exe файл...')

    try {
      // Создаем текстовый файл с расширением .exe
      const blob = new Blob(['malware-test'], { type: 'application/octet-stream' })
      const exeFile = new File([blob], 'virus.exe', { type: 'application/x-msdownload' })

      await uploadImage(exeFile, 'test')
      setResult('✅ Загрузилось (не должно!)')
    } catch (error: any) {
      console.error('✅ ОШИБКА API ПОЙМАНА!', error)
      setResult(`✅ API ошибка: ${error.message}`)
    }
  }

  // 3. Тест с очень большим, но допустимым файлом (10MB)
  const testLargeFile = async () => {
    console.clear()
    console.log('=== 🧪 ТЕСТ: Большой файл (10MB) ===')

    setResult('Пробую загрузить файл 10MB...')

    try {
      // 10MB - большой, но возможно допустимый размер
      const size = 10 * 1024 * 1024 // 10MB
      const buffer = new ArrayBuffer(size)
      const blob = new Blob([buffer], { type: 'image/jpeg' })
      const largeFile = new File([blob], 'large-image.jpg', { type: 'image/jpeg' })

      await uploadImage(largeFile, 'test')
      setResult('✅ Загрузилось (возможно ограничение сервера)')
    } catch (error: any) {
      console.error('✅ ОШИБКА API ПОЙМАНА!', error)
      setResult(`✅ API ошибка размера: ${error.message}`)
    }
  }

  // 4. Тест получения URL по ID с несуществующей папкой
  const testUrlWithInvalidFolder = async () => {
    console.clear()
    console.log('=== 🧪 ТЕСТ: Запрос URL с несуществующей папкой ===')

    setResult('Пробую получить URL для несуществующей папки...')

    try {
      // Используем ваш хук, но передаем несуществующую папку
      // Проблема: ваш текущий getImageUrlById не принимает папку!
      // Нужно либо изменить хук, либо тестировать по-другому

      // Вместо этого тестируем просто несуществующий ID
      await getImageUrlById('definitely-not-exist-12345')
      setResult('✅ Получил URL (не должно быть!)')
    } catch (error: any) {
      console.error('✅ ОШИБКА API ПОЙМАНА!', error)
      setResult(`✅ API ошибка получения URL: ${error.message}`)
    }
  }

  // 5. Простой тест - запрос на несуществующий endpoint напрямую
  const testDirectApiError = async () => {
    console.clear()
    console.log('=== 🧪 ТЕСТ: Прямой запрос на несуществующий endpoint ===')

    setResult('Делаю запрос на /api/non-existent...')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/non-existent-endpoint`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('Статус ответа:', response.status)

      if (response.ok) {
        const data = await response.json()
        setResult(`✅ Сервер ответил: ${JSON.stringify(data)}`)
      } else {
        const errorData = await response.json()
        console.error('✅ СЕРВЕР ВЕРНУЛ ОШИБКУ:', errorData)
        setResult(`✅ Сервер вернул ошибку ${response.status}`)
      }
    } catch (error: any) {
      console.error('✅ ОШИБКА FETCH:', error)
      setResult(`✅ Ошибка сети: ${error.message}`)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>🧪 Тестируем РЕАЛЬНЫЕ ошибки API</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Нажмите кнопки и проверьте консоль (F12). Должны быть логи от baseApi.ts
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '10px',
          marginBottom: '20px',
        }}
      >
        <button style={buttonStyle('#dc3545')} onClick={testDeleteNonExistent} disabled={isLoading}>
          🗑️ Удалить несуществующий
        </button>

        <button
          style={buttonStyle('#ffc107', '#333')}
          onClick={testInvalidFileType}
          disabled={isLoading}
        >
          ⚠️ .exe файл
        </button>

        <button style={buttonStyle('#17a2b8')} onClick={testLargeFile} disabled={isLoading}>
          📦 Файл 10MB
        </button>

        <button
          style={buttonStyle('#6c757d')}
          onClick={testUrlWithInvalidFolder}
          disabled={isLoading}
        >
          🔗 Неверный URL
        </button>

        <button style={buttonStyle('#28a745')} onClick={testDirectApiError} disabled={isLoading}>
          🎯 Прямой запрос
        </button>
      </div>

      {isLoading && (
        <div
          style={{
            padding: '10px',
            background: '#fff3cd',
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          ⏳ Загружаем...
        </div>
      )}

      {result && (
        <div
          style={{
            padding: '15px',
            background: result.includes('✅') ? '#d4edda' : '#f8d7da',
            color: result.includes('✅') ? '#155724' : '#721c24',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '16px',
          }}
        >
          {result}
        </div>
      )}

      <div
        style={{
          padding: '15px',
          background: '#e8f4f8',
          borderRadius: '6px',
        }}
      >
        <h3>🎯 Что должно быть в консоли если baseApi работает:</h3>
        <pre
          style={{
            background: '#fff',
            padding: '10px',
            borderRadius: '4px',
            fontSize: '12px',
            marginBottom: '10px',
          }}
        >
          {`=== 🚨 API ERROR ===
🕒 Время: 2024-01-15T20:30:45.123Z
🔢 Код: 404 (или 400, 413, 415...)
📍 Путь: /cdn/non-existent-delete-id-12345
💬 Сообщение: File not found
📄 Оригинальная ошибка: {...}`}
        </pre>
        <p style={{ color: '#666' }}>
          Если этого нет - значит либо сервер не возвращает ошибку, либо baseApi не обрабатывает её
          правильно
        </p>
      </div>
    </div>
  )
}

const buttonStyle = (backgroundColor: string, color: string = 'white') => ({
  padding: '12px',
  background: backgroundColor,
  color: color,
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  textAlign: 'left' as const,
})

export default TestApiError
