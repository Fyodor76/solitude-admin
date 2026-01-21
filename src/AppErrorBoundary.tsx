import React, { Component, ReactNode } from 'react'

import './errorBoundary.scss'

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
      return (
        <div className="error-wrapper">
          <div className="error-container">
            <div className="error-main">
              <h2 className="error-main-h2">OOPS!</h2>
              <p>YOU LOST IN SPACE</p>
              <button
                className="error-main-button"
                onClick={() => {
                  this.setState({ hasError: false })
                }}
              >
                GO HOME
              </button>
            </div>
            <div className="error-image"></div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
export default ErrorBoundary
