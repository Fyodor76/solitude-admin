import { ReactNode } from 'react'

import './PageHeader.scss'

interface PageHeaderProps {
  title: string
  subtitle?: ReactNode
  actions?: ReactNode
}

export const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => {
  return (
    <section className="page-header">
      <div className="page-header__content">
        <h1 className="page-header__title">{title}</h1>
        {subtitle ? <div className="page-header__subtitle">{subtitle}</div> : null}
      </div>

      {actions ? <div className="page-header__actions">{actions}</div> : null}
    </section>
  )
}
