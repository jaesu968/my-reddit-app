import { Link } from 'react-router-dom'

export default function Home() {
	return (
		<section>
			<h1>Welcome to Reddit Client</h1>
			<p>Select a section to start browsing.</p>
			<ul>
				<li>
					<Link to="/posts">Go to Posts</Link>
				</li>
				<li>
					<Link to="/subreddits">Go to Subreddits</Link>
				</li>
			</ul>
		</section>
	)
}
