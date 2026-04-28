import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import SearchBar from './SearchBar'

describe('SearchBar', () => {
  it('renders input and submit button', () => {
    render(<SearchBar value="" onChange={vi.fn()} onSubmit={vi.fn()} />)

    expect(screen.getByRole('textbox', { name: /search/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })

  it('calls onChange when user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<SearchBar value="" onChange={onChange} onSubmit={vi.fn()} />)

    await user.type(screen.getByRole('textbox', { name: /search/i }), 'react')
    expect(onChange).toHaveBeenCalled()
  })

  it('calls onSubmit when form is submitted', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((e) => e.preventDefault())

    render(<SearchBar value="react" onChange={vi.fn()} onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: /search/i }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

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
