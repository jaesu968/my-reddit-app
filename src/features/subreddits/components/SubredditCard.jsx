import Card from 'react-bootstrap/Card'


export default function SubredditCard({subreddit, onSelect, isSelected}) {
	// render subreddit card with name and description using Bootstrap Card component
	return (
		<Card className={`border ${isSelected ? 'border-primary' : 'border-light'} shadow-sm h-100 feed-card`}
			onClick = {() => onSelect()}
		style={{ cursor: 'pointer' }}> 
			<Card.Body>
				<div className="d-flex justify-content-between align-items-center gap-3 mb-3">
					<Card.Title as="h3" className="h5 mb-0">
						{subreddit.display_name}
					</Card.Title>
					<span className="badge rounded-pill text-bg-primary-subtle text-primary-emphasis">
						Community
					</span>
				</div>
				<Card.Text className="text-body-secondary mb-0">
					{subreddit.description || subreddit.public_description || 'No description available for this subreddit.'}
				</Card.Text>
			</Card.Body>
		</Card>
	)
}
