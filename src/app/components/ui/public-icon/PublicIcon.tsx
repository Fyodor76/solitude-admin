import React from 'react'

interface PublicIconProps {
  name: string
  size?: number
  alt?: string
  className?: string
}
const PablicIcon: React.FC<PublicIconProps> = ({ name, size = 24, alt = '', className = '' }) => {
  return (
    <img
      src={`/icons/${name}.png`}
      style={{ width: size, height: size }}
      alt={alt || `${name} icon`}
      className={className}
    />
  )
}

export default PablicIcon
