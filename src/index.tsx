import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { setCookie, getCookie, deleteCookie } from 'hono/cookie'
import { homepage } from './pages/homepage'
import { demoPage } from './pages/demo'
import { registerPage } from './pages/register'
import { mainPage } from './pages/main'
import { watchPage } from './pages/watch'

type Bindings = {
  DB: D1Database
  KV: KVNamespace
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  GOOGLE_REDIRECT_URI?: string
  SESSION_SECRET?: string
  OPENAI_API_KEY?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// SEO: Serve robots.txt
app.get('/robots.txt', serveStatic({ path: './public/robots.txt' }))

// SEO: Serve sitemap.xml
app.get('/sitemap.xml', serveStatic({ path: './public/sitemap.xml' }))

// Homepage
app.get('/', async (c) => {
  const user = getCookie(c, 'user')
  
  // Track visit in database
  try {
    const visitId = crypto.randomUUID()
    const sessionId = getCookie(c, 'session_id') || crypto.randomUUID()
    
    // Set session cookie if new
    if (!getCookie(c, 'session_id')) {
      setCookie(c, 'session_id', sessionId, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      })
    }
    
    // Record visit
    await c.env.DB.prepare(`
      INSERT INTO visits (id, session_id, ip_address, user_agent, page_path, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      visitId,
      sessionId,
      c.req.header('cf-connecting-ip') || 'unknown',
      c.req.header('user-agent') || 'unknown',
      '/'
    ).run()
    
    // Track online user in KV (expires after 5 minutes)
    const onlineKey = `online:${sessionId}`
    await c.env.KV.put(onlineKey, Date.now().toString(), { expirationTtl: 300 })
  } catch (error) {
    console.error('Error tracking visit:', error)
  }
  
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
  
  // Get registration number and initial credits
  const userInfo = await c.env.DB.prepare(`
    SELECT created_at, initial_credits FROM users WHERE id = ?
  `).bind(user.id).first()
  
  const countResult = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM users WHERE created_at <= ?
  `).bind(userInfo?.created_at).first()
  
  user.registration_number = countResult?.count || 1
  user.initial_credits = userInfo?.initial_credits || 500
  
  return c.html(demoPage(user))
})

// Main page (Development Preview) - Always 100 credits (except dev users)
app.get('/main', async (c) => {
  const userCookie = getCookie(c, 'user')
  if (!userCookie) {
    return c.redirect('/')
  }
  
  const user = JSON.parse(userCookie)
  
  // Dev user (user_id='dev') has infinite credits - no charge
  const isDevUser = user.user_id === 'dev'
  
  if (!isDevUser) {
    // Check if this is the first access to /main
    const firstAccess = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM credit_transactions 
      WHERE user_id = ? AND reason = 'main_page_access'
    `).bind(user.user_id).first()
    
    if (!firstAccess || firstAccess.count === 0) {
      // First time accessing /main - charge 100 credits
      if (user.credits < 100) {
        return c.html(`
          <!DOCTYPE html>
          <html lang="ja">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=1280, initial-scale=0.5">
            <title>クレジット不足 - AI Debate</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="/static/styles.css" rel="stylesheet">
          </head>
          <body class="bg-black text-white flex items-center justify-center min-h-screen">
            <div class="text-center">
              <h1 class="text-4xl font-bold mb-4 text-red-400">クレジット不足</h1>
              <p class="text-xl mb-6">メインページの初回閲覧には<strong class="text-yellow-400">100クレジット</strong>が必要です</p>
              <p class="text-gray-400 mb-8">現在のクレジット: <strong>${user.credits}</strong></p>
              <a href="/demo" class="btn-primary inline-block px-8 py-3">マイページに戻る</a>
            </div>
          </body>
          </html>
        `)
      }
      
      // Deduct 100 credits
      const newCredits = user.credits - 100
      await c.env.DB.prepare(`
        UPDATE users SET credits = ? WHERE id = ?
      `).bind(newCredits, user.id).run()
      
      // Record credit transaction
      await c.env.DB.prepare(`
        INSERT INTO credit_transactions (id, user_id, amount, type, reason, created_at)
        VALUES (?, ?, ?, 'spend', 'main_page_access', datetime('now'))
      `).bind(crypto.randomUUID(), user.user_id, -100).run()
      
      // Update user cookie with new credits
      user.credits = newCredits
      setCookie(c, 'user', JSON.stringify(user), {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 60 * 60 * 24 * 30
      })
    }
    // Second time onwards - free access, no charge
  }
  
  // Dev user - display infinity symbol
  if (isDevUser) {
    user.creditsDisplay = '∞'
  }
  
  return c.html(mainPage(user))
})

// Watch debate page (Development)
app.get('/watch/:debateId', async (c) => {
  const userCookie = getCookie(c, 'user')
  if (!userCookie) {
    return c.redirect('/')
  }
  
  const user = JSON.parse(userCookie)
  const debateId = c.req.param('debateId')
  
  // Dev user - display infinity symbol
  if (user.user_id === 'dev') {
    user.credits = 1000000
  }
  
  return c.html(watchPage(user, debateId))
})

// API: Generate AI debate response
app.post('/api/debate/generate', async (c) => {
  try {
    const { systemPrompt, conversationHistory, maxTokens, temperature } = await c.req.json()
    const apiKey = c.env.OPENAI_API_KEY
    
    if (!apiKey) {
      return c.json({ error: 'OpenAI API key not configured' }, 500)
    }
    
    // 会話履歴をOpenAI形式のメッセージに変換
    const messages: any[] = [
      { role: 'system', content: systemPrompt }
    ]
    
    // 会話履歴を全て追加（相手の発言を読めるように）
    if (conversationHistory && conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        // 両方のAIの発言をassistantとして記録（ラベルなし）
        messages.push({
          role: 'assistant',
          content: msg.content
        })
      }
      
      // 最後に「相手の発言を踏まえて反論してください」を追加
      messages.push({
        role: 'user',
        content: '上記の議論を踏まえ、新しい視点から反論してください。130文字以内。'
      })
    } else {
      // 初回は通常通り
      messages.push({
        role: 'user',
        content: '130文字以内で簡潔に主張してください。'
      })
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: maxTokens || 80,
        temperature: temperature || 0.9
      })
    })
    
    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI API error:', error)
      return c.json({ error: 'AI generation failed' }, 500)
    }
    
    const data = await response.json()
    let message = data.choices[0].message.content.trim()
    
    // 130文字制限を厳格に実施
    if (message.length > 130) {
      message = message.substring(0, 130)
    }
    
    return c.json({ message })
  } catch (error) {
    console.error('Debate generation error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// API: 投票を保存
app.post('/api/vote', async (c) => {
  try {
    const { debateId, userId, vote } = await c.req.json()
    const { DB } = c.env
    
    // 既存の投票を更新または新規追加
    await DB.prepare(`
      INSERT INTO debate_votes (debate_id, user_id, vote)
      VALUES (?, ?, ?)
      ON CONFLICT(debate_id, user_id) DO UPDATE SET vote = excluded.vote
    `).bind(debateId, userId, vote).run()
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Vote save error:', error)
    return c.json({ error: 'Failed to save vote' }, 500)
  }
})

// API: 投票結果を取得
app.get('/api/votes/:debateId', async (c) => {
  try {
    const debateId = c.req.param('debateId')
    const { DB } = c.env
    
    const result = await DB.prepare(`
      SELECT vote, COUNT(*) as count
      FROM debate_votes
      WHERE debate_id = ?
      GROUP BY vote
    `).bind(debateId).all()
    
    const votes = { agree: 0, disagree: 0, total: 0 }
    for (const row of result.results) {
      votes[row.vote as 'agree' | 'disagree'] = row.count as number
      votes.total += row.count as number
    }
    
    return c.json(votes)
  } catch (error) {
    console.error('Vote fetch error:', error)
    return c.json({ error: 'Failed to fetch votes' }, 500)
  }
})

// API: コメントを保存
app.post('/api/comment', async (c) => {
  try {
    const { debateId, userId, username, vote, content } = await c.req.json()
    const { DB } = c.env
    
    await DB.prepare(`
      INSERT INTO debate_comments (debate_id, user_id, username, vote, content)
      VALUES (?, ?, ?, ?, ?)
    `).bind(debateId, userId, username, vote, content).run()
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Comment save error:', error)
    return c.json({ error: 'Failed to save comment' }, 500)
  }
})

// API: コメントを取得
app.get('/api/comments/:debateId', async (c) => {
  try {
    const debateId = c.req.param('debateId')
    const { DB } = c.env
    
    const result = await DB.prepare(`
      SELECT *
      FROM debate_comments
      WHERE debate_id = ?
      ORDER BY created_at ASC
      LIMIT 50
    `).bind(debateId).all()
    
    return c.json({ comments: result.results })
  } catch (error) {
    console.error('Comments fetch error:', error)
    return c.json({ error: 'Failed to fetch comments' }, 500)
  }
})

// API: コメントを削除
app.delete('/api/comments/:debateId', async (c) => {
  try {
    const debateId = c.req.param('debateId')
    const { DB } = c.env
    
    await DB.prepare(`
      DELETE FROM debate_comments
      WHERE debate_id = ?
    `).bind(debateId).run()
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Comments delete error:', error)
    return c.json({ error: 'Failed to delete comments' }, 500)
  }
})

// API: ディベートメッセージを取得
app.get('/api/debate/:debateId/messages', async (c) => {
  try {
    const debateId = c.req.param('debateId')
    const { DB } = c.env
    
    const result = await DB.prepare(`
      SELECT *
      FROM debate_messages
      WHERE debate_id = ?
      ORDER BY created_at ASC
    `).bind(debateId).all()
    
    return c.json({ messages: result.results })
  } catch (error) {
    console.error('Messages fetch error:', error)
    return c.json({ error: 'Failed to fetch messages' }, 500)
  }
})

// API: ディベートメッセージを削除
app.delete('/api/debate/:debateId/messages', async (c) => {
  try {
    const debateId = c.req.param('debateId')
    const { DB } = c.env
    
    await DB.prepare(`
      DELETE FROM debate_messages
      WHERE debate_id = ?
    `).bind(debateId).run()
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Messages delete error:', error)
    return c.json({ error: 'Failed to delete messages' }, 500)
  }
})

// API: ディベートメッセージを保存
app.post('/api/debate/message', async (c) => {
  try {
    const { debateId, side, model, content } = await c.req.json()
    const { DB } = c.env
    
    // パラメータ検証
    if (!debateId || !side || !model || !content) {
      console.error('Invalid parameters:', { debateId, side, model, content })
      return c.json({ error: 'Invalid parameters' }, 400)
    }
    
    await DB.prepare(`
      INSERT INTO debate_messages (debate_id, side, model, content)
      VALUES (?, ?, ?, ?)
    `).bind(debateId, side, model, content).run()
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Message save error:', error)
    return c.json({ error: 'Failed to save message' }, 500)
  }
})

// Google OAuth authentication
app.get('/auth/google', async (c) => {
  const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } = c.env
  
  if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
    // Fallback to mock for development
    const mockGoogleId = 'mock_' + Date.now()
    const mockEmail = 'user' + Date.now() + '@example.com'
    const mockName = 'Test User'
    
    // Check if user already exists (for mock)
    const existingUser = await c.env.DB.prepare(
      'SELECT * FROM users WHERE google_id = ? OR email = ?'
    ).bind(mockGoogleId, mockEmail).first()
    
    if (existingUser) {
      const userData = {
        id: existingUser.id,
        user_id: existingUser.user_id,
        username: existingUser.username,
        email: existingUser.email,
        credits: existingUser.credits
      }
      
      setCookie(c, 'user', JSON.stringify(userData), {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 60 * 60 * 24 * 30
      })
      
      return c.redirect('/demo')
    } else {
      setCookie(c, 'google_id', mockGoogleId, { maxAge: 600 })
      setCookie(c, 'google_email', mockEmail, { maxAge: 600 })
      setCookie(c, 'google_name', mockName, { maxAge: 600 })
      
      return c.redirect('/register')
    }
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
    
    // Check if user already exists
    const existingUser = await c.env.DB.prepare(
      'SELECT * FROM users WHERE google_id = ? OR email = ?'
    ).bind(googleUser.id, googleUser.email).first()
    
    if (existingUser) {
      // Existing user - direct login
      const userData = {
        id: existingUser.id,
        user_id: existingUser.user_id,
        username: existingUser.username,
        email: existingUser.email,
        credits: existingUser.credits
      }
      
      setCookie(c, 'user', JSON.stringify(userData), {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      })
      
      return c.redirect('/demo')
    } else {
      // New user - go to registration
      setCookie(c, 'google_id', googleUser.id, { httpOnly: true, secure: true, maxAge: 3600 })
      setCookie(c, 'google_email', googleUser.email, { httpOnly: true, secure: true, maxAge: 3600 })
      setCookie(c, 'google_name', googleUser.name, { httpOnly: true, secure: true, maxAge: 3600 })
      
      return c.redirect('/register')
    }
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

// API: Get online connection count (real-time tracking with KV)
app.get('/api/stats/online', async (c) => {
  try {
    // Get all online users from KV (keys starting with 'online:')
    const list = await c.env.KV.list({ prefix: 'online:' })
    const onlineCount = list.keys.length
    
    return c.json({ count: onlineCount })
  } catch (error) {
    console.error('Error getting online count:', error)
    return c.json({ count: 0 })
  }
})

// API: Get total visitor count (from database)
app.get('/api/stats/visitors', async (c) => {
  try {
    const result = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM visits'
    ).first()
    
    const count = result?.count || 0
    return c.json({ count })
  } catch (error) {
    console.error('Error getting visitor count:', error)
    return c.json({ count: 0 })
  }
})

// API: Get registered user count (from database)
app.get('/api/stats/users', async (c) => {
  try {
    const result = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM users'
    ).first()
    
    const count = result?.count || 0
    return c.json({ count })
  } catch (error) {
    console.error('Error getting user count:', error)
    return c.json({ count: 0 })
  }
})

export default app
