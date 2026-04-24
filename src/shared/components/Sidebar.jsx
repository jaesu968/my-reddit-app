import Card from 'react-bootstrap/Card'
import Stack from 'react-bootstrap/Stack'
import { Link } from 'react-router-dom'

const sidebarSubreddits = ['r/reactjs', 'r/javascript', 'r/webdev']

export default function Sidebar() {
  return (
    <aside>
      <Stack gap={3} className="sidebar-card">
        <Card className="border-0 shadow-sm feed-card">
          <Card.Body>
            <p className="text-uppercase small fw-semibold text-muted mb-2">Explore</p>
            <Card.Title as="h3" className="h5 mb-2">
              Popular Subreddits
            </Card.Title>
            <Card.Text className="small text-body-secondary mb-0">
              Quick links to community sections, styled to match post cards.
            </Card.Text>
          </Card.Body>
        </Card>

        {sidebarSubreddits.map((subreddit) => (
          <Card key={subreddit} className="border-0 shadow-sm feed-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
                <Card.Title as="h4" className="h6 mb-0">
                  {subreddit}
                </Card.Title>
                <span className="badge rounded-pill text-bg-light">Hot</span>
              </div>
              <Card.Text className="small text-body-secondary mb-3">
                Check trending posts in this subreddit feed.
              </Card.Text>
              <Link className="btn btn-outline-primary btn-sm" to="/explore">
                Open Explore
              </Link>
            </Card.Body>
          </Card>
        ))}

        <Card className="border-0 shadow-sm feed-card">
          <Card.Body>
            <Card.Title as="h4" className="h6 mb-2">
              Looking for posts?
            </Card.Title>
            <Link className="btn btn-primary btn-sm" to="/posts">
              Browse Posts
            </Link>
          </Card.Body>
        </Card>
      </Stack>
    </aside>
  )
}
