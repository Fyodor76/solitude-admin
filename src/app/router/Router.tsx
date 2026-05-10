import { ValidationProvider } from '@/context/validation/provider'
import { Categories } from '@/pages/categories'
import { MainPage } from '@/pages/main'
import { RouteObject } from 'react-router-dom'

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
          <ValidationProvider>
            <PublicRouter>
              <Login />
            </PublicRouter>
          </ValidationProvider>
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
    ],
  },
]
