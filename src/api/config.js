/**
 * Base URL for the Rust API (no trailing slash).
 *
 * Priority:
 * 1. `VITE_API_BASE_URL` when set (overrides everything below).
 * 2. Vite **development** (`import.meta.env.DEV`): `http://127.0.0.1:3000` unless `VITE_API_BASE_URL` is set.
 * 3. **Production** in the browser on `localhost` / `127.0.0.1` / `[::1]`: local Axum for preview.
 * 4. **Production** anywhere else (e.g. Vercel): `DEFAULT_REMOTE_API_BASE` (Fly).
 */

/** Default Fly.io API used when the app is served from a non-local host and no env override is set. */
export const DEFAULT_REMOTE_API_BASE = 'https://easyreceiptbackend.fly.dev'

function normalizedEnvBase() {
  const raw = (import.meta.env.VITE_API_BASE_URL ?? '').trim()
  if (!raw || raw === 'undefined' || raw === 'null') return ''
  return raw.replace(/\/$/, '')
}

function isLocalBrowserHost() {
  if (typeof window === 'undefined') return false
  const h = window.location.hostname
  return h === 'localhost' || h === '127.0.0.1' || h === '[::1]'
}

export function resolveApiBaseUrl() {
  const fromEnv = normalizedEnvBase()
  if (fromEnv) return fromEnv
  if (import.meta.env.DEV) return 'http://127.0.0.1:3000'
  if (isLocalBrowserHost()) return 'http://127.0.0.1:3000'
  return DEFAULT_REMOTE_API_BASE
}