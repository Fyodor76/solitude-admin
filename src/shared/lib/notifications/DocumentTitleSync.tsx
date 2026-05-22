import { useLocation } from 'react-router-dom'

import { useAdminNotifications } from './AdminNotificationsContext'
import { useDocumentTitleWithUnreadCount } from './useDocumentTitleWithUnreadCount'
import { useFaviconBadge } from './useFaviconBadge'

/** Заголовок вкладки по разделу + favicon с бейджем (как у колокольчика). */
export function DocumentTitleSync() {
  const { pathname } = useLocation()
  const { unreadCount } = useAdminNotifications()

  useDocumentTitleWithUnreadCount(pathname)
  useFaviconBadge(unreadCount)

  return null
}
