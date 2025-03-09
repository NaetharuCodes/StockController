import { describe, it, expect } from 'vitest'
import { app } from '../src/index.js' // Your Hono app

describe('Health endpoints', () => {
  it('GET /api/health should return 200 OK', async () => {
    const res = await app.request('/api/health')
    expect(res.status).toBe(200)
  })

  it('GET /api/health/db should return 200 OK', async () => {
    const res = await app.request('/api/health/db')
    expect(res.status).toBe(200)
  })
})