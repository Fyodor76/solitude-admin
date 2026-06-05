import { ReactNode } from 'react'

import { useMatchMedia } from '@/shared/hooks/useMatchMedia'
import { DocumentTitleSync } from '@/shared/lib/notifications'
import { PullToRefreshIndicator, usePullToRefresh } from '@/shared/lib/pull-to-refresh'
import { AdminPushPrompt } from '@/shared/lib/push'
import { Header } from '@/shared/ui/header'
import classNames from 'classnames'

import Sidebar from '@/app/components/sidebar/Sidebar'
import { MenuItem } from '@/app/components/sidebar/sidebarType'

import './BaseLayout.scss'

type AdminLayoutShellProps = {
  children: ReactNode
  menuItems: MenuItem[]
  isSidebarOpen: boolean
  isSupportPage: boolean
  onToggleSidebar: () => void
}

export function AdminLayoutShell({
  children,
  menuItems,
  isSidebarOpen,
  isSupportPage,
  onToggleSidebar,
}: AdminLayoutShellProps) {
  const isMobile = useMatchMedia('(max-width: 640px)')
  const { pullDistance, refreshing } = usePullToRefresh({
    enabled: isMobile,
  })

  return (
    <div className="admin-layout">
      <DocumentTitleSync />
      <Sidebar menuItems={menuItems} toggleSidebar={onToggleSidebar} isOpen={isSidebarOpen} />

      <div
        className={classNames('admin-layout__main', 'admin-layout__shell', {
          'admin-layout__shell--support': isSupportPage,
        })}
      >
        <PullToRefreshIndicator pullDistance={pullDistance} refreshing={refreshing} />
        <Header />
        <main className="admin-layout__body admin-layout__shell__body">
          <AdminPushPrompt />
          {children}
        </main>
      </div>
    </div>
  )
}
