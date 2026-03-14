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
import { battlePage } from './pages/battle'
import { adminDashboardPage } from './pages/admin-dashboard'
import { notificationsPage } from './pages/notifications'

type Bindings = {
  DB: D1Database
  KV: KVNamespace
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  GOOGLE_REDIRECT_URI?: string
  SESSION_SECRET?: string
  OPENAI_API_KEY?: string
}

// DEV_ADMIN_EMAILS: read from env var (comma-separated) with hardcoded fallback
// SECURITY: Move to Cloudflare secret: wrangler pages secret put DEV_ADMIN_EMAILS
function getDevAdminEmails(env?: any): string[] {
  const envVal = env?.DEV_ADMIN_EMAILS
  if (envVal) return envVal.split(',').map((e: string) => e.trim().toLowerCase())
  // fallback (used only at module-level calls, prefer env-aware version)
  return ['supurikuto123@gmail.com', 'taison0727@gmail.com']
}
const DEV_ADMIN_EMAILS = ['supurikuto123@gmail.com', 'taison0727@gmail.com']

// Safe cookie parser to prevent 500 errors from corrupted cookies
function safeParseUserCookie(cookieValue: string | undefined): any | null {
  if (!cookieValue) return null
  try {
    return JSON.parse(cookieValue)
  } catch (e) {
    console.error('Invalid user cookie, parse failed:', e)
    return null
  }
}

// Check if user is dev admin (sync: hardcoded fallback for legacy use)
function isDevAdmin(user: any, env?: any): boolean {
  if (!user) return false
  // Original dev user check
  const emails = env ? getDevAdminEmails(env) : DEV_ADMIN_EMAILS.map(e => e.toLowerCase())
  if (user.user_id === 'dev' && !!user.email && emails.some((email: string) => email === user.email.toLowerCase())) return true
  // Cookie-based is_dev flag (set at login from DB)
  if (user.is_dev === 1 || user.is_dev === true) return true
  return false
}

// Check if user is dev admin via DB (async, most accurate)
async function isDevAdminDB(user: any, env: any): Promise<boolean> {
  if (!user) return false
  // Original dev user check (no DB needed)
  const emails = getDevAdminEmails(env)
  if (user.user_id === 'dev' && !!user.email && emails.some((email: string) => email === user.email.toLowerCase())) return true
  // DB check for granted dev users
  try {
    const row = await env.DB.prepare('SELECT is_dev FROM users WHERE user_id = ?').bind(user.user_id).first()
    if (row && (row.is_dev === 1 || row.is_dev === true)) return true
  } catch (e) {}
  return false
}

// Minimal user data for cookie (prevents 502 Bad Gateway from large cookies)
function getMinimalUser(user: any): any {
  if (!user) return null;
  return {
    user_id: user.user_id,
    username: user.username,
    email: user.email,
    google_id: user.google_id,
    credits: user.credits,
    nickname: user.nickname,
    avatar_type: user.avatar_type,
    avatar_value: user.avatar_value,
    rating: user.rating,
    rank: user.rank,
    is_dev: user.is_dev || 0,
  };
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

// Serve SVG favicon inline (no serveStatic needed - works in all environments)
const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#03050f"/><stop offset="100%" stop-color="#080018"/>
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00e5ff"/><stop offset="100%" stop-color="#0090ff"/>
    </linearGradient>
    <linearGradient id="magentaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff00cc"/><stop offset="100%" stop-color="#aa00ff"/>
    </linearGradient>
    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00e5ff"/><stop offset="50%" stop-color="#8800ff"/><stop offset="100%" stop-color="#ff00cc"/>
    </linearGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="1.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#bg)"/>
  <circle cx="20" cy="20" r="18" fill="#00e5ff" opacity="0.04"/>
  <circle cx="44" cy="44" r="18" fill="#ff00cc" opacity="0.04"/>
  <line x1="32" y1="6" x2="32" y2="58" stroke="#00e5ff" stroke-width="0.25" opacity="0.12"/>
  <line x1="6" y1="32" x2="58" y2="32" stroke="#ff00cc" stroke-width="0.25" opacity="0.12"/>
  <path d="M 32 9 A 23 23 0 0 0 32 55" fill="none" stroke="url(#cyanGrad)" stroke-width="2.5" stroke-linecap="round" opacity="0.9"/>
  <path d="M 32 9 A 23 23 0 0 1 32 55" fill="none" stroke="url(#magentaGrad)" stroke-width="2.5" stroke-linecap="round" opacity="0.9"/>
  <circle cx="32" cy="32" r="15" fill="none" stroke="#ffffff" stroke-width="0.4" opacity="0.08"/>
  <path d="M 22 22 L 16 22 L 16 42 L 22 42" fill="none" stroke="#00e5ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
  <path d="M 42 22 L 48 22 L 48 42 L 42 42" fill="none" stroke="#ff00cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
  <text x="32" y="37" text-anchor="middle" font-size="16" font-weight="900" font-family="Arial Black,Arial,sans-serif" fill="url(#logoGrad)" filter="url(#glow)" letter-spacing="-0.5">AI</text>
  <circle cx="10" cy="10" r="2" fill="#00e5ff" opacity="0.7"/>
  <circle cx="54" cy="10" r="2" fill="#ff00cc" opacity="0.7"/>
  <circle cx="10" cy="54" r="2" fill="#00e5ff" opacity="0.35"/>
  <circle cx="54" cy="54" r="2" fill="#ff00cc" opacity="0.35"/>
  <line x1="32" y1="6" x2="32" y2="10" stroke="#00e5ff" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
  <line x1="58" y1="32" x2="54" y2="32" stroke="#ff00cc" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
  <line x1="32" y1="58" x2="32" y2="54" stroke="#00e5ff" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
  <line x1="6" y1="32" x2="10" y2="32" stroke="#ff00cc" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
</svg>`

app.get('/favicon.svg', (c) => {
  return new Response(FAVICON_SVG, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' }
  })
})

app.get('/static/icon.svg', (c) => {
  return new Response(FAVICON_SVG, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' }
  })
})

// SEO: Serve robots.txt inline
app.get('/robots.txt', (c) => {
  return new Response('User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://ai-debate.jp/sitemap.xml\n', {
    headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'public, max-age=3600' }
  })
})

// SEO: Serve sitemap.xml dynamically (overrides static file)
// This URL can be submitted directly to Google Search Console
app.get('/sitemap.xml', async (c) => {
  const baseUrl = 'https://ai-debate.jp'
  const today = new Date().toISOString().split('T')[0]

  // Static pages
  const pages = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/theme-vote', changefreq: 'daily', priority: '0.8' },
    { loc: '/community', changefreq: 'daily', priority: '0.7' },
    { loc: '/announcements', changefreq: 'daily', priority: '0.7' },
    { loc: '/archive', changefreq: 'weekly', priority: '0.6' },
    { loc: '/battle', changefreq: 'monthly', priority: '0.5' },
    { loc: '/terms', changefreq: 'monthly', priority: '0.3' },
    { loc: '/privacy', changefreq: 'monthly', priority: '0.3' },
    { loc: '/legal', changefreq: 'monthly', priority: '0.3' },
  ]

  // Dynamic: user profile pages
  try {
    const users = await c.env.DB.prepare(
      'SELECT user_id FROM users ORDER BY created_at DESC LIMIT 100'
    ).all()
    if (users.results) {
      for (const u of users.results) {
        pages.push({ loc: `/user/${u.user_id}`, changefreq: 'weekly', priority: '0.4' })
      }
    }
  } catch (e) {
    // Ignore errors
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${baseUrl}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  })
})

// Homepage
app.get('/', async (c) => {
  const user = getCookie(c, 'user')

  // Track visit in database
  try {
    // Ensure visits table exists (idempotent)
    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS visits (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        page_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run()

    const visitId = crypto.randomUUID()
    const sessionId = getCookie(c, 'session_id') || crypto.randomUUID()

    // Set session cookie if new
    if (!getCookie(c, 'session_id')) {
      setCookie(c, 'session_id', sessionId, {
        httpOnly: true,
        secure: c.req.url.startsWith('https'),
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

  // Get fresh credits from DB if user is logged in
  let userData = null
  if (user) {
    try {
      userData = JSON.parse(user)
    } catch (e) {
      // Corrupted user cookie - clear it
      console.error('Invalid user cookie, clearing:', e)
      deleteCookie(c, 'user')
      userData = null
    }
  }
  if (userData && userData.user_id) {
    try {
      const freshUser = await c.env.DB.prepare('SELECT credits FROM users WHERE user_id = ?').bind(userData.user_id).first()
      if (freshUser) {
        userData.credits = freshUser.credits
        // Update cookie with fresh credits (MINIMAL)
        setCookie(c, 'user', JSON.stringify(getMinimalUser(userData)), {
          httpOnly: true,
          secure: c.req.url.startsWith('https'),
          sameSite: 'Lax',
          maxAge: 60 * 60 * 24 * 30
        })
      }
    } catch (e) {
      console.error('Error refreshing credits:', e)
    }
  }

  return c.html(homepage(userData))
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

    // Create user: 500 credits for normal users, 50000 for dev
    const userId = crypto.randomUUID()

    // Secure dev check based on a specific email that the developer uses
    const isDevUser = user_id === 'dev' && getDevAdminEmails(c.env).includes(email.toLowerCase())

    const credits = isDevUser ? 50000 : 500 // dev gets 50000, normal users get 500

    await c.env.DB.prepare(`
      INSERT INTO users (id, user_id, username, email, google_id, credits, is_pre_registration, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
    `).bind(userId, user_id, username, email, googleId, credits).run()

    // Record credit transaction
    await c.env.DB.prepare(`
      INSERT INTO credit_transactions (id, user_id, amount, type, reason, created_at)
      VALUES (?, ?, ?, 'earn', 'pre_registration_bonus', datetime('now'))
    `).bind(crypto.randomUUID(), user_id, credits).run()

    // Set user cookie (MINIMAL)
    const userDataToCookie = { id: userId, user_id, username, email, credits }
    setCookie(c, 'user', JSON.stringify(getMinimalUser(userDataToCookie)), {
      httpOnly: true,
      secure: c.req.url.startsWith('https'), // Set to true in production
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
  const user = safeParseUserCookie(userCookie)
  if (!user) {
    deleteCookie(c, 'user')
    return c.redirect('/')
  }

  // Get registration number
  // Get fresh user data from DB (not stale cookie)
  const freshUserData = await c.env.DB.prepare(`
    SELECT * FROM users WHERE user_id = ?
  `).bind(user.user_id).first()

  if (freshUserData) {
    user.credits = freshUserData.credits
    user.is_dev = (freshUserData as any).is_dev || 0
  }

  const userInfo = await c.env.DB.prepare(`
    SELECT created_at, credits FROM users WHERE user_id = ?
  `).bind(user.user_id).first()

  const countResult = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM users WHERE created_at <= ?
  `).bind(userInfo?.created_at).first()

  user.registration_number = countResult?.count || 1
  // Show the original registration bonus, not current balance
  user.initial_credits = (user.user_id === 'dev' && getDevAdminEmails(c.env).includes((user.email||'').toLowerCase())) ? 50000 : 500

  // Update cookie with fresh credits (MINIMAL)
  setCookie(c, 'user', JSON.stringify(getMinimalUser(user)), {
    httpOnly: true,
    secure: c.req.url.startsWith('https'),
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 30
  })

  return c.html(demoPage(user))
})

