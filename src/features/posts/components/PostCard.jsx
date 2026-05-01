// PostCard component that displays individual post information in a card layout
import { useState } from 'react'
import Card from 'react-bootstrap/Card'
import CommentList from '../../comments/components/CommentList' // import CommentList to display comments for the selected post
import { useRef, useEffect } from 'react' // import useEffect and useRef to manage scroll behavior when a new post is selected

// helpers for preview url and best preview image
const decodePreviewUrl = (url = '') => url.replace(/&amp;/g, '&')
const pickBestPreviewImage = (previewImage, targetWidth = 600) => {
	if (!previewImage) return null
	const candidates = [...(previewImage.resolutions || []), previewImage.source]
		.filter(Boolean)
		.map((img) => ({
			url: decodePreviewUrl(img.url || ''),
			width: img.width,
			height: img.height,
		}))
		.filter((img) => img.url)
	if (!candidates.length) return null
	const sorted = candidates.sort((a, b) => (a.width || 0) - (b.width || 0))
	return sorted.find((img) => (img.width || 0) >= targetWidth) || sorted[sorted.length - 1]
}

export default function PostCard({ post, onSelect, isSelected, imagePriority = 'low' }) {
	const [voteDir, setVoteDir] = useState(0) // 1 = upvoted, -1 = downvoted, 0 = neutral
	const titleId = `post-title-${post.id}`
	const displayScore = post.score + voteDir // adjust score based on vote direction
	const author = post.author // author of the post, displayed in the card metadata
	const date = new Date(post.created_utc * 1000).toLocaleDateString() // formatted post date
	const numComments = post.num_comments ?? 0 // number of comments, default to 0 if undefined

	// Decode HTML entities in Reddit preview URLs (e.g. &amp; → &)
	const previewImage = post.preview?.images?.[0]
	const bestPreviewImage = pickBestPreviewImage(previewImage, 600)
	const previewWidth = bestPreviewImage?.width
	const previewHeight = bestPreviewImage?.height
	const thumbnail = post.thumbnail && !['self', 'default', 'nsfw', 'image', ''].includes(post.thumbnail)
		? decodePreviewUrl(post.thumbnail)
		: null
	const image = bestPreviewImage?.url || thumbnail

	const handleUpvote = (e) => {
		e.stopPropagation()
		setVoteDir(v => v === 1 ? 0 : 1)
	}

	const handleDownvote = (e) => {
		e.stopPropagation()
		setVoteDir(v => v === -1 ? 0 : -1)
	}
	// boolean to check for screen size to conditionally render post details on large screens , versus expanding the card on small screens when selected.
	const isMobile = window.innerWidth < 992
	// useRef to create a reference to the card element for managing scroll behavior when a post is selected on mobile devices
	const expandedRef = useRef(null)
	// useEffect to scroll to the expanded post details when a new post is selected on mobile devices,
	//  ensuring the user sees the post content without having to manually scroll.
	// check if isSelected or isMobile changes
	useEffect(() => {
		if(isSelected && isMobile) {
			// if true call expandedRef.current?.scrollIntoView 
			// add delay of 500ms to allow the card expansion animation to complete before scrolling, ensuring a smoother user experience.
			setTimeout(() => {
				expandedRef.current?.scrollIntoView({ behavior: 'smooth' })
			}, 500)
		}
	}, [isSelected, isMobile])


	return (
		<Card
			className={`border ${isSelected ? 'border-primary' : 'border-light'} shadow-sm feed-card`}
			onClick={() => onSelect()}
			style={{ cursor: 'pointer' }}
		>
			<Card.Body className="d-flex gap-3 p-3">
				{/* Vote column */}
				<div className="d-flex flex-column align-items-center gap-1" style={{ minWidth: '2rem' }}>
					<button
						onClick={handleUpvote}
						className={`btn btn-sm border-0 lh-1 ${voteDir === 1 ? 'text-danger' : 'text-muted'}`}
						style={{ minWidth: '1.75rem', minHeight: '1.75rem', padding: '0.25rem' }}
						aria-label="Upvote"
					>▲</button>
					<span className="small fw-bold" aria-label="vote score">{displayScore}</span>
					<button
						onClick={handleDownvote}
						className={`btn btn-sm border-0 lh-1 ${voteDir === -1 ? 'text-primary' : 'text-muted'}`}
						style={{ minWidth: '1.75rem', minHeight: '1.75rem', padding: '0.25rem' }}
						aria-label="Downvote"
					>▼</button>
				</div>
				{/* Content column */}
				<div className="flex-grow-1 d-flex flex-column">
					<Card.Title id={titleId} as="h2" className="h5 mb-2" style={{minWidth: 0}}>{post.title}</Card.Title>
					
					{isSelected && isMobile ? (
						<div ref={expandedRef} className="mb-3">
							{post.selftext ? (
								<p className="text-body-secondary small mb-2" style={{ whiteSpace: 'pre-wrap' }}>
									{post.selftext}
								</p>
							) : (
								<p className="text-body-secondary small mb-2">
									This is a link post.{' '}
									{post.url && (
										<a href={post.url} target="_blank" rel="noopener noreferrer">
											View original link ↗
										</a>
									)}
								</p>
							)}
							<CommentList postId={post.id} />
						</div>
					) : (
						<>
							{image && (
								<img 
									src={image}
									alt={post.title}
									width={previewWidth}
									height={previewHeight}
									className="img-fluid rounded mb-2"
									style={{ maxHeight: '200px', objectFit: 'cover'}}
									loading={imagePriority === 'high' ? 'eager' : 'lazy'}
									fetchpriority={imagePriority === 'high' ? 'high' : 'low'}
									decoding="async"
								/>
							)}
							{!image && post.selftext && (
								<p className="small text-body-secondary mb-2 text-truncate">{post.selftext}</p>
							)}
						</>
					)}
					<p className="small text-muted mb-0 mt-auto">
						Posted by u/{author} · {date} · {numComments} comments
					</p>
				</div>
			</Card.Body>
		</Card>
	)
}