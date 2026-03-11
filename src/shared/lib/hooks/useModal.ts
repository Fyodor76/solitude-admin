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
    console.log('1️⃣ onOpen вызван с content:', newContent)
    console.log('2️⃣ Текущий content ДО:', content)
    requestAnimationFrame(() => {
      console.log('3️⃣ requestAnimationFrame выполняется')
      console.log('4️⃣ Устанавливаем content:', newContent ?? null)
      setContent(newContent ?? null)
      setIsOpen(true)
      console.log('5️⃣ После setContent, новое значение будет в следующем рендере')
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
