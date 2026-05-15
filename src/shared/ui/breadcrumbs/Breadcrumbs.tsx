import BreadcrumbsItems from './BreadcrumbsItems'
import { useBreadcrumbs } from './useBreadcrumbs'

const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs()
  return (
    <div>
      <BreadcrumbsItems items={breadcrumbs} />
    </div>
  )
}

export default Breadcrumbs
