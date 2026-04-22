import PostCard from './PostCard'

const samplePosts = ['AskReddit: What are you building?', 'React: Tips for clean architecture']

export default function PostList() {
	return (
		<ul>
			{samplePosts.map((postTitle) => (
				<PostCard key={postTitle} title={postTitle} />
			))}
		</ul>
	)
}
