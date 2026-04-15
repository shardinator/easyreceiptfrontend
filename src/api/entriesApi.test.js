import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { requestEntries } from './entriesApi.js'

describe('requestEntries', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    vi.stubEnv('DEV', true)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: 'id1',
            count: 1,
            timestamp_ms: 1,
            text: 'a',
            hash: 'h',
          },
        ],
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('GETs the entries endpoint', async () => {
    const rows = await requestEntries()
    expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:3000/api/entries', {
      method: 'GET',
      cache: 'no-store',
    })
    expect(rows).toHaveLength(1)
    expect(rows[0].id).toBe('id1')
  })

  it('throws when status is not ok', async () => {
    globalThis.fetch.mockResolvedValueOnce({ ok: false, status: 500 })
    await expect(requestEntries()).rejects.toMatchObject({ status: 500 })
  })
})

