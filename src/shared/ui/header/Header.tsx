import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

import Breadcrumbs from '../breadcrumbs/Breadcrumbs'
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
    <>
      <div className="header">
        <div className="header-container">
          <HeaderSidebar toggleSidebar={toggleSidebar} isOpen={isOpen} />
          <div className="btn-logout-container">
            <Button onClick={handleLogout} className="btn-logout">
              Выйти
            </Button>
          </div>
        </div>
        <div className="breadcrumbs-container">
          <Breadcrumbs />
        </div>
      </div>
    </>
  )
}
