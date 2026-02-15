import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { setCookie, getCookie, deleteCookie } from 'hono/cookie'
import { homepage } from './pages/homepage'
import { demoPage } from './pages/demo'
import { registerPage } from './pages/register'
import { mainPage } from './pages/main'
import { watchPage } from './pages/watch'
import { myPage } from './pages/mypage'
import { announcementsPage } from './pages/announcements'
import { archivePage } from './pages/archive'
import { communityPage } from './pages/community'
import { UserProfile } from './pages/user-profile'
import { termsPage } from './pages/terms'
import { privacyPage } from './pages/privacy'
import { legalPage } from './pages/legal'
// contactPage removed - merged into tickets
import { themeVotePage } from './pages/theme-vote'
import { ticketsPage } from './pages/tickets'
import { adminTicketsPage } from './pages/admin-tickets'

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

// Serve favicon
app.get('/favicon.ico', (c) => {
  // Return a transparent 1x1 ICO to prevent 404
  return new Response(null, { status: 204 })
})

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
    
    // Create user: 500 credits for normal users, special amount for dev
    const userId = crypto.randomUUID()
    const isDevUser = user_id === 'dev'
    const credits = isDevUser ? 500000 : 500 // dev gets 500000, normal users get 500
    
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
  
  // Get registration number
  const userInfo = await c.env.DB.prepare(`
    SELECT created_at, credits FROM users WHERE id = ?
  `).bind(user.id).first()
  
  const countResult = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM users WHERE created_at <= ?
  `).bind(userInfo?.created_at).first()
  
  user.registration_number = countResult?.count || 1
  user.initial_credits = userInfo?.credits || 500
  
  return c.html(demoPage(user))
})

// Main page (Development Preview) - Always 100 credits (except dev users)
app.get('/main', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.redirect('/')
    }
    
    const user = JSON.parse(userCookie)
    
    // Dev user (user_id='dev') has infinite credits - no charge
    const isDevUser = user.user_id === 'dev'
    
    // Get fresh credits from DB
    const freshUser = await c.env.DB.prepare(
      'SELECT credits FROM users WHERE user_id = ?'
    ).bind(user.user_id).first()
    if (freshUser) {
      user.credits = freshUser.credits
    }
    
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
          UPDATE users SET credits = ? WHERE user_id = ?
        `).bind(newCredits, user.user_id).run()
      
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
    
    // Dev user - display infinity symbol (visual only)
    if (isDevUser) {
      user.creditsDisplay = '∞'
    }
    
    // Fetch debates from database
    const debatesResult = await c.env.DB.prepare(`
      SELECT id, topic, status, created_at, 
             (SELECT COUNT(*) FROM debate_votes WHERE debate_id = debates.id) as total_votes
      FROM debates 
      ORDER BY created_at DESC 
      LIMIT 50
    `).all()
    
    const debates = debatesResult.results || []
    
    // Add viewer count (for now, use vote count as proxy)
    debates.forEach((debate: any) => {
      debate.viewers = debate.total_votes || 0
    })
    
    return c.html(mainPage(user, debates))
  } catch (error) {
    console.error('Main page error:', error)
    return c.text('Internal Server Error: ' + (error as Error).message, 500)
  }
})

// Watch debate page (Development)
app.get('/watch/:debateId', async (c) => {
  const userCookie = getCookie(c, 'user')
  if (!userCookie) {
    return c.redirect('/')
  }
  
  const user = JSON.parse(userCookie)
  const debateId = c.req.param('debateId')
  
  // Get fresh credits from DB
  const freshUser = await c.env.DB.prepare(
    'SELECT credits FROM users WHERE user_id = ?'
  ).bind(user.user_id).first()
  if (freshUser) {
    user.credits = freshUser.credits
  }
  
  return c.html(watchPage(user, debateId))
})

// Watch page with query parameter
app.get('/watch', async (c) => {
  const userCookie = getCookie(c, 'user')
  if (!userCookie) {
    return c.redirect('/')
  }
  
  const user = JSON.parse(userCookie)
  const debateId = c.req.query('id') || 'default'
  
  // Get fresh credits from DB
  const freshUser = await c.env.DB.prepare(
    'SELECT credits FROM users WHERE user_id = ?'
  ).bind(user.user_id).first()
  if (freshUser) {
    user.credits = freshUser.credits
  }
  
  return c.html(watchPage(user, debateId))
})

// MyPage
app.get('/mypage', async (c) => {
  const userCookie = getCookie(c, 'user')
  if (!userCookie) {
    return c.redirect('/')
  }
  
  const user = JSON.parse(userCookie)
  
  try {
    let userData = await c.env.DB.prepare(
      'SELECT * FROM users WHERE user_id = ?'
    ).bind(user.user_id).first()
    
    if (!userData) {
      // Create user if not exists (with required columns)
      const newId = crypto.randomUUID()
      const defaultCredits = user.user_id === 'dev' ? 500000 : 500
      await c.env.DB.prepare(`
        INSERT INTO users (id, user_id, username, email, google_id, credits, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `).bind(newId, user.user_id, user.username || user.user_id, user.email || '', user.google_id || 'local_' + user.user_id, defaultCredits).run()
      
      userData = await c.env.DB.prepare(
        'SELECT * FROM users WHERE user_id = ?'
      ).bind(user.user_id).first()
    }
    
    // Dev user: credits from DB, display handled in template
    
    const enrichedUserData = {
      ...userData,
      nickname: userData.nickname || userData.username || user.username || user.user_id,
      avatar_type: userData.avatar_type || 'bottts',
      avatar_value: userData.avatar_value || '1'
    }
    
    // Sync cookie with DB data
    setCookie(c, 'user', JSON.stringify(enrichedUserData), {
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 30
    })
    
    return c.html(myPage(enrichedUserData))
  } catch (error) {
    console.error('Error loading mypage:', error)
    return c.redirect('/')
  }
})

