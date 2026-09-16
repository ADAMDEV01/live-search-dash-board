import type { FormEvent } from 'react'

interface SearchBarProps {
  query: string
  onQueryChange: (value: string) => void
  onSubmit: (event: FormEvent) => void
  onClear: () => void
  isLoading: boolean
}

export function SearchBar({ query, onQueryChange, onSubmit, onClear, isLoading }: SearchBarProps) {
  return (
    <form className="search-form" onSubmit={onSubmit} role="search">
      <div className="search-input-wrap">
        <label className="sr-only" htmlFor="github-search">Search GitHub username</label>
        <input id="github-search" className="search-input" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search a GitHub username..." autoComplete="off" />
        {query && <button className="clear-button" type="button" onClick={onClear} aria-label="Clear search">×</button>}
      </div>
      <button className="search-button" type="submit" disabled={isLoading}>{isLoading ? 'Searching...' : 'Search'} <span aria-hidden="true">↗</span></button>
    </form>
  )
}
