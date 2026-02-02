import './Icon.scss'
import { type IconName, iconSet } from './iconSet'

interface IconProps {
  name: IconName
  width?: string
  height?: string
  color?: string
  className?: string
  onClick?: () => void
}

const Icon = ({ name, width, height, color = 'currentColor', className, onClick }: IconProps) => {
  const icon = iconSet[name]
  const style: React.CSSProperties = {
    color: color,
    ...(width && { width }),
    ...(height && { height }),
  }
  return (
    <span
      className={`icon ${className || ''}`.trim()}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : 'img'}
      aria-label={name}
    >
      {icon}
    </span>
  )
}
export default Icon
