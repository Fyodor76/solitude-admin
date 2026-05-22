export {
  AdminNotificationsProvider,
  SupportAlertsProvider,
  useAdminNotifications,
  useSupportAlerts,
} from './AdminNotificationsContext'
export { useAdminNotificationsCenter } from './useAdminNotificationsCenter'
export { applySidebarNotificationBadges } from './applySidebarNotificationBadges'
export type { SidebarNotificationCounts } from './applySidebarNotificationBadges'
export { mapAdminNotificationDto } from './mapNotificationDto'
export {
  ADMIN_NOTIFICATION_KIND,
  ADMIN_NOTIFICATION_KIND_LABELS,
  ADMIN_NOTIFICATIONS_LIST_LIMIT,
  ADMIN_NOTIFICATIONS_POLL_MS,
  NOTIFICATION_BELL_COPY,
} from './constants'
export type { AdminNotificationItem, AdminNotificationKind } from './types'
export { buildSupportNotificationSourceId } from './supportSourceId'
export { APP_DOCUMENT_TITLE, buildDocumentTitle, getRouteDocumentLabel } from './documentTitle'
export { useDocumentTitleWithUnreadCount } from './useDocumentTitleWithUnreadCount'
export { DocumentTitleSync } from './DocumentTitleSync'
export {
  applyFaviconBadge,
  startFaviconBadgeBlink,
  stopFaviconBadgeBlink,
  restoreDefaultFavicon,
  DEFAULT_FAVICON_URL,
  FAVICON_BADGE_STYLE,
  FAVICON_BLINK_INTERVAL_MS,
} from './faviconBadge'
export { useFaviconBadge } from './useFaviconBadge'
