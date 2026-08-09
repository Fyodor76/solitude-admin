import Container from '@/shared/ui/container/Container'
import Icon from '@/shared/ui/icons/Icon'
import { Link } from 'react-router-dom'

import { MenuItem } from '@/app/components/sidebar/sidebarType'
import { menuSidebar } from '@/app/constans/menuSiderbar'

import './MainPage.scss'

const MENU_DESCRIPTIONS: Record<string, string> = {
  categories: 'Дерево категорий товаров: создание, редактирование и удаление.',
  'product-attributes': 'Опции и значения атрибутов товаров.',
  'size-charts': 'Размерные сетки и параметры для категорий.',
  'products-list': 'Список товаров: просмотр, поиск и редактирование.',
  'product-create': 'Мастер создания товара с вариациями и остатками.',
  stock: 'Склад: остатки по товарам, поиск и быстрое редактирование.',
  'platform-images': 'Загрузка и управление изображениями платформы.',
  heatmap: 'Тепловая карта кликов и просмотр страниц магазина.',
  support: 'Поддержка и обратная связь с клиентами.',
  'callback-form': 'Заявки с формы обратной связи на сайте.',
}

function getNavigableMenuItems(items: MenuItem[]): MenuItem[] {
  return items.flatMap(item => {
    if (item.subItems?.length) {
      return item.subItems
        .filter(subItem => subItem.href)
        .map(subItem => ({
          ...subItem,
          icon: subItem.icon ?? item.icon,
        }))
    }

    if (!item.href || item.href === '#') {
      return []
    }

    return [item]
  })
}

const MainPage = () => {
  const navigableItems = getNavigableMenuItems(menuSidebar)

  return (
    <Container className="admin-home admin-page">
      <nav className="admin-home__grid" aria-label="Разделы админ-панели">
        {navigableItems.map(item => (
          <Link key={item.id} to={item.href!} className="admin-home__card">
            <div className="admin-home__card-header">
              {item.icon ? (
                <span className="admin-home__card-icon">
                  <Icon name={item.icon} color="#1072d5" width="24px" height="24px" />
                </span>
              ) : null}
              <span className="admin-home__card-arrow" aria-hidden="true">
                →
              </span>
            </div>
            <h2 className="admin-home__card-title">{item.text}</h2>
            <p className="admin-home__card-description">
              {MENU_DESCRIPTIONS[item.id] ?? 'Перейти в раздел.'}
            </p>
          </Link>
        ))}
      </nav>
    </Container>
  )
}

export default MainPage
