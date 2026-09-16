import type { GithubRepository } from '../types/github'
import { RepositoryCard } from './RepositoryCard'

export function RepositoryList({ repositories }: { repositories: GithubRepository[] }) {
  return <div className="repo-list">{repositories.map((repository) => <RepositoryCard key={repository.id} repository={repository} />)}</div>
}