// Main page (Development Preview) - Always 100 credits (except dev users)
app.get('/main', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user) {
      deleteCookie(c, 'user')
      return c.redirect('/')
    }

    // Dev user (user_id='dev') has infinite credits - no charge
    const isDevUser = user.user_id === 'dev' && getDevAdminEmails(c.env).includes((user.email||'').toLowerCase())

    // Get fresh credits + restriction flags from DB
    // Use try/catch for new columns (credit_freeze etc.) in case migration not yet applied on production
    let freshUser: any = null
    try {
      freshUser = await c.env.DB.prepare(
        'SELECT credits, is_dev, is_banned, credit_freeze FROM users WHERE user_id = ?'
      ).bind(user.user_id).first() as any
    } catch(e) {
      // Fallback if credit_freeze column doesn't exist yet
      try {
        freshUser = await c.env.DB.prepare(
          'SELECT credits, is_dev, is_banned FROM users WHERE user_id = ?'
        ).bind(user.user_id).first() as any
      } catch(e2) {}
    }
    if (freshUser) {
      user.credits = freshUser.credits
      user.is_dev = freshUser.is_dev || 0
      // Full BAN check
      if (freshUser.is_banned) return c.redirect('/?banned=1')
    }

    if (!isDevUser) {
      // Check if this is the first access to /main
      const firstAccess = await c.env.DB.prepare(`
        SELECT COUNT(*) as count FROM credit_transactions 
        WHERE user_id = ? AND reason = 'main_page_access'
      `).bind(user.user_id).first()

      if (!firstAccess || Number(firstAccess.count) === 0) {
        // First time accessing /main - charge 100 credits
        // Skip charge if credit_freeze is active (allow access but record as free)
        const isCreditFrozen = freshUser?.credit_freeze === 1 || false
        if (!isCreditFrozen && user.credits < 100) {
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

        // Deduct 100 credits (skip if credit_freeze)
        if (!isCreditFrozen) {
          const newCredits = user.credits - 100
          await c.env.DB.prepare(`
            UPDATE users SET credits = ? WHERE user_id = ?
          `).bind(newCredits, user.user_id).run()

          // Record credit transaction
          await c.env.DB.prepare(`
            INSERT INTO credit_transactions (id, user_id, amount, type, reason, created_at)
            VALUES (?, ?, ?, 'spend', 'main_page_access', datetime('now'))
          `).bind(crypto.randomUUID(), user.user_id, -100).run()

          // Update user cookie with new credits (MINIMAL)
          user.credits = newCredits
          setCookie(c, 'user', JSON.stringify(getMinimalUser(user)), {
            httpOnly: true,
            secure: c.req.url.startsWith('https'),
            sameSite: 'Lax',
            maxAge: 60 * 60 * 24 * 30
          })
        } else {
          // credit_freeze: record as free access but still log the visit
          await c.env.DB.prepare(`
            INSERT OR IGNORE INTO credit_transactions (id, user_id, amount, type, reason, created_at)
            VALUES (?, ?, 0, 'spend', 'main_page_access', datetime('now'))
          `).bind(crypto.randomUUID(), user.user_id).run()
        }
      }
      // Second time onwards - free access, no charge
    }

    // Update last_access_at
    try { await c.env.DB.prepare('UPDATE users SET last_access_at = CURRENT_TIMESTAMP WHERE user_id = ?').bind(user.user_id).run() } catch(e) {}
    // Debates must be started via !s-x command before they appear
    let debatesResult: any = { results: [] }
    try {
      debatesResult = await c.env.DB.prepare(`
        SELECT id, topic, status, created_at, scheduled_at, agree_position, disagree_position,
               (SELECT COUNT(*) FROM debate_votes WHERE debate_id = debates.id) as total_votes
        FROM debates 
        WHERE status IN ('live', 'upcoming')
        ORDER BY 
          CASE WHEN status = 'live' THEN 0 WHEN status = 'upcoming' THEN 1 ELSE 2 END,
          created_at DESC 
        LIMIT 50
      `).all()
    } catch (e) {
      // scheduled_at column might not exist
      try {
        debatesResult = await c.env.DB.prepare(`
          SELECT id, topic, status, created_at,
                 (SELECT COUNT(*) FROM debate_votes WHERE debate_id = debates.id) as total_votes
          FROM debates 
          WHERE status IN ('live', 'upcoming')
          ORDER BY created_at DESC 
          LIMIT 50
        `).all()
      } catch (e2) {
        // status column might not exist - fallback to no debates
        debatesResult = { results: [] }
      }
    }

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
  const user = safeParseUserCookie(userCookie)
  if (!user) {
    deleteCookie(c, 'user')
    return c.redirect('/')
  }
  const debateId = c.req.param('debateId')

  // Get fresh credits and restriction flags from DB
  let watchFreshUser: any = null
  try {
    watchFreshUser = await c.env.DB.prepare(
      'SELECT credits, is_banned, debate_ban FROM users WHERE user_id = ?'
    ).bind(user.user_id).first() as any
  } catch(e) {
    watchFreshUser = await c.env.DB.prepare(
      'SELECT credits, is_banned FROM users WHERE user_id = ?'
    ).bind(user.user_id).first() as any
  }
  if (watchFreshUser) {
    user.credits = watchFreshUser.credits
    // BAN/debate_ban check
    if (watchFreshUser.is_banned) return c.redirect('/?banned=1')
    if (watchFreshUser.debate_ban) return c.redirect('/main?debate_ban=1')
  }
  // Update last_access_at
  try { await c.env.DB.prepare('UPDATE users SET last_access_at = CURRENT_TIMESTAMP WHERE user_id = ?').bind(user.user_id).run() } catch(e) {}

  return c.html(watchPage(user, debateId))
})

// Watch page with query parameter
app.get('/watch', async (c) => {
  const userCookie = getCookie(c, 'user')
  const user = safeParseUserCookie(userCookie)
  if (!user) {
    deleteCookie(c, 'user')
    return c.redirect('/')
  }
  const debateId = c.req.query('id')

  if (!debateId) {
    return c.redirect('/main')
  }

  // Get fresh credits + restriction from DB
  let watchFreshUser2: any = null
  try {
    watchFreshUser2 = await c.env.DB.prepare(
      'SELECT credits, is_banned, debate_ban FROM users WHERE user_id = ?'
    ).bind(user.user_id).first() as any
  } catch(e) {
    watchFreshUser2 = await c.env.DB.prepare(
      'SELECT credits, is_banned FROM users WHERE user_id = ?'
    ).bind(user.user_id).first() as any
  }
  if (watchFreshUser2) {
    user.credits = watchFreshUser2.credits
    if (watchFreshUser2.is_banned) return c.redirect('/?banned=1')
    if (watchFreshUser2.debate_ban) return c.redirect('/main?debate_ban=1')
  }
  // Update last_access_at
  try { await c.env.DB.prepare('UPDATE users SET last_access_at = CURRENT_TIMESTAMP WHERE user_id = ?').bind(user.user_id).run() } catch(e) {}

  return c.html(watchPage(user, debateId))
})

