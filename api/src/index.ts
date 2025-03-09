import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import healthRoutes from './routes/health.js'

const app = new Hono()

// Middleware
app.use("*", logger())

// Routes
app.route('/api/health', healthRoutes)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
serve({
  fetch: app.fetch,
  port: PORT
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