// User Profile Page
app.get('/user/:user_id', async (c) => {
  const targetUserId = c.req.param('user_id')
  
  // Get current user (optional - can view profiles without login)
  const userCookie = getCookie(c, 'user')
  let currentUser = null
  if (userCookie) {
    try {
      currentUser = JSON.parse(userCookie)
      const currentUserData = await c.env.DB.prepare(
        'SELECT user_id, username, email, credits, avatar_url, avatar_type, avatar_value FROM users WHERE user_id = ?'
      ).bind(currentUser.user_id).first()
      currentUser = currentUserData
    } catch (error) {
      console.error('Error loading current user:', error)
    }
  }
  
  try {
    // Get target user profile
    const profileUser = await c.env.DB.prepare(
      'SELECT user_id, username, email, credits, rating, rank, avatar_url, avatar_type, avatar_value, created_at FROM users WHERE user_id = ?'
    ).bind(targetUserId).first()
    
    if (!profileUser) {
      return c.text('User not found', 404)
    }
    
    // Get debate statistics (debates table doesn't have these columns yet, using dummy data)
    const debateStats = {
      total_debates: 0,
      wins: 0,
      losses: 0,
      draws: 0
    }
    
    // Get community post count
    const postCount = await c.env.DB.prepare(
      'SELECT COUNT(*) as total FROM community_posts WHERE user_id = ?'
    ).bind(targetUserId).first()
    
    // Calculate win rate
    const total = debateStats?.total_debates || 0
    const wins = debateStats?.wins || 0
    const win_rate = total > 0 ? Math.round((wins / total) * 100) : 0
    
    const stats = {
      total_debates: debateStats?.total_debates || 0,
      wins: wins,
      losses: debateStats?.losses || 0,
      draws: debateStats?.draws || 0,
      win_rate: win_rate,
      total_posts: postCount?.total || 0
    }
    
    return c.html(<UserProfile profileUser={profileUser as any} currentUser={currentUser as any} stats={stats} />)
  } catch (error) {
    console.error('Error loading user profile:', error)
    return c.text('Error loading profile', 500)
  }
})

// Announcements Page
app.get('/announcements', async (c) => {
  const userCookie = getCookie(c, 'user')
  if (!userCookie) {
    return c.redirect('/')
  }
  
  const user = JSON.parse(userCookie)
  return c.html(announcementsPage(user))
})

// Archive Page
app.get('/archive', async (c) => {
  const userCookie = getCookie(c, 'user')
  if (!userCookie) {
    return c.redirect('/')
  }
  
  const user = JSON.parse(userCookie)
  return c.html(archivePage(user))
})

// Community Page
app.get('/community', async (c) => {
  const userCookie = getCookie(c, 'user')
  if (!userCookie) {
    return c.redirect('/')
  }
  
  const user = JSON.parse(userCookie)
  return c.html(communityPage(user))
})

// Terms Page
app.get('/terms', async (c) => {
  const userCookie = getCookie(c, 'user')
  if (!userCookie) {
    return c.redirect('/')
  }
  
  const user = JSON.parse(userCookie)
  return c.html(termsPage(user))
})

// Privacy Page
app.get('/privacy', async (c) => {
  const userCookie = getCookie(c, 'user')
  if (!userCookie) {
    return c.redirect('/')
  }
  
  const user = JSON.parse(userCookie)
  return c.html(privacyPage(user))
})

// Legal Page
app.get('/legal', async (c) => {
  const userCookie = getCookie(c, 'user')
  if (!userCookie) {
    return c.redirect('/')
  }
  
  const user = JSON.parse(userCookie)
  return c.html(legalPage(user))
})

// Contact Page - redirects to tickets (merged)
app.get('/contact', (c) => {
  return c.redirect('/tickets')
})

// Theme Vote Page
app.get('/theme-vote', async (c) => {
  const userCookie = getCookie(c, 'user')
  if (!userCookie) {
    return c.redirect('/')
  }
  
  const user = JSON.parse(userCookie)
  return c.html(themeVotePage(user))
})

// Tickets page (user)
app.get('/tickets', async (c) => {
  const userCookie = getCookie(c, 'user')
  if (!userCookie) {
    return c.redirect('/')
  }
  
  const user = JSON.parse(userCookie)
  return c.html(ticketsPage(user))
})

// Admin tickets page (dev only)
app.get('/admin/tickets', async (c) => {
  const userCookie = getCookie(c, 'user')
  if (!userCookie) {
    return c.redirect('/')
  }
  
  const user = JSON.parse(userCookie)
  if (user.user_id !== 'dev') {
    return c.redirect('/')
  }
  
  return c.html(adminTicketsPage(user))
})

// API: Profile Update
app.post('/api/profile/update', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    const { nickname, user_id, avatar_type, avatar_value, avatar_url } = await c.req.json()
    
    if (!nickname || !user_id) {
      return c.json({ success: false, error: '必須項目が入力されていません' })
    }
    
    // Check if user_id is unique (if changed)
    if (user_id !== user.user_id) {
      const existing = await c.env.DB.prepare(
        'SELECT user_id FROM users WHERE user_id = ?'
      ).bind(user_id).first()
      
      if (existing) {
        return c.json({ success: false, error: 'このユーザーIDは既に使用されています' })
      }
    }
    
    // Update user profile (including avatar_url)
    await c.env.DB.prepare(
      'UPDATE users SET nickname = ?, user_id = ?, avatar_type = ?, avatar_value = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?'
    ).bind(nickname, user_id, avatar_type || 'bottts', avatar_value || '1', avatar_url || null, user.user_id).run()
    
    // Get updated user
    const updatedUser = await c.env.DB.prepare(
      'SELECT * FROM users WHERE user_id = ?'
    ).bind(user_id).first()
    
    // Update cookie
    setCookie(c, 'user', JSON.stringify(updatedUser), {
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 30
    })
    
    return c.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Profile update error:', error)
    return c.json({ success: false, error: 'サーバーエラーが発生しました' }, 500)
  }
})