// MyPage
app.get('/mypage', async (c) => {
  const userCookie = getCookie(c, 'user')
  const user = safeParseUserCookie(userCookie)
  if (!user) {
    deleteCookie(c, 'user')
    return c.redirect('/')
  }

  try {
    let userData = await c.env.DB.prepare(
      'SELECT * FROM users WHERE user_id = ?'
    ).bind(user.user_id).first()

    if (!userData) {
      // Create user if not exists (with required columns)
      const newId = crypto.randomUUID()
      const isDevUser = user.user_id === 'dev' && !!user.email && getDevAdminEmails(c.env).includes((user.email||'').toLowerCase())
      const defaultCredits = isDevUser ? 50000 : 500
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
      nickname: (userData as any).nickname || (userData as any).username || user.username || user.user_id,
      avatar_type: (userData as any).avatar_type || 'bottts',
      avatar_value: (userData as any).avatar_value || '1'
    }

    // Sync cookie with fresh data (MINIMAL)
    setCookie(c, 'user', JSON.stringify(getMinimalUser(enrichedUserData)), {
      path: '/',
      httpOnly: true,
      secure: c.req.url.startsWith('https'),
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

    // Default: credits and posts are PRIVATE by default
    let privacySettings: any = {
      show_total_debates: true, show_wins: true, show_losses: true,
      show_draws: true, show_win_rate: true, show_posts: false, show_credits: false
    }
    try {
      const privacyData = await c.env.KV.get(`privacy:${targetUserId}`)
      if (privacyData) privacySettings = JSON.parse(privacyData)
    } catch (e) { }

    const stats = {
      total_debates: debateStats?.total_debates || 0,
      wins: wins,
      losses: debateStats?.losses || 0,
      draws: debateStats?.draws || 0,
      win_rate: win_rate,
      total_posts: postCount?.total || 0
    }

    return c.html(<UserProfile profileUser={profileUser as any} currentUser={currentUser as any} stats={stats} privacy={privacySettings as any} />)
  } catch (error) {
    console.error('Error loading user profile:', error)
    return c.text('Error loading profile', 500)
  }
})

// Announcements Page
app.get('/announcements', async (c) => {
  const userCookie = getCookie(c, 'user')
  const user = safeParseUserCookie(userCookie)
  if (!user) {
    deleteCookie(c, 'user')
    return c.redirect('/')
  }
  return c.html(announcementsPage(user))
})

// Archive Page
app.get('/archive', async (c) => {
  const userCookie = getCookie(c, 'user')
  const user = safeParseUserCookie(userCookie)
  if (!user) {
    deleteCookie(c, 'user')
    return c.redirect('/')
  }
  return c.html(archivePage(user))
})

// Community Page
app.get('/community', async (c) => {
  const userCookie = getCookie(c, 'user')
  const user = safeParseUserCookie(userCookie)
  if (!user) {
    deleteCookie(c, 'user')
    return c.redirect('/')
  }
  try { await c.env.DB.prepare('UPDATE users SET last_access_at = CURRENT_TIMESTAMP WHERE user_id = ?').bind(user.user_id).run() } catch(e) {}
  return c.html(communityPage(user))
})

// Terms Page
app.get('/terms', async (c) => {
  const userCookie = getCookie(c, 'user')
  const user = safeParseUserCookie(userCookie)
  if (!user) {
    deleteCookie(c, 'user')
    return c.redirect('/')
  }
  return c.html(termsPage(user))
})

// Privacy Page
app.get('/privacy', async (c) => {
  const userCookie = getCookie(c, 'user')
  const user = safeParseUserCookie(userCookie)
  if (!user) {
    deleteCookie(c, 'user')
    return c.redirect('/')
  }
  return c.html(privacyPage(user))
})

// Legal Page
app.get('/legal', async (c) => {
  const userCookie = getCookie(c, 'user')
  const user = safeParseUserCookie(userCookie)
  if (!user) {
    deleteCookie(c, 'user')
    return c.redirect('/')
  }
  return c.html(legalPage(user))
})

// Contact Page - redirects to tickets (merged)
app.get('/contact', (c) => {
  return c.redirect('/tickets')
})

// Battle Page
app.get('/battle', async (c) => {
  const userCookie = getCookie(c, 'user')
  const user = safeParseUserCookie(userCookie)
  if (!user) {
    deleteCookie(c, 'user')
    return c.redirect('/')
  }
  const freshUser = await c.env.DB.prepare('SELECT credits FROM users WHERE user_id = ?').bind(user.user_id).first()
  if (freshUser) user.credits = freshUser.credits
  try { await c.env.DB.prepare('UPDATE users SET last_access_at = CURRENT_TIMESTAMP WHERE user_id = ?').bind(user.user_id).run() } catch(e) {}

  return c.html(battlePage(user))
})

// API: Battle Start - DISABLED (battles are not yet available)
app.post('/api/battle/start', async (c) => {
  return c.json({ success: false, error: '対戦機能は現在開発中です。リリースまでお待ちください。' }, 403)
})

// Theme Vote Page
app.get('/theme-vote', async (c) => {
  const userCookie = getCookie(c, 'user')
  const user = safeParseUserCookie(userCookie)
  if (!user) {
    deleteCookie(c, 'user')
    return c.redirect('/')
  }
  return c.html(themeVotePage(user))
})

// Tickets page (user)
app.get('/tickets', async (c) => {
  const userCookie = getCookie(c, 'user')
  const user = safeParseUserCookie(userCookie)
  if (!user) {
    deleteCookie(c, 'user')
    return c.redirect('/')
  }
  return c.html(ticketsPage(user))
})

// Admin tickets page (dev only)
// Admin Dashboard (dev only)
app.get('/admin/dashboard', async (c) => {
  const userCookie = getCookie(c, 'user')
  const user = safeParseUserCookie(userCookie)
  if (!user) return c.redirect('/')
  const isDev = await isDevAdminDB(user, c.env)
  if (!isDev) return c.redirect('/')
  // Refresh credits
  const freshUser = await c.env.DB.prepare('SELECT credits, is_dev FROM users WHERE user_id = ?').bind(user.user_id).first()
  if (freshUser) { user.credits = freshUser.credits; user.is_dev = (freshUser as any).is_dev || 0 }
  return c.html(adminDashboardPage(user))
})

// Notifications page
app.get('/notifications', async (c) => {
  const userCookie = getCookie(c, 'user')
  const user = safeParseUserCookie(userCookie)
  if (!user) return c.redirect('/')
  // Refresh credits
  try {
    const freshUser = await c.env.DB.prepare('SELECT credits, is_dev FROM users WHERE user_id = ?').bind(user.user_id).first()
    if (freshUser) { user.credits = freshUser.credits; user.is_dev = (freshUser as any).is_dev || 0 }
  } catch(e) {}
  // Update last_access_at
  try { await c.env.DB.prepare('UPDATE users SET last_access_at = CURRENT_TIMESTAMP WHERE user_id = ?').bind(user.user_id).run() } catch(e) {}
  return c.html(notificationsPage(user))
})

app.get('/admin/tickets', async (c) => {
  const userCookie = getCookie(c, 'user')
  const user = safeParseUserCookie(userCookie)
  if (!user) {
    deleteCookie(c, 'user')
    return c.redirect('/')
  }
  if (!isDevAdmin(user, c.env)) {
    return c.redirect('/')
  }

  return c.html(adminTicketsPage(user))
})

// API: Profile Update
app.post('/api/profile/update', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    const { nickname, user_id, avatar_type, avatar_value, avatar_url } = await c.req.json()

    if (!nickname || !user_id) {
      return c.json({ success: false, error: '必須項目が入力されていません' })
    }

    // SECURITY FIX (BOLA): We MUST NOT update based on the requested `user_id` blindly.
    // We bind the update to `user.user_id` (the authenticated user).
    // The `user_id` in the request body is what they *want* their new ID to be.

    // Validate target user_id format
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(user_id)) {
      return c.json({ success: false, error: 'ユーザーIDは3-20文字の英数字、アンダースコア、ハイフンのみ使用可能です' })
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

    // Update cookie (MINIMAL)
    setCookie(c, 'user', JSON.stringify(getMinimalUser(updatedUser)), {
      path: '/',
      httpOnly: true,
      secure: c.req.url.startsWith('https'),
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
    const user = safeParseUserCookie(userCookie)
    if (!user) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    const formData = await c.req.formData()
    const file = formData.get('avatar')

    if (!file || !(file instanceof File)) {
      return c.json({ success: false, error: 'No file uploaded' }, 400)
    }

    // Validate file size (5MB max - increased for larger icons)
    if (file.size > 5 * 1024 * 1024) {
      return c.json({ success: false, error: 'File too large (max 5MB)' }, 400)
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
      // Safe base64 conversion using chunked approach to avoid stack overflow
      const uint8Array = new Uint8Array(arrayBuffer)
      let binary = ''
      const chunkSize = 8192
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.subarray(i, i + chunkSize)
        binary += String.fromCharCode(...chunk)
      }
      const base64 = btoa(binary)
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
      const user = safeParseUserCookie(userCookie)
      if (user) currentUserId = user.user_id
    }

    // Get announcements with reaction counts (always include image_url and poll_data via migration)
    const selectExtra = ', a.image_url, a.poll_data'

    const announcements = await c.env.DB.prepare(`
      SELECT 
        a.id, a.content, a.type, a.created_at
        ${selectExtra},
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

    const user = safeParseUserCookie(userCookie)
    if (!user) {
      return c.json({ success: false, error: 'Permission denied' }, 403)
    }

    const { content, type, image_url, poll } = await c.req.json()

    if (!content) {
      return c.json({ success: false, error: 'Content required' })
    }

    const pollData = poll ? JSON.stringify({ ...poll, votes: new Array(poll.options.length).fill(0) }) : null

    await c.env.DB.prepare(
      'INSERT INTO announcements (content, type, image_url, poll_data, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)'
    ).bind(content, type || 'announcement', image_url || null, pollData).run()

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

    const user = safeParseUserCookie(userCookie)
    if (!user) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }

    if (!isDevAdmin(user, c.env)) {
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

// API: Vote on announcement poll
app.post('/api/announcements/:id/poll-vote', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }

    const user = safeParseUserCookie(userCookie)
    const announcementId = c.req.param('id')
    const { option_index } = await c.req.json()

    // Prevent rapid repeat voting - check KV for cooldown
    const pollVoteKey = `poll_vote:${announcementId}:${user.user_id}`
    const existingVote = await c.env.KV.get(pollVoteKey)
    if (existingVote) {
      return c.json({ success: false, error: 'このアンケートには既に投票済みです' }, 400)
    }

    // Get current poll data
    const ann = await c.env.DB.prepare(
      'SELECT poll_data FROM announcements WHERE id = ?'
    ).bind(announcementId).first()

    if (!ann || !ann.poll_data) {
      return c.json({ success: false, error: 'アンケートが見つかりません' }, 404)
    }

    const poll = JSON.parse(ann.poll_data as string)
    if (option_index < 0 || option_index >= poll.options.length) {
      return c.json({ success: false, error: '無効な選択肢です' }, 400)
    }

    // Increment vote count
    if (!poll.votes) poll.votes = new Array(poll.options.length).fill(0)
    poll.votes[option_index] = (poll.votes[option_index] || 0) + 1

    await c.env.DB.prepare(
      'UPDATE announcements SET poll_data = ? WHERE id = ?'
    ).bind(JSON.stringify(poll), announcementId).run()

    // Record vote in KV to prevent duplicates (no expiration = permanent)
    await c.env.KV.put(pollVoteKey, String(option_index))

    return c.json({ success: true, voted_index: option_index })
  } catch (error) {
    console.error('Poll vote error:', error)
    return c.json({ success: false, error: 'Failed to vote' }, 500)
  }
})

// API: Toggle Announcement Reaction
app.post('/api/announcements/:id/reaction', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }

    const user = safeParseUserCookie(userCookie)
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

// API: Get Archive Debates (from archived_debates + completed debates)
app.get('/api/archive/debates', async (c) => {
  try {
    // Get from archived_debates table
    const archived = await c.env.DB.prepare(`
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

    // Also get completed debates from main debates table that aren't archived yet
    let completedDebates: any[] = []
    try {
      const completed = await c.env.DB.prepare(`
        SELECT 
          d.id,
          d.id as debate_id,
          d.topic as theme,
          d.agree_position as opinion_a,
          d.disagree_position as opinion_b,
          COALESCE((SELECT COUNT(*) FROM debate_votes WHERE debate_id = d.id AND vote = 'agree'), 0) as agree_votes,
          COALESCE((SELECT COUNT(*) FROM debate_votes WHERE debate_id = d.id AND vote = 'disagree'), 0) as disagree_votes,
          d.winner,
          'completed' as status,
          (SELECT COUNT(*) FROM debate_messages WHERE debate_id = d.id) as message_count,
          d.created_at
        FROM debates d
        WHERE d.status = 'completed'
        AND d.id NOT IN (SELECT debate_id FROM archived_debates WHERE debate_id IS NOT NULL)
        ORDER BY d.created_at DESC
        LIMIT 50
      `).all()
      completedDebates = completed.results || []
    } catch (e) {
      // debates table may not have status/winner columns - ignore
      console.log('Note: Could not fetch completed debates from debates table')
    }

    // 重複除去: archive_idをキーとして使い、archived_debatesを優先
    const seenIds = new Set<string>()
    const allDebates: any[] = []
    for (const d of (archived.results || [])) {
      const key = String(d.debate_id || d.id)
      if (!seenIds.has(key)) {
        seenIds.add(key)
        // 勝者を投票数で再計算（DBのwinnerが信頼できない場合の保険）
        const av = Number(d.agree_votes || 0)
        const dv = Number(d.disagree_votes || 0)
        if (!d.winner) d.winner = av >= dv ? 'agree' : 'disagree'
        allDebates.push(d)
      }
    }
    for (const d of completedDebates) {
      const key = String(d.debate_id || d.id)
      if (!seenIds.has(key)) {
        seenIds.add(key)
        const av = Number(d.agree_votes || 0)
        const dv = Number(d.disagree_votes || 0)
        if (!d.winner) d.winner = av >= dv ? 'agree' : 'disagree'
        allDebates.push(d)
      }
    }
    return c.json({ success: true, debates: allDebates })
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

    const user = safeParseUserCookie(userCookie)
    if (!user) {
      return c.json({ success: true, purchased_ids: [] })
    }

    // Only authenticated dev admin has access to all
    if (isDevAdmin(user, c.env)) {
      return c.json({ success: true, purchased_ids: ['all'] })
    }

    const views = await c.env.DB.prepare(`
      SELECT debate_id FROM archive_views WHERE user_id = ?
    `).bind(user.user_id).all()

    // Return only valid debate IDs (exclude null, empty, 'undefined')
    const purchasedIds = (views.results || [])
      .map((v: any) => String(v.debate_id))
      .filter((id: string) => id && id !== 'null' && id !== 'undefined' && id.length > 0)

    return c.json({ success: true, purchased_ids: purchasedIds })
  } catch (error) {
    console.error('Check purchased error:', error)
    return c.json({ success: true, purchased_ids: [] })
  }
})

// API: Auto-promote upcoming debates to live 3 minutes before scheduled time
app.get('/api/debates/check-upcoming', async (c) => {
  try {
    // Find upcoming debates whose scheduled_at is within 3 minutes from now
    const threeMinutesFromNow = new Date(Date.now() + 3 * 60 * 1000).toISOString()
    const now = new Date().toISOString()

    const upcomingDebates = await c.env.DB.prepare(`
      SELECT id, topic, scheduled_at FROM debates 
      WHERE status = 'upcoming' AND scheduled_at IS NOT NULL AND scheduled_at <= ?
    `).bind(threeMinutesFromNow).all()

    const promoted: string[] = []

    if (upcomingDebates.results) {
      for (const debate of upcomingDebates.results) {
        // Promote to live
        try {
          await c.env.DB.prepare(
            "UPDATE debates SET status = 'live', started_at = datetime('now') WHERE id = ?"
          ).bind(debate.id).run()
          promoted.push(debate.id as string)
        } catch (e) {
          try {
            await c.env.DB.prepare("ALTER TABLE debates ADD COLUMN started_at TEXT").run()
            await c.env.DB.prepare(
              "UPDATE debates SET status = 'live', started_at = datetime('now') WHERE id = ?"
            ).bind(debate.id).run()
            promoted.push(debate.id as string)
          } catch (e2) { }
        }
      }
    }

    return c.json({ success: true, promoted })
  } catch (error) {
    console.error('Check upcoming error:', error)
    return c.json({ success: true, promoted: [] })
  }
})

// API: Update debate status (for sync) — DEV ONLY
app.post('/api/debate/:debateId/status', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user || !isDevAdmin(user, c.env)) {
      return c.json({ success: false, error: 'Permission denied' }, 403)
    }

    const debateId = c.req.param('debateId')
    const { status, winner } = await c.req.json()

    try {
      await c.env.DB.prepare(
        'UPDATE debates SET status = ?, winner = ? WHERE id = ?'
      ).bind(status, winner || null, debateId).run()
    } catch (e) {
      // winner column might not exist
      try {
        await c.env.DB.prepare(
          'UPDATE debates SET status = ? WHERE id = ?'
        ).bind(status, debateId).run()
      } catch (e2) { }
    }

    // AUTO-ARCHIVE logic when status is 'completed'
    if (status === 'completed') {
      try {
        // Fetch debate info
        const debate = await c.env.DB.prepare('SELECT * FROM debates WHERE id = ?').bind(debateId).first()
        if (debate) {
          // Fetch messages
          const messagesResult = await c.env.DB.prepare('SELECT side, content FROM debate_messages WHERE debate_id = ? ORDER BY created_at ASC').bind(debateId).all()
          const messages = messagesResult.results || []
          const messagesJson = JSON.stringify(messages)

          // Get votes
          const agreeVotes = await c.env.DB.prepare("SELECT COUNT(*) as count FROM debate_votes WHERE debate_id = ? AND vote = 'agree'").bind(debateId).first()
          const disagreeVotes = await c.env.DB.prepare("SELECT COUNT(*) as count FROM debate_votes WHERE debate_id = ? AND vote = 'disagree'").bind(debateId).first()

          // Check if already archived
          const existingArchive = await c.env.DB.prepare('SELECT id FROM archived_debates WHERE debate_id = ?').bind(debateId).first()
          if (!existingArchive) {
            const agreeCount = Number(agreeVotes?.count || 0)
            const disagreeCount = Number(disagreeVotes?.count || 0)

            // Winner determination: vote majority wins. Ties are broken by passed winner (AI judge result).
            // NO draws - one side always wins.
            let finalWinner: string
            if (agreeCount > disagreeCount) {
              finalWinner = 'agree'
            } else if (disagreeCount > agreeCount) {
              finalWinner = 'disagree'
            } else {
              // Tie: use AI judge result passed from frontend, fallback to 'agree'
              finalWinner = (winner === 'agree' || winner === 'disagree') ? winner : 'agree'
            }

            await c.env.DB.prepare(`
              INSERT INTO archived_debates (debate_id, title, topic, agree_position, disagree_position, agree_votes, disagree_votes, winner, messages, created_at, archived_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
            `).bind(
              debate.id,
              debate.topic || 'Unknown Theme',
              debate.topic || 'Unknown Topic',
              debate.agree_position || 'Agree',
              debate.disagree_position || 'Disagree',
              agreeCount,
              disagreeCount,
              finalWinner,
              messagesJson,
              debate.created_at || 'datetime("now")'
            ).run()
            console.log(`Auto-archived debate ${debateId}, winner: ${finalWinner} (agree:${agreeCount} disagree:${disagreeCount})`)
          }
        }
      } catch (archiveError) {
        console.error('Auto-archive failed:', archiveError)
      }
    }

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: true }) // non-critical
  }
})

