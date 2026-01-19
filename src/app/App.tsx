import AppErrorBoundary from '@/AppErrorBoundary'
import { Outlet } from 'react-router-dom'

import './styles/global.scss'

function App() {
  return (
    <AppErrorBoundary>
      <Outlet />
    </AppErrorBoundary>
  )
}

export default App