// API: Avatar Upload
app.post('/api/avatar/upload', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    const formData = await c.req.formData()
    const file = formData.get('avatar')
    
    if (!file || !(file instanceof File)) {
      return c.json({ success: false, error: 'No file uploaded' }, 400)
    }
    
    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      return c.json({ success: false, error: 'File too large (max 2MB)' }, 400)
    }
    
    // Generate unique filename
    const ext = file.name.split('.').pop()
    const filename = `avatars/${user.user_id}-${Date.now()}.${ext}`
    
    // Upload to R2 (if R2 is available, otherwise use base64)
    if (c.env.R2) {
      const arrayBuffer = await file.arrayBuffer()
      await c.env.R2.put(filename, arrayBuffer, {
        httpMetadata: {
          contentType: file.type
        }
      })
      
      // Return R2 URL (or public URL if configured)
      return c.json({ success: true, url: `/api/avatar/${filename}` })
    } else {
      // Fallback: Store as base64 data URL
      const arrayBuffer = await file.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      const dataUrl = `data:${file.type};base64,${base64}`
      
      return c.json({ success: true, url: dataUrl })
    }
  } catch (error) {
    console.error('Avatar upload error:', error)
    return c.json({ success: false, error: 'Upload failed' }, 500)
  }
})

// API: Serve Avatar from R2
app.get('/api/avatar/:path{.*}', async (c) => {
  try {
    const path = c.req.param('path')
    
    if (c.env.R2) {
      const object = await c.env.R2.get(path)
      
      if (!object) {
        return c.notFound()
      }
      
      return new Response(object.body, {
        headers: {
          'Content-Type': object.httpMetadata?.contentType || 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000'
        }
      })
    }
    
    return c.notFound()
  } catch (error) {
    console.error('Serve avatar error:', error)
    return c.notFound()
  }
})

// API: Get Announcements
app.get('/api/announcements', async (c) => {
  try {
    // Get current user for reaction status
    const userCookie = getCookie(c, 'user')
    let currentUserId = null
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie)
        currentUserId = user.user_id
      } catch (e) {
        // Continue without user
      }
    }
    
    // Get announcements with reaction counts
    const announcements = await c.env.DB.prepare(`
      SELECT 
        a.*,
        (SELECT COUNT(*) FROM announcement_reactions WHERE announcement_id = a.id) as reaction_count,
        (SELECT COUNT(*) FROM announcement_reactions WHERE announcement_id = a.id AND user_id = ?) as user_has_reacted
      FROM announcements a
      ORDER BY a.created_at DESC
      LIMIT 50
    `).bind(currentUserId || '').all()
    
    return c.json({ success: true, announcements: announcements.results || [] })
  } catch (error) {
    console.error('Get announcements error:', error)
    return c.json({ success: false, error: 'Failed to load announcements' }, 500)
  }
})

// API: Post Announcement (Dev Only)
app.post('/api/announcements/post', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    
    // Only dev can post
    if (user.user_id !== 'dev') {
      return c.json({ success: false, error: 'Permission denied' }, 403)
    }
    
    const { content, type } = await c.req.json()
    
    if (!content) {
      return c.json({ success: false, error: 'Content required' })
    }
    
    // Use NULL for id to let autoincrement work
    await c.env.DB.prepare(
      'INSERT INTO announcements (content, type, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)'
    ).bind(content, type || 'announcement').run()
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Post announcement error:', error)
    return c.json({ success: false, error: 'Failed to post announcement' }, 500)
  }
})

// API: Delete Announcement (Dev Only)
app.delete('/api/announcements/:id', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    
    // Only dev can delete
    if (user.user_id !== 'dev') {
      return c.json({ success: false, error: 'Permission denied' }, 403)
    }
    
    const announcementId = c.req.param('id')
    
    // Delete announcement (reactions will cascade delete)
    await c.env.DB.prepare(
      'DELETE FROM announcements WHERE id = ?'
    ).bind(announcementId).run()
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Delete announcement error:', error)
    return c.json({ success: false, error: 'Failed to delete announcement' }, 500)
  }
})

// API: Toggle Announcement Reaction
app.post('/api/announcements/:id/reaction', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    const announcementId = c.req.param('id')
    const { emoji } = await c.req.json()
    
    // Check if reaction exists
    const existing = await c.env.DB.prepare(
      'SELECT id FROM announcement_reactions WHERE announcement_id = ? AND user_id = ?'
    ).bind(announcementId, user.user_id).first()
    
    if (existing) {
      // Remove reaction
      await c.env.DB.prepare(
        'DELETE FROM announcement_reactions WHERE announcement_id = ? AND user_id = ?'
      ).bind(announcementId, user.user_id).run()
    } else {
      // Add reaction
      await c.env.DB.prepare(
        'INSERT INTO announcement_reactions (announcement_id, user_id, emoji, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
      ).bind(announcementId, user.user_id, emoji || '👍').run()
    }
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Announcement reaction error:', error)
    return c.json({ success: false, error: 'Failed to toggle reaction' }, 500)
  }
})