// API: Execute command (ONLY for authenticated dev admins)
app.post('/api/commands/execute', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }

    // SECURITY: Only authenticated dev admin can execute commands
    // source field from client is informational only - NOT used for auth
    if (!isDevAdmin(user, c.env)) {
      return c.json({ success: false, error: 'Permission denied' }, 403)
    }

    const { command, debateId } = await c.req.json()

    if (!command) {
      return c.json({ success: false, error: 'コマンドが空です' }, 400)
    }

    const cmd = command.trim()

    // !s-x - Schedule debate (x minutes later, 0 = immediate then auto-archive)
    const scheduleMatch = cmd.match(/^!s-(\d+)$/)
    if (scheduleMatch) {
      const minutes = parseInt(scheduleMatch[1])

      // Ensure a debate exists with a random theme
      let targetDebateId = debateId
      if (!targetDebateId || targetDebateId === 'default') {
        targetDebateId = crypto.randomUUID()
      }

      // Check if debate exists in DB, if not create with random theme
      const existingDebate = await c.env.DB.prepare('SELECT id FROM debates WHERE id = ?').bind(targetDebateId).first()
      if (!existingDebate) {
        // Get random theme from adopted themes or defaults
        let randomTheme: any = null
        try {
          randomTheme = await c.env.DB.prepare(`
            SELECT title, agree_opinion, disagree_opinion FROM theme_proposals 
            WHERE status = 'active' AND adopted = 1 ORDER BY RANDOM() LIMIT 1
          `).first()
        } catch (e) { }
        if (!randomTheme) {
          try {
            randomTheme = await c.env.DB.prepare(`
              SELECT title, agree_opinion, disagree_opinion FROM theme_proposals 
              WHERE status = 'active' ORDER BY RANDOM() LIMIT 1
            `).first()
          } catch (e) { }
        }
        if (!randomTheme) {
          const defaultThemes = [
            { title: 'AIは人間の仕事を奪うか？', agree_opinion: 'AIの進化により多くの職種が自動化される', disagree_opinion: '新しい職種が生まれ、人間の仕事は変わるが消えない' },
            { title: 'リモートワークは生産性を上げるか？', agree_opinion: '通勤時間の削減と自由な環境が集中力を高める', disagree_opinion: '対面コミュニケーション不足がチームワークを損なう' },
            { title: 'SNSは社会に良い影響を与えるか？', agree_opinion: '情報の民主化と社会運動の推進に貢献', disagree_opinion: 'フェイクニュースと精神的健康への悪影響が深刻' },
            { title: '宇宙開発に巨額投資すべきか？', agree_opinion: '人類の生存と科学技術発展のため不可欠', disagree_opinion: '地球上の問題解決に資源を集中すべき' },
            { title: '学校教育にAIを導入すべきか？', agree_opinion: '個別最適化された学習体験が可能になる', disagree_opinion: '人間教師による情操教育が失われる' },
          ]
          randomTheme = defaultThemes[Math.floor(Math.random() * defaultThemes.length)]
        }
        try {
          // Clear existing active debates if user wants a clean slate
          await c.env.DB.prepare("UPDATE debates SET status = 'completed' WHERE status IN ('live', 'upcoming', 'pending')").run()

          await c.env.DB.prepare(`
            INSERT INTO debates (id, title, topic, agree_position, disagree_position, status, created_at)
            VALUES (?, ?, ?, ?, ?, 'pending', datetime('now'))
          `).bind(targetDebateId, randomTheme.title, randomTheme.title, randomTheme.agree_opinion, randomTheme.disagree_opinion).run()
        } catch (e2: any) { console.error('Failed to INSERT debate:', e2?.message || e2) }
      }

      if (minutes === 0) {
        // Immediate start: set debate status to 'live' in DB
        try {
          await c.env.DB.prepare(
            "UPDATE debates SET status = 'live', started_at = datetime('now') WHERE id = ?"
          ).bind(targetDebateId).run()
        } catch (e) {
          try {
            await c.env.DB.prepare("ALTER TABLE debates ADD COLUMN started_at TEXT").run()
            await c.env.DB.prepare(
              "UPDATE debates SET status = 'live', started_at = datetime('now') WHERE id = ?"
            ).bind(targetDebateId).run()
          } catch (e2: any) {
            console.error('Failed to ALTER+UPDATE debate to live:', e2?.message || e2)
            try { await c.env.DB.prepare("UPDATE debates SET status = 'live' WHERE id = ?").bind(targetDebateId).run() } catch (e3: any) { console.error('Final fallback UPDATE to live failed:', e3?.message || e3) }
          }
        }
        return c.json({ success: true, action: 'start_debate_archive', schedule_minutes: 0, debateId: targetDebateId })
      }

      // Scheduled start: set debate status to 'upcoming' with scheduled time
      try {
        const scheduledAt = new Date(Date.now() + minutes * 60 * 1000).toISOString()
        try {
          await c.env.DB.prepare(
            "UPDATE debates SET status = 'upcoming', scheduled_at = ? WHERE id = ?"
          ).bind(scheduledAt, targetDebateId).run()
        } catch (e) {
          try {
            await c.env.DB.prepare("ALTER TABLE debates ADD COLUMN scheduled_at TEXT").run()
            await c.env.DB.prepare(
              "UPDATE debates SET status = 'upcoming', scheduled_at = ? WHERE id = ?"
            ).bind(scheduledAt, targetDebateId).run()
          } catch (e2: any) {
            console.error('Failed to ALTER+UPDATE debate to upcoming:', e2?.message || e2)
            try { await c.env.DB.prepare("UPDATE debates SET status = 'upcoming' WHERE id = ?").bind(targetDebateId).run() } catch (e3: any) { console.error('Final fallback UPDATE to upcoming failed:', e3?.message || e3) }
          }
        }
      } catch (e) {
        console.error('Schedule debate DB error:', e)
      }
      return c.json({ success: true, action: 'schedule_debate', schedule_minutes: minutes, debateId: targetDebateId })
    }

    // !@xxx+coiny - Grant y coins to user xxx
    const coinMatch = cmd.match(/^!@(\w+)\+coin(\d+)$/)
    if (coinMatch) {
      const targetUserId = coinMatch[1]
      const coinAmount = parseInt(coinMatch[2])

      if (coinAmount <= 0 || coinAmount > 100000) {
        return c.json({ success: false, error: '付与額は1〜100000の範囲で指定してください' }, 400)
      }

      // Check target user exists
      const targetUser = await c.env.DB.prepare('SELECT user_id, credits FROM users WHERE user_id = ?').bind(targetUserId).first()
      if (!targetUser) {
        return c.json({ success: false, error: `ユーザー @${targetUserId} が見つかりません` }, 404)
      }

      // Grant credits
      await c.env.DB.prepare('UPDATE users SET credits = credits + ? WHERE user_id = ?').bind(coinAmount, targetUserId).run()

      // Record transaction
      await c.env.DB.prepare(`
        INSERT INTO credit_transactions (id, user_id, amount, type, reason, created_at)
        VALUES (?, ?, ?, 'earn', ?, datetime('now'))
      `).bind(crypto.randomUUID(), targetUserId, coinAmount, `${user.user_id}からの付与`).run()

      return c.json({ success: true, action: 'grant_coins', target: targetUserId, amount: coinAmount })
    }

    // All unrecognized commands are errors - only !s-x and !@xxx+coiny are allowed\n    return c.json({ success: false, error: 'エラー: 不明なコマンド「' + cmd + '」。使用可能: !s-数字（開始予約）, !@ユーザー+coin数字（コイン付与）' }, 400)
  } catch (error) {
    console.error('Command execution error:', error)
    return c.json({ success: false, error: 'コマンド実行エラー' }, 500)
  }
})

// API: Get/Update user privacy settings
app.get('/api/user/privacy', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) return c.json({ success: false, error: 'Not authenticated' }, 401)
    const user = safeParseUserCookie(userCookie)

    // Try to get privacy settings from KV
    const key = `privacy:${user.user_id}`
    const data = await c.env.KV.get(key)

    if (data) {
      return c.json({ success: true, settings: JSON.parse(data) })
    }

    // Default: credits and posts are PRIVATE
    const defaults = {
      show_total_debates: true,
      show_wins: true,
      show_losses: true,
      show_draws: true,
      show_win_rate: true,
      show_posts: false,
      show_credits: false
    }
    return c.json({ success: true, settings: defaults })
  } catch (error) {
    return c.json({ success: true, settings: {} })
  }
})

