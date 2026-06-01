import React, { useEffect, useRef, useState } from 'react'

import { useMatchMedia } from '@/shared/hooks/useMatchMedia'
import { Button, Tooltip } from 'antd'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

import defaultUserLogo from '@/app/assets/images/user.jpg'
import { ADMIN_MOBILE_SIDEBAR_MEDIA_QUERY } from '@/app/constans/layout'
import { overlayVariants, sidebarVariants } from '@/app/constans/sidebarVariants'

import Icon from '../../../shared/ui/icons/Icon'
import './Sidebar.scss'
import { SidebarProps } from './sidebarType'

const defaultLogo = '/icons/favicon-96x96.png'

/** Подсветка пункта по текущему URL (точное совпадение или вложенный путь). */
function isSidebarHrefActive(href: string | undefined, pathname: string): boolean {
  if (!href || href === '#') {
    return false
  }
  if (pathname === href) {
    return true
  }
  return pathname.startsWith(`${href}/`)
}

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
    title: 'Solitude Admin 1.0',
  },
  user = {
    href: '#profile',
    name: 'Alexander Pierce',
    logo: defaultUserLogo,
  },
}: SidebarProps) => {
  const { pathname } = useLocation()
  const isMobile = useMatchMedia(ADMIN_MOBILE_SIDEBAR_MEDIA_QUERY)
  const prevPathnameRef = useRef(pathname)
  const [openSubMenuItem, setOpenSubMenuItem] = useState<Set<string>>(new Set())

  useEffect(() => {
    const parentIdsToOpen = menuItems
      .filter(
        item => item.subItems?.some(subItem => isSidebarHrefActive(subItem.href, pathname)) ?? false
      )
      .map(item => item.id)

    if (parentIdsToOpen.length === 0) {
      return
    }

    setOpenSubMenuItem(prev => {
      const next = new Set(prev)
      parentIdsToOpen.forEach(id => next.add(id))
      return next
    })
  }, [menuItems, pathname])

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

  useEffect(() => {
    if (!isMobile || !isOpen || prevPathnameRef.current === pathname) {
      prevPathnameRef.current = pathname
      return
    }

    prevPathnameRef.current = pathname
    toggleSidebar()
  }, [isMobile, isOpen, pathname, toggleSidebar])

  useEffect(() => {
    if (!isMobile || !isOpen) {
      document.body.style.removeProperty('overflow')
      return
    }

    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.removeProperty('overflow')
    }
  }, [isMobile, isOpen])

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
      {isMobile && !isOpen && (
        <button
          type="button"
          className="sidebar-mobile-toggle"
          onClick={toggleSidebar}
          aria-label="Открыть меню"
          aria-expanded={false}
        >
          <span className="sidebar-mobile-toggle__icon">
            <Icon name="arrow" />
          </span>
        </button>
      )}

      {isMobile ? (
        <div
          className={classNames('sidebar-overlay', { active: isOpen })}
          onClick={isOpen && closeOnOutsideClick ? toggleSidebar : undefined}
          aria-hidden={!isOpen}
        />
      ) : (
        isOpen && (
          <motion.div
            className="sidebar-overlay active"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={closeOnOutsideClick ? toggleSidebar : undefined}
          />
        )
      )}

      {isMobile ? (
        <aside
          className={classNames(
            'sidebar',
            `sidebar-${position}`,
            'sidebar--mobile',
            isOpen ? 'sidebar--mobile-open' : 'sidebar--mobile-closed'
          )}
          style={{ width }}
          onClick={e => e.stopPropagation()}
        >
          {renderSidebarContent()}
        </aside>
      ) : (
        <motion.aside
          className={classNames('sidebar', `sidebar-${position}`, { collapsed: !isOpen })}
          style={{ width }}
          variants={sidebarVariants}
          initial={isOpen ? 'open' : 'collapsed'}
          animate={isOpen ? 'open' : 'collapsed'}
          onClick={e => e.stopPropagation()}
        >
          {renderSidebarContent()}
        </motion.aside>
      )}
    </>
  )

  function renderSidebarContent() {
    return (
      <>
        <div className="sidebar-header-container">
          {logo && (
            <a href="/" className="sidebar-header">
              <img src={logo.imageUrl} alt={logo.altText || 'логотип'} className="sidebar-logo" />
              {isOpen && logo.title && <span className="sidebar-brand">{logo.title}</span>}
            </a>
          )}
          <div className="header-sidebar-container">
            <motion.div
              id="header-sidebar"
              className={isOpen ? 'sidebar-open' : ''}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="headerSidebar">
                <motion.div
                  className={`burger-arrow ${isOpen ? 'open' : ''}`}
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <Button
                    onClick={toggleSidebar}
                    className="open-sidebar"
                    type="text"
                    shape="circle"
                  >
                    <Icon name="arrow" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

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
                const subMenuExpanded = hasSubItems && isOpenSubItem
                const hasActiveChild =
                  hasSubItems &&
                  (item.subItems?.some(subItem => isSidebarHrefActive(subItem.href, pathname)) ??
                    false)
                const routeMatchesLeaf = !hasSubItems && isSidebarHrefActive(item.href, pathname)
                const menuIconHighlighted = routeMatchesLeaf || hasActiveChild || subMenuExpanded
                const menuTextHighlighted = menuIconHighlighted

                const tooltipPlacement = position === 'left' ? 'right' : 'left'

                return (
                  <li className="sidebar-menu-item " key={item.id}>
                    <Tooltip
                      title={!isOpen ? item.text : undefined}
                      placement={tooltipPlacement}
                      mouseEnterDelay={0}
                    >
                      <a
                        href={hasSubItems ? '#' : item.href || '#'}
                        className={[
                          'sidebar-menu-link',
                          routeMatchesLeaf ? 'is-active' : '',
                          subMenuExpanded ? 'is-expanded' : '',
                          hasActiveChild ? 'has-active-child' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
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
                            return
                          }

                          if (isMobile && isOpen) {
                            toggleSidebar()
                          }
                        }}
                      >
                        <div className="icon-and-text">
                          {item.icon && (
                            <span className="menu-item-icon-wrap">
                              <span className="menu-item-icon">
                                <Icon
                                  name={item.icon}
                                  color={menuIconHighlighted ? '#1072d5' : '#c2c7d0'}
                                />
                              </span>
                              {item.badgeCount != null && item.badgeCount > 0 ? (
                                <span
                                  className="sidebar-menu-badge-count"
                                  aria-label={`Новых обращений: ${item.badgeCount}`}
                                >
                                  {item.badgeCount > 99 ? '99+' : item.badgeCount}
                                </span>
                              ) : null}
                            </span>
                          )}
                          {isOpen && (
                            <span
                              className={`menu-item-text ${menuTextHighlighted ? 'is-highlighted' : ''}`}
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
                    </Tooltip>
                    {hasSubItems && isOpenSubItem && isOpen && item.subItems ? (
                      <ul className="sidebar-submenu">
                        {item.subItems.map(subItem => {
                          const subRouteActive = isSidebarHrefActive(subItem.href, pathname)
                          return (
                            <li className="sidebar-submenu-item" key={subItem.id}>
                              <a
                                href={subItem.href || '#'}
                                className={[
                                  'sidebar-menu-link',
                                  'sidebar-menu-link--child',
                                  subRouteActive ? 'is-active' : '',
                                ]
                                  .filter(Boolean)
                                  .join(' ')}
                                onClick={() => {
                                  subItem.onClick?.()
                                  if (isMobile && isOpen) {
                                    toggleSidebar()
                                  }
                                }}
                              >
                                <span
                                  className={`menu-item-text ${subRouteActive ? 'is-highlighted' : ''}`}
                                >
                                  {subItem.text}
                                </span>
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </>
    )
  }
}

export default Sidebar
