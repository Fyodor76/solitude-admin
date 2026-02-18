import React, { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import defaultLogo from '@/app/assets/images/image.png'
import defaultUserLogo from '@/app/assets/images/user.jpg'
import { overlayVariants, sidebarVariants, subMenuVariant } from '@/app/constans/sidebarVariants'

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
    imageUrl: defaultLogo,
    altText: 'логотип',
    title: 'AdminLTE 3',
  },
  user = {
    href: '#profile',
    name: 'Alexander Pierce',
    logo: defaultUserLogo,
  },
}: SidebarProps) => {
  const [openSubMenuItem, setOpenSubMenuItem] = useState<Set<string>>(new Set())
  useEffect(() => {
    if (!isOpen) {
      setOpenSubMenuItem(new Set())
    }
  }, [isOpen])
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
              {isOpen && user.name && (
                <div className="user-container">
                  <a className="user-name " href={user.href}>
                    {user.name || ''}
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
                  <li className="sidebar-menu-item " key={item.id}>
                    <a
                      href={hasSubItems ? '#' : item.href || '#'}
                      className={`sidebar-menu-link ${openSubMenuItem.has(item.id) ? 'active' : ''}`}
                      data-collapsed={!isOpen}
                      onClick={e => {
                        if (hasSubItems) {
                          e.preventDefault()
                          if (!isOpen) {
                            toggleSidebar()
                            toggleSubMenuItem(item.id)
                          } else {
                            toggleSubMenuItem(item.id)
                          }
                          if (item.onClick) {
                            item.onClick()
                          }
                        }
                      }}
                    >
                      <div className="icon-and-text">
                        {item.icon && (
                          <span className="menu-item-icon">
                            <Icon name={item.icon} />
                          </span>
                        )}
                        {isOpen && (
                          <span
                            className={`menu-item-text ${openSubMenuItem.has(item.id) ? 'active' : ''}`}
                          >
                            {item.text}
                          </span>
                        )}
                      </div>
                      {hasSubItems && isOpen && (
                        <span className={`submenu-arrow ${isOpenSubItem ? 'expanded' : ''}`}>
                          <Icon name="arrow" color={`${isOpenSubItem ? '#1072d5' : '#ffffff'}`} />
                        </span>
                      )}
                    </a>
                    <AnimatePresence>
                      {hasSubItems && isOpenSubItem && isOpen && item.subItems && (
                        <motion.ul
                          variants={subMenuVariant}
                          initial="close"
                          animate="open"
                          exit="close"
                          className={`sidebar-submenu ${isOpenSubItem ? 'open' : ''}`}
                        >
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
                        </motion.ul>
                      )}
                    </AnimatePresence>
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
