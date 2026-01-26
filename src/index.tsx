import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { setCookie, getCookie, deleteCookie } from 'hono/cookie'
import { homepage } from './pages/homepage'
import { demoPage } from './pages/demo'
import { registerPage } from './pages/register'

type Bindings = {
  DB: D1Database
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  GOOGLE_REDIRECT_URI?: string
  SESSION_SECRET?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Homepage
app.get('/', (c) => {
  const user = getCookie(c, 'user')
  return c.html(homepage(user ? JSON.parse(user) : null))
})

// Registration page
app.get('/register', (c) => {
  const googleId = getCookie(c, 'google_id')
  const email = getCookie(c, 'google_email')
  const name = getCookie(c, 'google_name')
  
  if (!googleId || !email) {
    return c.redirect('/')
  }
  
  return c.html(registerPage({ email, name: name || '' }))
})

// Handle registration submission
app.post('/api/register', async (c) => {
  const { user_id, username } = await c.req.json()
  const googleId = getCookie(c, 'google_id')
  const email = getCookie(c, 'google_email')
  
  if (!googleId || !email) {
    return c.json({ error: 'Not authenticated' }, 401)
  }
  
  // Validate user_id
  if (!/^[a-zA-Z0-9_-]{3,20}$/.test(user_id)) {
    return c.json({ error: 'ユーザーIDは3-20文字の英数字、アンダースコア、ハイフンのみ使用可能です' }, 400)
  }
  
  // Validate username
  if (!username || username.length < 1 || username.length > 30) {
    return c.json({ error: 'ユーザー名は1-30文字である必要があります' }, 400)
  }
  
  // Check forbidden words
  const forbiddenWords = ['admin', 'root', 'system', 'moderator', 'aidebate', 'official']
  const lowerUsername = username.toLowerCase()
  const lowerUserId = user_id.toLowerCase()
  
  for (const word of forbiddenWords) {
    if (lowerUsername.includes(word) || lowerUserId.includes(word)) {
      return c.json({ error: `禁止ワード "${word}" が含まれています` }, 400)
    }
  }
  
  try {
    // Check if user_id already exists
    const existing = await c.env.DB.prepare(
      'SELECT id FROM users WHERE user_id = ?'
    ).bind(user_id).first()
    
    if (existing) {
      return c.json({ error: 'このユーザーIDは既に使用されています' }, 400)
    }
    
    // Check if email already registered
    const existingEmail = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first()
    
    if (existingEmail) {
      return c.json({ error: 'このメールアドレスは既に登録されています' }, 400)
    }
    
    // Create user (pre-registration gets 500 credits, normal gets 300)
    const userId = crypto.randomUUID()
    const credits = 500 // Pre-registration bonus
    
    await c.env.DB.prepare(`
      INSERT INTO users (id, user_id, username, email, google_id, credits, is_pre_registration, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
    `).bind(userId, user_id, username, email, googleId, credits).run()
    
    // Record credit transaction
    await c.env.DB.prepare(`
      INSERT INTO credit_transactions (id, user_id, amount, type, reason, created_at)
      VALUES (?, ?, ?, 'earn', 'pre_registration_bonus', datetime('now'))
    `).bind(crypto.randomUUID(), user_id, credits).run()
    
    // Set user cookie
    const userData = { id: userId, user_id, username, email, credits }
    setCookie(c, 'user', JSON.stringify(userData), {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })
    
    // Clear temporary Google cookies
    deleteCookie(c, 'google_id')
    deleteCookie(c, 'google_email')
    deleteCookie(c, 'google_name')
    
    return c.json({ success: true, redirect: '/demo' })
  } catch (error) {
    console.error('Registration error:', error)
    return c.json({ error: 'サーバーエラーが発生しました' }, 500)
  }
})

// Demo page
app.get('/demo', (c) => {
  const userCookie = getCookie(c, 'user')
  if (!userCookie) {
    return c.redirect('/')
  }
  
  const user = JSON.parse(userCookie)
  return c.html(demoPage(user))
})

// Mock Google OAuth (for development)
// In production, use real Google OAuth
app.get('/auth/google', (c) => {
  // Mock login for development
  const mockGoogleId = 'mock_' + Date.now()
  const mockEmail = 'user' + Date.now() + '@example.com'
  const mockName = 'Test User'
  
  setCookie(c, 'google_id', mockGoogleId, { maxAge: 600 })
  setCookie(c, 'google_email', mockEmail, { maxAge: 600 })
  setCookie(c, 'google_name', mockName, { maxAge: 600 })
  
  return c.redirect('/register')
})

// Logout
app.get('/logout', (c) => {
  deleteCookie(c, 'user')
  return c.redirect('/')
})

// API: Get user info
app.get('/api/user', (c) => {
  const userCookie = getCookie(c, 'user')
  if (!userCookie) {
    return c.json({ error: 'Not authenticated' }, 401)
  }
  
  return c.json(JSON.parse(userCookie))
})

// API: Check user_id availability
app.get('/api/check-userid/:userid', async (c) => {
  const userid = c.req.param('userid')
  
  const existing = await c.env.DB.prepare(
    'SELECT id FROM users WHERE user_id = ?'
  ).bind(userid).first()
  
  return c.json({ available: !existing })
})

export default app
