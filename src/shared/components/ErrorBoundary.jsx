// Class component required — React error boundaries must use componentDidCatch,
// which is only available on class components (no hook equivalent exists).
import React from 'react'
import { Card } from 'react-bootstrap'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  // Called during render when a descendant throws. Return value merges into state.
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  // Called after render with the error and component stack. Used for logging.
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="m-4">
          <Card.Header>Something went wrong.</Card.Header>
          <Card.Body>
            <p>{this.state.error?.message || 'An unexpected error occurred.'}</p>
            {/* Resets error state so the subtree re-mounts and attempts to render again. */}
            <button className="btn btn-outline-secondary" onClick={() => this.setState({ hasError: false, error: null })}>
              Try Again
            </button>
          </Card.Body>
        </Card>
      )
    }
    return this.props.children
  }
}