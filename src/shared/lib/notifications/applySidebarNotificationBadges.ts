import type { MenuItem } from '@/app/components/sidebar/sidebarType'
import { SIDEBAR_MENU_ITEM_ID } from '@/app/constans/sidebarMenuIds'

export type SidebarNotificationCounts = {
  supportUnreadCount: number
}

/**
 * Подставляет badgeCount в пункты меню по данным summary уведомлений.
 * Новые типы: добавить ветку в getBadgeCountForMenuItem.
 */
export function applySidebarNotificationBadges(
  menuItems: MenuItem[],
  counts: SidebarNotificationCounts
): MenuItem[] {
  return menuItems.map(item => {
    const badgeCount = getBadgeCountForMenuItem(item.id, counts)
    if (badgeCount === undefined) {
      return item
    }
    return { ...item, badgeCount }
  })
}

function getBadgeCountForMenuItem(
  menuItemId: string,
  counts: SidebarNotificationCounts
): number | undefined {
  if (menuItemId === SIDEBAR_MENU_ITEM_ID.SUPPORT && counts.supportUnreadCount > 0) {
    return counts.supportUnreadCount
  }
  return undefined
}
