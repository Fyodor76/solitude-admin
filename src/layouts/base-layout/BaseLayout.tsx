import { ReactNode, useMemo, useState } from 'react'

import {
  AdminNotificationsProvider,
  applySidebarNotificationBadges,
  useAdminNotifications,
} from '@/shared/lib/notifications'
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

function BaseLayoutContent({
  children,
  onSupportPage,
}: BaseLayoutProps & { onSupportPage: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const { supportUnreadCount } = useAdminNotifications()

  const menuItems = useMemo(
    () => applySidebarNotificationBadges(menuSidebar, { supportUnreadCount }),
    [supportUnreadCount]
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

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  const { pathname } = useLocation()
  const onSupportPage = pathname === '/support' || pathname.startsWith('/support/')
  useSupportRealtime(true)

  return (
    <AdminNotificationsProvider enableAlerts={!onSupportPage}>
      <BaseLayoutContent onSupportPage={onSupportPage}>{children}</BaseLayoutContent>
    </AdminNotificationsProvider>
  )
}
