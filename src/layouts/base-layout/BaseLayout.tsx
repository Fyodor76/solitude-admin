import { ReactNode } from 'react'

import Breadcrumbs from '@/shared/ui/breadcrumbs/Breadcrumbs'
import { Header } from '@/shared/ui/header'

interface BaseLayoutProps {
  children: ReactNode
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <div>
      <Header />
      <Breadcrumbs />
      <div>{children}</div>
    </div>
  )
}
