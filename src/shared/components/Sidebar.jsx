import { Link } from 'react-router-dom'

export default function Sidebar() {
	return (
		<aside>
			<h3>Explore</h3>
			<ul>
				<li>
					<Link to="/posts">Trending Posts</Link>
				</li>
				<li>
					<Link to="/subreddits">Popular Subreddits</Link>
				</li>
			</ul>
		</aside>
	)
}
