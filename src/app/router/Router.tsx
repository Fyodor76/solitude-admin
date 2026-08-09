import { ValidationProvider } from '@/context/validation/provider'
import { Categories } from '@/pages/categories'
import CallbackFormPage from '@/pages/forms/callback-form/CallbackFormPage'
import { MainPage } from '@/pages/main'
import { NotificationsPage } from '@/pages/notifications'
import { OrderDetailPage, OrdersPage } from '@/pages/orders'
import { PlatformImages } from '@/pages/platform-images'
import { ProductAttribute } from '@/pages/product-attributes'
import { ProductCreatePage } from '@/pages/product-create'
import {
  ProductDetailPage,
  ProductsPage,
  VariationCreatePage,
  VariationEditPage,
  VariationStockPage,
} from '@/pages/products'
import { SizeChart } from '@/pages/size-charts'
import { StockPage } from '@/pages/stock'
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

const LoginPage = () => (
  <ValidationProvider>
    <Login />
  </ValidationProvider>
)

const RegistrationPage = () => (
  <ValidationProvider>
    <Registration />
  </ValidationProvider>
)

const CategoriesPage = () => (
  <ValidationProvider>
    <Categories />
  </ValidationProvider>
)

export const Router: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <RouterErrorElement />,

    children: [
      {
        element: <ProtectedRouter />,
        children: [
          {
            index: true,
            element: <MainPage />,
          },
          {
            path: 'categories',
            element: <CategoriesPage />,
          },
          {
            path: 'platform-images',
            element: <PlatformImages />,
          },
          {
            path: 'size-charts',
            element: <SizeChart />,
          },
          {
            path: 'heatmap',
            element: <StorePreview />,
          },
          {
            path: 'support',
            element: <SupportInbox />,
          },
          {
            path: 'notifications',
            element: <NotificationsPage />,
          },
          {
            path: 'forms/callback',
            element: <CallbackFormPage />,
          },
          {
            path: 'product-attributes',
            element: <ProductAttribute />,
          },
          {
            path: 'products',
            element: <ProductsPage />,
          },
          {
            path: 'products/create',
            element: <ProductCreatePage />,
          },
          {
            path: 'stock',
            element: <StockPage />,
          },
          {
            path: 'orders',
            element: <OrdersPage />,
          },
          {
            path: 'orders/:orderId',
            element: <OrderDetailPage />,
          },
          {
            path: 'products/:productId',
            element: <ProductDetailPage />,
          },
          {
            path: 'products/:productId/variations/new',
            element: <VariationCreatePage />,
          },
          {
            path: 'products/:productId/variations/:variationId/stock',
            element: <VariationStockPage />,
          },
          {
            path: 'products/:productId/variations/:variationId',
            element: <VariationEditPage />,
          },
        ],
      },

      {
        path: '/login',
        element: (
          <PublicRouter>
            <LoginPage />
          </PublicRouter>
        ),
      },
      {
        path: '/registration',
        element: (
          <PublicRouter>
            <RegistrationPage />
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
        path: '/store-preview',
        element: <Navigate to="/heatmap" replace />,
      },
    ],
  },
]
