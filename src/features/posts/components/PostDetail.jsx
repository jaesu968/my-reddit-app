import Card from 'react-bootstrap/Card'

export default function PostDetail() {
	return (
		<Card className="border-0 shadow-sm detail-card h-100">
			<Card.Body>
				<p className="text-uppercase small fw-semibold text-muted mb-2">Post Detail</p>
				<Card.Title as="h2" className="h4 mb-3">
					Select a post to view details
				</Card.Title>
				<Card.Text className="text-body-secondary mb-0">
					This placeholder keeps the page structure stable until the selected post flow is wired.
				</Card.Text>
			</Card.Body>
		</Card>
	)
}
