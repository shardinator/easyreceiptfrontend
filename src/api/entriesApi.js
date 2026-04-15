import { resolveApiBaseUrl } from './config.js'

const ENTRIES_PATH = '/api/entries'

function entriesEndpointUrl() {
  const base = resolveApiBaseUrl()
  if (!base) return ENTRIES_PATH
  return `${base}${ENTRIES_PATH}`
}

/**
 * Fetches all saved entries from the backend.
 * @returns {Promise<Array<{id:string,count:number,timestamp_ms:number,text:string,hash:string}>>}
 */
export async function requestEntries() {
  const res = await fetch(entriesEndpointUrl(), { method: 'GET' })
  if (!res.ok) {
    const err = new Error(`API error: ${res.status}`)
    err.status = res.status
    throw err
  }
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

/**
 * Deletes a saved entry by id.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function requestDeleteEntry(id) {
  const path = `${ENTRIES_PATH}/${encodeURIComponent(id)}`
  const base = resolveApiBaseUrl()
  const url = base ? `${base}${path}` : path
  const res = await fetch(url, { method: 'DELETE' })
  if (res.status === 404) {
    const err = new Error('Entry not found')
    err.status = 404
    throw err
  }
  if (!res.ok) {
    const err = new Error(`API error: ${res.status}`)
    err.status = res.status
    throw err
  }
}

