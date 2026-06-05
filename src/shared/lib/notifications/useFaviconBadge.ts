import { useEffect } from 'react'

import { startFaviconBadgeBlink, stopFaviconBadgeBlink } from './faviconBadge'

export function useFaviconBadge(unreadCount: number): void {
  useEffect(() => {
    if (unreadCount > 0) {
      void startFaviconBadgeBlink(unreadCount).catch(error => {
        console.warn('[favicon-badge]', error)
        stopFaviconBadgeBlink()
      })
    } else {
      stopFaviconBadgeBlink()
    }

    return () => stopFaviconBadgeBlink()
  }, [unreadCount])
}
