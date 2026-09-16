import type { GithubRepository } from '../types/github'

export function RepositoryCard({ repository }: { repository: GithubRepository }) {
  const updated = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(repository.updated_at))
  return (
    <article className="repo-card">
      <div className="repo-title-row"><h3 className="repo-title"><a href={repository.html_url} target="_blank" rel="noreferrer">{repository.name}</a></h3><span className="repo-meta" title="Updated date">{updated}</span></div>
      <p className="repo-description">{repository.description || 'No description provided.'}</p>
      <div className="repo-meta"><span>{repository.language && <i className="language-dot" aria-hidden="true" />} {repository.language || 'Code'}</span><span>★ {repository.stargazers_count.toLocaleString()}</span><span>⑂ {repository.forks_count.toLocaleString()}</span></div>
    </article>
  )
}
