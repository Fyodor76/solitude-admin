/** id пунктов бокового меню — для badge, аналитики и т.п. */
export const SIDEBAR_MENU_ITEM_ID = {
  CATEGORIES: 'categories',
  SIZE_CHARTS: 'size-charts',
  PLATFORM_IMAGES: 'platform-images',
  HEATMAP: 'heatmap',
  SUPPORT: 'support',
} as const

export type SidebarMenuItemId = (typeof SIDEBAR_MENU_ITEM_ID)[keyof typeof SIDEBAR_MENU_ITEM_ID]
