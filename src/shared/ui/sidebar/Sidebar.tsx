import React, { useEffect, useState } from 'react'

import Icon from '../icons/Icon'
import { IconName } from '../icons/iconSet'
import './sidebar.scss'

export interface MenuItem {
  id: string
  text: string
  href?: string
  icon?: IconName
  hasArrow?: boolean
  subItems?: MenuItem[]
  onClick?: () => void
}
export interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  menuItems: MenuItem[]
  position?: 'left' | 'right'
  width?: string
  closeOnOutsideClick?: boolean
  logo?: {
    imageUrl: string
    altText?: string
    title?: string
  }
  user?: {
    href: string
    name: string
    logo?: string
  }
}

const Sidebar = ({
  isOpen,
  onClose,
  menuItems,
  position = 'left',
  width = '280px',
  closeOnOutsideClick = true,
  logo = {
    imageUrl: 'public/images/image.png',
    altText: 'логотип',
    title: 'AdminLTE 3',
  },
  user = {
    href: '#profile',
    name: 'Alexander Pierce',
    logo: 'public/images/user.jpg',
  },
}: SidebarProps) => {
  useEffect(() => {
    const handleCloseEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleCloseEsc)
    return () => {
      document.removeEventListener('keydown', handleCloseEsc)
    }
  }, [isOpen, onClose])

  const [openSubMenuItem, setOpenSubMenuItem] = useState<Set<string>>(new Set())

  const toggleSubMenuItem = (menuItemId: string) => {
    const newOpenSubMenuItem = new Set(openSubMenuItem)
    if (newOpenSubMenuItem.has(menuItemId)) {
      newOpenSubMenuItem.delete(menuItemId)
    } else {
      newOpenSubMenuItem.add(menuItemId)
    }
    setOpenSubMenuItem(newOpenSubMenuItem)
  }

  return (
    <div
      className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
      onClick={closeOnOutsideClick ? onClose : undefined}
    >
      <aside
        className={`sidebar sidebar-${position} ${isOpen ? 'open' : ''}`}
        style={{ width }}
        onClick={e => e.stopPropagation()}
      >
        <a href="/" className="sidebar-header">
          <img src={logo.imageUrl} alt={logo.altText || 'логотип'} className="sidebar-logo" />
          {logo.title && <span className="sidebar-brand">{logo.title}</span>}
        </a>
        <div className="sidebar-container">
          <div className="user-panel">
            <img src={user.logo} alt="user-avatar" className="user-avatar" />
            <div className="user-container">
              <a className="user-name" href={user.href}>
                {user.name}
              </a>
            </div>
          </div>

          <nav className="sidebar-nav">
            <ul className="sidebar-menu">
              {menuItems.map(item => {
                const hasSubItems = item.subItems && item.subItems.length > 0
                const isOpenSubItem = openSubMenuItem.has(item.id)

                return (
                  <li className="sidebar-menu-item" key={item.id}>
                    <a
                      href={hasSubItems ? '#' : item.href || '#'}
                      className="sidebar-menu-link"
                      onClick={e => {
                        if (hasSubItems) {
                          e.preventDefault()
                          toggleSubMenuItem(item.id)
                        } else if (item.onClick) {
                          item.onClick()
                        }
                      }}
                    >
                      {item.icon && (
                        <span className="menu-item-icon">
                          <Icon name={item.icon} />
                        </span>
                      )}

                      <span className="menu-item-text">{item.text}</span>

                      {/* Стрелочка для подменю - ВНУТРИ ссылки */}
                      {hasSubItems && (
                        <span className={`submenu-arrow ${isOpenSubItem ? 'expanded' : ''}`}>
                          <Icon name="arrow" color="#ffffff" />
                        </span>
                      )}
                    </a>

                    {hasSubItems && isOpenSubItem && item.subItems && (
                      <ul className="sidebar-submenu">
                        {item.subItems.map(subItem => (
                          <li className="sidebar-submenu-item" key={subItem.id}>
                            <a
                              href={subItem.href || '#'}
                              className="sidebar-submenu-link"
                              onClick={subItem.onClick}
                            >
                              {subItem.icon && (
                                <span className="submenu-item-icon">
                                  <Icon name={subItem.icon} color="#ffffff" />
                                </span>
                              )}
                              <span className="submenu-item-text">{subItem.text}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  )
}

export default Sidebar
