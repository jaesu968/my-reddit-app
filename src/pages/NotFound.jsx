import { Link } from 'react-router-dom'

export default function NotFound() {
	return (
		<section>
			<h1>404</h1>
			<p>We could not find that page.</p>
			<Link to="/">Back to Home</Link>
		</section>
	)
}
