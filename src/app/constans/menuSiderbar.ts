import { MenuItem } from '@/app/components/sidebar/sidebarType'

export const menuSidebar: MenuItem[] = [
  {
    id: 'categories',
    text: 'All categories',
    href: '/categories',
    icon: 'categories',
    hasArrow: false,
  },
  {
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
  },
  {
    id: 'widgets',
    text: 'Widgets',
    href: '#',
    icon: 'widgets',
    hasArrow: true,
    subItems: [
      {
        id: 'all-products3',
        text: 'All Products',
        href: '/products',
        icon: 'doc',
      },
    ],
  },

  {
    id: 'layout-options',
    text: 'Layout Options',
    href: '#',
    icon: 'layoutOptions',
    hasArrow: true,
    subItems: [
      {
        id: 'all-products4',
        text: 'All Products',
        href: '/products',
      },
    ],
  },
  {
    id: 'charts',
    text: 'Charts',
    href: '#',
    icon: 'charts',
    hasArrow: true,
    subItems: [
      {
        id: 'all-products5',
        text: 'All Products',
        href: '/products',
      },
    ],
  },
  {
    id: 'ui-elements',
    text: 'UI Elements',
    href: '#',
    icon: 'uiElements',
    hasArrow: true,
    subItems: [
      {
        id: 'all-products6',
        text: 'All Products',
        href: '/products',
      },
    ],
  },
  {
    id: 'forms',
    text: 'Forms',
    href: '#',
    icon: 'forms',
    hasArrow: true,
    subItems: [
      {
        id: 'all-products7',
        text: 'All Products',
        href: '/products',
      },
    ],
  },
  {
    id: 'tables',
    text: 'Tables',
    href: '#',
    icon: 'tables',
    hasArrow: true,
    subItems: [
      {
        id: 'all-products8',
        text: 'All Products',
        href: '/products',
      },
    ],
  },
  {
    id: 'examples',
    text: 'EXAMPLES',
    hasArrow: false,
  },
  {
    id: 'calendar',
    text: 'Calendar',
    icon: 'calendar',
    href: '#',
    hasArrow: false,
  },
  {
    id: 'gallery',
    text: 'Gallery',
    icon: 'gallery',
    href: '#',
    hasArrow: false,
  },
  {
    id: 'kanbanBoard',
    text: 'Kanban Board',
    icon: 'kanbanBoard',
    href: '#',
    hasArrow: false,
  },
  {
    id: 'mailbox',
    text: 'Mailbox',
    icon: 'mailbox',
    href: '#',
    hasArrow: true,
    subItems: [
      {
        id: 'all-products9',
        text: 'All Products',
        href: '/products',
      },
    ],
  },
  {
    id: 'pages',
    text: 'Pages',
    icon: 'pages',
    href: '#',
    hasArrow: true,
    subItems: [
      {
        id: 'all-products11',
        text: 'All Products',
        href: '/products',
      },
    ],
  },
  {
    id: 'extras',
    text: 'Extras',
    icon: 'extras',
    href: '#',
    hasArrow: true,
    subItems: [
      {
        id: 'all-products12',
        text: 'All Products',
        href: '/products',
      },
    ],
  },
  {
    id: 'search',
    text: 'Search',
    icon: 'search',
    href: '#',
    hasArrow: true,
    subItems: [
      {
        id: 'all-products13',
        text: 'All Products',
        href: '/products',
      },
    ],
  },

  {
    id: 'MISCELLANEOUS',
    text: 'MISCELLANEOUS',
    hasArrow: false,
  },
  {
    id: 'tabbeb',
    text: 'Tabbeb IFrame Plugin',
    icon: 'tabbeb',
    href: '#',
    hasArrow: false,
  },
  {
    id: 'doc',
    text: 'Documentation',
    icon: 'doc',
    href: '#',
    hasArrow: false,
  },
  {
    id: 'labels',
    text: 'LABELS',
    hasArrow: false,
  },
  {
    id: 'important',
    text: 'Important',
    icon: 'important',
    hasArrow: false,
  },
  {
    id: 'warning',
    text: 'Warning',
    icon: 'warning',
    hasArrow: false,
  },
  {
    id: 'informational',
    text: 'Informational',
    icon: 'inform',
    hasArrow: false,
  },
]
