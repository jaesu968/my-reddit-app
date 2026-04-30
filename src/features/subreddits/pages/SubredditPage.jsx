import Stack from 'react-bootstrap/Stack'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import SubredditList from '../components/SubredditList'
import PostList from '../../posts/components/PostList'

export default function SubredditPage({ query = '' }) {
	return (
		<Stack gap={4} className="page-section">
			<section className="section-intro">
				<p className="page-eyebrow">Subreddits</p>
				<h1 className="display-6 mb-3">Posts</h1>
				<p className="section-lead mb-0">
					Browse community cards with the same spacing, typography, and structure as the posts feed.
				</p>
			</section>

			<Row className="g-4 align-items-start">
				<Col xs={12} xl={5}>
					<SubredditList query={query} onQueryChange={() => {}} />
				</Col>
				<Col xs={12} xl={7}>
					<PostList query={query} />
				</Col>
			</Row>
		</Stack>
	)
}
