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
    },
    {
      id: 'widgets',
      text: 'Widgets',
      href: '#',
      icon: 'widgets',
      hasArrow: true,
    },
    {
      id: 'layout-options',
      text: 'Layout Options',
      href: '#',
      icon: 'layoutOptions',
      hasArrow: true,
    },
    {
      id: 'charts',
      text: 'Charts',
      href: '#',
      icon: 'charts',
      hasArrow: true,
    },
    {
      id: 'ui-elements',
      text: 'UI Elements',
      href: '#',
      icon: 'uiElements',
      hasArrow: true,
    },
    {
      id: 'forms',
      text: 'Forms',
      href: '#',
      icon: 'forms',
      hasArrow: true,
    },
    {
      id: 'tables',
      text: 'Tables',
      href: '#',
      icon: 'tables',
      hasArrow: true,
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
