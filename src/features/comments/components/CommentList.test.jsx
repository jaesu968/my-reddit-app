// testing file for CommentList component, which is responsible for rendering a list of comments for a selected post.
import { render, screen } from '@testing-library/react'
import { expect, vi } from 'vitest' // using vitest instead of jest, typically faster and more modern for Vite projects
import CommentList from './CommentList'
import { useComments } from '../hooks'

// create mock implementations for the hooks used in CommentList
vi.mock('../hooks', () => ({
    useComments: vi.fn() 
}))

// sample comments data to be used in tests 
const SAMPLE_COMMENTS = [
    { id: 'c1', body: 'Great post!', author: 'alice', created_utc: 0, score: 5, ups: 5, downs: 0 },
    { id: 'c2', body: 'I disagree', author: 'bob', created_utc: 0, score: -2, ups: 1, downs: 3 },
]

// testing suite for the CommentList component
describe('CommentList', () => {
    beforeEach(() => {
        vi.clearAllMocks() // reset mock function calls and implementations before each test
    })

    // Smoke test: confirms the component renders without crashing when postId is provided.
    it('renders without crashing with a postId', () => {
        useComments.mockReturnValue({ items: SAMPLE_COMMENTS, status: 'succeeded', error: null })
        render(<CommentList postId="1" />) // render with a valid postId to avoid the "select a post" placeholder
        // Assert that comments are rendered
        expect(screen.getByText(/great post!/i)).toBeInTheDocument()
    })

    // Conditional rendering test: shows placeholder when no postId is provided.
    it('shows placeholder when no postId is provided', () => {
        render(<CommentList postId={null} />)
        expect(screen.getByText(/select a post to view comments/i)).toBeInTheDocument()
    })

    // Conditional rendering test: shows loading state when comments are being fetched.
    it('shows loading state when comments are being fetched', () => {
        useComments.mockReturnValue({ items: [], status: 'loading', error: null })
        render(<CommentList postId="1" />)
        expect(screen.getByText(/loading comments/i)).toBeInTheDocument()
    })

    // Conditional rendering test: shows error message when fetch fails.
    it('shows error message when fetch fails', () => {
        useComments.mockReturnValue({ items: [], status: 'failed', error: 'Network error' })
        render(<CommentList postId="1" />)
        expect(screen.getByText(/network error/i)).toBeInTheDocument()
    })

    // Conditional rendering test: shows fallback message when no comments are available.
    it('shows fallback message when no comments are available', () => {
        useComments.mockReturnValue({ items: [], status: 'succeeded', error: null })
        render(<CommentList postId="1" />)
        expect(screen.getByText(/no comments available for this post/i)).toBeInTheDocument()
    })

    // Rendering test: displays all comment data (author, body) when comments exist.
    it('renders all comments with author and body text', () => {
        useComments.mockReturnValue({ items: SAMPLE_COMMENTS, status: 'succeeded', error: null })
        render(<CommentList postId="1" />)
        // Assert both comment authors appear
        expect(screen.getByText('alice')).toBeInTheDocument()
        expect(screen.getByText('bob')).toBeInTheDocument()
        // Assert both comment bodies appear
        expect(screen.getByText(/great post!/i)).toBeInTheDocument()
        expect(screen.getByText(/i disagree/i)).toBeInTheDocument()
    })

    // Rendering test: shows fallback text when a comment has no body.
    it('shows fallback text when comment body is empty', () => {
        const commentWithoutBody = { id: 'c3', body: '', author: 'charlie' }
        useComments.mockReturnValue({ items: [commentWithoutBody], status: 'succeeded', error: null })
        render(<CommentList postId="1" />)
        expect(screen.getByText(/no content for this comment/i)).toBeInTheDocument()
    })
})