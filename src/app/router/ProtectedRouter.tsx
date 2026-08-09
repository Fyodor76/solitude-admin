import { Navigate, Outlet } from 'react-router-dom'

import { BaseLayout } from '../../layouts/base-layout'

const ProtectedRouter = () => {
  const isAuth = localStorage.getItem('access')

  if (!isAuth) {
    return <Navigate to="/login" replace />
  }

  return (
    <BaseLayout>
      <Outlet />
    </BaseLayout>
  )
}

export default ProtectedRouter
