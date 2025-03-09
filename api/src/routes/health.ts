import { Hono } from 'hono'
import prisma from '../services/prisma.js'

const app = new Hono()

// Basic health check endpoint
app.get('/', async (c) => {
  return c.json({ status: 'ok', message: 'API is running' })
})

// Test database connection
app.get('/db', async (c) => {
  try {
    // Just count the sites to verify DB connection
    const count = await prisma.site.count()
    return c.json({ 
      status: 'ok', 
      message: 'Database connection successful', 
      sitesCount: count 
    })
  } catch (error) {
    console.error('Database error:', error)
    return c.json({ 
      status: 'error', 
      message: 'Database connection failed' 
    }, 500)
  }
})

export default app