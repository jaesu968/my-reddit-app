import Card from 'react-bootstrap/Card'
import { useComments } from '../hooks'
import Loading from '../../../shared/components/Loading'
import ErrorState from '../../../shared/components/ErrorState'
import ReactMarkdown from 'react-markdown' // import ReactMarkdown to render markdown content in the comment body
import remarkGfm from 'remark-gfm' // import remarkGfm to support GitHub Flavored Markdown features like tables, strikethrough, and task lists in comments
import rehypeRaw from 'rehype-raw' // import rehypeRaw to allow raw HTML (e.g. images) in comment bodies

export default function CommentList({ postId }) {
	const { items, status, error } = useComments(postId)

	if (!postId) return <Card>...Select a post to view comments</Card>
	if (status === 'loading') return <Loading label="Loading comments..." />
	if (status === 'failed') return <ErrorState message={error} />

	// Cap at 10 comments to keep the panel a manageable length.
	const commentItems = items.slice(0, 10).map((comment) => (
		<Card key={comment.id} className="mb-3">
			<Card.Body>
				<Card.Title className="small text-muted">{comment.author}</Card.Title>
				<div>
					{comment.body ? (
						<ReactMarkdown 
						remarkPlugins={[remarkGfm]}
						rehypePlugins={[rehypeRaw]}
						components={{ img: (props) => <img {...props} style={{ maxWidth: '100%'}} /> }}>
							{comment.body}
						</ReactMarkdown>
					) : (
						<p className="text-muted fst-italic">No content for this comment.</p>
					)}
				</div>
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
