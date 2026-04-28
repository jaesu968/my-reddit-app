import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest' // using vitest instead of jest, typically faster and more modern for Vite projects
import SearchBar from './SearchBar'

// React Testing Library replaces Enzyme for testing React components.
//  It encourages testing from the user's perspective, 
// focusing on what the component renders and 
// how it behaves rather than its internal implementation details. 
// This leads to more robust and 
// maintainable tests that are less likely to break with refactors. 
// In this test suite, we verify that the SearchBar component renders correctly, 
// responds to user input, and conditionally shows a clear button when appropriate.
describe('SearchBar', () => {
  // Smoke test: confirms key UI controls render for basic usage.
  it('renders input and submit button', () => {
    render(<SearchBar value="" onChange={vi.fn()} onSubmit={vi.fn()} />)

    expect(screen.getByRole('textbox', { name: /search/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })

  // Interaction test: typing should call parent onChange handler.
  it('calls onChange when user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<SearchBar value="" onChange={onChange} onSubmit={vi.fn()} />)

    await user.type(screen.getByRole('textbox', { name: /search/i }), 'react')
    expect(onChange).toHaveBeenCalled()
  })

  // Form behavior test: clicking Search submits the form callback.
  it('calls onSubmit when form is submitted', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((e) => e.preventDefault())

    render(<SearchBar value="react" onChange={vi.fn()} onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: /search/i }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  // Conditional rendering test: Clear appears only when value exists.
  it('shows clear button only when value exists and onClear is provided', () => {
    const onClear = vi.fn()
    const { rerender } = render(
      <SearchBar value="" onChange={vi.fn()} onSubmit={vi.fn()} onClear={onClear} />
    )

    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument()

    rerender(<SearchBar value="redux" onChange={vi.fn()} onSubmit={vi.fn()} onClear={onClear} />)
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
  })
})
