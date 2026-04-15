import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { requestTextHash } from './hashApi.js'

describe('requestTextHash', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    vi.stubEnv('DEV', true)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ hash: 'deadbeef' }),
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('POSTs JSON to the hash endpoint', async () => {
    const result = await requestTextHash('hello')
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:3000/api/hash',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'hello' }),
      }),
    )
    expect(result).toEqual({ hash: 'deadbeef' })
  })

  it('throws when status is not ok', async () => {
    globalThis.fetch.mockResolvedValueOnce({ ok: false, status: 404 })
    await expect(requestTextHash('x')).rejects.toMatchObject({ status: 404 })
  })

  it('throws when hash is missing', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })
    await expect(requestTextHash('x')).rejects.toThrow(/missing hash/)
  })
})
