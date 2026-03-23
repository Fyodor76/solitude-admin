import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { store } from '././app/store/index'
import ErrorBoundary from './app/components/error-boundary/ErrorBoundary'
import { Router } from './app/router/Router'

const router = createBrowserRouter(Router)

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ErrorBoundary>
  </StrictMode>
)
