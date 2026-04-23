import Card from 'react-bootstrap/Card'

export default function CommentList() {
	return (
		<Card className="border-0 shadow-sm detail-card">
			<Card.Body>
				<p className="text-uppercase small fw-semibold text-muted mb-2">Comments</p>
				<Card.Text className="text-body-secondary mb-0">
					Comments will render here once the post detail flow is connected.
				</Card.Text>
			</Card.Body>
		</Card>
	)
}
