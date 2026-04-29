// PostCard component that displays individual post information in a card layout
import Card from 'react-bootstrap/Card'

export default function PostCard({ post, onSelect, isSelected }) {
	// extract score/author/date from the post object and display them in the card body
	const score = post.score
	const author = post.author
	const date = new Date(post.created_utc * 1000).toLocaleDateString() // convert UTC timestamp to local date string

	return (
		<Card className={`border ${isSelected ? 'border-primary' : 'border-light'} shadow-sm h-100 feed-card`} 
		onClick={() => onSelect()}
		role="button" 
		tabIndex={0}
		onKeyDown={(e) => { 
			if (e.key === 'Enter') onSelect() 
			if (e.key === ' ') {e.preventDefault(); onSelect()}
		}}
		aria-label={`Select post: ${post.title}`}
		aria-pressed={isSelected}>
			<Card.Body>
				<div className="d-flex justify-content-between align-items-start gap-3 mb-2">
					<div>
						<p className="text-uppercase small fw-semibold text-muted mb-2">Featured Post</p>
						<Card.Title as="h3" className="h5 mb-2">
							{post.title}
						</Card.Title>
					</div>
					<span className="badge rounded-pill text-bg-light">Hot</span>
				</div>
				<Card.Text className="small text-body-secondary mb-0">
					By {author} on {date} | Score: {score}
				</Card.Text>
			</Card.Body>
		</Card>
	)
}