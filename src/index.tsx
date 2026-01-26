import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Homepage
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Debate - AIとディベートする未来</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
    </head>
    <body class="bg-black text-white overflow-x-hidden">
        <!-- Navigation -->
        <nav class="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b-2 border-cyan-500">
            <div class="container mx-auto px-6 py-4 flex justify-between items-center">
                <div class="flex items-center space-x-2">
                    <div class="cyber-logo">
                        <i class="fas fa-brain text-3xl text-cyan-400"></i>
                    </div>
                    <span class="text-2xl font-bold cyber-text">AI Debate</span>
                </div>
                <div class="hidden md:flex space-x-8">
                    <a href="#home" class="nav-link">ホーム</a>
                    <a href="#features" class="nav-link">機能</a>
                    <a href="#debates" class="nav-link">ディベート</a>
                    <a href="#about" class="nav-link">About</a>
                </div>
                <div class="flex space-x-4">
                    <button class="btn-secondary">
                        <i class="fas fa-user-plus mr-2"></i>登録
                    </button>
                    <button class="btn-primary">
                        <i class="fas fa-sign-in-alt mr-2"></i>ログイン
                    </button>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section id="home" class="min-h-screen flex items-center justify-center relative pt-20">
            <div class="cyber-grid"></div>
            <div class="container mx-auto px-6 text-center relative z-10">
                <div class="glitch-wrapper">
                    <h1 class="text-6xl md:text-8xl font-black mb-6 glitch" data-text="AI Debate">
                        AI Debate
                    </h1>
                </div>
                <p class="text-xl md:text-2xl mb-8 text-cyan-300 max-w-3xl mx-auto neon-text">
                    🤖 AIとの知的バトルを体験しよう 🚀
                </p>
                <p class="text-lg mb-12 text-gray-300 max-w-2xl mx-auto">
                    最先端のAI技術で、いつでもどこでもディベートに参加。<br>
                    あなたの論理力と説得力を試す新しいプラットフォーム
                </p>
                <div class="flex flex-col md:flex-row gap-6 justify-center items-center">
                    <button class="btn-glow text-xl px-12 py-4">
                        <i class="fas fa-rocket mr-3"></i>今すぐ始める
                    </button>
                    <button class="btn-outline text-xl px-12 py-4">
                        <i class="fas fa-play-circle mr-3"></i>デモを見る
                    </button>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="py-20 relative">
            <div class="container mx-auto px-6">
                <h2 class="text-5xl font-bold text-center mb-16 cyber-text">
                    <span class="inline-block animate-pulse">✨</span>
                    Features
                    <span class="inline-block animate-pulse">✨</span>
                </h2>
                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Feature 1 -->
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-comments text-4xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">リアルタイムディベート</h3>
                        <p class="text-gray-400">
                            AIと即座にディベート開始。待ち時間ゼロで、あなたの意見をぶつけよう
                        </p>
                    </div>
                    
                    <!-- Feature 2 -->
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-trophy text-4xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">スコアリングシステム</h3>
                        <p class="text-gray-400">
                            論理性・説得力・創造性を評価。あなたのディベートスキルをレベルアップ
                        </p>
                    </div>
                    
                    <!-- Feature 3 -->
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-users text-4xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">観戦モード</h3>
                        <p class="text-gray-400">
                            他のユーザーとAIのディベートを観戦。学びと刺激を得よう
                        </p>
                    </div>
                    
                    <!-- Feature 4 -->
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-lightbulb text-4xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">多彩なトピック</h3>
                        <p class="text-gray-400">
                            科学・政治・文化・哲学など、様々なテーマでディベート可能
                        </p>
                    </div>
                    
                    <!-- Feature 5 -->
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-chart-line text-4xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">成長トラッキング</h3>
                        <p class="text-gray-400">
                            あなたの成長を可視化。過去のディベートを振り返り、改善しよう
                        </p>
                    </div>
                    
                    <!-- Feature 6 -->
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-globe text-4xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">多言語対応</h3>
                        <p class="text-gray-400">
                            日本語・英語をはじめ、複数の言語でディベート体験
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Popular Debates Section -->
        <section id="debates" class="py-20 bg-gradient-to-b from-black to-purple-900/20">
            <div class="container mx-auto px-6">
                <h2 class="text-5xl font-bold text-center mb-16 cyber-text">
                    🔥 人気のディベート 🔥
                </h2>
                <div class="grid md:grid-cols-2 gap-8">
                    <!-- Debate 1 -->
                    <div class="debate-card">
                        <div class="flex justify-between items-start mb-4">
                            <span class="badge badge-hot">🔥 トレンド</span>
                            <span class="text-sm text-gray-400">2時間前</span>
                        </div>
                        <h3 class="text-2xl font-bold mb-3">AIは人類の仕事を奪うか？</h3>
                        <p class="text-gray-400 mb-4">
                            技術進歩と雇用の未来について、白熱した議論が展開中
                        </p>
                        <div class="flex justify-between items-center">
                            <div class="flex items-center space-x-4">
                                <span class="text-cyan-400">
                                    <i class="fas fa-eye mr-2"></i>1,234
                                </span>
                                <span class="text-pink-400">
                                    <i class="fas fa-comment mr-2"></i>89
                                </span>
                            </div>
                            <button class="btn-watch">観戦する</button>
                        </div>
                    </div>
                    
                    <!-- Debate 2 -->
                    <div class="debate-card">
                        <div class="flex justify-between items-start mb-4">
                            <span class="badge badge-new">✨ 新着</span>
                            <span class="text-sm text-gray-400">30分前</span>
                        </div>
                        <h3 class="text-2xl font-bold mb-3">宇宙開発に巨額投資すべきか</h3>
                        <p class="text-gray-400 mb-4">
                            地球の問題 vs 宇宙の可能性。あなたはどちら派？
                        </p>
                        <div class="flex justify-between items-center">
                            <div class="flex items-center space-x-4">
                                <span class="text-cyan-400">
                                    <i class="fas fa-eye mr-2"></i>567
                                </span>
                                <span class="text-pink-400">
                                    <i class="fas fa-comment mr-2"></i>42
                                </span>
                            </div>
                            <button class="btn-watch">観戦する</button>
                        </div>
                    </div>
                    
                    <!-- Debate 3 -->
                    <div class="debate-card">
                        <div class="flex justify-between items-start mb-4">
                            <span class="badge badge-philosophy">🧠 哲学</span>
                            <span class="text-sm text-gray-400">1日前</span>
                        </div>
                        <h3 class="text-2xl font-bold mb-3">自由意志は存在するのか？</h3>
                        <p class="text-gray-400 mb-4">
                            決定論 vs 自由意志論。深遠な哲学的テーマに挑戦
                        </p>
                        <div class="flex justify-between items-center">
                            <div class="flex items-center space-x-4">
                                <span class="text-cyan-400">
                                    <i class="fas fa-eye mr-2"></i>892
                                </span>
                                <span class="text-pink-400">
                                    <i class="fas fa-comment mr-2"></i>156
                                </span>
                            </div>
                            <button class="btn-watch">観戦する</button>
                        </div>
                    </div>
                    
                    <!-- Debate 4 -->
                    <div class="debate-card">
                        <div class="flex justify-between items-start mb-4">
                            <span class="badge badge-science">🔬 科学</span>
                            <span class="text-sm text-gray-400">3時間前</span>
                        </div>
                        <h3 class="text-2xl font-bold mb-3">気候変動対策は経済成長と両立できるか</h3>
                        <p class="text-gray-400 mb-4">
                            環境保護と経済発展のバランスについて議論
                        </p>
                        <div class="flex justify-between items-center">
                            <div class="flex items-center space-x-4">
                                <span class="text-cyan-400">
                                    <i class="fas fa-eye mr-2"></i>1,456
                                </span>
                                <span class="text-pink-400">
                                    <i class="fas fa-comment mr-2"></i>203
                                </span>
                            </div>
                            <button class="btn-watch">観戦する</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-20 relative">
            <div class="container mx-auto px-6 text-center">
                <div class="cta-box">
                    <h2 class="text-5xl font-bold mb-6 cyber-text">
                        Ready to Debate? 🚀
                    </h2>
                    <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        今すぐ参加して、AIとの知的バトルを始めよう！<br>
                        無料で始められます
                    </p>
                    <button class="btn-glow text-2xl px-16 py-5">
                        <i class="fas fa-bolt mr-3"></i>無料で始める
                    </button>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="py-12 border-t-2 border-cyan-500/30">
            <div class="container mx-auto px-6">
                <div class="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h4 class="text-xl font-bold mb-4 text-cyan-400">AI Debate</h4>
                        <p class="text-gray-400">
                            AIとディベートする、<br>新しい学びのプラットフォーム
                        </p>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold mb-4">プラットフォーム</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#" class="hover:text-cyan-400">ディベート</a></li>
                            <li><a href="#" class="hover:text-cyan-400">観戦</a></li>
                            <li><a href="#" class="hover:text-cyan-400">ランキング</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold mb-4">サポート</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#" class="hover:text-cyan-400">ヘルプ</a></li>
                            <li><a href="#" class="hover:text-cyan-400">利用規約</a></li>
                            <li><a href="#" class="hover:text-cyan-400">プライバシー</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold mb-4">Follow Us</h4>
                        <div class="flex space-x-4">
                            <a href="#" class="social-icon">
                                <i class="fab fa-twitter"></i>
                            </a>
                            <a href="#" class="social-icon">
                                <i class="fab fa-discord"></i>
                            </a>
                            <a href="#" class="social-icon">
                                <i class="fab fa-github"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="text-center text-gray-500 pt-8 border-t border-gray-800">
                    <p>&copy; 2026 AI Debate. All rights reserved.</p>
                </div>
            </div>
        </footer>

        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app