// API: Get Archive Debates
app.get('/api/archive/debates', async (c) => {
  try {
    const debates = await c.env.DB.prepare(`
      SELECT 
        id,
        debate_id,
        title as theme,
        agree_position as opinion_a,
        disagree_position as opinion_b,
        agree_votes,
        disagree_votes,
        winner,
        'completed' as status,
        CASE 
          WHEN messages IS NOT NULL AND LENGTH(messages) > 2
          THEN (LENGTH(messages) - LENGTH(REPLACE(messages, '"content"', ''))) / LENGTH('"content"')
          ELSE 0
        END as message_count,
        created_at
      FROM archived_debates 
      ORDER BY archived_at DESC 
      LIMIT 50
    `).all()
    
    return c.json({ success: true, debates: debates.results || [] })
  } catch (error) {
    console.error('Get archive debates error:', error)
    return c.json({ success: false, error: 'Failed to load debates' }, 500)
  }
})

// API: Get Archive Debate Detail (with messages)
app.get('/api/archive/detail/:id', async (c) => {
  try {
    const archiveId = c.req.param('id')
    
    const debate = await c.env.DB.prepare(`
      SELECT * FROM archived_debates WHERE id = ?
    `).bind(archiveId).first()
    
    if (!debate) {
      return c.json({ success: false, error: 'Archive not found' }, 404)
    }
    
    return c.json({ success: true, debate })
  } catch (error) {
    console.error('Get archive detail error:', error)
    return c.json({ success: false, error: 'Failed to load archive detail' }, 500)
  }
})

// API: Check archive purchase status for user
app.get('/api/archive/purchased', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: true, purchased_ids: [] })
    }
    
    const user = JSON.parse(userCookie)
    
    // Dev user has access to all
    if (user.user_id === 'dev') {
      return c.json({ success: true, purchased_ids: ['all'] })
    }
    
    const views = await c.env.DB.prepare(`
      SELECT debate_id FROM archive_views WHERE user_id = ?
    `).bind(user.user_id).all()
    
    const purchasedIds = (views.results || []).map((v: any) => v.debate_id)
    
    return c.json({ success: true, purchased_ids: purchasedIds })
  } catch (error) {
    console.error('Check purchased error:', error)
    return c.json({ success: true, purchased_ids: [] })
  }
})

// API: Get AI model info (for debate page display)
app.get('/api/debate/model-info', async (c) => {
  return c.json({ 
    success: true, 
    model: 'gpt-4.1-nano',
    display_name: 'GPT-4.1 Nano'
  })
})

// API: Purchase Archive Access
app.post('/api/archive/purchase', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    const { debate_id } = await c.req.json()
    
    // Dev user bypasses credit check
    const isDevUser = user.user_id === 'dev'
    
    // Check if already purchased
    const existingView = await c.env.DB.prepare(
      'SELECT id FROM archive_views WHERE user_id = ? AND debate_id = ?'
    ).bind(user.user_id, debate_id).first()
    
    if (existingView) {
      // Already purchased - grant access without charging
      return c.json({ success: true, session_id: crypto.randomUUID(), already_purchased: true })
    }
    
    if (!isDevUser) {
      const userData = await c.env.DB.prepare(
        'SELECT credits FROM users WHERE user_id = ?'
      ).bind(user.user_id).first()
      
      const currentCredits = userData?.credits || 0
      
      if (currentCredits < 50) {
        return c.json({ success: false, error: 'クレジットが不足しています（必要: 50クレジット）' })
      }
      
      // Deduct 50 credits
      await c.env.DB.prepare(
        'UPDATE users SET credits = credits - 50 WHERE user_id = ?'
      ).bind(user.user_id).run()
      
      // Record credit transaction
      await c.env.DB.prepare(`
        INSERT INTO credit_transactions (id, user_id, amount, type, reason, created_at)
        VALUES (?, ?, ?, 'spend', 'archive_view', datetime('now'))
      `).bind(crypto.randomUUID(), user.user_id, -50).run()
    }
    
    // Create session
    const sessionId = crypto.randomUUID()
    
    await c.env.DB.prepare(
      'INSERT INTO archive_views (id, user_id, debate_id, session_id, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)'
    ).bind(crypto.randomUUID(), user.user_id, debate_id, sessionId).run()
    
    return c.json({ success: true, session_id: sessionId })
  } catch (error) {
    console.error('Purchase error:', error)
    return c.json({ success: false, error: 'サーバーエラーが発生しました' }, 500)
  }
})

