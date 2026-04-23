import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import PostCard from './PostCard'

const samplePosts = [
	'AskReddit: What are you building?',
	'React: Tips for clean architecture',
	'Frontend: Share your favorite Bootstrap layout tricks',
]

export default function PostList() {
	return (
		<Row xs={1} className="g-4">
			{samplePosts.map((postTitle) => (
				<Col key={postTitle}>
					<PostCard title={postTitle} />
				</Col>
			))}
		</Row>
	)
}
