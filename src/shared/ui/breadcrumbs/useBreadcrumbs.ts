import { useLocation } from 'react-router-dom'

import { ROUTES } from '@/app/lib/config/navigation'

import { BreadcrumbsItemProps } from './BreadcrumbsItems'

export const useBreadcrumbs = (): BreadcrumbsItemProps[] => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  const crumbs: BreadcrumbsItemProps[] = [{ label: ROUTES.HOME.label, href: ROUTES.HOME.path }]
  pathnames.forEach((segment, index) => {
    const path = '/' + pathnames.slice(0, index + 1).join('/')
    const route = Object.values(ROUTES).find(r => r.path === path)

    crumbs.push({
      label: route ? route.label : segment,
      href: path,
    })
  })

  return crumbs
}
