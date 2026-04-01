import React from 'react'

import './icon.scss'
import { type IconName, iconSet } from './iconSet'

interface IconProps {
  name: IconName
  width?: string
  height?: string
  color?: string
  className?: string
  onClick?: () => void
}

const Icon = React.memo(
  ({ name, width, height, color = '#ffffff', className, onClick }: IconProps) => {
    console.log(`Icon ${name} rendered`) // ← добавить лог
    const icon = iconSet[name]

    const style: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: color,
      ...(width && { width }),
      ...(height && { height }),
    }
    const dynamicClass = color !== '#ffffff' ? 'icon--dynamic-color' : ''
    return (
      <span
        className={`icon ${dynamicClass} ${className || ''}`.trim()}
        style={style}
        onClick={onClick}
        role={onClick ? 'button' : 'img'}
        aria-label={name}
      >
        {icon}
      </span>
    )
  }
)
Icon.displayName = 'Icon'
export default Icon
