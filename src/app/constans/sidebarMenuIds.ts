/** id пунктов бокового меню — для badge, аналитики и т.п. */
export const SIDEBAR_MENU_ITEM_ID = {
  CATEGORIES: 'categories',
  PRODUCT_CREATE: 'product-create',
  SIZE_CHARTS: 'size-charts',
  PLATFORM_IMAGES: 'platform-images',
  HEATMAP: 'heatmap',
  SUPPORT: 'support',
  FORMS: 'forms',
  CALLBACK_FORM: 'callback-form',
  PRODUCT_ATTRIBUTES: 'product-attributes',
} as const

export type SidebarMenuItemId = (typeof SIDEBAR_MENU_ITEM_ID)[keyof typeof SIDEBAR_MENU_ITEM_ID]
