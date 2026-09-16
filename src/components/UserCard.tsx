import type { GithubUser } from '../types/github'

export function UserCard({ user }: { user: GithubUser }) {
  return (
    <article className="user-card">
      <div className="user-top"><img className="avatar" src={user.avatar_url} alt={`${user.login}'s avatar`} /><div><h3 className="user-name">{user.name || user.login}</h3><span className="user-handle">@{user.login}</span></div></div>
      <p className="user-bio">{user.bio || 'This developer has not added a bio yet.'}</p>
      <dl className="profile-stats"><div><dt>Followers</dt><dd>{user.followers.toLocaleString()}</dd></div><div><dt>Public repos</dt><dd>{user.public_repos.toLocaleString()}</dd></div></dl>
      <a className="profile-link" href={user.html_url} target="_blank" rel="noreferrer">VIEW PROFILE ↗</a>
    </article>
  )
}
