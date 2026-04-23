import Card from 'react-bootstrap/Card'
import Placeholder from 'react-bootstrap/Placeholder'

export default function PostCard({ title }) {
	return (
		<Card className="border-0 shadow-sm h-100 feed-card">
			<Card.Body>
				<div className="d-flex justify-content-between align-items-start gap-3 mb-2">
					<div>
						<p className="text-uppercase small fw-semibold text-muted mb-2">Featured Post</p>
						<Card.Title as="h3" className="h5 mb-2">
							{title}
						</Card.Title>
					</div>
					<span className="badge rounded-pill text-bg-light">Hot</span>
				</div>
				<Card.Text className="text-body-secondary mb-3">
					<Placeholder as="span" animation="glow">
						<Placeholder xs={12} />
					</Placeholder>
				</Card.Text>
				<Card.Text className="small text-body-secondary mb-0">
					Quick preview cards keep the post feed aligned with the rest of the app shell.
				</Card.Text>
			</Card.Body>
		</Card>
	)
}
