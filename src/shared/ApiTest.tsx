import React, { useState } from 'react'

import { apiClient } from '../app/api/client'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  parentId: string | null
  imageId: string
  isActive: boolean
  sortOrder: number
  type: string
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  success: boolean
  data: Category[]
}

const ApiTest: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const getCategories = async () => {
    setLoading(true)
    setResult('Проверяю...')
    setCategories([])
    try {
      const response = await apiClient.get<ApiResponse>('/categories')
      console.log('Ответ от API:', response)
      if (response.success) {
        setCategories(response.data)
        setResult(`✅ УСПЕХ! Получено категорий: ${response.data.length || 'данные пришли'}`)
      }
    } catch (error) {
      setResult(`❌ ОШИБКА`)
      console.error('Ошибка', error)
    }
    setLoading(false)
  }
  return (
    <div>
      <button
        onClick={getCategories}
        disabled={loading}
        style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px' }}
      >
        {loading ? 'Проверяю...' : 'Проверить категории'}
      </button>

      {result && (
        <div
          style={{
            padding: '15px',
            backgroundColor: result.includes('✅') ? '#d4edda' : '#f8d7da',
            border: `1px solid ${result.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '5px',
            color: result.includes('✅') ? '#155724' : '#721c24',
          }}
        >
          <strong>Результат:</strong> {result}
        </div>
      )}
    </div>
  )
}

export default ApiTest
