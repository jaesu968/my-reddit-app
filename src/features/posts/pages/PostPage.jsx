import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import PostDetail from '../components/PostDetail'
import PostList from '../components/PostList'
import CommentList from '../../comments/components/CommentList'
import { useSelector } from 'react-redux'

export default function PostPage({ query = '', onQueryChange = () => {} }) {
	const selectedPost = useSelector((state) => state.posts.selectedPost)

	// render page layout with PostList and PostDetail components, and conditionally render CommentList if a post is selected
	return (
		<Stack gap={4} className="page-section">
			<section className="section-intro">
				<p className="page-eyebrow">Posts</p>
				<h1 className="display-6 mb-3">Trending Discussions</h1>
				<p className="section-lead mb-0">
					A consistent feed layout for browsing featured conversations and post details.
				</p>
			</section>

			<Row className="g-4">
				<Col xs={12} xl={7}>
					<PostList query={query} />
				</Col>
				<Col xs={12} xl={5}>
					<PostDetail />
				</Col>
			</Row>
			<Row className="mt-4">
				<Col xs={12}>
					<CommentList postId={selectedPost?.id} />
				</Col>
			</Row>
		</Stack>	
	)
}
