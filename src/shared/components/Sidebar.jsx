import Card from 'react-bootstrap/Card'
import Stack from 'react-bootstrap/Stack'
import { Link } from 'react-router-dom'
import SubredditList from '../../features/subreddits/components/SubredditList'

// render the subreddit list in the sidebar, with a header and when you click on a subreddit, 
// it loads the subreddit posts in the main feed. 


export default function Sidebar() {
  return (
    <aside>
      <Stack gap={3} className="sidebar-card">
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
          <Card.Title as="h2" className="h4 mb-0">
            Subreddits
          </Card.Title>
          <Link to="/subreddits" className="btn btn-sm btn-outline-primary">
            View All
          </Link>
        </div>
        <SubredditList className="border-0 shadow-sm feed-card" />
      </Stack>
    </aside>
  )
}
