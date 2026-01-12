import { ReactNode } from 'react'

import classNames from 'classnames'

import './Card.scss'

interface CardType {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className }: CardType) => {
  return <div className={classNames('container', className)}>{children}</div>
}
