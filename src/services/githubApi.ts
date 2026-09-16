import type { GithubRepository, GithubSearchData, GithubUser } from '../types/github'

const API_BASE = 'https://api.github.com'

async function githubFetch<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    signal,
    headers: { Accept: 'application/vnd.github+json' },
  })
  if (!response.ok) {
    const error = new Error(response.status === 403 ? 'GitHub rate limit reached. Please try again later.' : response.status === 404 ? 'No GitHub user was found for that search.' : 'GitHub returned an unexpected response.')
    Object.assign(error, { status: response.status })
    throw error
  }
  return response.json() as Promise<T>
}

export async function searchGithubUser(term: string, signal: AbortSignal): Promise<GithubSearchData | null> {
  const matches = await githubFetch<{ items: Array<{ login: string }> }>(`/search/users?q=${encodeURIComponent(term)}&per_page=1`, signal)
  if (matches.items.length === 0) return null
  const user = await githubFetch<GithubUser>(`/users/${encodeURIComponent(matches.items[0].login)}`, signal)
  const repositories = await githubFetch<GithubRepository[]>(`/users/${encodeURIComponent(user.login)}/repos?sort=updated&per_page=12`, signal)
  return { user, repositories }
}
