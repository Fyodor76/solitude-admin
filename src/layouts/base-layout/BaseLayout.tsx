import { ReactNode, useMemo, useState } from 'react'

import {
  AdminNotificationsProvider,
  applySidebarNotificationBadges,
  useAdminNotifications,
} from '@/shared/lib/notifications'
import { useSupportRealtime } from '@/shared/lib/support/useSupportRealtime'

import { menuSidebar } from '@/app/constans/menuSiderbar'

import { AdminLayoutShell } from './AdminLayoutShell'
import { useAdminLayoutRoute } from './useAdminLayoutRoute'

interface BaseLayoutProps {
  children: ReactNode
}

type BaseLayoutContentProps = BaseLayoutProps & {
  isSupportPage: boolean
}

function BaseLayoutContent({ children, isSupportPage }: BaseLayoutContentProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { supportUnreadCount } = useAdminNotifications()

  const menuItems = useMemo(
    () => applySidebarNotificationBadges(menuSidebar, { supportUnreadCount }),
    [supportUnreadCount]
  )

  return (
    <AdminLayoutShell
      menuItems={menuItems}
      isSidebarOpen={isSidebarOpen}
      isSupportPage={isSupportPage}
      onToggleSidebar={() => setIsSidebarOpen(open => !open)}
    >
      {children}
    </AdminLayoutShell>
  )
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  const { isSupportPage, enableNotificationAlerts } = useAdminLayoutRoute()

  useSupportRealtime(true)

  return (
    <AdminNotificationsProvider enableAlerts={enableNotificationAlerts}>
      <BaseLayoutContent isSupportPage={isSupportPage}>{children}</BaseLayoutContent>
    </AdminNotificationsProvider>
  )
}
