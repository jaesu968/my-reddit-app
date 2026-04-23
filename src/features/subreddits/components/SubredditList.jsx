import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import SubredditCard from './SubredditCard'

const sampleSubreddits = ['r/reactjs', 'r/javascript', 'r/webdev', 'r/frontend']

export default function SubredditList() {
	return (
		<Row xs={1} md={2} className="g-4">
			{sampleSubreddits.map((subreddit) => (
				<Col key={subreddit}>
					<SubredditCard name={subreddit} />
				</Col>
			))}
		</Row>
	)
}
