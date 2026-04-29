import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { NavLink } from 'react-router-dom'
import RedditLogo from '../../assets/Logo3.png'
import SearchBar from './SearchBar'

export default function AppNavbar({ query = '', onQueryChange = () => {} }) {

  return (
    <Navbar bg="light" expand="lg" className="border-bottom shadow-sm sticky-top">
      <Container fluid="lg">
        <Navbar.Brand as={NavLink} to="/" className="fw-semibold text-dark d-inline-flex align-items-center gap-2">
          <img src={RedditLogo} alt="Reddit Logo" width="60" height="60" className="d-block" />
		  <span className="brand-title">
			<span className="brand-reddit">Reddit</span>Mini
		  </span>
        </Navbar.Brand>
        <div className="flex-grow-1 mx-3" style={{ maxWidth: '300px' }}>
          <SearchBar
            value={query}
            onChange={onQueryChange}
            onSubmit={(e) => e.preventDefault()}
            placeholder="Search posts..."
            ariaLabel="Search posts"
            showButton={false}
          />
        </div>
        <Navbar.Toggle aria-controls="primary-navbar-nav" />
        <Navbar.Collapse id="primary-navbar-nav">
          <Nav className="ms-auto gap-lg-2">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/posts">
              Posts
            </Nav.Link>
			<Nav.Link as={NavLink} to="/explore">
              Explore
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
