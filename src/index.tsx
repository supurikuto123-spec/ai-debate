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
app.get('/demo', async (c) => {
  const userCookie = getCookie(c, 'user')
  if (!userCookie) {
    return c.redirect('/')
  }
  
  const user = JSON.parse(userCookie)
  
  // Get registration number (count of users registered before this user)
  const result = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM users WHERE created_at <= (SELECT created_at FROM users WHERE id = ?)
  `).bind(user.id).first()
  
  user.registration_number = result?.count || 1
  
  return c.html(demoPage(user))
})

// Google OAuth authentication
app.get('/auth/google', (c) => {
  const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } = c.env
  
  if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
    // Fallback to mock for development
    const mockGoogleId = 'mock_' + Date.now()
    const mockEmail = 'user' + Date.now() + '@example.com'
    const mockName = 'Test User'
    
    setCookie(c, 'google_id', mockGoogleId, { maxAge: 600 })
    setCookie(c, 'google_email', mockEmail, { maxAge: 600 })
    setCookie(c, 'google_name', mockName, { maxAge: 600 })
    
    return c.redirect('/register')
  }
  
  // Production Google OAuth
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID)
  authUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid email profile')
  authUrl.searchParams.set('access_type', 'offline')
  
  return c.redirect(authUrl.toString())
})

// Google OAuth callback
app.get('/auth/google/callback', async (c) => {
  const code = c.req.query('code')
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = c.env
  
  if (!code) {
    return c.text('Authorization code not found', 400)
  }
  
  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code'
      }).toString()
    })
    
    const tokens = await tokenResponse.json()
    
    if (!tokens.access_token) {
      console.error('Token error:', tokens)
      return c.text('Failed to get access token', 500)
    }
    
    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${tokens.access_token}` }
    })
    
    const googleUser = await userResponse.json()
    
    // Set cookies
    setCookie(c, 'google_id', googleUser.id, { httpOnly: true, secure: true, maxAge: 3600 })
    setCookie(c, 'google_email', googleUser.email, { httpOnly: true, secure: true, maxAge: 3600 })
    setCookie(c, 'google_name', googleUser.name, { httpOnly: true, secure: true, maxAge: 3600 })
    
    return c.redirect('/register')
  } catch (error) {
    console.error('OAuth error:', error)
    return c.text('Authentication failed', 500)
  }
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

// API: Get visitor count (mock implementation - real-time tracking would need KV)
app.get('/api/stats/visitors', async (c) => {
  // Simulate visitor count: random between 30-150
  const baseCount = 73
  const variance = Math.floor(Math.random() * 40) - 20
  const visitors = Math.max(30, baseCount + variance)
  
  return c.json({ count: visitors })
})

// API: Get registered user count
app.get('/api/stats/users', async (c) => {
  try {
    const result = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM users'
    ).first()
    
    const count = result?.count || 0
    return c.json({ count })
  } catch (error) {
    console.error('Error getting user count:', error)
    // Return mock data if DB unavailable
    return c.json({ count: 42 })
  }
})

export default app
