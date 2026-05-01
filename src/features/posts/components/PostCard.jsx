import { useState } from 'react'
import Card from 'react-bootstrap/Card'
import CommentList from '../../comments/components/CommentList'
import { useRef, useEffect } from 'react'

// Reddit encodes preview URLs with HTML entities (e.g. &amp; instead of &).
// decodePreviewUrl fixes those so the browser can actually load the image.
const decodePreviewUrl = (url = '') => url.replace(/&amp;/g, '&')

// Reddit provides multiple resolution variants for each preview image.
// This picks the smallest one that meets the target width to avoid loading
// oversized images. Falls back to the largest available if none are wide enough.
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

// imagePriority: 'high' for the first card in the feed (above the fold), 'low' for all others.
// This maps to fetchpriority and loading attributes on the preview image.
export default function PostCard({ post, onSelect, isSelected, imagePriority = 'low' }) {
	// voteDir tracks the user's local vote: 1 = upvoted, -1 = downvoted, 0 = neutral.
	// Votes are client-side only — not persisted to Reddit's API.
	const [voteDir, setVoteDir] = useState(0)
	const titleId = `post-title-${post.id}`
	const displayScore = post.score + voteDir
	const author = post.author
	const date = new Date(post.created_utc * 1000).toLocaleDateString()
	const numComments = post.num_comments ?? 0

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
	// On mobile (<992px) selecting a post expands inline inside the card instead of
	// showing a separate detail panel. 992px matches Bootstrap's lg breakpoint.
	const isMobile = window.innerWidth < 992
	const expandedRef = useRef(null)

	// When the card expands on mobile, scroll it into view after a short delay
	// so the animation has time to complete before the scroll fires.
	useEffect(() => {
		if(isSelected && isMobile) {
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