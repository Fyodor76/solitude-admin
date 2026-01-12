import { MainPage } from '@/pages/main'
import { RouteObject } from 'react-router-dom'

import { AuthLayout } from '../../layouts/auth-layout'
import { Forgot } from '../../pages/forgot'
import Login from '../../pages/login/Login'
import { Registration } from '../../pages/registration'
import App from '../App'
import ProtectedRouter from './ProtectedRouter'
import RouterErrorElement from './RouterErrorElement'

export const Router: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <RouterErrorElement />,

    children: [
      {
        index: true,
        element: (
          <ProtectedRouter>
            <MainPage />
          </ProtectedRouter>
        ),
      },
      {
        path: '/login',
        element: (
          <AuthLayout>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: '/registration',
        element: (
          <AuthLayout>
            <Registration />
          </AuthLayout>
        ),
      },
      {
        path: '/forgot',
        element: (
          <AuthLayout>
            <Forgot />
          </AuthLayout>
        ),
      },
    ],
  },
]
