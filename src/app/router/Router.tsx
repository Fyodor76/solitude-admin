import { Categories } from '@/pages/categories'
import CallbackFormPage from '@/pages/forms/callback-form/CallbackFormPage'
import { MainPage } from '@/pages/main'
import { NotificationsPage } from '@/pages/notifications'
import { PlatformImages } from '@/pages/platform-images'
import { ProductAttribute } from '@/pages/product-attributes'
import { SizeChart } from '@/pages/size-charts'
import { StorePreview } from '@/pages/store-preview'
import { SupportInbox } from '@/pages/support-inbox'
import { Navigate, RouteObject } from 'react-router-dom'

import { Forgot } from '../../pages/forgot'
import Login from '../../pages/login/Login'
import { Registration } from '../../pages/registration'
import App from '../App'
import ProtectedRouter from './ProtectedRouter'
import PublicRouter from './PublickRouter'
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
          <PublicRouter>
            <Login />
          </PublicRouter>
        ),
      },
      {
        path: '/registration',
        element: (
          <PublicRouter>
            <Registration />
          </PublicRouter>
        ),
      },
      {
        path: '/forgot',
        element: (
          <PublicRouter>
            <Forgot />
          </PublicRouter>
        ),
      },
      {
        path: '/categories',
        element: (
          <ProtectedRouter>
            <Categories />
          </ProtectedRouter>
        ),
      },
      {
        path: '/platform-images',
        element: (
          <ProtectedRouter>
            <PlatformImages />
          </ProtectedRouter>
        ),
      },
      {
        path: '/size-charts',
        element: (
          <ProtectedRouter>
            <SizeChart />
          </ProtectedRouter>
        ),
      },
      {
        path: '/store-preview',
        element: <Navigate to="/heatmap" replace />,
      },
      {
        path: '/heatmap',
        element: (
          <ProtectedRouter>
            <StorePreview />
          </ProtectedRouter>
        ),
      },
      {
        path: '/support',
        element: (
          <ProtectedRouter>
            <SupportInbox />
          </ProtectedRouter>
        ),
      },
      {
        path: '/notifications',
        element: (
          <ProtectedRouter>
            <NotificationsPage />
          </ProtectedRouter>
        ),
      },
      {
        path: '/forms/callback',
        element: (
          <ProtectedRouter>
            <CallbackFormPage />
          </ProtectedRouter>
        ),
      },
      {
        path: '/product-attributes',
        element: (
          <ProtectedRouter>
            <ProductAttribute />
          </ProtectedRouter>
        ),
      },
    ],
  },
]
