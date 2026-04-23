import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside>
      <Card className="shadow-sm border-0 sidebar-card">
        <Card.Body>
          <Card.Title as="h3" className="fs-5 mb-3">
            Explore
          </Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item className="px-0">
              <Link className="text-decoration-none fw-medium" to="/posts">
                Trending Posts
              </Link>
            </ListGroup.Item>
            <ListGroup.Item className="px-0">
              <Link className="text-decoration-none fw-medium" to="/subreddits">
                Popular Subreddits
              </Link>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </aside>
  )
}