// API: Save Debate to Archive
app.post('/api/archive/save', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    
    // Only dev can save to archive
    if (user.user_id !== 'dev') {
      return c.json({ success: false, error: 'Permission denied' }, 403)
    }
    
    const { debate_id, title, topic, agree_position, disagree_position, agree_votes, disagree_votes, winner, messages } = await c.req.json()
    
    // Insert into archived_debates table
    await c.env.DB.prepare(`
      INSERT INTO archived_debates (debate_id, title, topic, agree_position, disagree_position, agree_votes, disagree_votes, winner, messages, created_at, archived_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(debate_id, title, topic, agree_position, disagree_position, agree_votes, disagree_votes, winner, messages).run()
    
    console.log('Debate archived:', { debate_id, title, winner })
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Archive save error:', error)
    return c.json({ success: false, error: 'Failed to save archive' }, 500)
  }
})

// API: Get Community Posts
app.get('/api/community/posts', async (c) => {
  try {
    const lang = c.req.query('language') || 'ja'
    
    // Get current user for reaction status
    const userCookie = getCookie(c, 'user')
    let currentUserId = null
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie)
        currentUserId = user.user_id
      } catch (e) {
        // Continue without user
      }
    }
    
    // Get posts with reaction counts and user avatar info
    const posts = await c.env.DB.prepare(`
      SELECT 
        cp.*,
        COALESCE(u.avatar_url, '') as avatar_url,
        COALESCE(u.avatar_type, 'bottts') as avatar_type,
        COALESCE(u.avatar_value, '1') as avatar_value,
        (SELECT COUNT(*) FROM post_reactions WHERE post_id = cp.id) as reaction_count,
        (SELECT COUNT(*) FROM post_reactions WHERE post_id = cp.id AND user_id = ?) as user_has_reacted
      FROM community_posts cp
      LEFT JOIN users u ON cp.user_id = u.user_id
      WHERE cp.language = ?
      ORDER BY cp.created_at ASC
      LIMIT 100
    `).bind(currentUserId || '', lang).all()
    
    return c.json({ success: true, posts: posts.results || [] })
  } catch (error) {
    console.error('Get posts error:', error)
    return c.json({ success: false, error: 'Failed to load posts' }, 500)
  }
})

// API: Create Community Post
app.post('/api/community/post', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    const { content, language } = await c.req.json()
    
    if (!content || !language) {
      return c.json({ success: false, error: 'Content and language required' })
    }
    
    // Use NULL for id to let autoincrement work
    await c.env.DB.prepare(
      'INSERT INTO community_posts (user_id, language, content, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
    ).bind(user.user_id, language, content).run()
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Create post error:', error)
    return c.json({ success: false, error: 'Failed to create post' }, 500)
  }
})

// API: Delete Community Post
app.delete('/api/community/post/:id', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    const postId = c.req.param('id')
    
    // Check if user owns the post
    const post = await c.env.DB.prepare(
      'SELECT user_id FROM community_posts WHERE id = ?'
    ).bind(postId).first()
    
    if (!post) {
      return c.json({ success: false, error: 'Post not found' }, 404)
    }
    
    if (post.user_id !== user.user_id) {
      return c.json({ success: false, error: 'Unauthorized' }, 403)
    }
    
    // Delete post (reactions will cascade delete)
    await c.env.DB.prepare(
      'DELETE FROM community_posts WHERE id = ?'
    ).bind(postId).run()
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Delete post error:', error)
    return c.json({ success: false, error: 'Failed to delete post' }, 500)
  }
})

// API: Toggle Reaction
app.post('/api/community/post/:id/reaction', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    const postId = c.req.param('id')
    const { emoji } = await c.req.json()
    
    // Check if reaction exists
    const existing = await c.env.DB.prepare(
      'SELECT id FROM post_reactions WHERE post_id = ? AND user_id = ?'
    ).bind(postId, user.user_id).first()
    
    if (existing) {
      // Remove reaction
      await c.env.DB.prepare(
        'DELETE FROM post_reactions WHERE post_id = ? AND user_id = ?'
      ).bind(postId, user.user_id).run()
    } else {
      // Add reaction
      await c.env.DB.prepare(
        'INSERT INTO post_reactions (post_id, user_id, emoji, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
      ).bind(postId, user.user_id, emoji || '❤️').run()
    }
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Reaction error:', error)
    return c.json({ success: false, error: 'Failed to toggle reaction' }, 500)
  }
})

// API: Community Stats
app.get('/api/community/stats', async (c) => {
  try {
    const lang = c.req.query('language') || 'ja'
    
    const result = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM community_posts WHERE language = ?'
    ).bind(lang).first()
    
    return c.json({ success: true, count: result?.count || 0 })
  } catch (error) {
    console.error('Get stats error:', error)
    return c.json({ success: false, count: 0 })
  }
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
    // OpenAI Prompt Cachingは自動動作（1024トークン以上で有効、90%割引）
    // 重要: 静的コンテンツを先頭に配置し、プレフィックスを一致させる
    const messages: any[] = []
    
    // 1. システムプロンプト（静的コンテンツ = キャッシュ対象）
    messages.push({
      role: 'system',
      content: systemPrompt
    })
    
    // 2. 会話履歴を全て送信（user/assistantを交互に配置）
    if (conversationHistory && conversationHistory.length > 0) {
      for (let i = 0; i < conversationHistory.length; i++) {
        const msg = conversationHistory[i]
        // 偶数番目はuser、奇数番目はassistant（交互に配置）
        messages.push({
          role: i % 2 === 0 ? 'user' : 'assistant',
          content: msg.content
        })
      }
      
      // 3. 最後に固定の指示を追加（キャッシュプレフィックスを維持）
      messages.push({
        role: conversationHistory.length % 2 === 0 ? 'user' : 'assistant',
        content: '続けてください。180文字以内、句読点で終わること。'
      })
    } else {
      // 初回は通常通り
      messages.push({
        role: 'user',
        content: '【重要】必ず180文字以内、句読点（。）で終わること。180文字を超えた場合は即座に無効です。180文字で完結する内容にしてください。簡潔に主張してください。'
      })
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-nano',  // Prompt Cachingサポート（75%割引）
        messages: messages,
        max_tokens: maxTokens || 220,  // 180文字（日本語） ≈ 220トークン
        temperature: temperature || 0.7
      })
    })
    
    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI API error:', error)
      return c.json({ error: 'AI generation failed' }, 500)
    }
    
    const data = await response.json()
    let message = data.choices[0].message.content.trim()
    
    // 実際に使用されたモデル情報を取得
    const usedModel = data.model || 'gpt-4.1-nano'
    
    // トークン使用量をログ出力（キャッシュヒット率確認）
    // gpt-4.1-nanoは90%キャッシュ割引（$0.10 → $0.01/1M cached tokens）
    if (data.usage) {
      const cached = data.usage.prompt_tokens_details?.cached_tokens || 0
      const cacheRate = data.usage.prompt_tokens > 0 
        ? ((cached / data.usage.prompt_tokens) * 100).toFixed(1)
        : '0.0'
      console.log(`[Debate] Tokens - Input: ${data.usage.prompt_tokens}, Cached: ${cached} (${cacheRate}%), Output: ${data.usage.completion_tokens}`)
    }
    
    // [意見A], [意見B], [意見C]などのラベルを削除
    message = message.replace(/^\[意見[ABC]\]:\s*/g, '')
    
    // 180文字制限を厳格に実施（必ず句読点で終わるように調整）
    if (message.length > 180) {
      // 180文字でカット
      message = message.substring(0, 180)
      
      // 最後の句読点（。、！、？）を探す
      const lastPunctuationIndex = Math.max(
        message.lastIndexOf('。'),
        message.lastIndexOf('！'),
        message.lastIndexOf('？')
      )
      
      // 句読点が見つかった場合、そこで終了
      if (lastPunctuationIndex > 120) { // 最低でも120文字は確保
        message = message.substring(0, lastPunctuationIndex + 1)
      } else {
        // 句読点がない場合は強制的に「。」を追加
        message = message.substring(0, 179) + '。'
      }
    } else if (!message.endsWith('。') && !message.endsWith('！') && !message.endsWith('？')) {
      // 180文字未満でも句読点で終わっていない場合は「。」を追加
      if (message.length < 180) {
        message = message + '。'
      }
    }
    
    return c.json({ message, model: usedModel })
  } catch (error) {
    console.error('Debate generation error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// API: AI評価（JSON形式を強制）
app.post('/api/debate/evaluate', async (c) => {
  try {
    const { prompt } = await c.req.json()
    const apiKey = c.env.OPENAI_API_KEY
    
    if (!apiKey) {
      return c.json({ error: 'OpenAI API key not configured' }, 500)
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-nano',
        messages: [
          {
            role: 'system',
            content: '公平な審査員。立場の一貫性を最重視。必ずJSON形式で返してください。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 60,
        temperature: 0.5,
        response_format: { type: 'json_object' }  // JSON形式を強制
      })
    })
    
    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI API error:', error)
      return c.json({ error: 'AI evaluation failed' }, 500)
    }
    
    const data = await response.json()
    let message = data.choices[0].message.content.trim()
    
    // トークン使用量をログ出力
    if (data.usage) {
      const cached = data.usage.prompt_tokens_details?.cached_tokens || 0
      const cacheRate = data.usage.prompt_tokens > 0 
        ? ((cached / data.usage.prompt_tokens) * 100).toFixed(1)
        : '0.0'
      console.log(`[AI評価] Tokens - Input: ${data.usage.prompt_tokens}, Cached: ${cached} (${cacheRate}%), Output: ${data.usage.completion_tokens}`)
    }
    
    return c.json({ message })
  } catch (error) {
    console.error('AI evaluation error:', error)
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

// API: ディベートテーマを取得
app.get('/api/debate/:debateId/theme', async (c) => {
  try {
    const debateId = c.req.param('debateId')
    const { DB } = c.env
    
    const result = await DB.prepare(`
      SELECT * FROM debates WHERE id = ?
    `).bind(debateId).first()
    
    if (!result) {
      return c.json({ error: 'Debate not found' }, 404)
    }
    
    return c.json(result)
  } catch (error) {
    console.error('Theme fetch error:', error)
    return c.json({ error: 'Failed to fetch theme' }, 500)
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

// API: Get user info (always fresh from DB)
app.get('/api/user', async (c) => {
  const userCookie = getCookie(c, 'user')
  if (!userCookie) {
    return c.json({ error: 'Not authenticated' }, 401)
  }
  
  try {
    const cookieUser = JSON.parse(userCookie)
    // Always get fresh data from DB
    const dbUser = await c.env.DB.prepare(
      'SELECT user_id, username, email, credits, nickname, avatar_type, avatar_value, avatar_url, rating, rank FROM users WHERE user_id = ?'
    ).bind(cookieUser.user_id).first()
    
    if (dbUser) {
      // Update cookie with fresh data
      setCookie(c, 'user', JSON.stringify(dbUser), {
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 60 * 60 * 24 * 30
      })
      return c.json(dbUser)
    }
    return c.json(cookieUser)
  } catch (error) {
    console.error('Get user error:', error)
    return c.json(JSON.parse(userCookie))
  }
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

// API: Contact form submission
app.post('/api/contact', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    const { category, email, subject, message } = await c.req.json()
    
    if (!category || !email || !subject || !message) {
      return c.json({ success: false, error: 'Missing required fields' }, 400)
    }
    
    // Store in database
    await c.env.DB.prepare(`
      INSERT INTO contact_messages (user_id, email, category, subject, message, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).bind(user.user_id, email, category, subject, message).run()
    
    console.log('Contact form submission:', { user_id: user.user_id, category, subject })
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Contact error:', error)
    return c.json({ success: false, error: 'Failed to submit' }, 500)
  }
})

