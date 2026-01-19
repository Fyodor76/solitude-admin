import * as React from 'react'
import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}
interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    }
  }

  componentDidCatch(error: Error) {
    console.log('ErrorBoundary поймал ошибку:')
    console.log('Сообщение:', error.message)
  }
  render(): ReactNode {
    if (this.state.hasError) {
      return <div></div>
    }
    return this.props.children
  }
}
export default ErrorBoundary
