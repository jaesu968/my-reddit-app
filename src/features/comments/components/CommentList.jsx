import Card from 'react-bootstrap/Card'
import { useComments } from '../hooks'
import Loading from '../../../shared/components/Loading'
import ErrorState from '../../../shared/components/ErrorState'

export default function CommentList({ postId }) {
	// hook call to get comments data and status
	const { items, status, error } = useComments(postId)
	// render loading state, error state, or comments list based on the status of the comments data
	if (!postId) return <Card>...Select a post to view comments</Card>
	if (status === 'loading') return <Loading message="Loading comments..." />
	if (status === 'failed') return <ErrorState message={error} />
	// render comments in a list format using Boostrap Card components
	const commentItems = items.map((comment) => (
		<Card key={comment.id} className="mb-3">
			<Card.Body>
				<Card.Title className="small text-muted">{comment.author}</Card.Title>
				<Card.Text>{comment.body}</Card.Text>
			</Card.Body>
		</Card>
	))
	return (
		<Card className="border-0 shadow-sm detail-card">
			<Card.Body>
				{commentItems.length > 0 ? commentItems : <p className="text-muted">No comments available for this post.</p>}
			</Card.Body>
		</Card>
	)
}
