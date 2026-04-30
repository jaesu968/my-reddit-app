import Container from 'react-bootstrap/Container'
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
            placeholder="Search posts and subreddits..."
            ariaLabel="Search posts and subreddits"
            showButton={false}
          />
        </div>
      </Container>
    </Navbar>
  )
}
