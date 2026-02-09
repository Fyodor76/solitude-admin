import React, { useEffect, useState } from 'react'

import { motion, Variants } from 'framer-motion'

import Icon from '../icons/Icon'
import './sidebar.scss'
import { SidebarProps } from './sidebarType'

const Sidebar = ({
  isOpen,
  toggleSidebar,
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
        toggleSidebar()
      }
    }
    document.addEventListener('keydown', handleCloseEsc)
    return () => {
      document.removeEventListener('keydown', handleCloseEsc)
    }
  }, [isOpen, toggleSidebar])

  const [openSubMenuItem, setOpenSubMenuItem] = useState<Set<string>>(new Set())

  const sidebarWidth = parseInt(width) || 280
  const collapsedWidth = 70

  const toggleSubMenuItem = (menuItemId: string) => {
    const newOpenSubMenuItem = new Set(openSubMenuItem)
    if (newOpenSubMenuItem.has(menuItemId)) {
      newOpenSubMenuItem.delete(menuItemId)
    } else {
      newOpenSubMenuItem.add(menuItemId)
    }
    setOpenSubMenuItem(newOpenSubMenuItem)
  }

  const sidebarVariants: Variants = {
    collapsed: {
      width: collapsedWidth,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      width: sidebarWidth,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  }

  const overlayVariants: Variants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  }

  return (
    <>
      {isOpen && (
        <motion.div
          className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
          variants={overlayVariants}
          initial="closed"
          animate="open"
          exit="closed"
          onClick={closeOnOutsideClick ? toggleSidebar : undefined}
        ></motion.div>
      )}
      <motion.aside
        className={`sidebar sidebar-${position}`}
        style={{ width }}
        variants={sidebarVariants}
        initial={isOpen ? 'open' : 'collapsed'}
        animate={isOpen ? 'open' : 'collapsed'}
        onClick={e => e.stopPropagation()}
      >
        {logo && (
          <a href="/" className="sidebar-header">
            <img src={logo.imageUrl} alt={logo.altText || 'логотип'} className="sidebar-logo" />
            {isOpen && logo.title && <span className="sidebar-brand">{logo.title}</span>}
          </a>
        )}

        <div className="sidebar-container">
          {user && (
            <div className="user-panel">
              <img src={user.logo} alt="user-avatar" className="user-avatar" />
              {isOpen && (
                <div className="user-container">
                  <a className="user-name" href={user.href}>
                    {user.name}
                  </a>
                </div>
              )}
            </div>
          )}
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
                          if (isOpen) {
                            e.preventDefault()
                            toggleSubMenuItem(item.id)
                          }
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
                      {isOpen && <span className="menu-item-text">{item.text}</span>}
                      {hasSubItems && isOpen && (
                        <span className={`submenu-arrow ${isOpenSubItem ? 'expanded' : ''}`}>
                          <Icon name="arrow" color="#ffffff" />
                        </span>
                      )}
                    </a>

                    {hasSubItems && isOpenSubItem && isOpen && item.subItems && (
                      <ul className={`sidebar-submenu ${isOpenSubItem ? 'open' : ''}`}>
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
      </motion.aside>
    </>
  )
}

export default Sidebar
