import { Navigate } from 'react-router-dom'

import { BaseLayout } from '../../layouts/base-layout'

interface ProtectedRouterProps {
  children: React.ReactNode
}
const ProtectedRouter = ({ children }: ProtectedRouterProps) => {
  // const isAuth = localStorage.getItem('isAuth')
  // if (!isAuth) {
  //   return <Navigate to="/login" replace />
  // }
  return <BaseLayout>{children}</BaseLayout>
}

export default ProtectedRouter
