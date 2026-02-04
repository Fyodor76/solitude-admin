import { ReactNode, useState } from 'react'

import { Header } from '@/shared/ui/header'
import Sidebar, { MenuItem } from '@/shared/ui/sidebar/Sidebar'

interface BaseLayoutProps {
  children: ReactNode
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const onClose = () => {
    setIsOpen(false)
  }
  const onOpen = () => {
    setIsOpen(true)
  }
  const menuSidebar: MenuItem[] = [
    {
      id: 'dashboard',
      text: 'Dashboard',
      href: '#',
      icon: 'dashboards',
      hasArrow: true,
      subItems: [
        {
          id: 'all-products',
          text: 'All Products',
          href: '/products',
        },
        {
          id: 'all-products',
          text: 'All Products',
          href: '/products',
        },
      ],
    },
    {
      id: 'widgets',
      text: 'Widgets',
      href: '#',
      icon: 'widgets',
      hasArrow: true,
      subItems: [
        {
          id: 'all-products',
          text: 'All Products',
          href: '/products',
        },
      ],
    },

    {
      id: 'layout-options',
      text: 'Layout Options',
      href: '#',
      icon: 'layoutOptions',
      hasArrow: true,
      subItems: [
        {
          id: 'all-products',
          text: 'All Products',
          href: '/products',
        },
      ],
    },
    {
      id: 'charts',
      text: 'Charts',
      href: '#',
      icon: 'charts',
      hasArrow: true,
      subItems: [
        {
          id: 'all-products',
          text: 'All Products',
          href: '/products',
        },
      ],
    },
    {
      id: 'ui-elements',
      text: 'UI Elements',
      href: '#',
      icon: 'uiElements',
      hasArrow: true,
      subItems: [
        {
          id: 'all-products',
          text: 'All Products',
          href: '/products',
        },
      ],
    },
    {
      id: 'forms',
      text: 'Forms',
      href: '#',
      icon: 'forms',
      hasArrow: true,
      subItems: [
        {
          id: 'all-products',
          text: 'All Products',
          href: '/products',
        },
      ],
    },
    {
      id: 'tables',
      text: 'Tables',
      href: '#',
      icon: 'tables',
      hasArrow: true,
      subItems: [
        {
          id: 'all-products',
          text: 'All Products',
          href: '/products',
        },
      ],
    },
  ]
  return (
    <div>
      <Header openSidebar={onOpen} />
      <Sidebar menuItems={menuSidebar} onClose={onClose} isOpen={isOpen} />
      <div>{children}</div>
    </div>
  )
}
