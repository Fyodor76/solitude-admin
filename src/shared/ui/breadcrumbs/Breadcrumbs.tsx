import React from 'react'

import { Link, useLocation } from 'react-router-dom'

import './breadcrumbs.scss'

const Breadcrumbs = () => {
  const location = useLocation()

  const pathnames = location.pathname.split('/').filter(x => x)

  return (
    <nav aria-label="Breadcrumbs" className="breadcrumbs">
      <ol>
        <li>
          <Link to="/">Главная</Link>
        </li>
        {pathnames.map((pathname, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
          const isLast = pathnames.length - 1 === index

          return (
            <li key={pathname}>
              {isLast ? <span>{pathname}</span> : <Link to={routeTo}>{pathname}</Link>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
