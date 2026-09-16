# Pulse — Live Search Dashboard

Pulse is a responsive GitHub developer explorer built with React, TypeScript, and Vite. It uses the public GitHub REST API directly from the browser, so no API key or backend is required.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`. The generated `dist` folder can be deployed to Vercel with the Vite preset. There are no environment variables to configure.

## Engineering decisions

### Debouncing

Typing fires a request only after 450ms without a change. This prevents one API request per keystroke while keeping the interface feeling live. Pressing Enter or clicking Search bypasses the debounce for an intentional manual search.

### Cancellation and stale responses

`useGithubSearch` keeps the active `AbortController` in a ref. Starting a new search aborts the previous fetch and passes the new controller's `signal` to both GitHub requests. An abort is expected control flow and is not shown as an error.

Cancellation alone is not sufficient: a response can already have resolved (or a server/proxy may not honor cancellation) when a newer request begins. Every request receives an incrementing `requestId`. Before writing any result or error, the hook checks that the ID still matches `latestRequestId`. This guard prevents an older, slower search from replacing newer results.

Before the fix, searching for `octocat`, then quickly searching for `torvalds`, could show the `octocat` profile if its response arrived last. To reproduce that failure during development, add a delay around `githubFetch` in `src/services/githubApi.ts`, search two terms quickly, and make the first delay longer. The request ID check means the delayed response is ignored.

### Cache and errors

Successful and not-found responses are cached in memory for five minutes by normalized search term. Repeating a search in the same browser session avoids another API request. The UI distinguishes idle, loading, results, empty/not found, rate-limited (403), and unexpected/network errors.

## Project structure

```text
src/
  components/       Presentational search, result, state, and card components
  hooks/            Debounce and race-safe GitHub search hooks
  services/         GitHub REST API client
  types/            API response types
  App.tsx           Page composition
  index.css         Global tokens and base styles
```

## Verification

- `npm run build` runs TypeScript's project build followed by Vite's production build.
- `npm run lint` checks the source with Oxlint.
- Manual checks: Enter search, debounced typing, clear, repeat searches (cache), a nonexistent username (404), and rapid searches with an artificial first-request delay.