app.post('/api/user/privacy', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) return c.json({ success: false, error: 'Not authenticated' }, 401)
    const user = safeParseUserCookie(userCookie)

    const settings = await c.req.json()
    const key = `privacy:${user.user_id}`
    await c.env.KV.put(key, JSON.stringify(settings))

    return c.json({ success: true })
  } catch (error) {
    return c.json({ success: false, error: 'Failed to save settings' }, 500)
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

// API: Get AI profiles (viewable by all users)
app.get('/api/ai-profiles', async (c) => {
  return c.json({
    success: true,
    profiles: {
      aether: {
        name: 'Aether',
        role: '賛成側 AI ディベーター',
        icon: 'fas fa-brain',
        color: '#34d399',
        gradient: 'from-green-500 to-emerald-500',
        model: 'gpt-4.1-nano',
        trait: '論理的・データ重視',
        style: '構造的に根拠を積み上げる',
        description: '客観的データと論理的推論を重視し、体系的に議論を構築するAI。根拠の明確さと一貫性が特徴。'
      },
      nova: {
        name: 'Nova',
        role: '反対側 AI ディベーター',
        icon: 'fas fa-fire',
        color: '#f87171',
        gradient: 'from-red-500 to-rose-500',
        model: 'gpt-4.1-nano',
        trait: '批判的・反証重視',
        style: '矛盾を鋭く突く',
        description: '相手の論点の弱点を鋭く指摘し、反証を提示するAI。批判的思考と反論力が特徴。'
      }
    }
  })
})

// API: Get user's own stats (for mypage)
app.get('/api/user/stats', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) return c.json({ success: false, error: 'Not authenticated' }, 401)
    const user = safeParseUserCookie(userCookie)

    // Get post count
    let totalPosts = 0
    try {
      const postCount = await c.env.DB.prepare('SELECT COUNT(*) as total FROM community_posts WHERE user_id = ?').bind(user.user_id).first()
      totalPosts = (postCount?.total as number) || 0
    } catch (e) { }

    // Get debate statistics from archived/completed debates (BATTLE only - exclude spectators)
    // Spectators are those who only purchased archive_views but did NOT cast a vote during live debate
    // We treat debate_votes as "battle" participation (user voted during the live debate, not as spectator)
    // archive_views = purchased archives (spectators) - exclude these debate_ids from stats
    let totalDebates = 0, wins = 0, losses = 0, draws = 0
    try {
      // Count only debates where user voted LIVE (debate_votes) 
      // AND exclude debates where user is only a spectator (archive_views)
      const debateVotes = await c.env.DB.prepare(`
        SELECT dv.vote, d.winner FROM debate_votes dv 
        JOIN debates d ON dv.debate_id = d.id 
        WHERE dv.user_id = ? AND d.status = 'completed'
        AND d.id NOT IN (
          SELECT av.debate_id FROM archive_views av WHERE av.user_id = ?
        )
      `).bind(user.user_id, user.user_id).all()

      if (debateVotes.results) {
        totalDebates = debateVotes.results.length
        debateVotes.results.forEach((v: any) => {
          if (!v.winner) draws++
          else if (v.vote === v.winner) wins++
          else losses++
        })
      }
    } catch (e) {
      // Fallback: just count all votes if archive_views join fails
      try {
        const debateVotes2 = await c.env.DB.prepare(`
          SELECT dv.vote, d.winner FROM debate_votes dv 
          JOIN debates d ON dv.debate_id = d.id 
          WHERE dv.user_id = ? AND d.status = 'completed'
        `).bind(user.user_id).all()
        if (debateVotes2.results) {
          totalDebates = debateVotes2.results.length
          debateVotes2.results.forEach((v: any) => {
            if (!v.winner) draws++
            else if (v.vote === v.winner) wins++
            else losses++
          })
        }
      } catch (e2) { }
    }

    // Get archive/spectated debates count
    let watchedDebates = 0
    try {
      const watchedCount = await c.env.DB.prepare('SELECT COUNT(*) as total FROM archive_views WHERE user_id = ?').bind(user.user_id).first()
      watchedDebates = (watchedCount?.total as number) || 0
    } catch (e) { }

    const winRate = totalDebates > 0 ? Math.round((wins / totalDebates) * 100) : 0

    return c.json({
      success: true,
      stats: {
        total_debates: totalDebates,
        wins,
        losses,
        draws,
        win_rate: winRate,
        total_posts: totalPosts,
        watched_debates: watchedDebates
      }
    })
  } catch (error) {
    console.error('Get user stats error:', error)
    return c.json({ success: true, stats: { total_debates: 0, wins: 0, losses: 0, draws: 0, win_rate: 0, total_posts: 0, watched_debates: 0 } })
  }
})

// API: Get user's watched/purchased debates list
app.get('/api/archive/watched', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) return c.json({ success: false, error: 'Not authenticated' }, 401)
    const user = safeParseUserCookie(userCookie)
    if (!user) return c.json({ success: false, error: 'Not authenticated' }, 401)

    // Get all debates the user has purchased/watched from archive_views
    const watched = await c.env.DB.prepare(`
      SELECT av.debate_id, av.created_at as watched_at,
             ad.theme, ad.opinion_a, ad.opinion_b, ad.agree_votes, ad.disagree_votes, ad.winner, ad.id as archive_id
      FROM archive_views av
      LEFT JOIN archived_debates ad ON av.debate_id = ad.debate_id
      WHERE av.user_id = ?
      ORDER BY av.created_at DESC
      LIMIT 50
    `).bind(user.user_id).all()

    return c.json({ success: true, debates: watched.results || [] })
  } catch (error) {
    console.error('Get watched debates error:', error)
    return c.json({ success: false, debates: [] })
  }
})

