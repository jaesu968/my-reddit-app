import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Stack from 'react-bootstrap/Stack'
import { Link } from 'react-router-dom'

export default function NotFound() {
	return (
		<Stack gap={4} className="page-section justify-content-center h-100">
			<Card className="border-0 shadow-sm empty-state-card mx-auto">
				<Card.Body className="p-4 p-lg-5 text-center">
					<p className="page-eyebrow justify-content-center">404</p>
					<h1 className="display-6 mb-3">We could not find that page</h1>
					<p className="section-lead mb-4">
						The route does not exist, but the rest of the app is still one click away.
					</p>
					<Button as={Link} to="/" variant="primary">
						Back to Home
					</Button>
				</Card.Body>
			</Card>
		</Stack>
	)
}
