// this will be a testing file for the PostList component,
//  which is responsible for rendering a list of posts based on the current search query and
//  selected subreddit.
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest' // using vitest instead of jest, typically faster and more modern for Vite projects
import PostList from './PostList'
import { usePosts } from '../hooks'
import { useDispatch, useSelector } from 'react-redux'

// create mock implementations for the hooks and Redux functions used in PostList 
// hooks first to control the data returned to the component during tests,
vi.mock('../hooks', () => ({
    usePosts: vi.fn() 
}))
// mock useDispatch to prevent actual Redux actions from being dispatched during tests
vi.mock('react-redux', () => ({
    useDispatch: vi.fn(),
    useSelector: vi.fn()
}))

// Sample posts reused across multiple tests
const SAMPLE_POSTS = [
    { id: '1', title: 'React Tips', selftext: '', author: 'alice', subreddit_name_prefixed: 'r/reactjs', created_utc: 0, score: 10, ups: 10, downs: 0 },
    { id: '2', title: 'Vue patterns', selftext: '', author: 'bob', subreddit_name_prefixed: 'r/vuejs', created_utc: 0, score: 5, ups: 5, downs: 0 },
]
// testing suite for the PostList component
describe('PostList', () => {
    // mock dispatch function to be used in tests
    const mockDispatch = vi.fn() 
    // shared setup in beforeEach to reset mocks and provide default return values for hooks
    beforeEach(() => {
        vi.clearAllMocks() // reset mock function calls and implementations before each test
        useDispatch.mockReturnValue(mockDispatch) // use the mock dispatch function
        useSelector.mockImplementation((selectorFn) => 
            selectorFn({ posts: { selectedPost: null } }) // default state for useSelector
        )
    })

    // Smoke test: confirms the search input renders and posts are shown after a successful fetch.
    it('renders without crashing', () => {
        usePosts.mockReturnValue({ items: [], status: 'succeeded', error: null })
        render(<PostList />)
        // "Search posts" is the aria-label on the input, not a visible text node — use getByRole
        expect(screen.getByRole('textbox', { name: /search posts/i })).toBeInTheDocument()
    })

    // Interaction test: typing in the search bar should filter the list of posts.
    it('filters posts based on search query', async () => {
        const user = userEvent.setup()
        // Mock must be set BEFORE the first render so the component gets the data on mount
        usePosts.mockReturnValue({ items: SAMPLE_POSTS, status: 'succeeded', error: null })
        render(<PostList />)

        // Both posts should be visible initially
        expect(screen.getByText(/react tips/i)).toBeInTheDocument()
        expect(screen.getByText(/vue patterns/i)).toBeInTheDocument()

        // Type into the search bar to filter
        await user.type(screen.getByRole('textbox', { name: /search posts/i }), 'react')

        // Only the matching post should remain
        expect(screen.getByText(/react tips/i)).toBeInTheDocument()
        expect(screen.queryByText(/vue patterns/i)).not.toBeInTheDocument()
    })

    // Conditional rendering test: shows loading state when posts are being fetched.
    it('shows loading state when posts are being fetched', () => {
        usePosts.mockReturnValue({ items: [], status: 'loading', error: null })
        render(<PostList />)
        expect(screen.getByText(/loading posts/i)).toBeInTheDocument()
    })

    // Conditional rendering test: shows error message when fetch fails.
    it('shows error message when fetch fails', () => {
        usePosts.mockReturnValue({ items: [], status: 'failed', error: 'Network error' })
        render(<PostList />)
        expect(screen.getByText(/network error/i)).toBeInTheDocument()
    })

    // Conditional rendering test: shows "no results" message when query has no matches.
    it('shows no-results message when search query matches nothing', async () => {
        const user = userEvent.setup() // userEvent setup for simulating user interactions
        usePosts.mockReturnValue({ items: SAMPLE_POSTS, status: 'succeeded', error: null })
        render(<PostList />)

        await user.type(screen.getByRole('textbox', { name: /search posts/i }), 'xyznotapost')
        expect(screen.getByText(/no posts found/i)).toBeInTheDocument()
    })

    // Interaction test: clicking a post card dispatches setSelectedPost with that post's data.
    it('dispatches setSelectedPost when a post card is clicked', async () => {
        const user = userEvent.setup() // userEvent setup for simulating user interactions
        usePosts.mockReturnValue({ items: SAMPLE_POSTS, status: 'succeeded', error: null })
        render(<PostList />)

        await user.click(screen.getByText(/react tips/i))
        // dispatch should have been called once with an action containing the clicked post's id
        expect(mockDispatch).toHaveBeenCalledTimes(1)
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({ payload: expect.objectContaining({ id: '1' }) })
        )
    })
})