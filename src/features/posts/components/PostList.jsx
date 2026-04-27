import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import PostCard from './PostCard'
import { usePosts } from '../hooks'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedPost } from '../postSlice'
import Loading from '../../../shared/components/Loading'
import ErrorState from '../../../shared/components/ErrorState'

export default function PostList() {
	// hook call to get posts data and status
	const { items, status, error } = usePosts() 
	const dispatch = useDispatch() // get dispatch function to update selected post in the store
	// handler and selector logic 
	const handleSelectPost = (post) => {
		dispatch(setSelectedPost(post)) // update selected post in the store
	}
	const selectedPost = useSelector((state) => state.posts.selectedPost) // get selected post from the store
	// render loading state if posts are loading 
	if (status === 'loading') {
		return <Loading message="Loading posts..." />
	} else if (status === 'failed') { // render error state if there was an error fetching posts
		return <ErrorState message={error} />
	}
	// render posts in a grid layout using Bootstrap components
	const postItems = items.map((post) => (
		<Col key={post.id}>
			<PostCard post={post} onSelect={() => handleSelectPost(post)} isSelected={selectedPost?.id === post.id} />
		</Col>
	))

	return (
		<Row xs={1} className="g-4">
			{postItems}
		</Row>
	)
}