// API: Get theme votes
app.get('/api/theme-votes', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    let currentUserId = null
    if (userCookie) {
      const user = JSON.parse(userCookie)
      currentUserId = user.user_id
    }
    
    const category = c.req.query('category') || 'all'
    const sort = c.req.query('sort') || 'votes'
    
    let query = `
      SELECT 
        tp.id,
        tp.title,
        tp.agree_opinion,
        tp.disagree_opinion,
        tp.category,
        tp.proposed_by,
        tp.vote_count,
        tp.created_at,
        CASE WHEN tv.user_id IS NOT NULL THEN 1 ELSE 0 END as has_voted
      FROM theme_proposals tp
      LEFT JOIN theme_votes tv ON tp.id = tv.theme_id AND tv.user_id = ?
      WHERE tp.status = 'active'
    `
    
    const params = [currentUserId || '']
    
    if (category !== 'all') {
      query += ' AND tp.category = ?'
      params.push(category)
    }
    
    if (sort === 'votes') {
      query += ' ORDER BY tp.vote_count DESC, tp.created_at DESC'
    } else {
      query += ' ORDER BY tp.created_at DESC'
    }
    
    const stmt = c.env.DB.prepare(query).bind(...params)
    const { results } = await stmt.all()
    
    return c.json({ success: true, themes: results || [] })
  } catch (error) {
    console.error('Get themes error:', error)
    return c.json({ success: false, error: 'Failed to load themes' }, 500)
  }
})

