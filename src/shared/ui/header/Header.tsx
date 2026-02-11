import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

import HeaderSidebar from '../sidebar/HeaderSidebar'
import './Header.scss'

interface HeaderProps {
  isOpen: boolean
  toggleSidebar: () => void
}
export const Header = ({ toggleSidebar, isOpen }: HeaderProps) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <div className="header" style={{ display: 'flex', justifyContent: 'space-between' }}>
      <HeaderSidebar toggleSidebar={toggleSidebar} isOpen={isOpen} />
      <Button onClick={handleLogout}>Выйти</Button>
    </div>
  )
}
