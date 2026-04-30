import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import '../styles/layout.css'
import ErrorBoundary from './ErrorBoundary'


export default function Layout({ children, query = '', onQueryChange = () => {} }) {

  return (
    <div className="app-shell">
      <Navbar query={query} onQueryChange={onQueryChange} />
      <Container as="section" fluid="lg" className="py-4 py-lg-5">
        {/* Wrap main content in an error boundary to catch rendering errors and display a fallback UI instead of breaking the entire app. */}
        <Row className="g-4 align-items-start">
          <Col xs={12} lg={8} xl={9}>
            <main className="content-panel">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
          </Col>
          <Col xs={12} lg={4} xl={3}>
          <ErrorBoundary>
            <Sidebar {...{ query, onQueryChange }} />
            </ErrorBoundary>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
