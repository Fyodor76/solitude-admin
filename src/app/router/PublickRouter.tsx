import { AuthLayout } from '@/layouts/auth-layout'
import { Navigate } from 'react-router-dom'

interface PublickRouterProps {
  children: React.ReactNode
}
const PublicRouter = ({ children }: PublickRouterProps) => {
  const isAuth = localStorage.getItem('access')

  if (isAuth) {
    return <Navigate to="/" replace />
  }
  return <AuthLayout>{children}</AuthLayout>
}

export default PublicRouter
