import { ReactNode, useState } from 'react'

import { Header } from '@/shared/ui/header'
import Sidebar from '@/shared/ui/sidebar/Sidebar'

import { menuSidebar } from '@/app/constans/menuSiderbar'

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

  return (
    <div>
      <Header openSidebar={onOpen} />
      <Sidebar menuItems={menuSidebar} onClose={onClose} isOpen={isOpen} />
      <div>{children}</div>
    </div>
  )
}
