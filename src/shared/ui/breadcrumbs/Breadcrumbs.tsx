import React from 'react'

import BreadcrumbsItems from './BreadcrumbsItems'
import { useBreadcrumbs } from './useBreadcrumbs'

const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs()
  return (
    <div className="breadcrumbs-container">
      <BreadcrumbsItems items={breadcrumbs} baseUrl="https://solitude-store.ru" />
    </div>
  )
}

export default Breadcrumbs
