import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import { Link } from 'react-router-dom'

const homeSections = [
	{
		title: 'Posts',
		description: 'Browse a feed of sample discussions and open a post detail view.',
		to: '/posts',
		cta: 'Browse posts',
	},
]

export default function Home() {
	return (
		<Stack gap={4} className="page-section">
			<section className="section-intro">
				<p className="page-eyebrow">Overview</p>
				<h1 className="display-5 mb-3">Welcome to Reddit Mini</h1>
				<p className="section-lead mb-0">
					Use Home as your posts entry point while subreddit discovery stays in the right sidebar.
				</p>
			</section>

			<Row xs={1} className="g-4">
				{homeSections.map((section) => (
					<Col key={section.to}>
						<Card className="h-100 shadow-sm border-0">
							<Card.Body className="d-flex flex-column">
								<Card.Title as="h2" className="h4 mb-3">
									{section.title}
								</Card.Title>
								<Card.Text className="text-body-secondary flex-grow-1">
									{section.description}
								</Card.Text>
								<Button as={Link} to={section.to} variant="primary">
									{section.cta}
								</Button>
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row>
		</Stack>
	)
}
