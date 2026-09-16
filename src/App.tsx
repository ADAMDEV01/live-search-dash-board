import { useState } from 'react'
import type { FormEvent } from 'react'
import { EmptyState } from './components/EmptyState'
import { ErrorState } from './components/ErrorState'
import { LoadingState } from './components/LoadingState'
import { SearchBar } from './components/SearchBar'
import { SearchResults } from './components/SearchResults'
import { useGithubSearch } from './hooks/useGithubSearch'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const { data, error, isLoading, status, search } = useGithubSearch(query)

  const submitSearch = (event?: FormEvent) => {
    event?.preventDefault()
    search(query)
  }

  const clearSearch = () => {
    setQuery('')
    search('')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Pulse home">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>pulse<span className="brand-dot">.</span></span>
        </a>
        <span className="topbar-caption">GITHUB EXPLORER</span>
      </header>

      <main>
        <section className="hero-section" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> LIVE DEVELOPER SEARCH</p>
            <h1 id="page-title">Find the people<br /><em>building tomorrow.</em></h1>
            <p className="hero-description">
              Explore GitHub profiles and repositories in real time.
              Type a username or search term to get started.
            </p>
          </div>
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            onSubmit={submitSearch}
            onClear={clearSearch}
            isLoading={isLoading}
          />
          <p className="search-hint"><kbd>↵</kbd> Press enter to search <span>·</span> Results update as you type</p>
        </section>

        <section className="results-section" aria-live="polite" aria-busy={isLoading}>
          {isLoading && <LoadingState />}
          {!isLoading && error && <ErrorState error={error} onRetry={() => search(query, true)} />}
          {!isLoading && !error && status === 'idle' && <EmptyState variant="idle" />}
          {!isLoading && !error && status === 'empty' && <EmptyState variant="empty" query={query} />}
          {!isLoading && !error && data && <SearchResults data={data} />}
        </section>
      </main>

      <footer className="footer">
        <span>Powered by the GitHub REST API</span>
        <span className="footer-status"><span className="status-dot" /> API STATUS: OPERATIONAL</span>
      </footer>
    </div>
  )
}

export default App
