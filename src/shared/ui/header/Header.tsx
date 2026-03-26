import { useLogoutMutation } from '@/shared/lib/api/auth/auth'
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
export const Header = () => {
  const [logout, { isLoading }] = useLogoutMutation()

  const navigate = useNavigate()
  const messages = 5
  const notification = 3

  const handleLogout = async () => {
    try {
      await logout().unwrap()

      localStorage.removeItem('access')
      localStorage.removeItem('refresh')

      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <>
      <div className="header">
        <div className="header-container">
          <HeaderSidebar />
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
            <Button loading={isLoading} onClick={handleLogout} className="btn-logout">
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
