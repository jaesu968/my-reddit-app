import Card from 'react-bootstrap/Card'

export default function SubredditCard({ name }) {
	return (
		<Card className="border-0 shadow-sm h-100 feed-card">
			<Card.Body>
				<div className="d-flex justify-content-between align-items-center gap-3 mb-3">
					<Card.Title as="h3" className="h5 mb-0">
						{name}
					</Card.Title>
					<span className="badge rounded-pill text-bg-primary-subtle text-primary-emphasis">
						Community
					</span>
				</div>
				<Card.Text className="text-body-secondary mb-0">
					Discover active threads, quick summaries, and a cleaner browsing surface.
				</Card.Text>
			</Card.Body>
		</Card>
	)
}