// API: Propose theme
app.post('/api/theme-votes/propose', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    const isDevUser = user.user_id === 'dev'
    
    // Always get fresh credits from DB (cookie may be stale)
    const freshUserData = await c.env.DB.prepare(
      'SELECT credits FROM users WHERE user_id = ?'
    ).bind(user.user_id).first()
    
    if (!freshUserData) {
      return c.json({ success: false, error: 'ユーザーが見つかりません' }, 404)
    }
    
    const currentCredits = freshUserData.credits as number
    
    // Check if user has enough credits (dev skips)
    if (!isDevUser && currentCredits < 10) {
      return c.json({ success: false, error: 'クレジットが不足しています（必要: 10クレジット）' }, 400)
    }
    
    const { title, agree_opinion, disagree_opinion, category } = await c.req.json()
    
    if (!title || !agree_opinion || !disagree_opinion) {
      return c.json({ success: false, error: 'すべての必須項目を入力してください' }, 400)
    }
    
    // Insert theme proposal (status='active' so it appears in list)
    await c.env.DB.prepare(`
      INSERT INTO theme_proposals (title, agree_opinion, disagree_opinion, category, proposed_by, status, vote_count, created_at)
      VALUES (?, ?, ?, ?, ?, 'active', 0, datetime('now'))
    `).bind(title, agree_opinion, disagree_opinion, category || 'other', user.user_id).run()
    
    // Deduct credits (skip for dev)
    if (!isDevUser) {
      await c.env.DB.prepare(`
        UPDATE users SET credits = credits - 10 WHERE user_id = ?
      `).bind(user.user_id).run()
      
      await c.env.DB.prepare(`
        INSERT INTO credit_transactions (id, user_id, amount, type, reason, created_at)
        VALUES (?, ?, ?, 'spend', 'テーマ提案', datetime('now'))
      `).bind(crypto.randomUUID(), user.user_id, -10).run()
    }
    
    console.log('Theme proposal:', { user_id: user.user_id, title })
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Submit theme error:', error)
    return c.json({ success: false, error: 'テーマの提案に失敗しました: ' + (error as Error).message }, 500)
  }
})

// API: Vote for theme
app.post('/api/theme-votes/:id/vote', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    const themeId = c.req.param('id')
    
    // Check credits from DB
    const voteUserData = await c.env.DB.prepare('SELECT credits FROM users WHERE user_id = ?').bind(user.user_id).first()
    if ((voteUserData?.credits || 0) < 5) {
      return c.json({ success: false, error: 'クレジットが不足しています' }, 400)
    }
    
    // Check if already voted
    const existingVote = await c.env.DB.prepare(`
      SELECT id FROM theme_votes WHERE theme_id = ? AND user_id = ?
    `).bind(themeId, user.user_id).first()
    
    if (existingVote) {
      return c.json({ success: false, error: 'すでに投票済みです' }, 400)
    }
    
    // Insert vote
    await c.env.DB.prepare(`
      INSERT INTO theme_votes (theme_id, user_id, created_at)
      VALUES (?, ?, datetime('now'))
    `).bind(themeId, user.user_id).run()
    
    // Increment vote count
    await c.env.DB.prepare(`
      UPDATE theme_proposals SET vote_count = vote_count + 1 WHERE id = ?
    `).bind(themeId).run()
    
    // Deduct credits
    await c.env.DB.prepare(`
      UPDATE users SET credits = credits - 5 WHERE user_id = ?
    `).bind(user.user_id).run()
    
    await c.env.DB.prepare(`
      INSERT INTO credit_transactions (id, user_id, amount, type, reason, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).bind(crypto.randomUUID(), user.user_id, -5, 'spend', 'テーマ投票').run()
    
    console.log('Theme vote:', { user_id: user.user_id, theme_id: themeId })
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Vote theme error:', error)
    return c.json({ success: false, error: 'Failed to vote' }, 500)
  }
})

// ==================== Support Ticket System APIs ====================

// API: Get user's tickets
app.get('/api/tickets', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    
    const tickets = await c.env.DB.prepare(`
      SELECT id, subject, status, created_at, updated_at
      FROM support_tickets
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).bind(user.user_id).all()
    
    return c.json({ success: true, tickets: tickets.results || [] })
  } catch (error) {
    console.error('Get tickets error:', error)
    return c.json({ success: false, error: 'Failed to get tickets' }, 500)
  }
})

// API: Get all tickets (dev only)
app.get('/api/admin/tickets', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    if (user.user_id !== 'dev') {
      return c.json({ success: false, error: 'Permission denied' }, 403)
    }
    
    const tickets = await c.env.DB.prepare(`
      SELECT t.id, t.user_id, t.subject, t.status, t.created_at, t.updated_at,
             u.nickname, u.email
      FROM support_tickets t
      LEFT JOIN users u ON t.user_id = u.user_id
      ORDER BY t.created_at ASC
    `).all()
    
    return c.json({ success: true, tickets: tickets.results || [] })
  } catch (error) {
    console.error('Get admin tickets error:', error)
    return c.json({ success: false, error: 'Failed to get tickets' }, 500)
  }
})

