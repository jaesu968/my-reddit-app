import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import PostDetail from '../components/PostDetail'
import PostList from '../components/PostList'
import { useSelector } from 'react-redux'

export default function PostPage({ query = '', onQueryChange = () => {} }) {
	const selectedPost = useSelector((state) => state.posts.selectedPost)

	// render page layout with PostList and PostDetail components, and conditionally render CommentList if a post is selected
	return (
		<Stack gap={4} className="page-section">
			<section className="section-intro">
				<p className="page-eyebrow">Posts</p>
				<h1 className="display-6 mb-3">Trending Discussions</h1>
			</section>

			<Row className="g-4">
				<Col xs={12} xl={7}>
					<PostList query={query} />
				</Col>
				{selectedPost && (
					<Col xs={12} xl={5}>
						<PostDetail />
					</Col>
				)}
			</Row>
		</Stack>	
	)
}
