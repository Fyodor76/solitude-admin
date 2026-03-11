import { useLogoutMutation } from '@/shared/lib/api/auth/auth'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

import './Header.scss'

export const Header = () => {
  const [logout, { isLoading }] = useLogoutMutation()
  const navigate = useNavigate()

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
    <div className="header">
      <Button loading={isLoading} onClick={handleLogout}>
        Выйти
      </Button>
    </div>
  )
}
