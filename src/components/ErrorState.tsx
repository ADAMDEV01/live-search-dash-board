interface ErrorStateProps { error: { message: string; status?: number }; onRetry: () => void }
export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return <div className="error-state" role="alert"><div className="state-inner"><div className="state-icon" aria-hidden="true">!</div><h2 className="state-title">{error.status === 403 ? 'Rate limit reached' : 'Search interrupted'}</h2><p className="state-text">{error.message}</p><button className="retry-button" type="button" onClick={onRetry}>Try again</button></div></div>
}
