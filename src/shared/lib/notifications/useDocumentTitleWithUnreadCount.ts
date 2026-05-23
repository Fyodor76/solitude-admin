import { useEffect } from 'react'

import { buildDocumentTitle, getRouteDocumentLabel } from './documentTitle'

export function useDocumentTitleWithUnreadCount(pathname: string): void {
  useEffect(() => {
    const pageLabel = getRouteDocumentLabel(pathname)
    document.title = buildDocumentTitle(pageLabel)
  }, [pathname])
}
