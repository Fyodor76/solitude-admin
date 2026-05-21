import { ReactNode, useMemo, useState } from 'react'

import { useSupportInboxAlerts } from '@/shared/lib/support/useSupportInboxAlerts'
import { useSupportRealtime } from '@/shared/lib/support/useSupportRealtime'
import { Header } from '@/shared/ui/header'
import classNames from 'classnames'
import { useLocation } from 'react-router-dom'

import Sidebar from '@/app/components/sidebar/Sidebar'
import { menuSidebar } from '@/app/constans/menuSiderbar'

import './BaseLayout.scss'

interface BaseLayoutProps {
  children: ReactNode
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { pathname } = useLocation()
  const onSupportPage = pathname === '/support' || pathname.startsWith('/support/')
  useSupportRealtime(true)
  const { waitingCount } = useSupportInboxAlerts({ enableSound: !onSupportPage })

  const menuItems = useMemo(
    () =>
      menuSidebar.map(item =>
        item.id === 'support' && waitingCount > 0
          ? { ...item, badgeCount: waitingCount }
          : { ...item, badgeCount: undefined }
      ),
    [waitingCount]
  )

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }
  return (
    <div className="wrapper" style={{ display: 'flex' }}>
      <Sidebar menuItems={menuItems} toggleSidebar={toggleSidebar} isOpen={isOpen} />

      <div
        className={classNames('main-page', { 'main-page--support': onSupportPage })}
        style={{ minWidth: '0', flex: '1', marginLeft: '70px' }}
      >
        <Header />
        <div className="main-page__body">{children}</div>
      </div>
    </div>
  )
}
