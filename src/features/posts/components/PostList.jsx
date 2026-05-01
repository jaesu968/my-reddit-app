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
	// Always call hooks in the same order, then select the active dataset.
	const popularPosts = usePosts()
	const subredditPosts = usePostsBySubreddit(selectedSubreddit?.display_name)
	const { items, status, error } = selectedSubreddit && !isHomeFeed ? subredditPosts : popularPosts
	// Dispatch updates selected post when a card is clicked.
	const dispatch = useDispatch()
	// Used to apply selected styling to the active card.
	const selectedPost = useSelector((state) => state.posts.selectedPost)
	// get initital visible posts 
	const INITIAL_VISIBLE_POSTS = 8 
	const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_POSTS)

	// Normalize query once, then reuse for filtering.
	const normalizedQuery = query.trim().toLowerCase()

	// Reset visible count when query or subreddit changes — must be before any early returns.
	useEffect(() => {
		setVisibleCount(INITIAL_VISIBLE_POSTS)
	}, [normalizedQuery, selectedSubreddit?.id])

	// Save clicked post as the current selection in Redux.
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

	// Determine if we should show the "Load More" button based on whether there are more posts to display.
	const visiblePosts = filteredPosts.slice(0, visibleCount)
	const hasMorePosts = visibleCount < filteredPosts.length

	// Build list UI from filtered results.
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
