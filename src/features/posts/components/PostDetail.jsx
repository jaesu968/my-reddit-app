import Card from 'react-bootstrap/Card'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown' // import ReactMarkdown to render markdown content in the post body
import remarkGfm from 'remark-gfm' // import remarkGfm to support GitHub Flavored Markdown features like tables, strikethrough, and task lists
import CommentList from '../../comments/components/CommentList' // import CommentList to display comments for the selected post
import {useEffect, useRef } from 'react' // import useEffect and useRef to manage scroll behavior when a new post is selected


export default function PostDetail() {
	const selectedPost = useSelector((state) => state.posts.selectedPost)
	const cardRef = useRef(null)

	// On mobile the detail panel sits below the post list, so scroll it into
	// view automatically when the user selects a new post.
	useEffect(() => {
		if(selectedPost && cardRef.current) {
			if (window.innerWidth < 992) {
				cardRef.current.scrollIntoView({ behavior: 'smooth' })
			}
		}
	}, [selectedPost])
	if (!selectedPost){
	return (
		<Card className="border-0 shadow-sm detail-card h-100" ref={cardRef}>
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
				<div className="text-body-secondary mb-0">
					{selectedPost.selftext ? (
						<ReactMarkdown remarkPlugins={[remarkGfm]}>
							{selectedPost.selftext}
						</ReactMarkdown>
					) : (
						<p className="small mb-2">
							This is a link post.{' '}
							{selectedPost.url && (
								<a href={selectedPost.url} target="_blank" rel="noopener noreferrer">
									View original link ↗
								</a>
							)}
						</p>
					)}
				</div>
				<CommentList postId={selectedPost.id} />
			</Card.Body>
		</Card>
	)
}
}
