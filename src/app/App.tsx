import { PushNavigationSync } from '@/shared/lib/push'
import { Outlet } from 'react-router-dom'

import AppErrorBoundary from '@/app/components/error-boundary/ErrorBoundary'

import { NotificationHost } from './components/notification-host/NotificationHost'
import './styles/global.scss'

function App() {
  return (
    <AppErrorBoundary>
      <PushNavigationSync />
      <NotificationHost />
      <Outlet />
    </AppErrorBoundary>
  )
}

export default App
