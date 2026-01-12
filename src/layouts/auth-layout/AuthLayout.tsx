import { ReactNode } from 'react'

import './AuthLayout.scss'

interface AuthLayoutProps {
  children: ReactNode
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <div className="auth-container">{children}</div>
}
