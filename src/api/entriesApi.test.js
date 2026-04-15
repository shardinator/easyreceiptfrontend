import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { requestDeleteEntry, requestEntries } from './entriesApi.js'

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

describe('requestDeleteEntry', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    vi.stubEnv('DEV', true)
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('succeeds on first 204', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 204 }))
    await requestDeleteEntry('abc')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('treats 404 as success when entry is not in list anymore', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 404 })
        .mockResolvedValueOnce({ ok: true, json: async () => [] }),
    )
    await requestDeleteEntry('gone')
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('retries DELETE after 404 when entry still appears in GET', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 404 })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [
            { id: 'row1', count: 1, timestamp_ms: 1, text: 'a', hash: 'h' },
          ],
        })
        .mockResolvedValueOnce({ ok: true, status: 204 }),
    )
    const p = requestDeleteEntry('row1')
    await vi.advanceTimersByTimeAsync(200)
    await p
    expect(fetch).toHaveBeenCalledTimes(3)
  })
})

