import { createContext, ReactNode, useContext, useMemo } from 'react'

import type { AdminNotificationItem } from './types'
import { useAdminNotificationsCenter } from './useAdminNotificationsCenter'

type AdminNotificationsContextValue = {
  unreadCount: number
  supportUnreadCount: number
  notificationItems: AdminNotificationItem[]
}

const AdminNotificationsContext = createContext<AdminNotificationsContextValue | null>(null)

type AdminNotificationsProviderProps = {
  children: ReactNode
  /** false на странице /support — без звука и toast */
  enableAlerts?: boolean
}

export function AdminNotificationsProvider({
  children,
  enableAlerts = true,
}: AdminNotificationsProviderProps) {
  const { unreadCount, supportUnreadCount, notificationItems } = useAdminNotificationsCenter({
    enableAlerts,
  })

  const value = useMemo(
    () => ({ unreadCount, supportUnreadCount, notificationItems }),
    [unreadCount, supportUnreadCount, notificationItems]
  )

  return (
    <AdminNotificationsContext.Provider value={value}>
      {children}
    </AdminNotificationsContext.Provider>
  )
}

export function useAdminNotifications(): AdminNotificationsContextValue {
  const ctx = useContext(AdminNotificationsContext)
  if (!ctx) {
    throw new Error('useAdminNotifications must be used within AdminNotificationsProvider')
  }
  return ctx
}

/** @deprecated используйте useAdminNotifications */
export const useSupportAlerts = useAdminNotifications

/** @deprecated используйте AdminNotificationsProvider */
export const SupportAlertsProvider = AdminNotificationsProvider
