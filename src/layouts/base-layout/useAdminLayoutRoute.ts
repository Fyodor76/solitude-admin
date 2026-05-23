import { useMemo } from 'react'

import { useLocation } from 'react-router-dom'

import {
  isNotificationsLayoutRoute,
  isSupportLayoutRoute,
  shouldEnableNotificationAlerts,
} from './layoutRouteFlags'

export function useAdminLayoutRoute() {
  const { pathname } = useLocation()

  return useMemo(
    () => ({
      isSupportPage: isSupportLayoutRoute(pathname),
      isNotificationsPage: isNotificationsLayoutRoute(pathname),
      enableNotificationAlerts: shouldEnableNotificationAlerts(pathname),
    }),
    [pathname]
  )
}
