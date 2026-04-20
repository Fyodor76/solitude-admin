import { ReactNode, useState } from 'react'

import Categories from '@/pages/categories/Categories'
import { Header } from '@/shared/ui/header'
import { Link } from 'react-router-dom'

import Sidebar from '@/app/components/sidebar/Sidebar'
import { menuSidebar } from '@/app/constans/menuSiderbar'

interface BaseLayoutProps {
  children: ReactNode
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }
  return (
    <div className="wrapper" style={{ display: 'flex' }}>
      <Sidebar menuItems={menuSidebar} toggleSidebar={toggleSidebar} isOpen={isOpen} />

      <div className="main-page" style={{ minWidth: '0', flex: '1', marginLeft: '70px' }}>
        <Header />
        {/*{' '}
        <Link to="/catalog">
          <h1 style={{ textAlign: 'center', color: 'green' }}>
            Перейти в каталог(протестируем работу breadcrumbs)
          </h1>
        </Link>
  */}
        <div>{children}</div>
      </div>
    </div>
  )
}
