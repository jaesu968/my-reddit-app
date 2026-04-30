import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import SubredditCard from './SubredditCard'
import { useSubreddits } from '../hooks'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedSubreddit } from '../subredditSlice'
import Loading from '../../../shared/components/Loading'
import ErrorState from '../../../shared/components/ErrorState'

// Returns true when subreddit fields match the normalized search term.
const matchesSubreddit = (subreddit, searchTerm) => {
	return (
		(subreddit.display_name || '').toLowerCase().includes(searchTerm) ||
		(subreddit.title || '').toLowerCase().includes(searchTerm) ||
		(subreddit.public_description || '').toLowerCase().includes(searchTerm)
	)
}

export default function SubredditList({ query = '', onQueryChange = () => {} }) {
	// Pull subreddit data/status from Redux through the feature hook.
	const { items, status, error } = useSubreddits()
	// Dispatch updates selected subreddit when a card is clicked.
	const dispatch = useDispatch()
	// Used to apply selected styling to the active subreddit card.
	const selectedSubreddit = useSelector((state) => state.subreddits.selectedSubreddit)

	// Save clicked subreddit as the current selection in Redux.
	const handleSelectSubreddit = (subreddit) => {
		dispatch(setSelectedSubreddit(subreddit))
	}

	// Stop rendering cards while data is loading.
	if (status === 'loading') {
		return <Loading label="Loading subreddits..." />
	}

	// Show a user-facing error state if fetch failed.
	if (status === 'failed') {
		return <ErrorState message={error} />
	}

	// Keep UI lightweight by showing a subset of communities.
	const visibleSubreddits = items.slice(0, 10)
	// Normalize query once, then reuse for filtering.
	const normalizedQuery = query.trim().toLowerCase()
	// If query is empty, keep visible list; otherwise filter by key text fields.
	const filteredSubreddits = normalizedQuery
		? visibleSubreddits.filter((subreddit) => matchesSubreddit(subreddit, normalizedQuery))
		: visibleSubreddits

	// Build list UI from filtered results.
	const subredditItems = filteredSubreddits.map((subreddit) => (
		<Col key={subreddit.id}>
			<SubredditCard
				subreddit={subreddit}
				onSelect={() => handleSelectSubreddit(subreddit)}
				isSelected={selectedSubreddit?.id === subreddit.id}
			/>
		</Col>
	))
	// Only show "no results" when the user actually typed a query.
	const hasNoResults = normalizedQuery.length > 0 && filteredSubreddits.length === 0

	return (
		<>
			{hasNoResults ? (
				<p className="text-muted mt-3">No subreddits found matching your search query.</p>
			) : (
				<Row xs={1} md={2} className="g-4">
					{subredditItems}
				</Row>
			)}
		</>
	)
}
