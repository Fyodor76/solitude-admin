import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

import HeaderSidebar from '../sidebar/HeaderSidebar'
import './Header.scss'

export const Header = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <div className="header" style={{ display: 'flex', justifyContent: 'space-between' }}>
      <HeaderSidebar />
      <Button onClick={handleLogout}>Выйти</Button>
    </div>
  )
}
