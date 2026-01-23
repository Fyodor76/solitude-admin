import React from 'react'

import './Sidebar.css'

export interface MenuItem {
  id: string
  text: string
  href?: string
  icon?: React.ReactNode
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
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="public/images/image.png" alt="логотип" className="sadebar-logo" />
        <a href="/" className="sidebar-brand">
          AdminLTE 3
        </a>
      </div>
      <div className="sidebar-container">
        <div className="user-panel">
          <img src="public/images/user.jpg" alt="user-name" className="user-avatar" />
          <div className="user-container">
            <a className="user-name" href="">
              Alexander Pierce
            </a>
          </div>
        </div>
        {/*<div className="sidebar-overlay" onClick={closeOnOutsideClick ? onClose : undefined}></div>*/}
      </div>
    </aside>
  )
}

export default Sidebar