// API: Purchase Archive Access
app.post('/api/archive/purchase', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }

    const user = safeParseUserCookie(userCookie)
    const { debate_id } = await c.req.json()

    // Dev user bypasses credit check
    const isDevUser = user.user_id === 'dev' && getDevAdminEmails(c.env).includes((user.email||'').toLowerCase())

    // Check if already purchased
    const existingView = await c.env.DB.prepare(
      'SELECT id FROM archive_views WHERE user_id = ? AND debate_id = ?'
    ).bind(user.user_id, debate_id).first()

    if (existingView) {
      // Already purchased - grant access without charging
      return c.json({ success: true, session_id: crypto.randomUUID(), already_purchased: true })
    }

    if (!isDevUser) {
      let userData: any = null
      try {
        userData = await c.env.DB.prepare(
          'SELECT credits, credit_freeze FROM users WHERE user_id = ?'
        ).bind(user.user_id).first() as any
      } catch(e) {
        userData = await c.env.DB.prepare(
          'SELECT credits FROM users WHERE user_id = ?'
        ).bind(user.user_id).first() as any
      }

      const currentCredits = userData?.credits || 0
      const isCreditFrozen = userData?.credit_freeze === 1 || false

      if (!isCreditFrozen && currentCredits < 50) {
        return c.json({ success: false, error: 'クレジットが不足しています（必要: 50クレジット）' })
      }

      if (isCreditFrozen) {
        return c.json({ success: false, error: 'クレジットが凍結されています。サポートにお問い合わせください。' }, 403)
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

    // Return new credits for instant UI update
    const updatedPurchaseUser = await c.env.DB.prepare('SELECT credits FROM users WHERE user_id = ?').bind(user.user_id).first()

    return c.json({ success: true, session_id: sessionId, new_credits: updatedPurchaseUser?.credits })
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

    const user = safeParseUserCookie(userCookie)

    // Only dev can save to archive
    if (!(user.user_id === 'dev' && getDevAdminEmails(c.env).includes((user.email||'').toLowerCase()))) {
      return c.json({ success: false, error: 'Permission denied' }, 403)
    }

    const { debate_id, title, topic, agree_position, disagree_position, agree_votes, disagree_votes, winner, messages } = await c.req.json()

    // Winner determination: votes majority wins, tie → use passed winner (AI judge), no draws
    const agreeCount = Number(agree_votes || 0)
    const disagreeCount = Number(disagree_votes || 0)
    let finalWinner: string
    if (agreeCount > disagreeCount) {
      finalWinner = 'agree'
    } else if (disagreeCount > agreeCount) {
      finalWinner = 'disagree'
    } else {
      finalWinner = (winner === 'agree' || winner === 'disagree') ? winner : 'agree'
    }

    // Insert into archived_debates table
    await c.env.DB.prepare(`
      INSERT INTO archived_debates (debate_id, title, topic, agree_position, disagree_position, agree_votes, disagree_votes, winner, messages, created_at, archived_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(debate_id, title, topic, agree_position, disagree_position, agreeCount, disagreeCount, finalWinner, messages).run()

    console.log('Debate archived:', { debate_id, title, winner: finalWinner })

    return c.json({ success: true })
  } catch (error) {
    console.error('Archive save error:', error)
    return c.json({ success: false, error: 'Failed to save archive' }, 500)
  }
})

// API: Delete all archives (DEV ADMIN ONLY)
app.delete('/api/archive/all', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user || !isDevAdmin(user, c.env)) {
      return c.json({ success: false, error: 'Permission denied' }, 403)
    }

    // Delete all archived debates
    await c.env.DB.prepare('DELETE FROM archived_debates').run()
    // Also delete archive_views (purchased records)
    await c.env.DB.prepare('DELETE FROM archive_views').run()
    // Also reset completed debates status so they don't re-appear in archive list
    try {
      await c.env.DB.prepare("UPDATE debates SET status = 'archived_deleted' WHERE status = 'completed'").run()
    } catch(e) {}

    console.log('[Admin] All archives deleted by', user.user_id)
    return c.json({ success: true, message: 'すべてのアーカイブを削除しました' })
  } catch (error) {
    console.error('Archive delete all error:', error)
    return c.json({ success: false, error: 'Failed to delete archives' }, 500)
  }
})
app.get('/api/community/posts', async (c) => {
  try {
    const lang = c.req.query('language') || 'ja'

    // Get current user for reaction status
    const userCookie = getCookie(c, 'user')
    let currentUserId = null
    if (userCookie) {
      const user = safeParseUserCookie(userCookie)
      if (user) currentUserId = user.user_id
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

    const user = safeParseUserCookie(userCookie)
    const { content, language } = await c.req.json()

    if (!content || !language) {
      return c.json({ success: false, error: 'Content and language required' })
    }

    // Check post_ban restriction (try/catch for DB schema compatibility)
    let userRecord: any = null
    try {
      userRecord = await c.env.DB.prepare('SELECT post_ban, is_banned FROM users WHERE user_id = ?').bind(user.user_id).first() as any
    } catch(e) {
      // Fallback: post_ban column may not exist yet in older DBs
      try {
        userRecord = await c.env.DB.prepare('SELECT is_banned FROM users WHERE user_id = ?').bind(user.user_id).first() as any
      } catch(e2) {}
    }
    if (userRecord?.is_banned) return c.json({ success: false, error: 'アカウントが停止されています' }, 403)
    if (userRecord?.post_ban) return c.json({ success: false, error: '投稿機能が制限されています。サポートにお問い合わせください。' }, 403)

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

    const user = safeParseUserCookie(userCookie)
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

    const user = safeParseUserCookie(userCookie)
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

// API: Generate AI debate response — AUTHENTICATED ONLY
app.post('/api/debate/generate', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user) {
      return c.json({ error: 'Not authenticated' }, 401)
    }

    const { systemPrompt, conversationHistory, maxTokens, temperature } = await c.req.json()
    const apiKey = c.env.OPENAI_API_KEY

    if (!apiKey) {
      return c.json({ error: 'OpenAI API key not configured' }, 500)
    }

    // 会話履歴をOpenAI形式のメッセージに構築
    // watch.jsは既に {role, content} 形式で送信してくるのでそのまま使用
    const messages: any[] = []

    // 1. システムプロンプト（静的コンテンツ = キャッシュ対象）
    messages.push({
      role: 'system',
      content: systemPrompt
    })

    // 2. 会話履歴をそのまま追加（watch.jsが正しいrole付きで送信）
    if (conversationHistory && conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        if (msg.role && msg.content) {
          messages.push({ role: msg.role, content: msg.content })
        }
      }
    } else {
      // 初回
      messages.push({
        role: 'user',
        content: '300文字以内で句点（。）で終えること。'
      })
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-nano',  // gpt-4.1-nano: $0.05/$0.005/$0.40
        messages: messages,
        max_tokens: maxTokens || 340,  // 300文字（日本語）≈ 340トークン
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
    // gpt-4.1-nano: $0.05/$0.005/$0.40
    if (data.usage) {
      const cached = data.usage.prompt_tokens_details?.cached_tokens || 0
      const cacheRate = data.usage.prompt_tokens > 0
        ? ((cached / data.usage.prompt_tokens) * 100).toFixed(1)
        : '0.0'
      console.log(`[Debate] Tokens - Input: ${data.usage.prompt_tokens}, Cached: ${cached} (${cacheRate}%), Output: ${data.usage.completion_tokens}`)
    }

    // [意見A], [意見B]などのラベルを削除
    message = message.replace(/^\[意見[ABC]\]:\s*/g, '')
    message = message.replace(/^(Aether|Nova):\s*/g, '')
    message = message.replace(/^【[^】]*】:\s*/g, '')

    // 300文字制限を厳格に実施（必ず句読点で終わるように調整）
    if (message.length > 300) {
      message = message.substring(0, 300)
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
    // SECURITY: Require authentication to prevent API cost abuse
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user) {
      return c.json({ error: 'Not authenticated' }, 401)
    }
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
            content: `あなたは公平・厳格なディベート審査員AI（審査官）です。
以下の4基準で厳密に評価し、必ずJSON形式 {"winner": "agree" または "disagree"} のみ返してください。
他のテキストは一切禁止です。

【評価基準（優先度順）】
1. 立場の一貫性（最重要）: 自分の立場（賛成/反対）を最後まで一貫して守ったか。
   - NG例: 「確かにそれも一理あります」「相手の意見にも納得できます」などは即座に減点。
   - 「！！」は強い主張、「！」は普通の主張、「？」は疑問・弱い主張として評価に影響する。
2. 論拠の強さ: 具体的事実・データ・事例があるか。記号的な表現（！！等）だけでなく実質的な内容か。
3. 反論の質: 相手の主張の弱点を的確に突けているか。
4. 論理の一貫性: 矛盾・自己否定がないか。

【立場変更の検出（自動失格）】
以下のパターンを含む主張は立場変更とみなし、即座に相手方を勝者とする:
- 「確かに」「おっしゃる通り」「それも正しい」「一理あります」等の譲歩表現
- 「でも相手の言う通り」等の同調表現
- 自分の立場と矛盾する主張

必ず {"winner": "agree"} または {"winner": "disagree"} のみ返す。`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 30,
        temperature: 0.1,
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
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user) {
      return c.json({ error: 'Not authenticated' }, 401)
    }

    const { debateId, vote } = await c.req.json()
    const { DB } = c.env

    // SECURITY: Use authenticated user's ID, not request body
    await DB.prepare(`
      INSERT INTO debate_votes (debate_id, user_id, vote)
      VALUES (?, ?, ?)
      ON CONFLICT(debate_id, user_id) DO UPDATE SET vote = excluded.vote
    `).bind(debateId, user.user_id, vote).run()

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
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user) {
      return c.json({ error: 'Not authenticated' }, 401)
    }

    const { debateId, vote, content } = await c.req.json()
    const { DB } = c.env

    // SECURITY: Use authenticated user's ID and username
    await DB.prepare(`
      INSERT INTO debate_comments (debate_id, user_id, username, vote, content)
      VALUES (?, ?, ?, ?, ?)
    `).bind(debateId, user.user_id, user.username || user.user_id, vote, content).run()

    return c.json({ success: true })
  } catch (error) {
    console.error('Comment save error:', error)
    return c.json({ error: 'Failed to save comment' }, 500)
  }
})

// API: コメントを取得（ユーザーアバター情報含む）
app.get('/api/comments/:debateId', async (c) => {
  try {
    const debateId = c.req.param('debateId')
    const { DB } = c.env

    // JOIN users table to include avatar info
    const result = await DB.prepare(`
      SELECT dc.*, u.avatar_type, u.avatar_value, u.avatar_url
      FROM debate_comments dc
      LEFT JOIN users u ON dc.user_id = u.user_id
      WHERE dc.debate_id = ?
      ORDER BY dc.created_at ASC
      LIMIT 50
    `).bind(debateId).all()

    return c.json({ comments: result.results })
  } catch (error) {
    console.error('Comments fetch error:', error)
    return c.json({ error: 'Failed to fetch comments' }, 500)
  }
})

// API: コメントを削除 — DEV ONLY
app.delete('/api/comments/:debateId', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user || !isDevAdmin(user, c.env)) {
      return c.json({ error: 'Permission denied' }, 403)
    }

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

// API: ディベートメッセージを削除 — DEV ONLY
app.delete('/api/debate/:debateId/messages', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user || !isDevAdmin(user, c.env)) {
      return c.json({ error: 'Permission denied' }, 403)
    }

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
    // SECURITY: Require authentication to save debate messages
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user) {
      return c.json({ error: 'Not authenticated' }, 401)
    }
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

    try {
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

        setCookie(c, 'user', JSON.stringify(getMinimalUser(userData)), {
          httpOnly: true,
          secure: c.req.url.startsWith('https'),
          sameSite: 'Lax',
          maxAge: 60 * 60 * 24 * 30
        })

        return c.redirect('/demo')
      }
    } catch (dbError) {
      console.error('Mock auth DB error (tables may not exist):', dbError)
      // Continue to register flow even if DB check fails
    }

    setCookie(c, 'google_id', mockGoogleId, { maxAge: 600, sameSite: 'Lax' })
    setCookie(c, 'google_email', mockEmail, { maxAge: 600, sameSite: 'Lax' })
    setCookie(c, 'google_name', mockName, { maxAge: 600, sameSite: 'Lax' })

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
  const errorParam = c.req.query('error')
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = c.env

  // Handle Google OAuth error responses (user denied access, etc.)
  if (errorParam) {
    console.error('Google OAuth error:', errorParam)
    return c.redirect('/')
  }

  if (!code) {
    return c.redirect('/')
  }

  // Validate required env vars
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    console.error('OAuth callback: Missing required environment variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)')
    return c.redirect('/')
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
      console.error('Token exchange failed:', JSON.stringify(tokens))
      return c.redirect('/')
    }

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${tokens.access_token}` }
    })

    if (!userResponse.ok) {
      console.error('Failed to get Google user info:', userResponse.status)
      return c.redirect('/')
    }

    const googleUser = await userResponse.json()

    if (!googleUser.id || !googleUser.email) {
      console.error('Invalid Google user data:', JSON.stringify(googleUser))
      return c.redirect('/')
    }

    // Check if user already exists
    const existingUser = await c.env.DB.prepare(
      'SELECT * FROM users WHERE google_id = ? OR email = ?'
    ).bind(googleUser.id, googleUser.email).first()

    // Determine secure flag based on request URL
    const isSecure = c.req.url.startsWith('https')

    if (existingUser) {
      // Existing user - direct login
      const userData = {
        id: existingUser.id,
        user_id: existingUser.user_id,
        username: existingUser.username,
        email: existingUser.email,
        credits: existingUser.credits
      }

      setCookie(c, 'user', JSON.stringify(getMinimalUser(userData)), {
        httpOnly: true,
        secure: isSecure,
        sameSite: 'Lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      })

      return c.redirect('/demo')
    } else {
      // New user - go to registration
      setCookie(c, 'google_id', googleUser.id, { httpOnly: true, secure: isSecure, sameSite: 'Lax', maxAge: 3600 })
      setCookie(c, 'google_email', googleUser.email, { httpOnly: true, secure: isSecure, sameSite: 'Lax', maxAge: 3600 })
      setCookie(c, 'google_name', googleUser.name || '', { httpOnly: true, secure: isSecure, sameSite: 'Lax', maxAge: 3600 })

      return c.redirect('/register')
    }
  } catch (error) {
    console.error('OAuth callback error:', error)
    // Don't show raw error to user - redirect to home with a gentle fallback
    return c.redirect('/')
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
    const cookieUser = safeParseUserCookie(userCookie)
    // Always get fresh data from DB
    const dbUser = await c.env.DB.prepare(
      'SELECT user_id, username, email, credits, nickname, avatar_type, avatar_value, avatar_url, rating, rank FROM users WHERE user_id = ?'
    ).bind(cookieUser.user_id).first()

    if (dbUser) {
      // Update last_access_at silently
      try { await c.env.DB.prepare('UPDATE users SET last_access_at = CURRENT_TIMESTAMP WHERE user_id = ?').bind(cookieUser.user_id).run() } catch(e) {}
      // Update cookie with fresh data (MINIMAL)
      setCookie(c, 'user', JSON.stringify(getMinimalUser(dbUser)), {
        path: '/',
        httpOnly: true,
        secure: c.req.url.startsWith('https'),
        sameSite: 'Lax',
        maxAge: 60 * 60 * 24 * 30
      })
      return c.json(dbUser)
    }
    return c.json(cookieUser)
  } catch (error) {
    console.error('Get user error:', error)
    return c.json(safeParseUserCookie(userCookie) || {})
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
    await c.env.DB.prepare(`CREATE TABLE IF NOT EXISTS visits (id TEXT PRIMARY KEY, session_id TEXT NOT NULL, ip_address TEXT, user_agent TEXT, page_path TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`).run()
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

    const user = safeParseUserCookie(userCookie)
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
      const user = safeParseUserCookie(userCookie)
      if (user) currentUserId = user.user_id
    }

    const category = c.req.query('category') || 'all'
    const sort = c.req.query('sort') || 'votes'

    // Safely check if 'adopted' column exists (production may not have migration yet)
    let hasAdoptedColumn = true;
    try {
      await c.env.DB.prepare("SELECT adopted FROM theme_proposals LIMIT 0").all();
    } catch {
      hasAdoptedColumn = false;
    }

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
        ${hasAdoptedColumn ? ', COALESCE(tp.adopted, 0) as adopted' : ', 0 as adopted'}
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
    } else if (sort === 'adopted') {
      // Show ONLY adopted themes when "adopted" tab is selected
      if (hasAdoptedColumn) {
        query += ' AND tp.adopted = 1 ORDER BY tp.vote_count DESC'
      } else {
        query += ' ORDER BY tp.vote_count DESC'
      }
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

    const user = safeParseUserCookie(userCookie)
    const isDevUser = user.user_id === 'dev' && getDevAdminEmails(c.env).includes((user.email||'').toLowerCase())

    // Always get fresh user data from DB
    let freshUserData: any = null
    try {
      freshUserData = await c.env.DB.prepare(
        'SELECT user_id, credits, credit_freeze FROM users WHERE user_id = ?'
      ).bind(user.user_id).first() as any
    } catch(e) {
      freshUserData = await c.env.DB.prepare(
        'SELECT user_id, credits FROM users WHERE user_id = ?'
      ).bind(user.user_id).first() as any
    }

    if (!freshUserData) {
      return c.json({ success: false, error: 'ユーザーが見つかりません' }, 404)
    }

    const currentCredits = freshUserData.credits as number
    const isCreditFrozen = freshUserData.credit_freeze === 1 || false

    // Check credit_freeze
    if (isCreditFrozen) {
      return c.json({ success: false, error: 'クレジットが凍結されています。サポートにお問い合わせください。' }, 403)
    }

    // Check credits: 20 credits for proposal
    if (currentCredits < 20) {
      return c.json({ success: false, error: 'クレジットが不足しています（必要: 20クレジット）' }, 400)
    }

    const { title, agree_opinion, disagree_opinion, category } = await c.req.json()

    if (!title || !agree_opinion || !disagree_opinion) {
      return c.json({ success: false, error: 'すべての必須項目を入力してください' }, 400)
    }

    // Insert theme proposal - must include user_id (NOT NULL in schema) AND proposed_by
    const proposedBy = freshUserData.user_id as string
    await c.env.DB.prepare(`
      INSERT INTO theme_proposals (user_id, title, agree_opinion, disagree_opinion, category, proposed_by, status, vote_count, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'active', 0, datetime('now'))
    `).bind(proposedBy, title, agree_opinion, disagree_opinion, category || 'other', proposedBy).run()

    // Deduct 20 credits for proposal
    await c.env.DB.prepare(
      'UPDATE users SET credits = credits - 20 WHERE user_id = ?'
    ).bind(user.user_id).run()

    await c.env.DB.prepare(`
      INSERT INTO credit_transactions (id, user_id, amount, type, reason, created_at)
      VALUES (?, ?, -20, 'spend', 'テーマ提案', datetime('now'))
    `).bind(crypto.randomUUID(), user.user_id).run()

    // Return new credits for instant UI update
    const updatedUser = await c.env.DB.prepare('SELECT credits FROM users WHERE user_id = ?').bind(user.user_id).first()

    return c.json({ success: true, new_credits: updatedUser?.credits })
  } catch (error) {
    console.error('Submit theme error:', error)
    return c.json({ success: false, error: 'テーマの提案に失敗しました: ' + (error as Error).message }, 500)
  }
})

