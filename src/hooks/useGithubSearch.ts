import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce } from './useDebounce'
import { searchGithubUser } from '../services/githubApi'
import type { GithubSearchData } from '../types/github'

type SearchStatus = 'idle' | 'searching' | 'results' | 'empty' | 'error'
interface SearchError { message: string; status?: number }
interface CacheEntry { data: GithubSearchData | null; expiresAt: number }
const CACHE_TTL = 5 * 60 * 1000

export function useGithubSearch(query: string) {
  const [data, setData] = useState<GithubSearchData | null>(null)
  const [error, setError] = useState<SearchError | null>(null)
  const [status, setStatus] = useState<SearchStatus>('idle')
  const debouncedQuery = useDebounce(query.trim(), 450)
  const controllerRef = useRef<AbortController | null>(null)
  const latestRequestId = useRef(0)
  const cacheRef = useRef(new Map<string, CacheEntry>())
  const lastRequestedTerm = useRef('')

  const search = useCallback(async (rawTerm: string, force = false) => {
    const term = rawTerm.trim().toLowerCase()
    if (!term) {
      controllerRef.current?.abort()
      latestRequestId.current += 1
      lastRequestedTerm.current = ''
      setData(null); setError(null); setStatus('idle')
      return
    }
    if (!force && term === lastRequestedTerm.current) return
    lastRequestedTerm.current = term
    const requestId = ++latestRequestId.current
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    const cached = cacheRef.current.get(term)
    if (cached && cached.expiresAt > Date.now()) {
      setData(cached.data); setError(null); setStatus(cached.data ? 'results' : 'empty')
      return
    }
    setStatus('searching'); setError(null)
    try {
      const result = await searchGithubUser(term, controller.signal)
      if (requestId !== latestRequestId.current) return
      cacheRef.current.set(term, { data: result, expiresAt: Date.now() + CACHE_TTL })
      setData(result); setStatus(result ? 'results' : 'empty')
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === 'AbortError') return
      if (requestId !== latestRequestId.current) return
      const apiError = caught instanceof Error ? caught : new Error('Something went wrong while searching.')
      const statusCode = typeof caught === 'object' && caught !== null && 'status' in caught && typeof caught.status === 'number' ? caught.status : undefined
      setData(null); setError({ message: apiError.message, status: statusCode }); setStatus('error')
    }
  }, [])

  useEffect(() => {
    if (debouncedQuery.length >= 2) void search(debouncedQuery)
    if (debouncedQuery.length === 0) void search('')
  }, [debouncedQuery, search])

  useEffect(() => () => controllerRef.current?.abort(), [])
  return { data, error, isLoading: status === 'searching', status, search }
}
