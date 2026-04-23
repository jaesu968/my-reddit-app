import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import { Link } from 'react-router-dom'

const exploreSections = [
  {
    title: 'Trending Posts',
    description: 'See the latest sample discussions from the posts feed.',
    to: '/posts',
    cta: 'Go to Posts',
  },
  {
    title: 'Popular Subreddits',
    description: 'Browse the communities currently highlighted in the app.',
    to: '/subreddits',
    cta: 'Go to Subreddits',
  },
]

export default function Explore() {
  return (
    <Stack gap={4} className="page-section">
      <section className="section-intro">
        <p className="page-eyebrow">Explore</p>
        <h1 className="display-6 mb-3">Discover Content</h1>
        <p className="section-lead mb-0">
          Explore is a normal route path, not a modal. Use it as a hub for posts and communities.
        </p>
      </section>

      <Row xs={1} md={2} className="g-4">
        {exploreSections.map((section) => (
          <Col key={section.to}>
            <Card className="h-100 border-0 shadow-sm feed-card">
              <Card.Body className="d-flex flex-column">
                <Card.Title as="h2" className="h5 mb-3">
                  {section.title}
                </Card.Title>
                <Card.Text className="text-body-secondary flex-grow-1">
                  {section.description}
                </Card.Text>
                <Link className="btn btn-primary" to={section.to}>
                  {section.cta}
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Stack>
  )
}
