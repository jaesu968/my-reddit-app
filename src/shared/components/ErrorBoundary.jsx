// Error Boundary component to catch and display errors in the UI
import React from 'react' 
import { Card } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'

export default class ErrorBoundary extends React.Component {
    // Initialize state to track if an error has occurred and store error details
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  // Static method to update state when an error is thrown
  static getDerivedStateFromError(error) {
    return { hasError: true, error } // Update state to show fallback UI
  }
 // log error details for debugging when an error is caught
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo) // Log error details for debugging
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="m-4">
          <Card.Header>Something went wrong. Try Again.</Card.Header>
          <Card.Body>
            <p>{this.state.error?.message || 'An unexpected error occurred.'}</p>
            <button className="btn btn-primary" onClick={() => this.setState({ hasError: false, error: null })}>
              Try Again
            </button>
          </Card.Body>
        </Card>
      ) // Render fallback UI with error message
    }
    return this.props.children // Render children if no error
  }
}