// API: Vote for theme (toggle - vote or unvote)
app.post('/api/theme-votes/:id/vote', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }

    const user = safeParseUserCookie(userCookie)
    const themeId = c.req.param('id')

    // Voting is FREE - no credit check needed

    // Check if already voted
    const existingVote = await c.env.DB.prepare(`
      SELECT id FROM theme_votes WHERE theme_id = ? AND user_id = ?
    `).bind(themeId, user.user_id).first()

    if (existingVote) {
      // Already voted - REMOVE vote (toggle off)
      await c.env.DB.prepare(`
        DELETE FROM theme_votes WHERE theme_id = ? AND user_id = ?
      `).bind(themeId, user.user_id).run()

      // Decrement vote count
      await c.env.DB.prepare(`
        UPDATE theme_proposals SET vote_count = MAX(vote_count - 1, 0) WHERE id = ?
      `).bind(themeId).run()

      console.log('Theme unvote (free):', { user_id: user.user_id, theme_id: themeId })

      const updatedVoteUser = await c.env.DB.prepare('SELECT credits FROM users WHERE user_id = ?').bind(user.user_id).first()
      return c.json({ success: true, action: 'unvoted', new_credits: updatedVoteUser?.credits })
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

    // Voting is FREE - no credit deduction
    console.log('Theme vote (free):', { user_id: user.user_id, theme_id: themeId })

    // Return current credits (unchanged)
    const updatedVoteUser = await c.env.DB.prepare('SELECT credits FROM users WHERE user_id = ?').bind(user.user_id).first()

    return c.json({ success: true, action: 'voted', new_credits: updatedVoteUser?.credits })
  } catch (error) {
    console.error('Vote theme error:', error)
    return c.json({ success: false, error: 'Failed to vote' }, 500)
  }
})

// API: Adopt/unadopt theme (dev only)
app.post('/api/theme-votes/:id/adopt', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }

    const user = safeParseUserCookie(userCookie)
    if (!isDevAdmin(user, c.env)) {
      return c.json({ success: false, error: 'Permission denied' }, 403)
    }

    const themeId = c.req.param('id')
    const { adopt } = await c.req.json()

    try {
      await c.env.DB.prepare(`
        UPDATE theme_proposals SET adopted = ? WHERE id = ?
      `).bind(adopt ? 1 : 0, themeId).run()
    } catch {
      // If adopted column doesn't exist, try to add it
      await c.env.DB.prepare(`ALTER TABLE theme_proposals ADD COLUMN adopted INTEGER DEFAULT 0`).run()
      await c.env.DB.prepare(`UPDATE theme_proposals SET adopted = ? WHERE id = ?`).bind(adopt ? 1 : 0, themeId).run()
    }

    return c.json({ success: true })
  } catch (error) {
    console.error('Adopt theme error:', error)
    return c.json({ success: false, error: 'Failed to adopt theme' }, 500)
  }
})

// API: Delete theme (dev only)
app.post('/api/theme-votes/:id/delete', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }

    const user = safeParseUserCookie(userCookie)
    if (!isDevAdmin(user, c.env)) {
      return c.json({ success: false, error: 'Permission denied' }, 403)
    }

    const themeId = c.req.param('id')

    // Delete votes first
    try {
      await c.env.DB.prepare('DELETE FROM theme_votes WHERE theme_id = ?').bind(themeId).run()
    } catch (e) { }

    // Delete the theme
    await c.env.DB.prepare('DELETE FROM theme_proposals WHERE id = ?').bind(themeId).run()

    return c.json({ success: true })
  } catch (error) {
    console.error('Delete theme error:', error)
    return c.json({ success: false, error: 'Failed to delete theme' }, 500)
  }
})

// ==================== Support Ticket System APIs ==

// API: Get user's tickets
app.get('/api/tickets', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }

    const user = safeParseUserCookie(userCookie)

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

// ====================== ADMIN DASHBOARD APIs ======================

// API: Admin - system stats
app.get('/api/admin/stats', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user || !(await isDevAdminDB(user, c.env))) return c.json({ success: false, error: 'Permission denied' }, 403)
    const [u, d, p, a] = await Promise.all([
      c.env.DB.prepare('SELECT COUNT(*) as cnt FROM users').first(),
      c.env.DB.prepare('SELECT COUNT(*) as cnt FROM debates').first(),
      c.env.DB.prepare('SELECT COUNT(*) as cnt FROM community_posts').first(),
      c.env.DB.prepare('SELECT COUNT(*) as cnt FROM archived_debates').first(),
    ])
    return c.json({ success: true, stats: { total_users: (u as any)?.cnt||0, total_debates: (d as any)?.cnt||0, total_posts: (p as any)?.cnt||0, total_archives: (a as any)?.cnt||0 } })
  } catch(e) { return c.json({ success: false, error: String(e) }, 500) }
})

// API: Admin - user list
app.get('/api/admin/users', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user || !(await isDevAdminDB(user, c.env))) return c.json({ success: false, error: 'Permission denied' }, 403)
    let result: any
    try {
      result = await c.env.DB.prepare(
        `SELECT user_id, username, email, credits, is_dev, is_banned, ban_reason,
                post_ban, debate_ban, credit_freeze, restriction_reason,
                last_access_at, created_at
         FROM users ORDER BY created_at DESC LIMIT 200`
      ).all()
    } catch(e) {
      // Fallback: new columns not yet migrated on production
      result = await c.env.DB.prepare(
        `SELECT user_id, username, email, credits, is_dev, is_banned, ban_reason,
                last_access_at, created_at
         FROM users ORDER BY created_at DESC LIMIT 200`
      ).all()
    }
    return c.json({ success: true, users: result.results || [] })
  } catch(e) { return c.json({ success: false, error: String(e) }, 500) }
})

// API: Admin - dev users list
app.get('/api/admin/dev-users', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user || !(await isDevAdminDB(user, c.env))) return c.json({ success: false, error: 'Permission denied' }, 403)
    const result = await c.env.DB.prepare(
      `SELECT u.user_id, u.username, u.email, u.is_dev, di.inviter_user_id as granted_by
       FROM users u
       LEFT JOIN dev_invitations di ON di.invitee_user_id = u.user_id
       WHERE u.is_dev = 1
       ORDER BY u.created_at ASC`
    ).all()
    return c.json({ success: true, users: result.results || [] })
  } catch(e) { return c.json({ success: false, error: String(e) }, 500) }
})

// API: Admin - grant/revoke dev role
app.post('/api/admin/dev-role', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user || !(await isDevAdminDB(user, c.env))) return c.json({ success: false, error: 'Permission denied' }, 403)
    const { target_user_id, action } = await c.req.json()
    if (!target_user_id || !['grant', 'revoke'].includes(action)) return c.json({ success: false, error: 'Invalid params' }, 400)
    // Prevent revoking the original dev
    if (action === 'revoke' && target_user_id === 'dev') return c.json({ success: false, error: 'オリジナルdevの権限は剥奪できません' }, 403)
    // Check target user exists
    const targetUser = await c.env.DB.prepare('SELECT user_id FROM users WHERE user_id = ?').bind(target_user_id).first()
    if (!targetUser) return c.json({ success: false, error: 'ユーザーが見つかりません' }, 404)
    if (action === 'grant') {
      await c.env.DB.prepare('UPDATE users SET is_dev = 1 WHERE user_id = ?').bind(target_user_id).run()
      // Record invitation
      try {
        await c.env.DB.prepare(
          'INSERT OR IGNORE INTO dev_invitations (id, inviter_user_id, invitee_user_id) VALUES (?, ?, ?)'
        ).bind(crypto.randomUUID(), user.user_id, target_user_id).run()
      } catch(e) {}
    } else {
      await c.env.DB.prepare('UPDATE users SET is_dev = 0 WHERE user_id = ?').bind(target_user_id).run()
      try { await c.env.DB.prepare('DELETE FROM dev_invitations WHERE invitee_user_id = ?').bind(target_user_id).run() } catch(e) {}
    }
    return c.json({ success: true })
  } catch(e) { return c.json({ success: false, error: String(e) }, 500) }
})

// API: Admin - grant credits
app.post('/api/admin/credits', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user || !(await isDevAdminDB(user, c.env))) return c.json({ success: false, error: 'Permission denied' }, 403)
    const { target_user_id, amount, reason } = await c.req.json()
    if (!target_user_id || !amount || amount <= 0) return c.json({ success: false, error: 'Invalid params' }, 400)
    const targetUser = await c.env.DB.prepare('SELECT user_id, credits FROM users WHERE user_id = ?').bind(target_user_id).first()
    if (!targetUser) return c.json({ success: false, error: 'ユーザーが見つかりません' }, 404)
    await c.env.DB.prepare('UPDATE users SET credits = credits + ? WHERE user_id = ?').bind(amount, target_user_id).run()
    await c.env.DB.prepare(
      'INSERT INTO credit_transactions (id, user_id, amount, type, reason, created_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)'
    ).bind(crypto.randomUUID(), target_user_id, amount, 'earn', reason || 'admin_grant').run()
    return c.json({ success: true })
  } catch(e) { return c.json({ success: false, error: String(e) }, 500) }
})

// API: Admin - recent transactions
app.get('/api/admin/transactions', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user || !(await isDevAdminDB(user, c.env))) return c.json({ success: false, error: 'Permission denied' }, 403)
    const result = await c.env.DB.prepare(
      'SELECT user_id, amount, type, reason, created_at FROM credit_transactions ORDER BY created_at DESC LIMIT 50'
    ).all()
    return c.json({ success: true, transactions: result.results || [] })
  } catch(e) { return c.json({ success: false, error: String(e) }, 500) }
})

// API: Admin - debates list
app.get('/api/admin/debates', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user || !(await isDevAdminDB(user, c.env))) return c.json({ success: false, error: 'Permission denied' }, 403)
    const result = await c.env.DB.prepare(
      'SELECT id, theme, status, created_at FROM debates ORDER BY created_at DESC LIMIT 100'
    ).all()
    return c.json({ success: true, debates: result.results || [] })
  } catch(e) { return c.json({ success: false, error: String(e) }, 500) }
})

