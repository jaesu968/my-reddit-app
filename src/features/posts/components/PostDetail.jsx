import Card from 'react-bootstrap/Card'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown' // import ReactMarkdown to render markdown content in the post body
import remarkGfm from 'remark-gfm' // import remarkGfm to support GitHub Flavored Markdown features like tables, strikethrough, and task lists
import CommentList from '../../comments/components/CommentList' // import CommentList to display comments for the selected post
import {useEffect, useRef } from 'react' // import useEffect and useRef to manage scroll behavior when a new post is selected


export default function PostDetail() {
	//  selectedPost lookup from the store using useSelector. This allows us to display the details of the selected post.
	const selectedPost = useSelector((state) => state.posts.selectedPost)
	// create a ref for the outer card container to manage scroll behavior when a new post is selected
	const cardRef = useRef(null)
	// when selectedPost id changes use useEffect to scroll the card into view smoothly, so that when a user clicks on a post from the list, the details card will scroll into view if it's not already visible.
	useEffect(() => {
		if(selectedPost && cardRef.current) {
			// only on small screen devices, scroll the card into view when a new post is selected, to ensure the user sees the post details without having to manually scroll.
			if (window.innerWidth < 992) {
				cardRef.current.scrollIntoView({ behavior: 'smooth' })
			}
		}
	}, [selectedPost])
	// if no post is selected, render a placeholder message prompting the user to select a post from the list.
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
					<ReactMarkdown remarkPlugins={[remarkGfm]}>
						{selectedPost.selftext || 'No additional text content for this post.'}
					</ReactMarkdown>
				</div>
				<CommentList postId={selectedPost.id} />
			</Card.Body>
		</Card>
	)
}
}
