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
  
  // Dev user - 500000 credits
  if (user.user_id === 'dev') {
    user.credits = 500000
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
    const userData = await c.env.DB.prepare(
      'SELECT * FROM users WHERE user_id = ?'
    ).bind(user.user_id).first()
    
    if (!userData) {
      return c.redirect('/')
    }
    
    const enrichedUserData = {
      ...userData,
      nickname: userData.nickname || user.username || user.user_id,
      avatar_type: userData.avatar_type || 'preset',
      avatar_value: userData.avatar_value || '1'
    }
    
    return c.html(myPage(enrichedUserData))
  } catch (error) {
    console.error('Error loading mypage:', error)
    return c.redirect('/')
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

// API: Profile Update
app.post('/api/profile/update', async (c) => {
  try {
    const userCookie = getCookie(c, 'user')
    if (!userCookie) {
      return c.json({ success: false, error: 'Not authenticated' }, 401)
    }
    
    const user = JSON.parse(userCookie)
    const { nickname, user_id, avatar_type, avatar_value } = await c.req.json()
    
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
    
    // Update user profile
    await c.env.DB.prepare(
      'UPDATE users SET nickname = ?, user_id = ?, avatar_type = ?, avatar_value = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?'
    ).bind(nickname, user_id, avatar_type, avatar_value, user.user_id).run()
    
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
    const announcements = await c.env.DB.prepare(
      'SELECT * FROM announcements ORDER BY created_at DESC LIMIT 50'
    ).all()
    
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

// API: Get Archive Debates
app.get('/api/archive/debates', async (c) => {
  try {
    const debates = await c.env.DB.prepare(
      'SELECT * FROM debates ORDER BY created_at DESC LIMIT 50'
    ).all()
    
    return c.json({ success: true, debates: debates.results || [] })
  } catch (error) {
    console.error('Get archive debates error:', error)
    return c.json({ success: false, error: 'Failed to load debates' }, 500)
  }
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
    
    // Check credits (dev user has 500000 credits)
    const userData = await c.env.DB.prepare(
      'SELECT credits FROM users WHERE user_id = ?'
    ).bind(user.user_id).first()
    
    const currentCredits = user.user_id === 'dev' ? 500000 : (userData?.credits || 0)
    
    if (currentCredits < 15) {
      return c.json({ success: false, error: 'クレジットが不足しています' })
    }
    
    // Deduct credits (only for non-dev users)
    if (user.user_id !== 'dev') {
      await c.env.DB.prepare(
        'UPDATE users SET credits = credits - 15 WHERE user_id = ?'
      ).bind(user.user_id).run()
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

// API: Get Community Posts
app.get('/api/community/posts', async (c) => {
  try {
    const lang = c.req.query('language') || 'ja'
    
    const posts = await c.env.DB.prepare(
      'SELECT * FROM community_posts WHERE language = ? ORDER BY created_at DESC LIMIT 50'
    ).bind(lang).all()
    
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
