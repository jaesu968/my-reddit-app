import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { NavLink } from 'react-router-dom'

export default function AppNavbar() {
  return (
    <Navbar bg="light" expand="lg" className="border-bottom shadow-sm sticky-top">
      <Container fluid="lg">
        <Navbar.Brand as={NavLink} to="/" className="fw-semibold text-dark">
          Reddit Mini
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="primary-navbar-nav" />
        <Navbar.Collapse id="primary-navbar-nav">
          <Nav className="ms-auto gap-lg-2">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/posts">
              Posts
            </Nav.Link>
            <Nav.Link as={NavLink} to="/subreddits">
              Subreddits
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
