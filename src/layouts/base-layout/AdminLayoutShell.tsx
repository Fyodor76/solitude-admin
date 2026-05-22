import { ReactNode } from 'react'

import { DocumentTitleSync } from '@/shared/lib/notifications'
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
  return (
    <div className="admin-layout">
      <DocumentTitleSync />
      <Sidebar menuItems={menuItems} toggleSidebar={onToggleSidebar} isOpen={isSidebarOpen} />

      <div
        className={classNames('admin-layout__main', 'main-page', {
          'main-page--support': isSupportPage,
        })}
      >
        <Header />
        <main className="admin-layout__body main-page__body">{children}</main>
      </div>
    </div>
  )
}
