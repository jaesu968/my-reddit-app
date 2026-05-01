import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import PostCard from './PostCard'
import { usePosts, usePostsBySubreddit } from '../hooks'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedPost } from '../postSlice'
import Loading from '../../../shared/components/Loading'
import ErrorState from '../../../shared/components/ErrorState'
import { useEffect, useState } from 'react'

// Returns true when a post matches the normalized search term.
const matchesPost = (post, searchTerm) => {
	return (
		(post.title || '').toLowerCase().includes(searchTerm) ||
		(post.selftext || '').toLowerCase().includes(searchTerm) ||
		(post.author || '').toLowerCase().includes(searchTerm) ||
		(post.subreddit_name_prefixed || '').toLowerCase().includes(searchTerm)
	)
}

export default function PostList({ query = '' }) {
	const selectedSubreddit = useSelector((state) => state.subreddits.selectedSubreddit)
	const selectedName = (selectedSubreddit?.display_name || '').trim().toLowerCase()
	const selectedUrl = (selectedSubreddit?.url || '').trim()
	// Reddit's "Home" entry is a special feed, not a real /r/<name> subreddit endpoint.
	const isHomeFeed = selectedName === 'home' || selectedUrl === '/'
	// Both hooks are always called regardless of which feed is active.
	// React requires hooks to be called unconditionally — the active data
	// is chosen afterwards based on the current subreddit selection.
	const popularPosts = usePosts()
	const subredditPosts = usePostsBySubreddit(selectedSubreddit?.display_name)
	const { items, status, error } = selectedSubreddit && !isHomeFeed ? subredditPosts : popularPosts
	const dispatch = useDispatch()
	const selectedPost = useSelector((state) => state.posts.selectedPost)

	// Render posts in pages of 8 to limit initial DOM size and improve load performance.
	const INITIAL_VISIBLE_POSTS = 8
	const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_POSTS)

	// Normalize query once, then reuse for filtering.
	const normalizedQuery = query.trim().toLowerCase()

	// Reset to the first page whenever the user changes the search query or switches subreddit.
	// This hook must stay above the early returns below to avoid a hooks-order violation (React error #300).
	useEffect(() => {
		setVisibleCount(INITIAL_VISIBLE_POSTS)
	}, [normalizedQuery, selectedSubreddit?.id])

	const handleSelectPost = (post) => {
		dispatch(setSelectedPost(post))
	}

	// Stop rendering the list while data is loading.
	if (status === 'loading') {
		return <Loading label="Loading posts..." />
	}

	// Show a user-facing error state if fetch failed.
	if (status === 'failed') {
		return <ErrorState message={error} />
	}

	// If query is empty, keep the original list; otherwise filter by text fields.
	const filteredPosts = normalizedQuery
		? items.filter((post) => matchesPost(post, normalizedQuery))
		: items

	const visiblePosts = filteredPosts.slice(0, visibleCount)
	const hasMorePosts = visibleCount < filteredPosts.length

	// The first card gets high fetch priority so the browser loads its image early (LCP optimisation).
	const postItems = visiblePosts.map((post, index) => (
		<Col key={post.id}>
			<PostCard 
			post={post} 
			onSelect={() => handleSelectPost(post)} 
			isSelected={selectedPost?.id === post.id}
			imagePriority={index === 0 ? 'high' : 'low'} />
		</Col>
	))
	// Only show "no results" when the user actually typed a query.
	const hasNoResults = normalizedQuery.length > 0 && filteredPosts.length === 0

	return (
		<>
		{hasNoResults ? (
			<p className="text-muted mt-3">No posts found matching your search query.</p>
		) : (
			<Row xs={1} className="g-4">
				{postItems}
			</Row>
		)}
		{hasMorePosts && (
			<div className="d-flex justify-content-center mt-3">
				<button 
					type="button"
					className="btn btn-outline-primary"
					onClick={() => setVisibleCount((c) => c + INITIAL_VISIBLE_POSTS)}
				>
					Load more posts
				</button>
			</div>
		)}
		</>
	)
}
