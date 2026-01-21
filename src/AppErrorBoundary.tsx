import React, { Component, ReactNode } from 'react'

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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2>Что то пошло не так ...</h2>
          <button
            onClick={() => {
              this.setState({ hasError: false })
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Попробовать снова
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
export default ErrorBoundary
