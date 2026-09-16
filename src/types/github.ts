export interface GithubUser {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
  bio: string | null
  followers: number
  public_repos: number
}

export interface GithubRepository {
  id: number
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
}

export interface GithubSearchData {
  user: GithubUser
  repositories: GithubRepository[]
}

export interface GithubApiError {
  message: string
  status: number
}
