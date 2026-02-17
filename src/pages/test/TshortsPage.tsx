import React from 'react'

import { Link } from 'react-router-dom'

const TshortsPage = () => {
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
      {' '}
      <h1> Футболки</h1>
      <p>Ты на странице /catalog/tshorts</p>
      <ul>
        <li>
          <Link to="/catalog/tshorts/1">Футботка мужская</Link>
        </li>
        <li>
          <Link to="/catalog/tshorts/2">Футболка женская</Link>
        </li>
        <li>
          <Link to="/catalog">← Назад в каталог</Link>
        </li>
      </ul>
    </div>
  )
}

export default TshortsPage
