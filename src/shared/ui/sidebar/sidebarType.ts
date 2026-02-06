import { IconName } from '../icons/iconSet'

export interface LogoSidebarType {
  imageUrl: string
  altText?: string
  title?: string
}
export interface UseSidebarType {
  href: string
  name: string
  logo?: string
}
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
  logo?: LogoSidebarType | null
  user?: UseSidebarType | null
}
