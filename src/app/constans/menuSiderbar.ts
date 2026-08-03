import { MenuItem } from '@/app/components/sidebar/sidebarType'

import { SIDEBAR_MENU_ITEM_ID } from './sidebarMenuIds'

export const menuSidebar: MenuItem[] = [
  {
    id: SIDEBAR_MENU_ITEM_ID.CATEGORIES,
    text: 'Категории',
    href: '/categories',
    icon: 'categories',
    hasArrow: false,
  },
  {
    id: SIDEBAR_MENU_ITEM_ID.SIZE_CHARTS,
    text: 'Размерные сетки',
    href: '/size-charts',
    icon: 'tables',
    hasArrow: false,
  },
  {
    id: SIDEBAR_MENU_ITEM_ID.PLATFORM_IMAGES,
    text: 'Изображения платформы',
    href: '/platform-images',
    icon: 'gallery',
    hasArrow: false,
  },
  {
    id: SIDEBAR_MENU_ITEM_ID.HEATMAP,
    text: 'Тепловая карта сайта',
    href: '/heatmap',
    icon: 'charts',
    hasArrow: false,
  },
  {
    id: SIDEBAR_MENU_ITEM_ID.SUPPORT,
    text: 'Обращения',
    href: '/support',
    icon: 'support',
    hasArrow: false,
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
    id: SIDEBAR_MENU_ITEM_ID.EDITOR,
    text: 'Конструктор товара',
    href: '/editor',
    icon: 'editing',
    hasArrow: false,
  },
]
