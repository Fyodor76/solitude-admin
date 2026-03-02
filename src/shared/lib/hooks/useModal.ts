'use client'

import { useCallback, useState } from 'react'

interface UseModalReturn<T = any> {
  isOpen: boolean
  content: T | null
  onOpen: (content?: T) => void
  onClose: () => void
  onToggle: (content?: T) => void
}

export function useModal<T = any>(initialState = false): UseModalReturn<T> {
  const [isOpen, setIsOpen] = useState(initialState)
  const [content, setContent] = useState<T | null>(null)

  const onOpen = useCallback((newContent?: T) => {
    requestAnimationFrame(() => {
      setContent(newContent ?? null)
      setIsOpen(true)
    })
  }, [])

  const onClose = useCallback(() => {
    setIsOpen(false)
    setContent(null)
  }, [])

  const onToggle = useCallback((newContent?: T) => {
    setIsOpen(prev => !prev)
    if (newContent !== undefined) setContent(newContent)
  }, [])

  return {
    isOpen,
    content,
    onOpen,
    onClose,
    onToggle,
  }
}
