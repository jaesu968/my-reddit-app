// testing PostDetail component that shows details of the selected post, including title, author, date, score, and body text.
//  It uses ReactMarkdown to render markdown content in the post body and remarkGfm to support GitHub Flavored Markdown features like
//  tables, strikethrough, and task lists.
//  The component also handles the case when no post is selected by showing a placeholder message prompting the user to select a post from the list.
import { render, screen } from '@testing-library/react'
import { useSelector } from 'react-redux'
import { expect, vi } from 'vitest' // using vitest instead of jest, typically faster and more modern for Vite projects
import PostDetail from './PostDetail'

// create mock implementations for the Redux functions used in PostDetail
vi.mock('react-redux', () => ({
    useSelector: vi.fn() 
}))
// sample post data to be used in tests
const SAMPLE_POST = {
    id: '1', 
    title: 'React Tips', 
    author: 'kyle',
    created_utc: 0, 
    score: 42, 
    ups: 45, 
    downs: 3, 
    selftext: 'Some **markdown** content.'
}
// testing suite for the PostDetail component 
describe('PostDetail', () => {
    beforeEach(() => {
        vi.clearAllMocks() // reset mock function calls and implementations before each test
    })
    // show placeholder when no post is selected 
    it('shows placeholder when no post is selected', () => {
        useSelector.mockImplementation((fn) => fn({ posts: { selectedPost: null}}))
        render(<PostDetail />)
        // "Select a post to view details" is the heading text in the placeholder, so we can use getByRole to find it
        expect(screen.getByRole('heading', { name: /select a post/i })).toBeInTheDocument()
    })
    // render a selected post's title and metadata (author, date, score) correctly
    it('renders selected post title and metadata', () => {
        useSelector.mockImplementation((fn) => fn({ posts: { selectedPost: SAMPLE_POST}}))
        render(<PostDetail />)
        // assert the title, author, score, ups, downs are visible
        expect(screen.getByRole('heading', { name: /react tips/i })).toBeInTheDocument()
        expect(screen.getByText(/by kyle on/i)).toBeInTheDocument()
        expect(screen.getByText(/score: 42/i)).toBeInTheDocument()
        expect(screen.getByText(/upvotes: 45/i)).toBeInTheDocument()
        expect(screen.getByText(/downvotes: 3/i)).toBeInTheDocument()
    })
    // show fallback text when appropriate (e.g. when selftext is empty)
    it('shows fallback text when selftext is empty', () => {
        useSelector.mockImplementation((fn) => fn({posts: { selectedPost: { ...SAMPLE_POST, selftext: ''}}}))
        render(<PostDetail />)
        // assert fallback string appears
        expect(screen.getByText(/no additional text content for this post/i)).toBeInTheDocument()
    })
    // render selftext content if it exists
    it('renders selftext content when present', () => {
        useSelector.mockImplementation((fn) => fn({posts: { selectedPost: SAMPLE_POST}}))
        render(<PostDetail />)
        // assert selftext content appears (ReactMarkdown strips ** so look for 'markdown' not '**markdown**')
        expect(screen.getByText(/markdown/i)).toBeInTheDocument()
    })
})
