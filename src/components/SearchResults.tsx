import type { GithubSearchData } from '../types/github'
import { RepositoryList } from './RepositoryList'
import { UserCard } from './UserCard'

export function SearchResults({ data }: { data: GithubSearchData }) {
  return (
    <div className="results-content">
      <div className="results-header">
        <div><p className="results-kicker">SEARCH RESULTS</p><h2 className="results-title">A developer worth knowing.</h2></div>
        <span className="results-count">{data.repositories.length} REPOSITORIES FOUND</span>
      </div>
      <div className="results-grid"><UserCard user={data.user} /><RepositoryList repositories={data.repositories} /></div>
    </div>
  )
}
