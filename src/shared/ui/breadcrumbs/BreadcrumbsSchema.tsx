import React from 'react'

import { BreadcrumbsItemProps } from './BreadcrumbsItems'

export interface BreadcrumbsSchema {
  items: BreadcrumbsItemProps[]
  baseUrl: string
}

const BreadcrumbsSchema = ({ items, baseUrl }: BreadcrumbsSchema) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `${baseUrl}${item.href}` : undefined,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default BreadcrumbsSchema
