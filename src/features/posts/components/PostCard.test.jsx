// testing for PostCard component
import { render, screen } from '@testing-library/react'
import { expect, vi } from 'vitest' // using vitest instead of jest, typically faster and more modern for Vite projects
import PostCard from './PostCard'
import userEvent from '@testing-library/user-event'

// sample post data to be used in tests
const SAMPLE_POST = {
    id: '1',
    title: 'React Tips and Tricks',
    selftext: 'Some useful tips for React development.',
    author: 'kyle',
    score: 42,
    num_comments: 15,
    subreddit_name_prefixed: 'r/reactjs',
    created_utc: 0
}
// helper function to render the PostCard component, with default props that can be overridden in individual tests
const renderPostCard = (props = {}) => {
    const onSelect = vi.fn()

    const result = render(
        <PostCard
            post={SAMPLE_POST}
            onSelect={onSelect}
            isSelected={false}
            {...props}
        />
    )

    return {
        ...result,
        onSelect,
    }
}

// testing suite for the PostCard component
describe('PostCard', () => {
    // Smoke test: confirms the component renders without crashing when given a post prop.
    it('renders without crashing', () => {
        renderPostCard()
        // Assert that the title and author are rendered
        expect(screen.getByText(/react tips and tricks/i)).toBeInTheDocument()
        expect(screen.getByText(/u\/kyle/i)).toBeInTheDocument()
    })

    // Rendering test: displays stable post metadata correctly.
    it('displays post metadata correctly', () => {
        renderPostCard()

        expect(screen.getByText(/u\/kyle/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/vote score/i)).toHaveTextContent('42')
        expect(screen.getByText(/15 comments/i)).toBeInTheDocument()
    })

    // Interaction test: clicking the card calls the onSelect callback.
    it('calls onSelect when clicked', async () => {
        const user = userEvent.setup()
        const { onSelect } = renderPostCard()
        const cardElement = screen.getByText(/react tips and tricks/i)

        await user.click(cardElement)

        expect(onSelect).toHaveBeenCalledTimes(1)
    })

    // Style state test: applies selected styles when isSelected is true.
    it('applies selected styles when isSelected is true', () => {
        const { container } = renderPostCard({ isSelected: true })
        const cardElement = container.querySelector('.card')

        expect(cardElement).toHaveClass('border-primary')
    })

    // Style state test: applies the unselected styles when isSelected is false.
    it('applies unselected styles when isSelected is false', () => {
        const { container } = renderPostCard({ isSelected: false })
        const cardElement = container.querySelector('.card')

        expect(cardElement).toHaveClass('border-light')
    })
    // Accessibility test: card is reachable and activatable by keyboard.
    it('supports keyboard interaction with Enter and Space', async () => {
        const user = userEvent.setup()
        const { onSelect } = renderPostCard()
        // Tab to focus the card — keyboard() targets the currently focused element
        await user.tab()

        // Enter should trigger onSelect
        await user.keyboard('{Enter}')
        expect(onSelect).toHaveBeenCalledTimes(1)

        // Space should also trigger onSelect
        await user.keyboard(' ')
        expect(onSelect).toHaveBeenCalledTimes(2)
    })

    // Accessibility test: card has a descriptive aria-label including the post title.
    it('has an accessible label including the post title', () => {
        renderPostCard()
        expect(screen.getByRole('button', { name: /select post: react tips and tricks/i })).toBeInTheDocument()
    })

    // Accessibility test: aria-pressed reflects the current selection state.
    it('has aria-pressed set to true when selected', () => {
        renderPostCard({ isSelected: true })
        expect(screen.getByRole('button', { pressed: true })).toBeInTheDocument()
    })
})