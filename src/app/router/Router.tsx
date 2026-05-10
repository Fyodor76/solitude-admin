import { Categories } from '@/pages/categories'
import { MainPage } from '@/pages/main'
import { PlatformImages } from '@/pages/platform-images'
import { StorePreview } from '@/pages/store-preview'
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
      /* {
        path: '/catalog',
        element: (
          <BaseLayout>
            <CatalogPage />
          </BaseLayout>
        ),
      },
      {
        path: '/catalog/tshorts',
        element: (
          <BaseLayout>
            <TshortsPage />
          </BaseLayout>
        ),
      },*/
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
    ],
  },
]
