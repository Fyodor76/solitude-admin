import { useState } from 'react'

export const TestCrash = () => {
  const [shouldCrash, setShouldCrash] = useState(false)

  if (shouldCrash) {
    throw new Error('Тест Error Boundary! 🚨')
  }

  return (
    <button
      onClick={() => setShouldCrash(true)}
      style={{
        padding: '20px 40px',
        backgroundColor: '#ff4757',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '20px',
        cursor: 'pointer',
        margin: '20px',
      }}
    >
      🔴 Нажми чтобы сломать компонент
    </button>
  )
}
