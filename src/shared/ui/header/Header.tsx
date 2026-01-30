import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

import './Header.scss'

interface HeaderProps {
  openSidebar?: () => void
}
export const Header = ({ openSidebar }: HeaderProps) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <div className="header" style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button onClick={openSidebar} className="menu-button">
        ☰
      </Button>
      <Button onClick={handleLogout}>Выйти</Button>
    </div>
  )
}
