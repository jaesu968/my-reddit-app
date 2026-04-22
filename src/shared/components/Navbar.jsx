import { Link } from 'react-router-dom'

export default function Navbar() {
	return (
		<header>
			<nav>
				<h2>Reddit Client</h2>
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/posts">Posts</Link>
					</li>
					<li>
						<Link to="/subreddits">Subreddits</Link>
					</li>
				</ul>
			</nav>
		</header>
	)
}
