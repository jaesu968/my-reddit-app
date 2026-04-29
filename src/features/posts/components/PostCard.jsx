// PostCard component that displays individual post information in a card layout
import { useState } from 'react'
import Card from 'react-bootstrap/Card'

export default function PostCard({ post, onSelect, isSelected }) {
	const [voteDir, setVoteDir] = useState(0) // 1 = upvoted, -1 = downvoted, 0 = neutral
	const displayScore = post.score + voteDir // adjust score based on vote direction
	const author = post.author // author of the post, displayed in the card metadata
	const date = new Date(post.created_utc * 1000).toLocaleDateString() // formatted post date
	const numComments = post.num_comments ?? 0 // number of comments, default to 0 if undefined

	// Decode HTML entities in Reddit preview URLs (e.g. &amp; → &)
	const previewImage = post.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, '&')
	const thumbnail = post.thumbnail && !['self', 'default', 'nsfw', 'image', ''].includes(post.thumbnail)
		? post.thumbnail
		: null
	const image = previewImage || thumbnail

	const handleUpvote = (e) => {
		e.stopPropagation()
		setVoteDir(v => v === 1 ? 0 : 1)
	}

	const handleDownvote = (e) => {
		e.stopPropagation()
		setVoteDir(v => v === -1 ? 0 : -1)
	}

	return (
		<Card
			className={`border ${isSelected ? 'border-primary' : 'border-light'} shadow-sm feed-card`}
			onClick={() => onSelect()}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === 'Enter') onSelect()
				if (e.key === ' ') { e.preventDefault(); onSelect() }
			}}
			aria-label={`Select post: ${post.title}`}
			aria-pressed={isSelected}
		>
			<Card.Body className="d-flex gap-3 p-3">
				{/* Vote column */}
				<div className="d-flex flex-column align-items-center gap-1" style={{ minWidth: '2rem' }}>
					<button
						onClick={handleUpvote}
						className={`btn btn-sm p-0 border-0 lh-1 ${voteDir === 1 ? 'text-danger' : 'text-muted'}`}
						aria-label="Upvote"
					>▲</button>
					<span className="small fw-bold" aria-label="vote score">{displayScore}</span>
					<button
						onClick={handleDownvote}
						className={`btn btn-sm p-0 border-0 lh-1 ${voteDir === -1 ? 'text-primary' : 'text-muted'}`}
						aria-label="Downvote"
					>▼</button>
				</div>
				{/* Content column */}
				<div className="flex-grow-1 d-flex flex-column">
					<Card.Title as="h3" className="h5 mb-2">{post.title}</Card.Title>
					{image && (
						<img
							src={image}
							alt={post.title}
							className="img-fluid rounded mb-2"
							style={{ maxHeight: '200px', objectFit: 'cover' }}
						/>
					)}
					{!image && post.selftext && (
						<p className="small text-body-secondary mb-2 text-truncate">{post.selftext}</p>
					)}
					<p className="small text-muted mb-0 mt-auto">
						Posted by u/{author} · {date} · {numComments} comments
					</p>
				</div>
			</Card.Body>
		</Card>
	)
}