import { resolveApiBaseUrl } from './config.js'

const ENTRIES_PATH = '/api/entries'

/** Fly may route each request to a different Machine; each has its own volume. */
const DELETE_MAX_ATTEMPTS = 16

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

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
  const res = await fetch(entriesEndpointUrl(), { method: 'GET', cache: 'no-store' })
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
 * When several Fly Machines run, DELETE can 404 on a Machine that never had the row;
 * we fetch the list again and retry until the row is gone or attempts are exhausted.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function requestDeleteEntry(id) {
  const path = `${ENTRIES_PATH}/${encodeURIComponent(id)}`
  const base = resolveApiBaseUrl()
  const url = base ? `${base}${path}` : path

  for (let attempt = 0; attempt < DELETE_MAX_ATTEMPTS; attempt++) {
    const res = await fetch(url, { method: 'DELETE', cache: 'no-store' })
    if (res.ok) {
      return
    }
    if (res.status === 404) {
      const rows = await requestEntries()
      const stillThere = rows.some((r) => r.id === id)
      if (!stillThere) {
        return
      }
      if (attempt + 1 >= DELETE_MAX_ATTEMPTS) {
        break
      }
      await sleep(50 + Math.floor(Math.random() * 100))
      continue
    }
    const err = new Error(`API error: ${res.status}`)
    err.status = res.status
    throw err
  }

  const err = new Error(
    'Could not delete this row after several tries. The API may be running on multiple Fly machines with separate disks. Use a single machine. Run fly scale count 1 on the deployment host.',
  )
  err.status = 503
  throw err
}

