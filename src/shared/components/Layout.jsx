import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import '../styles/layout.css'


export default function Layout({ children, query = '', onQueryChange = () => {} }) {

  return (
    <div className="app-shell">
      <Navbar query={query} onQueryChange={onQueryChange} />
      <Container as="section" fluid="lg" className="py-4 py-lg-5">
        <Row className="g-4 align-items-start">
          <Col xs={12} lg={8} xl={9}>
            <main className="content-panel">
              {children}
            </main>
          </Col>
          <Col xs={12} lg={4} xl={3}>
            <Sidebar {...{ query, onQueryChange }} />
          </Col>
        </Row>
      </Container>
    </div>
  )
}
