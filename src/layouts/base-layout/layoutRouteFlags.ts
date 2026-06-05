import { ROUTES } from '@/app/lib/config/navigation'
import { matchRoutePath } from '@/app/lib/routing/matchRoutePath'

/** Страницы, где не показываем toast/звук при новых уведомлениях (уже на экране списка). */
const NOTIFICATION_ALERTS_DISABLED_PATHS = [ROUTES.SUPPORT.path, ROUTES.NOTIFICATIONS.path] as const

export function isSupportLayoutRoute(pathname: string): boolean {
  return matchRoutePath(pathname, ROUTES.SUPPORT.path)
}

export function isNotificationsLayoutRoute(pathname: string): boolean {
  return matchRoutePath(pathname, ROUTES.NOTIFICATIONS.path)
}

export function shouldEnableNotificationAlerts(pathname: string): boolean {
  return !NOTIFICATION_ALERTS_DISABLED_PATHS.some(path => matchRoutePath(pathname, path))
}
