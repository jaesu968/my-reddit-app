import Card from 'react-bootstrap/Card'
import { useSelector } from 'react-redux'


export default function PostDetail() {
	//  selectedPost lookup from the store using useSelector, based on the postId prop passed from the PostPage component. This allows us to display the details of the selected post.
	const selectedPost = useSelector((state) => state.posts.selectedPost)
	// if no post is selected, render a placeholder message prompting the user to select a post from the list.

	if (!selectedPost){
	return (
		<Card className="border-0 shadow-sm detail-card h-100">
			<Card.Body>
				<p className="text-uppercase small fw-semibold text-muted mb-2">Post Detail</p>
				<Card.Title as="h2" className="h4 mb-3">
					Select a post to view details
				</Card.Title>
				<Card.Text className="text-body-secondary mb-0">
					This is where the post details will be displayed once you select a post from the list. You can see the title, author, date, score, and the body of the post here.
				</Card.Text>
			</Card.Body>
		</Card>
	)
} else {
	return (
		<Card className="border-0 shadow-sm detail-card h-100">
			<Card.Body>
				<Card.Title as="h2" className="h4 mb-3">
					{selectedPost.title}
				</Card.Title>
				{/* Render author, date, score, and post text here */}
				<Card.Text className="small text-body-secondary mb-2">
					By {selectedPost.author} on {new Date(selectedPost.created_utc * 1000).toLocaleDateString()} | Score: {selectedPost.score}
				</Card.Text>
				<Card.Text className="text-body-secondary mb-0">
					{selectedPost.selftext || 'No additional text content for this post.'}
				</Card.Text>
			</Card.Body>
		</Card>
	)
}
}
