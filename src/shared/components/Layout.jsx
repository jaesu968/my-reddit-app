import { useState } from 'react'
import React from 'react'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import '../styles/layout.css'

export default function Layout({ children }) {
  const [query, setQuery] = useState('')

  return (
    <div className="app-shell">
      <Navbar query={query} onQueryChange={setQuery} />
      <Container as="section" fluid="lg" className="py-4 py-lg-5">
        <Row className="g-4 align-items-start">
          <Col xs={12} lg={8} xl={9}>
            <main className="content-panel">
              {typeof children === 'object' && children.type?.name === 'PostPage'
                ? React.cloneElement(children, { query, onQueryChange: setQuery })
                : children}
            </main>
          </Col>
          <Col xs={12} lg={4} xl={3}>
            <Sidebar />
          </Col>
        </Row>
      </Container>
    </div>
  )
}
