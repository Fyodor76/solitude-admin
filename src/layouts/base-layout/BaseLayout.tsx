import { ReactNode, useState } from 'react'

import Categories from '@/pages/сategories/Categories'
import { Header } from '@/shared/ui/header'
import Sidebar from '@/shared/ui/sidebar/Sidebar'
import { Link } from 'react-router-dom'

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

      <div className="main-page" style={{ minWidth: '0', flex: '1' }}>
        <Header toggleSidebar={toggleSidebar} isOpen={isOpen} />
        <h1>Категории товаров</h1>
        <Categories />
        <Link to="/catalog">
          <h1 style={{ textAlign: 'center', color: 'green' }}>
            Перейти в каталог(протестируем работу breadcrumbs)
          </h1>
        </Link>
        <div>{children}</div>
      </div>
    </div>
  )
}
