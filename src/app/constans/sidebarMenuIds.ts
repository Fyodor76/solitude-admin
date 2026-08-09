/** id пунктов бокового меню — для badge, аналитики и т.п. */
export const SIDEBAR_MENU_ITEM_ID = {
  PRODUCTS: 'products',
  PRODUCTS_LIST: 'products-list',
  PRODUCT_CREATE: 'product-create',
  STOCK: 'stock',
  PRODUCT_ATTRIBUTES: 'product-attributes',
  SIZE_CHARTS: 'size-charts',
  CATEGORIES: 'categories',
  CONTENT: 'content',
  PLATFORM_IMAGES: 'platform-images',
  FORMS: 'forms',
  CALLBACK_FORM: 'callback-form',
  ANALYTICS: 'analytics',
  HEATMAP: 'heatmap',
  SUPPORT: 'support',
} as const

export type SidebarMenuItemId = (typeof SIDEBAR_MENU_ITEM_ID)[keyof typeof SIDEBAR_MENU_ITEM_ID]
