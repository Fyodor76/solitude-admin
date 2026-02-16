import React from 'react'

import { Link } from 'react-router-dom'

import './breadcrumbs.scss'
import BreadcrumbsSchema from './BreadcrumbsSchema'

export interface BreadcrumbsItemProps {
  label: string
  href?: string
}

export interface BreadcrumbsItemsProps {
  items: BreadcrumbsItemProps[]
  baseUrl: string
  includeSchema: boolean
}
export const BreadcrumbsItems = ({
  items,
  baseUrl = 'https://solitude-store.ru',
  includeSchema = true,
}: BreadcrumbsItemsProps) => {
  return (
    <>
      {includeSchema && <BreadcrumbsSchema baseUrl={baseUrl} items={items} />}
      <nav aria-label="Breadcrumbs" className="breadcrumbs">
        <ol>
          {items.map((item, index) => {
            const isLast = items.length - 1 === index
            return (
              <li key={index} className={isLast ? 'active' : 'inactive'}>
                {item.href && !isLast ? (
                  <Link to={item.href} className="link">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text">{item.label}</span>
                )}
                {!isLast && <span className="separator">/</span>}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}

export default BreadcrumbsItems
