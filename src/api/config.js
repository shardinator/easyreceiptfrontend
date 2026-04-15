/**
 * Base URL for the Rust API (no trailing slash).
 *
 * Priority:
 * 1. `VITE_API_BASE_URL` when set (production / split deploy).
 * 2. Vite **development** (`import.meta.env.DEV`): `http://127.0.0.1:3000` (direct to Axum, CORS open).
 * 3. **Production build** opened from **this machine** (`localhost` / `127.0.0.1` in the address
 *    bar, including `vite preview` or a static server for `dist/`): same `http://127.0.0.1:3000`
 *    so the browser does not rely on a proxy (many static servers return 404 for `/api/*`).
 * 4. Otherwise empty string: same origin as the page (set `VITE_API_BASE_URL` for real deploys).
 */

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
  return ''
}
