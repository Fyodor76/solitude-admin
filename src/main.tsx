import { StrictMode } from 'react'

import { ConfigProvider } from 'antd'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { store } from '././app/store/index'
import ErrorBoundary from './app/components/error-boundary/ErrorBoundary'
import { antdTheme } from './app/lib/config/antdTheme'
import { preloadAppFonts } from './app/lib/fonts/preloadFonts'
import { Router } from './app/router/Router'
import './app/styles/global.scss'

const router = createBrowserRouter(Router)
const rootElement = document.getElementById('root') as HTMLElement

function renderApp() {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <ConfigProvider theme={antdTheme}>
            <RouterProvider router={router} />
          </ConfigProvider>
        </Provider>
      </ErrorBoundary>
    </StrictMode>
  )
}

void preloadAppFonts().finally(renderApp)
