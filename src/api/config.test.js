// @vitest-environment node
import { describe, it, expect, vi, afterEach } from 'vitest'
import { resolveApiBaseUrl, DEFAULT_REMOTE_API_BASE } from './config.js'

describe('resolveApiBaseUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('uses VITE_API_BASE_URL when set', () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com/')
    vi.stubEnv('DEV', false)
    expect(resolveApiBaseUrl()).toBe('https://api.example.com')
  })

  it('in dev without env, points at local Axum default port', () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    vi.stubEnv('DEV', true)
    expect(resolveApiBaseUrl()).toBe('http://127.0.0.1:3000')
  })

  it('in prod without env and no browser, uses default Fly API', () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    vi.stubEnv('DEV', false)
    expect(resolveApiBaseUrl()).toBe(DEFAULT_REMOTE_API_BASE)
  })

  it('in prod without env on localhost page, still points at local Axum', () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    vi.stubEnv('DEV', false)
    vi.stubGlobal('window', { location: { hostname: 'localhost' } })
    expect(resolveApiBaseUrl()).toBe('http://127.0.0.1:3000')
  })

  it('in prod without env on remote host, uses default Fly API', () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    vi.stubEnv('DEV', false)
    vi.stubGlobal('window', { location: { hostname: 'myapp.vercel.app' } })
    expect(resolveApiBaseUrl()).toBe('https://easyreceiptbackend.fly.dev')
  })
})
