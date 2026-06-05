export const IS_ACTIVE_FILTER = {
  ALL: 'all',
  ACTIVE: 'active',
  INCLUDES: 'includes',
  INACTIVE: 'inactive',
} as const

/** Админка — все категории/товары, включая отключённые */
export const ADMIN_IS_ACTIVE_FILTER = IS_ACTIVE_FILTER.ALL
