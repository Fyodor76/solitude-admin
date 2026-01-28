import React from 'react'

import './sidebar.scss'

export interface MenuItem {
  id: string
  text: string
  href?: string
  icon?: React.ReactNode
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
  title?: string
  closeOnOutsideClick?: boolean
}

const Sidebar = ({
  isOpen,
  onClose,
  menuItems,
  position = 'left',
  width = '280px',
  title,
  closeOnOutsideClick = true,
}: SidebarProps) => {
  if (!isOpen) {
    return null
  }

  const handleCloseEsc = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose()
    }
  }
  return (
    <div
      className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
      onClick={closeOnOutsideClick ? onClose : undefined}
    >
      <aside
        className={`sidebar sidebar-${position} ${isOpen ? 'open' : ''}`}
        style={{ width }}
        onKeyDown={handleCloseEsc}
        tabIndex={-1}
      >
        <a href="/" className="sidebar-header">
          <img src="public/images/image.png" alt="логотип" className="sidebar-logo" />
          <span className="sidebar-brand">AdminLTE 3</span>
        </a>
        <div className="sidebar-container">
          <div className="user-panel">
            <img src="public/images/user.jpg" alt="user-avatar" className="user-avatar" />
            <div className="user-container">
              <a className="user-name" href="#profile">
                Alexander Pierce
              </a>
            </div>
          </div>
          <div className="sidebar-search-container">
            <div className="sidebar-search">
              <input type="search" placeholder="Search" className="input-search" />
            </div>
            <button className="button-search">
              <img src="public/images/search.png" alt="search" />
            </button>
          </div>
          <nav className="sidebar-nav">
            <ul className="sidebar-menu">
              {menuItems.map(item => (
                <li className="siderbar-menu-item" key={item.id}>
                  {item.href ? (
                    <a href={item.href} className="sidebar-menu-link">
                      {item.icon && <span className="menu-item-icon">{item.icon}</span>}
                      <span className="menu-item-text">{item.text}</span>
                      {item.hasArrow && (
                        <img
                          src="public/images/arrow.png"
                          alt="arrow"
                          className="menu-item-arrow"
                        />
                      )}
                    </a>
                  ) : (
                    <div className="sidebar-menu-title">
                      {item.icon && <span className="menu-title-icon">{item.icon}</span>}
                      <span className="menu-title-text">{item.text}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  )
}

export default Sidebar
