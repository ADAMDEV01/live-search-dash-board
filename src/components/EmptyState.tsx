export function EmptyState({ variant, query }: { variant: 'idle' | 'empty'; query?: string }) {
  const idle = variant === 'idle'
  return <div className="empty-state"><div className="state-inner"><div className="state-icon" aria-hidden="true">{idle ? '⌕' : '∅'}</div><h2 className="state-title">{idle ? 'Start exploring' : 'No user found'}</h2><p className="state-text">{idle ? 'Search for a GitHub username to see their profile and latest repositories.' : `We couldn't find a GitHub user matching “${query}”. Check the spelling and try again.`}</p></div></div>
}
