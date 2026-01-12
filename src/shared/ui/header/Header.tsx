import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

import './Header.scss'

export const Header = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <div className="header">
      <Button onClick={handleLogout}>Выйти</Button>
    </div>
  )
}
