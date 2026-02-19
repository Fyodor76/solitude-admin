import React from 'react'

import BreadcrumbsItems from './BreadcrumbsItems'
import { useBreadcrumbs } from './useBreadcrumbs'

const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs()
  const apiUrl = import.meta.env.VITE_API_URL
  return (
    <div>
      <BreadcrumbsItems items={breadcrumbs} baseUrl={apiUrl} />
    </div>
  )
}

export default Breadcrumbs
