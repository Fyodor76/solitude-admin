import { useEffect, useRef, useState } from 'react'

const PULL_THRESHOLD_PX = 72
const MAX_PULL_PX = 96

function getScrollTop(): number {
  const root = document.scrollingElement ?? document.documentElement
  return root.scrollTop
}

type PullToRefreshOptions = {
  enabled?: boolean
  onRefresh?: () => void | Promise<void>
}

/** Pull-to-refresh на mobile: потянуть страницу вниз у верхнего края. */
export function usePullToRefresh({ enabled = true, onRefresh }: PullToRefreshOptions = {}) {
  const [pullDistance, setPullDistance] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startYRef = useRef(0)
  const pullingRef = useRef(false)
  const pullDistanceRef = useRef(0)

  useEffect(() => {
    if (!enabled || refreshing) {
      return
    }

    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
    if (!isCoarsePointer) {
      return
    }

    const handleTouchStart = (event: TouchEvent) => {
      if (getScrollTop() > 0 || event.touches.length !== 1) {
        pullingRef.current = false
        return
      }

      startYRef.current = event.touches[0].clientY
      pullingRef.current = true
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!pullingRef.current || event.touches.length !== 1) {
        return
      }

      const distance = Math.max(0, event.touches[0].clientY - startYRef.current)
      if (distance <= 0) {
        setPullDistance(0)
        return
      }

      const nextDistance = Math.min(distance, MAX_PULL_PX)
      pullDistanceRef.current = nextDistance
      setPullDistance(nextDistance)

      if (distance > 8 && event.cancelable) {
        event.preventDefault()
      }
    }

    const finishPull = async () => {
      if (!pullingRef.current) {
        return
      }

      pullingRef.current = false
      const distance = pullDistanceRef.current
      const shouldRefresh = distance >= PULL_THRESHOLD_PX

      if (!shouldRefresh) {
        pullDistanceRef.current = 0
        setPullDistance(0)
        return
      }

      setRefreshing(true)
      setPullDistance(PULL_THRESHOLD_PX)

      try {
        if (onRefresh) {
          await onRefresh()
        } else {
          window.location.reload()
        }
      } finally {
        setRefreshing(false)
        pullDistanceRef.current = 0
        setPullDistance(0)
      }
    }

    const handleTouchEnd = () => {
      void finishPull()
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    document.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [enabled, onRefresh, refreshing])

  return {
    pullDistance,
    refreshing,
    isActive: pullDistance > 0 || refreshing,
  }
}