// API: Get all tickets (dev only)
app.get('/api/admin/tickets', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user || !isDevAdmin(user, c.env)) return c.json({ success: false, error: 'Permission denied' }, 403)

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

    const user = safeParseUserCookie(userCookie)
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

    const user = safeParseUserCookie(userCookie)
    const ticketId = c.req.param('id')

    // Verify ticket ownership or dev user
    const ticket = await c.env.DB.prepare(`
      SELECT user_id FROM support_tickets WHERE id = ?
    `).bind(ticketId).first()

    if (!ticket) {
      return c.json({ success: false, error: 'Ticket not found' }, 404)
    }

    if (ticket.user_id !== user.user_id && !(user.user_id === 'dev' && getDevAdminEmails(c.env).includes((user.email||'').toLowerCase()))) {
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

    const user = safeParseUserCookie(userCookie)
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

    if (ticket.user_id !== user.user_id && !(user.user_id === 'dev' && getDevAdminEmails(c.env).includes((user.email||'').toLowerCase()))) {
      return c.json({ success: false, error: 'Permission denied' }, 403)
    }

    // Prevent replies on resolved/closed tickets
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      return c.json({ success: false, error: 'このチケットは解決済みのため返信できません' }, 400)
    }

    const messageId = crypto.randomUUID()
    const isStaffReply = (user.user_id === 'dev' && getDevAdminEmails(c.env).includes((user.email||'').toLowerCase())) ? 1 : 0

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

    const user = safeParseUserCookie(userCookie)
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

    const user = safeParseUserCookie(userCookie)
    if (!isDevAdmin(user, c.env)) {
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

// ============================================================
// NOTIFICATIONS API
// ============================================================

// GET /api/notifications - fetch user notifications
app.get('/api/notifications', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user) return c.json({ success: false, error: 'Not authenticated' }, 401)
    
    const result = await c.env.DB.prepare(
      `SELECT id, type, title, body, is_read, link, created_at
       FROM notifications WHERE user_id = ?
       ORDER BY created_at DESC LIMIT 50`
    ).bind(user.user_id).all()
    
    return c.json({ success: true, notifications: result.results || [] })
  } catch(e) {
    return c.json({ success: false, error: String(e) }, 500)
  }
})

// GET /api/notifications/unread-count
app.get('/api/notifications/unread-count', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user) return c.json({ count: 0 })
    
    const result = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0`
    ).bind(user.user_id).first()
    
    return c.json({ count: (result?.count as number) || 0 })
  } catch(e) {
    return c.json({ count: 0 })
  }
})

// POST /api/notifications/read-all - mark all as read
app.post('/api/notifications/read-all', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user) return c.json({ success: false, error: 'Not authenticated' }, 401)
    
    await c.env.DB.prepare(
      `UPDATE notifications SET is_read = 1 WHERE user_id = ?`
    ).bind(user.user_id).run()
    
    return c.json({ success: true })
  } catch(e) {
    return c.json({ success: false, error: String(e) }, 500)
  }
})

// POST /api/notifications/read/:id - mark single as read
app.post('/api/notifications/read/:id', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user) return c.json({ success: false, error: 'Not authenticated' }, 401)
    const notifId = c.req.param('id')
    
    await c.env.DB.prepare(
      `UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`
    ).bind(notifId, user.user_id).run()
    
    return c.json({ success: true })
  } catch(e) {
    return c.json({ success: false, error: String(e) }, 500)
  }
})

// ============================================================
// USER BAN / RESTRICT API (dev admin only)
// ============================================================

// POST /api/admin/ban - ban/unban/restrict a user
// action: 'ban' | 'unban' | 'post_ban' | 'post_unban' | 'debate_ban' | 'debate_unban' | 'credit_freeze' | 'credit_unfreeze'
app.post('/api/admin/ban', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user || !(await isDevAdminDB(user, c.env))) return c.json({ success: false, error: 'Permission denied' }, 403)
    
    const { target_user_id, action, reason } = await c.req.json()
    const validActions = ['ban','unban','post_ban','post_unban','debate_ban','debate_unban','credit_freeze','credit_unfreeze']
    if (!target_user_id || !validActions.includes(action)) return c.json({ success: false, error: 'Invalid params' }, 400)
    if (target_user_id === 'dev') return c.json({ success: false, error: 'devユーザーは制限できません' }, 403)
    
    const targetUser = await c.env.DB.prepare('SELECT user_id, username, is_dev FROM users WHERE user_id = ?').bind(target_user_id).first() as any
    if (!targetUser) return c.json({ success: false, error: 'ユーザーが見つかりません' }, 404)
    if (targetUser.is_dev && ['ban','post_ban','debate_ban','credit_freeze'].includes(action)) {
      return c.json({ success: false, error: 'dev権限ユーザーは制限できません' }, 403)
    }
    
    let notifTitle = ''
    let notifBody = ''
    let notifType = 'warning'

    if (action === 'ban') {
      await c.env.DB.prepare(
        `UPDATE users SET is_banned = 1, ban_reason = ? WHERE user_id = ?`
      ).bind(reason || 'Admin ban', target_user_id).run()
      notifTitle = 'アカウント停止のお知らせ'
      notifBody = `あなたのアカウントは停止されました。理由: ${reason || '規約違反'}。詳細はサポートにお問い合わせください。`
    } else if (action === 'unban') {
      await c.env.DB.prepare(
        `UPDATE users SET is_banned = 0, ban_reason = NULL WHERE user_id = ?`
      ).bind(target_user_id).run()
      notifTitle = 'アカウント停止の解除'
      notifBody = 'アカウント停止が解除されました。通常通りご利用いただけます。'
      notifType = 'info'
    } else if (action === 'post_ban') {
      await c.env.DB.prepare(
        `UPDATE users SET post_ban = 1, restriction_reason = ? WHERE user_id = ?`
      ).bind(reason || '投稿禁止', target_user_id).run()
      notifTitle = '投稿機能の制限'
      notifBody = `コミュニティへの投稿が制限されました。理由: ${reason || '規約違反'}。`
    } else if (action === 'post_unban') {
      await c.env.DB.prepare(
        `UPDATE users SET post_ban = 0 WHERE user_id = ?`
      ).bind(target_user_id).run()
      notifTitle = '投稿制限の解除'
      notifBody = 'コミュニティへの投稿制限が解除されました。'
      notifType = 'info'
    } else if (action === 'debate_ban') {
      await c.env.DB.prepare(
        `UPDATE users SET debate_ban = 1, restriction_reason = ? WHERE user_id = ?`
      ).bind(reason || 'ディベート禁止', target_user_id).run()
      notifTitle = 'ディベート機能の制限'
      notifBody = `ディベートへの参加が制限されました。理由: ${reason || '規約違反'}。`
    } else if (action === 'debate_unban') {
      await c.env.DB.prepare(
        `UPDATE users SET debate_ban = 0 WHERE user_id = ?`
      ).bind(target_user_id).run()
      notifTitle = 'ディベート制限の解除'
      notifBody = 'ディベートへの参加制限が解除されました。'
      notifType = 'info'
    } else if (action === 'credit_freeze') {
      await c.env.DB.prepare(
        `UPDATE users SET credit_freeze = 1, restriction_reason = ? WHERE user_id = ?`
      ).bind(reason || 'クレジット凍結', target_user_id).run()
      notifTitle = 'クレジット凍結のお知らせ'
      notifBody = `クレジットの使用が凍結されました。理由: ${reason || '規約違反'}。詳細はサポートにお問い合わせください。`
    } else if (action === 'credit_unfreeze') {
      await c.env.DB.prepare(
        `UPDATE users SET credit_freeze = 0 WHERE user_id = ?`
      ).bind(target_user_id).run()
      notifTitle = 'クレジット凍結の解除'
      notifBody = 'クレジットの使用凍結が解除されました。'
      notifType = 'info'
    }
    
    // Send notification
    try {
      await c.env.DB.prepare(
        `INSERT INTO notifications (id, user_id, type, title, body, created_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
      ).bind(crypto.randomUUID(), target_user_id, notifType, notifTitle, notifBody).run()
    } catch(e) {}
    
    console.log(`[Admin RESTRICT] ${action} user ${target_user_id} by ${user.user_id}`)
    return c.json({ success: true })
  } catch(e) {
    return c.json({ success: false, error: String(e) }, 500)
  }
})

// POST /api/admin/notify - send notification to user (dev only)
app.post('/api/admin/notify', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user || !(await isDevAdminDB(user, c.env))) return c.json({ success: false, error: 'Permission denied' }, 403)
    
    const { target_user_id, title, body, type, link } = await c.req.json()
    if (!target_user_id || !title || !body) return c.json({ success: false, error: 'Invalid params' }, 400)
    
    // 'all' sends to all users
    if (target_user_id === 'all') {
      const users = await c.env.DB.prepare('SELECT user_id FROM users LIMIT 500').all()
      const allUsers = users.results || []
      for (const u of allUsers) {
        try {
          await c.env.DB.prepare(
            `INSERT INTO notifications (id, user_id, type, title, body, link, created_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
          ).bind(crypto.randomUUID(), (u as any).user_id, type || 'info', title, body, link || null).run()
        } catch(e) {}
      }
      return c.json({ success: true, sent: allUsers.length })
    }
    
    await c.env.DB.prepare(
      `INSERT INTO notifications (id, user_id, type, title, body, link, created_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
    ).bind(crypto.randomUUID(), target_user_id, type || 'info', title, body, link || null).run()
    
    return c.json({ success: true })
  } catch(e) {
    return c.json({ success: false, error: String(e) }, 500)
  }
})

// GET /api/admin/users - updated version with last_access_at, is_banned, restriction types
app.get('/api/admin/users/full', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user || !(await isDevAdminDB(user, c.env))) return c.json({ success: false, error: 'Permission denied' }, 403)
    let result: any
    try {
      result = await c.env.DB.prepare(
        `SELECT user_id, username, email, credits, is_dev, is_banned, ban_reason,
                post_ban, debate_ban, credit_freeze, restriction_reason,
                last_access_at, created_at
         FROM users ORDER BY created_at DESC LIMIT 200`
      ).all()
    } catch(e) {
      result = await c.env.DB.prepare(
        `SELECT user_id, username, email, credits, is_dev, is_banned, ban_reason,
                last_access_at, created_at
         FROM users ORDER BY created_at DESC LIMIT 200`
      ).all()
    }
    return c.json({ success: true, users: result.results || [] })
  } catch(e) { return c.json({ success: false, error: String(e) }, 500) }
})

// Update last_access_at on main page visits
app.post('/api/user/heartbeat', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    const user = safeParseUserCookie(userCookie)
    if (!user) return c.json({ success: false })
    
    await c.env.DB.prepare(
      `UPDATE users SET last_access_at = CURRENT_TIMESTAMP WHERE user_id = ?`
    ).bind(user.user_id).run()
    
    return c.json({ success: true })
  } catch(e) {
    return c.json({ success: false })
  }
})

// GET /api/stats/aio - AIO Debate overall statistics for nav
app.get('/api/stats/aio', async (c) => {
  try {
    let totalDebates = 0, totalVotes = 0, totalUsers = 0, totalPosts = 0
    try {
      const d = await c.env.DB.prepare('SELECT COUNT(*) as c FROM archived_debates').first()
      totalDebates = (d?.c as number) || 0
    } catch(e) {}
    try {
      const d = await c.env.DB.prepare('SELECT COUNT(*) as c FROM debate_votes').first()
      totalVotes = (d?.c as number) || 0
    } catch(e) {}
    try {
      const d = await c.env.DB.prepare('SELECT COUNT(*) as c FROM users').first()
      totalUsers = (d?.c as number) || 0
    } catch(e) {}
    try {
      const d = await c.env.DB.prepare('SELECT COUNT(*) as c FROM community_posts').first()
      totalPosts = (d?.c as number) || 0
    } catch(e) {}
    return c.json({ success: true, total_debates: totalDebates, total_votes: totalVotes, total_users: totalUsers, total_posts: totalPosts })
  } catch(e) {
    return c.json({ success: false, total_debates: 0, total_votes: 0, total_users: 0, total_posts: 0 })
  }
})

export default app
