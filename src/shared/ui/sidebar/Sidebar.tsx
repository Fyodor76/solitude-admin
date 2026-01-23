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
  return <div className="sidebar-overlay" onClick={closeOnOutsideClick ? onClose : undefined}></div>
}

export default Sidebar
