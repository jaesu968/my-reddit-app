// SearchBar.jsx - A reusable search bar component with optional loading state and clear button
import { Form, Button, InputGroup } from 'react-bootstrap'

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search...',
  ariaLabel = 'Search',
  isLoading = false,
  showButton = true,
  onClear,
}) {
  return (
    <Form onSubmit={onSubmit} className="mb-3">
      <InputGroup>
        <Form.Control
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
        />
        {value && onClear && (
          <Button variant="outline-secondary" type="button" onClick={onClear}>
            Clear
          </Button>
        )}
        {showButton && (
          <Button variant="primary" type="submit" disabled={isLoading}>
            Search
          </Button>
        )}
      </InputGroup>
    </Form>
  )
}