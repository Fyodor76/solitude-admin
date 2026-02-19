import { Button } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

import Breadcrumbs from '../breadcrumbs/Breadcrumbs'
import Icon from '../icons/Icon'
import HeaderSidebar from '../sidebar/HeaderSidebar'
import './Header.scss'

interface HeaderProps {
  isOpen: boolean
  toggleSidebar: () => void
}
export const Header = ({ toggleSidebar, isOpen }: HeaderProps) => {
  const navigate = useNavigate()
  const messages = 5
  const notification = 3
  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <>
      <div className="header">
        <div className="header-container">
          <HeaderSidebar toggleSidebar={toggleSidebar} isOpen={isOpen} />
          <div className="btn-container">
            <div className="links">
              <Link to="#" className="link-message">
                <Icon name="message"></Icon>
                {messages > 0 && <span className="badge">{messages}</span>}
              </Link>
              <Link to="#" className="link-notify">
                <Icon name="notify"></Icon>
                {notification > 0 && <span className="badge">{notification}</span>}
              </Link>
            </div>
            <Button onClick={handleLogout} className="btn-logout">
              <Icon name="logout"></Icon>
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
