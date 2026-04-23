import Stack from 'react-bootstrap/Stack'
import SubredditList from '../components/SubredditList'

export default function SubredditPage() {
	return (
		<Stack gap={4} className="page-section">
			<section className="section-intro">
				<p className="page-eyebrow">Subreddits</p>
				<h1 className="display-6 mb-3">Popular Communities</h1>
				<p className="section-lead mb-0">
					Browse community cards with the same spacing, typography, and structure as the posts feed.
				</p>
			</section>

			<SubredditList />
		</Stack>
	)
}
