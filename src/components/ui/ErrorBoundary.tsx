import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled render error:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-semibold text-ink mb-3">
          Something went wrong
        </h1>
        <p className="text-ink-muted mb-6">
          The page failed to load. Try reloading, or head back to the start.
        </p>
        <a
          href={import.meta.env.BASE_URL}
          className="text-primary hover:underline underline-offset-2 font-medium underline underline-offset-2"
        >
          Back to home
        </a>
      </div>
    )
  }
}

export default ErrorBoundary
