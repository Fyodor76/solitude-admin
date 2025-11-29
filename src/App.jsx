import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      // Используем относительный путь или тот же протокол
      const response = await fetch('/api/categories', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Received data:', data)
      
      setCategories(Array.isArray(data) ? data : [])
      
    } catch (err) {
      console.error('Fetch error:', err)
      setError(`Ошибка загрузки: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Тест API</h1>
      
      <button onClick={fetchCategories} disabled={loading}>
        {loading ? 'Загрузка...' : 'Запросить категории'}
      </button>
      
      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          {error}
        </div>
      )}
      
      <div style={{ margin: '20px 0' }}>
        <h3>Категории:</h3>
        {loading ? (
          <p>Загрузка...</p>
        ) : categories.length > 0 ? (
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                <strong>{category.name}</strong> 
                {category.description && ` - ${category.description}`}
                <br />
                <small>ID: {category.id}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>Категории не найдены</p>
        )}
      </div>
    </div>
  )
}

export default App