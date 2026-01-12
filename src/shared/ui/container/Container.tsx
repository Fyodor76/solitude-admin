import { ReactNode } from 'react'

import cn from 'classnames'

import './Container.scss'

interface ContainerProps {
  children: ReactNode
  'full-width'?: boolean
  'full-height'?: boolean
  'full-screen'?: boolean
  'no-padding'?: boolean
  as?: React.ElementType
  className?: string
}

const Container: React.FC<ContainerProps> = ({
  children,
  'full-width': fullWidth = false,
  'full-height': fullHeight = false,
  'full-screen': fullScreen = false,
  'no-padding': noPadding = false,
  as: Component = 'div',
  className = '',
  ...props
}) => {
  const containerClasses = cn(
    'container',
    {
      'container--full-width': fullWidth,
      'container--full-height': fullHeight,
      'container--full-screen': fullScreen,
      'container--no-padding': noPadding,
    },
    className
  )
  return (
    <Component className={containerClasses} {...props}>
      {children}
    </Component>
  )
}

export default Container
