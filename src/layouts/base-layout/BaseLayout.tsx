import { ReactNode } from 'react'

import { Header } from '@/shared/ui/header'

interface BaseLayoutProps {
  children: ReactNode
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <div>
      <Header />
      <div>{children}</div>
    </div>
  )
}
