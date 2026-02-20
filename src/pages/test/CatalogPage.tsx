import React from 'react'

import { Link } from 'react-router-dom'

const CatalogPage = () => {
  return (
    <div
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>Каталог товаров</h1>

      <p>Ты на странице /catalog</p>

      <ul>
        <li>
          <Link to="/catalog/tshorts" style={{ textDecoration: 'underline' }}>
            {' '}
            Перейти в футболки
          </Link>
        </li>
        <li>
          <Link to="/">← На главную</Link>
        </li>
      </ul>
    </div>
  )
}

export default CatalogPage
