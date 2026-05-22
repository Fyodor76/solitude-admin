import { useLogoutMutation } from '@/shared/lib/api/auth/auth'
import { Button, ConfigProvider } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

import Breadcrumbs from '../breadcrumbs/Breadcrumbs'
import Icon from '../icons/Icon'
import './Header.scss'

export const Header = () => {
  const [logout] = useLogoutMutation()

  const navigate = useNavigate()
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
          <div className="btn-container">
            <div className="links">
              <Link to="#" className="link-notify">
                <Icon name="notify"></Icon>
                {notification > 0 && <span className="badge">{notification}</span>}
              </Link>
            </div>

            <ConfigProvider wave={{ disabled: true }}>
              <Button onClick={handleLogout} className="btn-logout">
                <Icon name="logout"></Icon>
              </Button>
            </ConfigProvider>
          </div>
        </div>
        <div className="breadcrumbs-container">
          <Breadcrumbs />
        </div>
      </div>
    </>
  )
}
