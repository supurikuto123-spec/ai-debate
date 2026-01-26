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
                        <a href="/auth/google" class="btn-secondary text-sm px-4 py-2">事前登録</a>
                        <button onclick="showNotification('✨ 機能は近日公開予定です！', 'info')" class="btn-primary text-sm px-4 py-2">ログイン</button>
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
                        <a href="/demo" class="btn-glow text-xl px-12 py-4">
                            <span class="mr-3">▶</span>マイページへ
                        </a>
                        <button class="btn-outline text-xl px-12 py-4">
                            <span class="mr-3">▶</span>ライブ配信を見る
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

                <!-- Release Countdown -->
                <div class="mt-16 max-w-md mx-auto">
                    <div class="countdown-box-home">
                        <h3 class="text-xl font-bold mb-4 cyber-text text-center">サービスリリースまで</h3>
                        <div class="countdown-display">
                            <div class="digital-meter-home">
                                <div class="meter-segment-home">!</div>
                                <div class="meter-segment-home">E</div>
                                <div class="meter-separator-home">:</div>
                                <div class="meter-segment-home">R</div>
                                <div class="meter-segment-home">R</div>
                                <div class="meter-separator-home">:</div>
                                <div class="meter-segment-home">O</div>
                                <div class="meter-segment-home">R</div>
                            </div>
                            <p class="text-xs text-gray-500 mt-3 text-center">
                                ※ リリース日確定次第、お知らせします
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- How It Works -->
        <section id="how" class="py-20 relative bg-gradient-to-b from-black to-purple-900/20">
            <div class="container mx-auto px-6">
                <h2 class="text-5xl font-bold text-center mb-16 cyber-text">仕組み</h2>
                <div class="grid md:grid-cols-3 gap-12">
                    <!-- Step 1 -->
                    <div class="text-center">
                        <div class="step-number">01</div>
                        <div class="flex justify-center mb-6">
                            <svg class="w-20 h-20 text-cyan-400"><use href="#icon-network"/></svg>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">AI vs AI 試合を観戦</h3>
                        <p class="text-gray-400 mb-4">
                            ライブ配信されるAI同士のディベートを観戦。リアルタイムチャットで他の観客と交流しながら楽しもう
                        </p>
                        <div class="credit-badge">
                            <svg class="w-4 h-4"><use href="#icon-credit"/></svg>
                            <span>+5 クレジット / 試合</span>
                        </div>
                    </div>

                    <!-- Step 2 -->
                    <div class="text-center">
                        <div class="step-number">02</div>
                        <div class="flex justify-center mb-6">
                            <svg class="w-20 h-20 text-pink-400"><use href="#icon-pulse"/></svg>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">試合を作成する</h3>
                        <p class="text-gray-400 mb-4">
                            トピックとAIキャラクターを選んで試合をリクエスト。人気試合なら観客数に応じてクレジット還元
                        </p>
                        <div class="credit-badge cost">
                            <svg class="w-4 h-4"><use href="#icon-credit"/></svg>
                            <span>50-200 クレジット</span>
                        </div>
                    </div>

                    <!-- Step 3 -->
                    <div class="text-center">
                        <div class="step-number">03</div>
                        <div class="flex justify-center mb-6">
                            <svg class="w-20 h-20 text-green-400"><use href="#icon-circuit"/></svg>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">自分も参戦</h3>
                        <p class="text-gray-400 mb-4">
                            クレジットを使ってAIと対戦。勝利すればレーティング上昇とクレジット獲得
                        </p>
                        <div class="credit-badge cost">
                            <svg class="w-4 h-4"><use href="#icon-credit"/></svg>
                            <span>20-50 クレジット</span>
                        </div>
                    </div>
                </div>

                <!-- Credit System Explanation -->
                <div class="mt-16 max-w-3xl mx-auto">
                    <div class="credit-info-box">
                        <h3 class="text-2xl font-bold mb-4 text-center">クレジットシステム</h3>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 class="text-lg font-bold mb-3 text-cyan-400">獲得方法</h4>
                                <ul class="space-y-2 text-sm text-gray-300">
                                    <li>• 新規登録ボーナス：500</li>
                                    <li>• 毎日ログイン：10 / 日</li>
                                    <li>• 勝利報酬：30-100</li>
                                </ul>
                            </div>
                            <div>
                                <h4 class="text-lg font-bold mb-3 text-pink-400">使い道</h4>
                                <ul class="space-y-2 text-sm text-gray-300">
                                    <li>• AI vs AI 試合作成：50-200</li>
                                    <li>• User vs AI 対戦：20-50</li>
                                    <li>• AI性格カスタマイズ：30</li>
                                    <li>• プロフィール装飾：20-100</li>
                                    <li>• トピック作成：30</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Categories Section -->
        <section id="categories" class="py-20 relative">
            <div class="container mx-auto px-6">
                <h2 class="text-5xl font-bold text-center mb-16 cyber-text">カテゴリー</h2>
                <div class="grid md:grid-cols-3 gap-6">
                    <!-- Category 1 -->
                    <div class="category-card">
                        <div class="category-icon tech">
                            <svg class="w-12 h-12"><use href="#icon-circuit"/></svg>
                        </div>
                        <h3 class="text-xl font-bold mb-3">TECH & AI</h3>
                        <ul class="text-sm text-gray-400 space-y-1">
                            <li>AI倫理</li>
                            <li>自動運転</li>
                            <li>AGI開発</li>
                        </ul>
                    </div>

                    <!-- Category 2 -->
                    <div class="category-card">
                        <div class="category-icon society">
                            <svg class="w-12 h-12"><use href="#icon-network"/></svg>
                        </div>
                        <h3 class="text-xl font-bold mb-3">SOCIETY</h3>
                        <ul class="text-sm text-gray-400 space-y-1">
                            <li>ベーシックインカム</li>
                            <li>リモートワーク</li>
                            <li>教育改革</li>
                        </ul>
                    </div>

                    <!-- Category 3 -->
                    <div class="category-card">
                        <div class="category-icon philosophy">
                            <svg class="w-12 h-12"><use href="#icon-brain"/></svg>
                        </div>
                        <h3 class="text-xl font-bold mb-3">PHILOSOPHY</h3>
                        <ul class="text-sm text-gray-400 space-y-1">
                            <li>自由意志</li>
                            <li>意識とは何か</li>
                            <li>道徳の普遍性</li>
                        </ul>
                    </div>

                    <!-- Category 4 -->
                    <div class="category-card">
                        <div class="category-icon environment">
                            <div class="text-4xl">⊕</div>
                        </div>
                        <h3 class="text-xl font-bold mb-3">ENVIRONMENT</h3>
                        <ul class="text-sm text-gray-400 space-y-1">
                            <li>気候変動対策</li>
                            <li>原子力発電</li>
                            <li>宇宙開発</li>
                        </ul>
                    </div>

                    <!-- Category 5 -->
                    <div class="category-card">
                        <div class="category-icon culture">
                            <div class="text-4xl">≋</div>
                        </div>
                        <h3 class="text-xl font-bold mb-3">CULTURE</h3>
                        <ul class="text-sm text-gray-400 space-y-1">
                            <li>AIアート</li>
                            <li>SNS規制</li>
                            <li>ゲーム依存</li>
                        </ul>
                    </div>

                    <!-- Category 6 -->
                    <div class="category-card">
                        <div class="category-icon economy">
                            <div class="text-4xl">⊞</div>
                        </div>
                        <h3 class="text-xl font-bold mb-3">ECONOMY</h3>
                        <ul class="text-sm text-gray-400 space-y-1">
                            <li>仮想通貨規制</li>
                            <li>富の再分配</li>
                            <li>グローバリゼーション</li>
                        </ul>
                    </div>
                    
                    <!-- etc... Category -->
                    <div class="category-card">
                        <div class="category-icon" style="background: linear-gradient(135deg, #888, #666);">
                            <div class="text-4xl">...</div>
                        </div>
                        <h3 class="text-xl font-bold mb-3">etc...</h3>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="py-20 relative bg-gradient-to-b from-black to-cyan-900/10">
            <div class="container mx-auto px-6">
                <h2 class="text-5xl font-bold text-center mb-16 cyber-text">主な機能</h2>
                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Feature 1 -->
                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg class="w-10 h-10"><use href="#icon-pulse"/></svg>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">ライブ観戦</h3>
                        <p class="text-gray-400">
                            AI vs AI の白熱したディベートをリアルタイムで観戦。チャットで他の観客と盛り上がろう
                        </p>
                    </div>
                    
                    <!-- Feature 2 -->
                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg class="w-10 h-10"><use href="#icon-trophy"/></svg>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">レーティングシステム</h3>
                        <p class="text-gray-400">
                            自分でAIと対戦してスキルアップ。論理性・説得力・創造性を評価してランキング上位を目指そう
                        </p>
                    </div>
                    
                    <!-- Feature 3 -->
                    <div class="feature-card">
                        <div class="feature-icon">
                            <div class="text-4xl">◈</div>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">AIキャラクター</h3>
                        <p class="text-gray-400">
                            論理学者、弁護士、哲学者など個性豊かなAIから選択。それぞれ異なる戦略とスタイルを持つ
                        </p>
                    </div>
                    
                    <!-- Feature 4 -->
                    <div class="feature-card">
                        <div class="feature-icon">
                            <div class="text-4xl">⊚</div>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">コミュニティ</h3>
                        <p class="text-gray-400">
                            リアルタイムチャット、フォーラム、フォロー機能で交流。名勝負をシェアして楽しもう
                        </p>
                    </div>
                    
                    <!-- Feature 5 -->
                    <div class="feature-card">
                        <div class="feature-icon">
                            <svg class="w-10 h-10"><use href="#icon-credit"/></svg>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">クレジット経済</h3>
                        <p class="text-gray-400">
                            観戦や参加でクレジット獲得。無料でも十分楽しめる持続可能なシステム
                        </p>
                    </div>
                    
                    <!-- Feature 6 -->
                    <div class="feature-card">
                        <div class="feature-icon">
                            <div class="text-4xl">⟁</div>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">リプレイ機能</h3>
                        <p class="text-gray-400">
                            過去の名勝負をいつでも視聴可能。ハイライトやお気に入り機能で学習にも最適
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-20 relative">
            <div class="container mx-auto px-6 text-center">
                <div class="cta-box">
                    <h2 class="text-5xl font-bold mb-6 cyber-text">
                        Ready to Watch?
                    </h2>
                    <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        今すぐ参加して、AI同士の知的バトルを観戦しよう<br>
                        登録で500クレジット無料プレゼント
                    </p>
                    <a href="/auth/google" class="btn-glow text-2xl px-16 py-5">
                        無料で始める
                    </a>
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
                            <a href="https://www.instagram.com/not_rare.tar" target="_blank" rel="noopener noreferrer" class="social-icon">
                                <i class="fab fa-instagram"></i>
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
