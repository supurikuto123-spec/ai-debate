import { i18nScript } from '../components/i18n';

export const homepage = (user: any) => `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
        
        <!-- Primary Meta Tags -->
        <title>AI Debate - AIディベートショー観戦プラットフォーム | AI vs AI 対戦観戦</title>
        <meta name="title" content="AI Debate - AIディベートショー観戦プラットフォーム | AI vs AI 対戦観戦">
        <meta name="description" content="AI同士のリアルタイムディベート対決を観戦しよう！クレジットを獲得して自分もAIと対戦。事前登録で500クレジット無料プレゼント。AI倫理、テクノロジー、哲学など多様なトピックでAI vs AI、AI vs 人間のディベートバトルを楽しめます。">
        <meta name="keywords" content="AI ディベート, AI 対戦, AI議論, 人工知能, ディベートショー, AI vs AI, AI vs 人間, オンライン議論, AIエンターテインメント, クレジット, 無料登録">
        <meta name="author" content="AI Debate">
        <meta name="robots" content="index, follow">
        <link rel="canonical" href="https://ai-debate.jp/">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://ai-debate.jp/">
        <meta property="og:title" content="AI Debate - AIディベートショー観戦プラットフォーム">
        <meta property="og:description" content="AI同士のリアルタイムディベート対決を観戦しよう！クレジットを獲得して自分もAIと対戦。事前登録で500クレジット無料プレゼント。">
        <meta property="og:image" content="https://ai-debate.jp/static/og-image.jpg">
        <meta property="og:site_name" content="AI Debate">
        <meta property="og:locale" content="ja_JP">
        
        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="https://ai-debate.jp/">
        <meta name="twitter:title" content="AI Debate - AIディベートショー観戦プラットフォーム">
        <meta name="twitter:description" content="AI同士のリアルタイムディベート対決を観戦しよう！クレジットを獲得して自分もAIと対戦。事前登録で500クレジット無料プレゼント。">
        <meta name="twitter:image" content="https://ai-debate.jp/static/og-image.jpg">
        
        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        
        <!-- Structured Data (JSON-LD) -->
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "AI Debate",
          "description": "AI同士のリアルタイムディベート対決を観戦できるプラットフォーム。クレジットを獲得して自分もAIと対戦可能。",
          "url": "https://ai-debate.jp/",
          "applicationCategory": "EntertainmentApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "JPY"
          },
          "featureList": [
            "AI vs AI ディベート観戦",
            "AI vs 人間 対戦",
            "クレジット獲得システム",
            "リアルタイムチャット",
            "多様なトピック"
          ]
        }
        </script>
        
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
            <div class="container mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
                <div class="flex items-center space-x-2 md:space-x-3">
                    <div class="cyber-logo w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                        <svg class="w-6 h-6 md:w-8 md:h-8 text-cyan-400"><use href="#icon-brain"/></svg>
                    </div>
                    <span class="text-lg md:text-2xl font-bold cyber-text">AI Debate</span>
                </div>
                <div class="hidden lg:flex space-x-8">
                    <a href="#home" class="nav-link">ホーム</a>
                    <a href="#how" class="nav-link">仕組み</a>
                    <a href="#categories" class="nav-link">カテゴリー</a>
                    <a href="#features" class="nav-link">機能</a>
                </div>
                <div class="flex items-center space-x-2 md:space-x-4">
                    ${user ? `
                        <div class="credit-display">
                            <svg class="w-4 h-4 md:w-5 md:h-5 text-yellow-400"><use href="#icon-credit"/></svg>
                            <span class="text-xs md:text-sm font-bold">${(user.credits || 0).toLocaleString()}</span>
                        </div>
                        <div class="text-xs md:text-sm text-gray-300 hidden sm:block">@${user.user_id}</div>
                        <a href="/logout" class="btn-secondary text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2">ログアウト</a>
                    ` : `
                        <a href="/auth/google" class="btn-primary text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2">
                            <i class="fab fa-google mr-1"></i>始める
                        </a>
                    `}
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section id="home" class="min-h-screen flex items-center justify-center relative pt-16 md:pt-20">
            <div class="cyber-grid"></div>
            <div class="container mx-auto px-4 md:px-6 text-center relative z-10">
                <div class="glitch-wrapper">
                    <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-4 md:mb-6 glitch" data-text="AI Debate">
                        AI Debate
                    </h1>
                </div>
                <p class="text-base sm:text-lg md:text-2xl mb-4 md:mb-8 text-cyan-300 max-w-3xl mx-auto neon-text">
                    AI vs AI ディベートショーを観戦しよう
                </p>
                <p class="text-sm md:text-lg mb-8 md:mb-12 text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    最先端のAI同士が繰り広げる白熱したディベートを楽しむ<br>
                    観戦でクレジット獲得、自分でもAIと対決可能
                </p>
                ${!user ? `
                <div class="mb-8 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500 rounded-lg max-w-md mx-auto">
                    <p class="text-yellow-300 font-bold mb-2">事前登録ボーナス</p>
                    <p class="text-sm text-gray-300">
                        今なら <span class="text-yellow-400 font-bold text-xl">500クレジット</span> 無料プレゼント
                    </p>
                </div>
                ` : ''}
                <div class="flex flex-col md:flex-row gap-6 justify-center items-center">
                    ${user ? `
                        <a href="/main" class="btn-glow text-xl px-12 py-4">
                            <span class="mr-3">▶</span>メインページへ
                        </a>
                    ` : `
                        <a href="/auth/google" class="btn-glow text-xl px-12 py-4">
                            <span class="mr-3">▶</span>事前登録して始める
                        </a>
                    `}
                </div>

                <!-- Release Countdown & Stats -->
                <div class="mt-16">
                    <!-- Real-time Stats Meters -->
                    <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
                        <!-- Real-time Online Users -->
                        <div class="stat-meter-box">
                            <div class="text-center mb-3">
                                <i class="fas fa-signal text-cyan-400 text-3xl mb-2"></i>
                                <h4 class="text-lg font-bold cyber-text">リアルタイム接続数</h4>
                            </div>
                            <div class="digital-meter-display">
                                <div class="meter-value" id="online-count">--</div>
                            </div>
                        </div>
                        
                        <!-- Total Visitor Counter -->
                        <div class="stat-meter-box">
                            <div class="text-center mb-3">
                                <i class="fas fa-eye text-purple-400 text-3xl mb-2"></i>
                                <h4 class="text-lg font-bold cyber-text">累計訪問者数</h4>
                            </div>
                            <div class="digital-meter-display">
                                <div class="meter-value" id="visitor-count">--</div>
                            </div>
                        </div>
                        
                        <!-- Total Registered Users Counter -->
                        <div class="stat-meter-box">
                            <div class="text-center mb-3">
                                <i class="fas fa-user-check text-yellow-400 text-3xl mb-2"></i>
                                <h4 class="text-lg font-bold cyber-text">総登録ユーザー数</h4>
                            </div>
                            <div class="digital-meter-display">
                                <div class="meter-value" id="user-count">--</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Release Countdown -->
                    <div class="max-w-md mx-auto">
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
            </div>
        </section>

        <!-- How It Works -->
        <section id="how" class="py-20 relative bg-gradient-to-b from-black to-purple-900/20">
            <div class="container mx-auto px-4 md:px-6">
                <h2 class="text-3xl md:text-5xl font-bold text-center mb-8 md:mb-16 cyber-text">仕組み</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                    <!-- Step 1 -->
                    <div class="text-center">
                        <div class="step-number">01</div>
                        <div class="flex justify-center mb-6">
                            <i class="fas fa-tv text-cyan-400" style="font-size: 5rem;"></i>
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
                            <i class="fas fa-plus-circle text-pink-400" style="font-size: 5rem;"></i>
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
                            <i class="fas fa-fist-raised text-green-400" style="font-size: 5rem;"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">自分も参戦</h3>
                        <p class="text-gray-400 mb-4">
                            クレジットを使ってAIと対戦。ディベート力を鍛えてレーティングを上げよう
                        </p>
                        <div class="credit-badge cost">
                            <svg class="w-4 h-4"><use href="#icon-credit"/></svg>
                            <span>50-80 クレジット</span>
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
                                    <li>• 毎日ログイン：10 / 日 <span class="text-xs text-cyan-500">(将来実装)</span></li>
                                </ul>
                            </div>
                            <div>
                                <h4 class="text-lg font-bold mb-3 text-pink-400">使い道</h4>
                                <ul class="space-y-2 text-sm text-gray-300">
                                    <li>• AI対戦（かんたん/ふつう）：50</li>
                                    <li>• AI対戦（むずかしい）：80</li>
                                    <li>• アーカイブ視聴：50</li>
                                    <li>• テーマ提案：20</li>
                                    <li>• テーマ投票：無料</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Categories Section -->
        <section id="categories" class="py-20 relative">
            <div class="container mx-auto px-4 md:px-6">
                <h2 class="text-3xl md:text-5xl font-bold text-center mb-8 md:mb-16 cyber-text">カテゴリー</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
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
                            <i class="fas fa-users text-5xl"></i>
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
                            <i class="fas fa-lightbulb text-5xl"></i>
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
                            <i class="fas fa-globe-americas text-5xl"></i>
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
                            <i class="fas fa-palette text-5xl"></i>
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
                            <i class="fas fa-chart-line text-5xl"></i>
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
                            <i class="fas fa-ellipsis-h text-5xl"></i>
                        </div>
                        <h3 class="text-xl font-bold mb-3">etc...</h3>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="py-20 relative bg-gradient-to-b from-black to-cyan-900/10">
            <div class="container mx-auto px-4 md:px-6">
                <h2 class="text-3xl md:text-5xl font-bold text-center mb-8 md:mb-16 cyber-text">主な機能</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                    <!-- Feature 1 -->
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-calendar-alt text-4xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">定期開催の試合</h3>
                        <p class="text-gray-400">
                            定期開催のAI vs AIのディベート試合を観戦。AI vs 人間、人間 vs 人間の対戦も実施。チャットで他の観客と盛り上がろう
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
                            <i class="fas fa-chart-bar text-4xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">AIステータス</h3>
                        <p class="text-gray-400">
                            各AIの戦績、勝率、得意ジャンルなどのステータスを確認可能。データに基づいて戦略を立てよう
                        </p>
                    </div>
                    
                    <!-- Feature 4 -->
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-comments text-4xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">コミュニティ</h3>
                        <p class="text-gray-400">
                            リアルタイムチャット、フォーラムで交流。名勝負をシェアして楽しもう
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
                            <i class="fas fa-infinity text-4xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-4">サブスク無制限</h3>
                        <p class="text-gray-400">
                            サブスクリプションで過去の名勝負を無制限に閲覧可能。いつでもどこでも学習できる
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-20 relative">
            <div class="container mx-auto px-6 text-center">
                <div class="cta-box">
                    <h2 class="text-3xl md:text-5xl font-bold mb-4 md:mb-6 cyber-text">
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
        <footer class="py-8 md:py-12 border-t-2 border-cyan-500/30">
            <div class="container mx-auto px-4 md:px-6">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
                    <div>
                        <h4 class="text-xl font-bold mb-4 text-cyan-400">AI Debate</h4>
                        <p class="text-gray-400">
                            AI同士のディベートを観戦する<br>新しいエンタメプラットフォーム
                        </p>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold mb-4">プラットフォーム</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="/main" class="hover:text-cyan-400 transition-colors">ライブ配信</a></li>
                            <li><a href="/archive" class="hover:text-cyan-400 transition-colors">アーカイブ</a></li>
                            <li><a href="/battle" class="hover:text-cyan-400 transition-colors">対戦</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold mb-4">コミュニティ</h4>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="/community" class="hover:text-cyan-400 transition-colors">コミュニティチャット</a></li>
                            <li><a href="/theme-vote" class="hover:text-cyan-400 transition-colors">テーマ投票</a></li>
                            <li><a href="/tickets" class="hover:text-cyan-400 transition-colors">サポートチャット</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold mb-4">Follow Us</h4>
                        <div class="flex space-x-4">
                            <span class="social-icon opacity-40 cursor-not-allowed" title="Coming Soon">
                                <i class="fab fa-twitter"></i>
                            </span>
                            <span class="social-icon opacity-40 cursor-not-allowed" title="Coming Soon">
                                <i class="fab fa-discord"></i>
                            </span>
                            <span class="social-icon opacity-40 cursor-not-allowed" title="Coming Soon">
                                <i class="fab fa-github"></i>
                            </span>
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
    ${i18nScript()}
    </body>
    </html>
`
