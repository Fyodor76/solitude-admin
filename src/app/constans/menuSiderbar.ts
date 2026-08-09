import { MenuItem } from '@/app/components/sidebar/sidebarType'

import { SIDEBAR_MENU_ITEM_ID } from './sidebarMenuIds'

export const menuSidebar: MenuItem[] = [
  {
    id: SIDEBAR_MENU_ITEM_ID.PRODUCTS,
    text: 'Товары',
    href: '#',
    icon: 'boxOpen2',
    hasArrow: true,
    subItems: [
      {
        id: SIDEBAR_MENU_ITEM_ID.CATEGORIES,
        text: 'Категории',
        href: '/categories',
        icon: 'categories',
      },
      {
        id: SIDEBAR_MENU_ITEM_ID.PRODUCT_ATTRIBUTES,
        text: 'Опции',
        href: '/product-attributes',
        icon: 'options',
      },
      {
        id: SIDEBAR_MENU_ITEM_ID.SIZE_CHARTS,
        text: 'Размерные сетки',
        href: '/size-charts',
        icon: 'tables',
      },
      {
        id: SIDEBAR_MENU_ITEM_ID.PRODUCTS_LIST,
        text: 'Все товары',
        href: '/products',
        icon: 'doc',
      },
      {
        id: SIDEBAR_MENU_ITEM_ID.PRODUCT_CREATE,
        text: 'Создание товара',
        href: '/products/create',
        icon: 'add',
      },
      {
        id: SIDEBAR_MENU_ITEM_ID.STOCK,
        text: 'Склад',
        href: '/stock',
        icon: 'boxOpen',
      },
    ],
  },
  {
    id: SIDEBAR_MENU_ITEM_ID.CONTENT,
    text: 'Контент',
    href: '#',
    icon: 'gallery',
    hasArrow: true,
    subItems: [
      {
        id: SIDEBAR_MENU_ITEM_ID.PLATFORM_IMAGES,
        text: 'Изображения платформы',
        href: '/platform-images',
        icon: 'gallery',
      },
    ],
  },
  {
    id: SIDEBAR_MENU_ITEM_ID.FORMS,
    text: 'Формы',
    href: '#',
    icon: 'forms',
    hasArrow: true,
    subItems: [
      {
        id: SIDEBAR_MENU_ITEM_ID.CALLBACK_FORM,
        text: 'Форма обратной связи',
        href: '/forms/callback',
        icon: 'forms',
      },
    ],
  },
  {
    id: SIDEBAR_MENU_ITEM_ID.ANALYTICS,
    text: 'Аналитика',
    href: '#',
    icon: 'charts',
    hasArrow: true,
    subItems: [
      {
        id: SIDEBAR_MENU_ITEM_ID.HEATMAP,
        text: 'Тепловая карта сайта',
        href: '/heatmap',
        icon: 'charts',
      },
    ],
  },
  {
    id: SIDEBAR_MENU_ITEM_ID.SUPPORT,
    text: 'Обращения',
    href: '/support',
    icon: 'support',
    hasArrow: false,
  },
]
