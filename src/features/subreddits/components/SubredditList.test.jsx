// testing for the SubredditList component, which is responsible for rendering subreddits 
// and allowing users to click on them to view their posts.
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest' // using vitest instead of jest, typically faster and more modern for Vite projects
import SubredditList from './SubredditList'
import { useSubreddits } from '../hooks'
import { useDispatch, useSelector } from 'react-redux'

// create mock implementations for the hook and Redux functions used in SubredditList
// hook first to control the data returned to the component during tests
vi.mock('../hooks', () => ({
    useSubreddits: vi.fn() 
}))
// mock useDispatch to prevent actual Redux actions from being dispatched during tests
vi.mock('react-redux', () => ({
    useDispatch: vi.fn(), 
    useSelector: vi.fn() 
}))

// Sample subreddits reused across multiple tests
const SAMPLE_SUBREDDITS = [
    { id: '1', display_name: 'reactjs', title: 'ReactJS', public_description: 'A subreddit for React news and discussion.' },
    { id: '2', display_name: 'vuejs', title: 'VueJS', public_description: 'A subreddit for Vue news and discussion.' },
]
// testing suite for the SubredditList component
describe('SubredditList', () => {
    // mock dispatch function to be used in tests
    const mockDispatch = vi.fn() 
    // shared setup in beforeEach to reset mocks and provide default return values for hooks
    beforeEach(() => {
        vi.clearAllMocks() // reset mock function calls and implementations before each test
        useDispatch.mockReturnValue(mockDispatch) // use the mock dispatch function 
        useSelector.mockImplementation((selectorFn) => 
            selectorFn({ subreddits: { selectedSubreddit: null } }) // default state for useSelector
        )
    })

    // Smoke test: confirms the search input renders after a successful fetch.
    it('renders without crashing', () => {
        useSubreddits.mockReturnValue({ items: [], status: 'succeeded', error: null })
        render(<SubredditList />)
        // "Search subreddits" is the aria-label on the input — use getByRole, not getByText
        expect(screen.getByRole('textbox', { name: /search subreddits/i })).toBeInTheDocument()
    })

    // Conditional rendering test: shows loading state when subreddits are being fetched.
    it('shows loading state when subreddits are being fetched', () => {
        useSubreddits.mockReturnValue({ items: [], status: 'loading', error: null })
        render(<SubredditList />)
        expect(screen.getByText(/loading subreddits/i)).toBeInTheDocument()
    })

    // Conditional rendering test: shows error message when fetch fails.
    it('shows error message when fetch fails', () => {
        useSubreddits.mockReturnValue({ items: [], status: 'failed', error: 'Network error' })
        render(<SubredditList />)
        expect(screen.getByText(/network error/i)).toBeInTheDocument()
    })
    // Interaction test: typing in the search bar should filter the list of subreddits.
    it('filters subreddits based on search query', async () => {
        const user = userEvent.setup() // userEvent setup for simulating user interactions
        // Mock must be set BEFORE the first render so the component gets the data on mount
        useSubreddits.mockReturnValue({ items: SAMPLE_SUBREDDITS, status: 'succeeded', error: null })
        render(<SubredditList />)

        // Both subreddits should be visible initially
        expect(screen.getByText(/reactjs/i)).toBeInTheDocument()
        expect(screen.getByText(/vuejs/i)).toBeInTheDocument()

        // Type into the search bar to filter
        await user.type(screen.getByRole('textbox', { name: /search subreddits/i }), 'react')

        // Only the matching subreddit should remain
        expect(screen.getByText(/reactjs/i)).toBeInTheDocument()
        expect(screen.queryByText(/vuejs/i)).not.toBeInTheDocument()
    })

    // Conditional rendering test: shows "no results" message when query has no matches.
    it('shows no-results message when search query matches nothing', async () => {
        const user = userEvent.setup() // userEvent setup for simulating user interactions
        useSubreddits.mockReturnValue({ items: SAMPLE_SUBREDDITS, status: 'succeeded', error: null })
        render(<SubredditList />)

        // Type a query that matches nothing
        await user.type(screen.getByRole('textbox', { name: /search subreddits/i }), 'angular')

        // Expect a no-results message to be shown
        expect(screen.getByText(/no subreddits found/i)).toBeInTheDocument()
    })

    // Interaction test: clicking a subreddit card dispatches setSelectedSubreddit with that subreddit's data.
    it('dispatches setSelectedSubreddit when a subreddit card is clicked', async () => {
        const user = userEvent.setup() // userEvent setup for simulating user interactions
        useSubreddits.mockReturnValue({ items: SAMPLE_SUBREDDITS, status: 'succeeded', error: null })
        render(<SubredditList />)

        // Click on the first subreddit card
        await user.click(screen.getByText(/reactjs/i))

        // Expect the dispatch function to have been called with the correct action
        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'subreddits/setSelectedSubreddit',
            payload: SAMPLE_SUBREDDITS[0]
        })
    })
})