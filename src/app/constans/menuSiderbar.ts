import { MenuItem } from '@/app/components/sidebar/sidebarType'

export const menuSidebar: MenuItem[] = [
  {
    id: 'categories',
    text: 'Категории',
    href: '/categories',
    icon: 'categories',
    hasArrow: false,
  },
  {
    id: 'size-charts',
    text: 'Размерные сетки',
    href: '/size-charts',
    icon: 'tables',
    hasArrow: false,
  },
  {
    id: 'platform-images',
    text: 'Изображения платформы',
    href: '/platform-images',
    icon: 'gallery',
    hasArrow: false,
  },
  {
    id: 'heatmap',
    text: 'Тепловая карта сайта',
    href: '/heatmap',
    icon: 'charts',
    hasArrow: false,
  },
  {
    id: 'support',
    text: 'Обращения',
    href: '/support',
    icon: 'message',
    hasArrow: false,
  },
  /*{
    id: 'dashboard',
    text: 'Dashboard',
    href: '#',
    icon: 'dashboards',
    hasArrow: true,
    subItems: [
      {
        id: 'all-products1',
        text: 'All Products',
        href: '/products',
        icon: 'doc',
      },
      {
        id: 'all-products2',
        text: 'All Products',
        href: '/products',
        icon: 'doc',
      },
    ],
  },*/
]
