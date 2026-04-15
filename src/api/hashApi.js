import { resolveApiBaseUrl } from './config.js'

const HASH_PATH = '/api/hash'

function hashEndpointUrl() {
  const base = resolveApiBaseUrl()
  if (!base) return HASH_PATH
  return `${base}${HASH_PATH}`
}

/**
 * Calls `POST /api/hash` on the backend. Returns `{ hash }` on success.
 * @param {string} text
 * @returns {Promise<{ hash: string }>}
 */
export async function requestTextHash(text) {
  const res = await fetch(hashEndpointUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
    cache: 'no-store',
  })

  if (!res.ok) {
    const err = new Error(`API error: ${res.status}`)
    err.status = res.status
    throw err
  }

  const data = await res.json()
  if (typeof data?.hash !== 'string') {
    throw new Error('API error: the response did not include a hash string')
  }
  return { hash: data.hash }
}
