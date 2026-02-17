import { ReactNode } from 'react'

import { Header } from '@/shared/ui/header'
import { Link } from 'react-router-dom'

interface BaseLayoutProps {
  children: ReactNode
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  return (
    <div>
      <Header />
      <Link to="/catalog">
        <h1 style={{ textAlign: 'center', color: 'green' }}>
          Перейти в каталог(протестируем работу breadcrumbs)
        </h1>
      </Link>
      <div>{children}</div>
    </div>
  )
}
