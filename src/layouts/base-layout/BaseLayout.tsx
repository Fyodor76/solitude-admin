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

      <div className="main-page" style={{ minWidth: '0', flex: '1', marginLeft: '70px' }}>
        <Header />
        <h2
          style={{
            fontFamily: 'var(--font-primary)',
            color: ' var(--color-grey-background)',
            fontSize: '24px',
            fontWeight: 'normal',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          Категории товаров
        </h2>
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
