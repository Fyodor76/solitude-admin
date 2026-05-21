export const ROUTES = {
  HOME: { label: 'Главная', path: '/' },
  PRIVACY: { label: 'Политика конфиденциальности', path: '/privacy-policy' },
  CONSENT: { label: 'Согласие на обработку персональных данных', path: '/data-consent' },
  CATALOG: { label: 'Каталог', path: '/catalog' },
  TSHORTS: { label: 'Футболки', path: '/catalog/tshorts' },
  CATEGORIES: { label: 'Категории', path: '/categories' },
  SIZE_CHARTS: { label: 'Таблицы размеров', path: '/size-charts' },
  PLATFORM_IMAGES: { label: 'Изображения платформы', path: '/platform-images' },
  HEATMAP: { label: 'Тепловая карта сайта', path: '/heatmap' },
  SUPPORT: { label: 'Обращения', path: '/support' },
} as const
