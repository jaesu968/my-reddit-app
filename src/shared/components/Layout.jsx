import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
	return (
		<div>
			<Navbar />
			<div>
				<Sidebar />
				<main>{children}</main>
			</div>
		</div>
	)
}
