import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import PostCard from './PostCard'
import { usePosts } from '../hooks'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedPost } from '../postSlice'
import Loading from '../../../shared/components/Loading'
import ErrorState from '../../../shared/components/ErrorState'
import SearchBar from '../../../shared/components/SearchBar'
import { useState } from 'react'

// Returns true when a post matches the normalized search term.
const matchesPost = (post, searchTerm) => {
	return (
		(post.title || '').toLowerCase().includes(searchTerm) ||
		(post.selftext || '').toLowerCase().includes(searchTerm) ||
		(post.author || '').toLowerCase().includes(searchTerm) ||
		(post.subreddit_name_prefixed || '').toLowerCase().includes(searchTerm)
	)
}

export default function PostList() {
	// Pull post data/status from Redux through the feature hook.
	const { items, status, error } = usePosts()
	// Dispatch updates selected post when a card is clicked.
	const dispatch = useDispatch()
	// Used to apply selected styling to the active card.
	const selectedPost = useSelector((state) => state.posts.selectedPost)
	// Local search text for client-side filtering.
	const [query, setQuery] = useState('')

	// Keep form submit from triggering a page refresh.
	const handleSearchSubmit = (e) => {
		e.preventDefault()
	}

	// Reset the search input to show all posts again.
	const handleClearSearch = () => {
		setQuery('')
	}

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

	// Normalize query once, then reuse for filtering.
	const normalizedQuery = query.trim().toLowerCase()
	// If query is empty, keep the original list; otherwise filter by text fields.
	const filteredPosts = normalizedQuery
		? items.filter((post) => matchesPost(post, normalizedQuery))
		: items

	// Build list UI from filtered results.
	const postItems = filteredPosts.map((post) => (
		<Col key={post.id}>
			<PostCard post={post} onSelect={() => handleSelectPost(post)} isSelected={selectedPost?.id === post.id} />
		</Col>
	))
	// Only show "no results" when the user actually typed a query.
	const hasNoResults = normalizedQuery.length > 0 && filteredPosts.length === 0

	return (
		<>
			<SearchBar
				value={query}
				onChange={setQuery}
				onSubmit={handleSearchSubmit}
				onClear={handleClearSearch}
				placeholder="Search posts..."
				ariaLabel="Search posts"
				isLoading={status === 'loading'}
			/>
			{hasNoResults ? (
				<p className="text-muted mt-3">No posts found matching your search query.</p>
			) : (
				<Row xs={1} className="g-4">
					{postItems}
				</Row>
			)}
		</>
	)
}
