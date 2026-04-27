import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import SubredditCard from './SubredditCard'
import { useSubreddits } from '../hooks'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedSubreddit } from '../subredditSlice'
import Loading from '../../../shared/components/Loading'
import ErrorState from '../../../shared/components/ErrorState'

export default function SubredditList() {
	// hook call to get subreddits data and status 
	const { items, status, error } = useSubreddits()
	const dispatch = useDispatch() // get dispatch function to update selected subreddit in the store
	// handler and selector logic 
	const handleSelectSubreddit = (subreddit) => {
		dispatch(setSelectedSubreddit(subreddit)) // update selected subreddit in the store
	}
	const selectedSubreddit = useSelector((state) => state.subreddits.selectedSubreddit) // get selected subreddit from the store
	// render loading state if subreddits are loading 
	if (status === 'loading') {
		return <Loading label="Loading subreddits..." />
	} else if (status === 'failed') { // render error state if there was an error fetching subreddits
		return <ErrorState message={error} />
	}
	// render subreddits in a grid layout using Bootstrap components
	const visibleSubreddits = items.slice(0, 10) // limit to first 10 subreddits for display
	return (
		<Row xs={1} md={2} className="g-4">
			{visibleSubreddits.map((subreddit) => (
				<Col key={subreddit.id}>
					<SubredditCard
						subreddit={subreddit}
						onSelect={() => handleSelectSubreddit(subreddit)}
						isSelected={selectedSubreddit?.id === subreddit.id}
					/>
				</Col>
			))}
		</Row>
	)
}
