import { MenuItem } from '@/app/components/sidebar/sidebarType'

export const menuSidebar: MenuItem[] = [
  {
    id: 'categories',
    text: 'Сategories',
    href: '/categories',
    icon: 'categories',
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
