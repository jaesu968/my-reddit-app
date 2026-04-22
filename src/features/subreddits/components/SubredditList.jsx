import SubredditCard from './SubredditCard'

const sampleSubreddits = ['r/reactjs', 'r/javascript', 'r/webdev']

export default function SubredditList() {
	return (
		<ul>
			{sampleSubreddits.map((subreddit) => (
				<SubredditCard key={subreddit} name={subreddit} />
			))}
		</ul>
	)
}
