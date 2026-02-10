import { Outlet } from 'react-router-dom'

import AppErrorBoundary from '@/app/components/error-boundary/AppErrorBoundary'

import './styles/global.scss'

function App() {
  return (
    <AppErrorBoundary>
      <Outlet />
    </AppErrorBoundary>
  )
}

export default App
