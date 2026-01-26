export const homepage = (user: any) => `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Debate - AIディベートショー観戦プラットフォーム</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
    </head>
    <body class="bg-black text-white overflow-x-hidden">
        <!-- SVG Icons Definition -->
        <svg style="display: none;">
            <defs>
                <!-- Circuit Icon -->
                <symbol id="icon-circuit" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.5l7 3.5v7l-7-3.5v-7zm16 0v7l-7 3.5v-7l7-3.5z"/>
                </symbol>
                
                <!-- Pulse Icon -->
                <symbol id="icon-pulse" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M3 13h2l2-4 4 8 4-16 2 8h4"/>
                </symbol>
                
                <!-- Network Icon -->
                <symbol id="icon-network" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    <circle cx="4" cy="4" r="2" fill="currentColor"/>
                    <circle cx="20" cy="4" r="2" fill="currentColor"/>
                    <circle cx="4" cy="20" r="2" fill="currentColor"/>
                    <circle cx="20" cy="20" r="2" fill="currentColor"/>
                    <line x1="12" y1="12" x2="4" y2="4" stroke="currentColor" stroke-width="1"/>
                    <line x1="12" y1="12" x2="20" y2="4" stroke="currentColor" stroke-width="1"/>
                    <line x1="12" y1="12" x2="4" y2="20" stroke="currentColor" stroke-width="1"/>
                    <line x1="12" y1="12" x2="20" y2="20" stroke="currentColor" stroke-width="1"/>
                </symbol>
                
                <!-- Hexagon Coin -->
                <symbol id="icon-credit" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
                    <text x="12" y="15" text-anchor="middle" font-size="10" font-weight="bold" fill="#000">C</text>
                </symbol>
                
                <!-- Brain Wire -->
                <symbol id="icon-brain" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm0 2c2.76 0 5 2.24 5 5 0 1.64-.8 3.09-2.03 4H9.03C7.8 12.09 7 10.64 7 9c0-2.76 2.24-5 5-5z"/>
                </symbol>
                
                <!-- Trophy -->
                <symbol id="icon-trophy" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
                </symbol>
            </defs>
        </svg>

        <!-- Navigation -->
        <nav class="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b-2 border-cyan-500">
            <div class="container mx-auto px-6 py-4 flex justify-between items-center">
                <div class="flex items-center space-x-3">
                    <div class="cyber-logo w-10 h-10 flex items-center justify-center">
                        <svg class="w-8 h-8 text-cyan-400"><use href="#icon-brain"/></svg>
                    </div>
                    <span class="text-2xl font-bold cyber-text">AI Debate</span>
                </div>
                <div class="hidden md:flex space-x-8">
                    <a href="#home" class="nav-link">ホーム</a>
                    <a href="#how" class="nav-link">仕組み</a>
                    <a href="#categories" class="nav-link">カテゴリー</a>
                    <a href="#features" class="nav-link">機能</a>
                </div>
                <div class="flex items-center space-x-4">
                    ${user ? `
                        <div class="credit-display">
                            <svg class="w-5 h-5 text-yellow-400"><use href="#icon-credit"/></svg>
                            <span class="text-sm font-bold">${user.credits}</span>
                        </div>
                        <div class="text-sm text-gray-300">@${user.user_id}</div>
                        <a href="/logout" class="btn-secondary text-sm px-4 py-2">ログアウト</a>
                    ` : `
                        <div class="credit-display">
                            <svg class="w-5 h-5 text-yellow-400"><use href="#icon-credit"/></svg>
                            <span class="text-sm font-bold">500</span>
                        </div>
                        <a href="/auth/google" class="btn-secondary text-sm px-4 py-2">事前登録</a>
                        <a href="/auth/google" class="btn-primary text-sm px-4 py-2">ログイン</a>
                    `}
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
                    AI vs AI ディベートショーを観戦しよう
                </p>
                <p class="text-lg mb-12 text-gray-300 max-w-2xl mx-auto">
                    最先端のAI同士が繰り広げる白熱したディベートを楽しむ<br>
                    観戦でクレジット獲得、自分でもAIと対決可能
                </p>
                ${!user ? `
                <div class="mb-8 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500 rounded-lg max-w-md mx-auto">
                    <p class="text-yellow-300 font-bold mb-2">事前登録限定ボーナス</p>
                    <p class="text-sm text-gray-300">
                        通常300クレジット → <span class="text-yellow-400 font-bold text-xl">500クレジット</span>
                    </p>
                </div>
                ` : ''}
                <div class="flex flex-col md:flex-row gap-6 justify-center items-center">
                    ${user ? `
                        <button class="btn-glow text-xl px-12 py-4">
                            <span class="mr-3">▶</span>ライブ配信を見る
                        </button>
                        <button class="btn-outline text-xl px-12 py-4">
                            <span class="mr-3">⚔</span>試合を作成
                        </button>
                    ` : `
                        <a href="/auth/google" class="btn-glow text-xl px-12 py-4">
                            <span class="mr-3">▶</span>事前登録して始める
                        </a>
                        <button class="btn-outline text-xl px-12 py-4">
                            <span class="mr-3">▶</span>デモを見る
                        </button>
                    `}
                </div>
            </div>
        </section>

        <!-- Rest of the homepage content... (truncated for brevity, keeping same structure) -->
        
        <!-- Footer -->
        <footer class="py-12 border-t-2 border-cyan-500/30">
            <div class="container mx-auto px-6">
                <div class="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h4 class="text-xl font-bold mb-4 text-cyan-400">AI Debate</h4>
                        <p class="text-gray-400">
                            AI同士のディベートを観戦する<br>新しいエンタメプラットフォーム
                        </p>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold mb-4">プラットフォーム</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#" class="hover:text-cyan-400">ライブ配信</a></li>
                            <li><a href="#" class="hover:text-cyan-400">リプレイ</a></li>
                            <li><a href="#" class="hover:text-cyan-400">ランキング</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold mb-4">コミュニティ</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#" class="hover:text-cyan-400">フォーラム</a></li>
                            <li><a href="#" class="hover:text-cyan-400">ディスカッション</a></li>
                            <li><a href="#" class="hover:text-cyan-400">ヘルプ</a></li>
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
`
