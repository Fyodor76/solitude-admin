import { useEffect } from 'react'

import { Button, ButtonProps } from 'antd'

interface CustomButtonProps extends ButtonProps {
  keyDown?: boolean
  onClick: () => void
}

export const CustomButton = ({ onClick, ...props }: CustomButtonProps) => {
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Enter') {
        onClick()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClick])

  return <Button onClick={onClick} {...props} />
}
