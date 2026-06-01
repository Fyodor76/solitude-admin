import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, TouchEventHandler } from 'react'

const SWIPE_CLOSE_THRESHOLD_PX = 72
const SWIPE_DIRECTION_LOCK_PX = 10

type UseMobileSidebarSwipeOptions = {
  enabled: boolean
  isOpen: boolean
  onClose: () => void
}

type SwipeHandlers = {
  onTouchStart: TouchEventHandler<HTMLElement>
  onTouchMove: TouchEventHandler<HTMLElement>
  onTouchEnd: TouchEventHandler<HTMLElement>
  onTouchCancel: TouchEventHandler<HTMLElement>
}

export function useMobileSidebarSwipe({ enabled, isOpen, onClose }: UseMobileSidebarSwipeOptions) {
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const dragXRef = useRef(0)
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const activeRef = useRef(false)
  const lockRef = useRef<'none' | 'horizontal' | 'vertical'>('none')

  const reset = useCallback(() => {
    dragXRef.current = 0
    setDragX(0)
    setIsDragging(false)
    activeRef.current = false
    lockRef.current = 'none'
  }, [])

  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen, reset])

  const onTouchStart = useCallback<TouchEventHandler<HTMLElement>>(
    event => {
      if (!enabled || !isOpen) {
        return
      }

      const touch = event.touches[0]
      startXRef.current = touch.clientX
      startYRef.current = touch.clientY
      activeRef.current = true
      lockRef.current = 'none'
    },
    [enabled, isOpen]
  )

  const onTouchMove = useCallback<TouchEventHandler<HTMLElement>>(
    event => {
      if (!enabled || !isOpen || !activeRef.current) {
        return
      }

      const touch = event.touches[0]
      const dx = touch.clientX - startXRef.current
      const dy = touch.clientY - startYRef.current

      if (lockRef.current === 'none') {
        if (Math.abs(dx) < SWIPE_DIRECTION_LOCK_PX && Math.abs(dy) < SWIPE_DIRECTION_LOCK_PX) {
          return
        }

        lockRef.current = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical'
      }

      if (lockRef.current === 'vertical') {
        return
      }

      const nextDragX = Math.min(0, dx)
      dragXRef.current = nextDragX
      setDragX(nextDragX)
      setIsDragging(true)
    },
    [enabled, isOpen]
  )

  const onTouchEnd = useCallback<TouchEventHandler<HTMLElement>>(() => {
    if (!enabled || !isOpen || !activeRef.current) {
      return
    }

    if (dragXRef.current <= -SWIPE_CLOSE_THRESHOLD_PX) {
      onClose()
    }

    reset()
  }, [enabled, isOpen, onClose, reset])

  const swipeHandlers: SwipeHandlers = {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel: onTouchEnd,
  }

  const swipeStyle: CSSProperties | undefined =
    enabled && isOpen && dragX < 0
      ? {
          transform: `translate3d(${dragX}px, 0, 0)`,
        }
      : undefined

  return {
    swipeHandlers,
    swipeStyle,
    isDragging,
  }
}
