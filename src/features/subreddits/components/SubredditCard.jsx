import Card from 'react-bootstrap/Card'


export default function SubredditCard({subreddit, onSelect, isSelected}) {
	// render subreddit card with name and description using Bootstrap Card component
	return (
		<Card className={`border ${isSelected ? 'border-primary' : 'border-light'} shadow-sm h-100 feed-card`}
			onClick = {() => onSelect()}
		style={{ cursor: 'pointer' }}> 
			<Card.Body className="py-2 px-3">
				<div className="d-flex justify-content-between align-items-center gap-3 mb-3">
					<Card.Title as="h3" className="h5 mb-0">
						{subreddit.display_name}
					</Card.Title>
				</div>
			</Card.Body>
		</Card>
	)
}
