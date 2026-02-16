import { ReactNode } from 'react'

import BreadcrumbsItems from '@/shared/ui/breadcrumbs/BreadcrumbsItems'
import { useBreadcrumbs } from '@/shared/ui/breadcrumbs/useBreadcrumbs'
import { Header } from '@/shared/ui/header'

interface BaseLayoutProps {
  children: ReactNode
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  const breadcrumbs = useBreadcrumbs()
  return (
    <div>
      <Header />
      <BreadcrumbsItems
        items={breadcrumbs}
        baseUrl="https://solitude-store.ru"
        includeSchema={true}
      />
      <div>{children}</div>
    </div>
  )
}
