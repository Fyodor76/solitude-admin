import { useLogoutMutation } from '@/shared/lib/api/auth/auth'
import { useAdminNotifications } from '@/shared/lib/notifications'
import { NotificationBell } from '@/shared/ui/notification-bell'
import { Button, ConfigProvider } from 'antd'
import { useNavigate } from 'react-router-dom'

import Breadcrumbs from '../breadcrumbs/Breadcrumbs'
import Icon from '../icons/Icon'
import './Header.scss'

export const Header = () => {
  const [logout] = useLogoutMutation()
  const navigate = useNavigate()
  const { unreadCount, notificationItems } = useAdminNotifications()

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
              <NotificationBell items={notificationItems} count={unreadCount} />
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
