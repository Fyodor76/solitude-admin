import { ReactNode, useState } from 'react'

import { Header } from '@/shared/ui/header'
import Sidebar, { MenuItem } from '@/shared/ui/sidebar/Sidebar'

interface BaseLayoutProps {
  children: ReactNode
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  const [isOpen, setIsOpen] = useState(true)

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
      icon: 'public/images/dashboard2.png',
      hasArrow: true,
    },
    {
      id: 'widgets',
      text: 'Widgets',
      href: '#',
      icon: 'public/images/widgets2.png',
      hasArrow: true,
    },
    {
      id: 'layout-options',
      text: 'Layout Options',
      href: '#',
      icon: 'public/images/layout-options2.png',
      hasArrow: true,
    },
    {
      id: 'charts',
      text: 'Charts',
      href: '#',
      icon: 'public/images/charts.png',
      hasArrow: true,
    },
    {
      id: 'ui-elements',
      text: 'UI Elements',
      href: '#',
      icon: 'public/images/ui-elements.png',
      hasArrow: true,
    },
    {
      id: 'forms',
      text: 'Forms',
      href: '#',
      icon: 'public/images/forms.png',
      hasArrow: true,
    },
    {
      id: 'tables',
      text: 'Tables',
      href: '#',
      icon: 'public/images/tables.png',
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
