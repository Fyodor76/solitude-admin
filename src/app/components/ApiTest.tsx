import React from 'react'

import { useGetCategoriesQuery } from './ui/getCategories'

const ApiTest: React.FC = () => {
  const { data: categories, isLoading, error, refetch } = useGetCategoriesQuery()
  const handleGetCategories = () => {
    refetch()
    console.log(categories)
  }
  return (
    <div>
      <button
        onClick={handleGetCategories}
        disabled={isLoading}
        style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px' }}
      >
        {isLoading ? 'Проверяю...' : 'Проверить категории'}
      </button>

      {categories && (
        <div
          style={{
            padding: '15px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '5px',
            color: '#155724',
            marginBottom: '15px',
          }}
        >
          <strong>Результат:</strong> {categories.length}
        </div>
      )}
    </div>
  )
}

export default ApiTest