// API: Create new ticket
app.post('/api/tickets/create', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    const { subject, message } = await c.req.json()
    
    if (!subject || !message) {
      return c.json({ success: false, error: 'Subject and message are required' }, 400)
    }
    
    // Check for open ticket
    const openTicket = await c.env.DB.prepare(`
      SELECT id FROM support_tickets 
      WHERE user_id = ? AND status IN ('open', 'in_progress')
    `).bind(user.user_id).first()
    
    if (openTicket) {
      return c.json({ success: false, error: '未解決のチケットが既に存在します。新しいチケットは前のチケットが解決されてから作成できます。' }, 400)
    }
    
    const ticketId = crypto.randomUUID()
    const messageId = crypto.randomUUID()
    
    // Create ticket
    await c.env.DB.prepare(`
      INSERT INTO support_tickets (id, user_id, subject, message, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'open', datetime('now'), datetime('now'))
    `).bind(ticketId, user.user_id, subject, message).run()
    
    // Create first message
    await c.env.DB.prepare(`
      INSERT INTO ticket_messages (id, ticket_id, user_id, message, is_staff_reply, created_at)
      VALUES (?, ?, ?, ?, 0, datetime('now'))
    `).bind(messageId, ticketId, user.user_id, message).run()
    
    return c.json({ success: true, ticket_id: ticketId })
  } catch (error) {
    console.error('Create ticket error:', error)
    return c.json({ success: false, error: 'Failed to create ticket' }, 500)
  }
})

// API: Get ticket messages
app.get('/api/tickets/:id/messages', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    const ticketId = c.req.param('id')
    
    // Verify ticket ownership or dev user
    const ticket = await c.env.DB.prepare(`
      SELECT user_id FROM support_tickets WHERE id = ?
    `).bind(ticketId).first()
    
    if (!ticket) {
      return c.json({ success: false, error: 'Ticket not found' }, 404)
    }
    
    if (ticket.user_id !== user.user_id && user.user_id !== 'dev') {
      return c.json({ success: false, error: 'Permission denied' }, 403)
    }
    
    const messages = await c.env.DB.prepare(`
      SELECT m.id, m.message, m.is_staff_reply, m.created_at, u.nickname, u.user_id
      FROM ticket_messages m
      LEFT JOIN users u ON m.user_id = u.user_id
      WHERE m.ticket_id = ?
      ORDER BY m.created_at ASC
    `).bind(ticketId).all()
    
    return c.json({ success: true, messages: messages.results || [] })
  } catch (error) {
    console.error('Get ticket messages error:', error)
    return c.json({ success: false, error: 'Failed to get messages' }, 500)
  }
})

// API: Add message to ticket
app.post('/api/tickets/:id/reply', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    const ticketId = c.req.param('id')
    const { message } = await c.req.json()
    
    if (!message) {
      return c.json({ success: false, error: 'Message is required' }, 400)
    }
    
    // Verify ticket ownership or dev user
    const ticket = await c.env.DB.prepare(`
      SELECT user_id, status FROM support_tickets WHERE id = ?
    `).bind(ticketId).first()
    
    if (!ticket) {
      return c.json({ success: false, error: 'Ticket not found' }, 404)
    }
    
    if (ticket.user_id !== user.user_id && user.user_id !== 'dev') {
      return c.json({ success: false, error: 'Permission denied' }, 403)
    }
    
    // Prevent replies on resolved/closed tickets
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      return c.json({ success: false, error: 'このチケットは解決済みのため返信できません' }, 400)
    }
    
    const messageId = crypto.randomUUID()
    const isStaffReply = user.user_id === 'dev' ? 1 : 0
    
    // Add message
    await c.env.DB.prepare(`
      INSERT INTO ticket_messages (id, ticket_id, user_id, message, is_staff_reply, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).bind(messageId, ticketId, user.user_id, message, isStaffReply).run()
    
    // Update ticket timestamp and status if staff replied
    if (isStaffReply) {
      await c.env.DB.prepare(`
        UPDATE support_tickets 
        SET updated_at = datetime('now'), status = 'in_progress'
        WHERE id = ?
      `).bind(ticketId).run()
    } else {
      // User replied - just update timestamp
      await c.env.DB.prepare(`
        UPDATE support_tickets SET updated_at = datetime('now') WHERE id = ?
      `).bind(ticketId).run()
    }
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Reply ticket error:', error)
    return c.json({ success: false, error: 'Failed to reply' }, 500)
  }
})

// API: User resolves own ticket
app.post('/api/tickets/:id/resolve', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    const ticketId = c.req.param('id')
    
    // Verify ticket ownership
    const ticket = await c.env.DB.prepare(`
      SELECT user_id, status FROM support_tickets WHERE id = ?
    `).bind(ticketId).first()
    
    if (!ticket) {
      return c.json({ success: false, error: 'Ticket not found' }, 404)
    }
    
    if (ticket.user_id !== user.user_id) {
      return c.json({ success: false, error: 'Permission denied' }, 403)
    }
    
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      return c.json({ success: false, error: 'このチケットは既に解決済みです' }, 400)
    }
    
    await c.env.DB.prepare(`
      UPDATE support_tickets 
      SET status = 'resolved', 
          updated_at = datetime('now'),
          resolved_at = datetime('now')
      WHERE id = ?
    `).bind(ticketId).run()
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Resolve ticket error:', error)
    return c.json({ success: false, error: 'Failed to resolve ticket' }, 500)
  }
})

// API: Update ticket status (dev only)
app.post('/api/admin/tickets/:id/status', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    if (user.user_id !== 'dev') {
      return c.json({ success: false, error: 'Permission denied' }, 403)
    }
    
    const ticketId = c.req.param('id')
    const { status } = await c.req.json()
    
    if (!['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
      return c.json({ success: false, error: 'Invalid status' }, 400)
    }
    
    await c.env.DB.prepare(`
      UPDATE support_tickets 
      SET status = ?, 
          updated_at = datetime('now'),
          resolved_at = CASE WHEN ? IN ('resolved', 'closed') THEN datetime('now') ELSE resolved_at END
      WHERE id = ?
    `).bind(status, status, ticketId).run()
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Update ticket status error:', error)
    return c.json({ success: false, error: 'Failed to update status' }, 500)
  }
})

export default app
