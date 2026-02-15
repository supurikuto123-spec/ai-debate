import { globalNav } from '../components/global-nav';

export const battlePage = (user: any) => `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <title>対戦 - AI Debate Arena</title>
    <meta name="robots" content="noindex, nofollow">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/styles.css" rel="stylesheet">
    <style>
        .battle-tab { padding: 12px 28px; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 16px; transition: all 0.3s; background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.1); color: #9ca3af; }
        .battle-tab:hover { background: rgba(6,182,212,0.15); border-color: rgba(6,182,212,0.4); }
        .battle-tab.active { background: rgba(6,182,212,0.25); border-color: #06b6d4; color: #fff; box-shadow: 0 0 20px rgba(6,182,212,0.3); }
        .mode-card { background: linear-gradient(135deg, rgba(0,20,40,0.9), rgba(20,0,40,0.9)); border: 2px solid rgba(0,255,255,0.3); border-radius: 16px; padding: 30px; transition: all 0.3s; }
        .coming-soon-overlay { position: relative; overflow: hidden; }
        .coming-soon-overlay::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); pointer-events: none; }
        .pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
        @keyframes pulseGlow { 0%,100%{ box-shadow: 0 0 20px rgba(6,182,212,0.3); } 50%{ box-shadow: 0 0 50px rgba(6,182,212,0.6), 0 0 80px rgba(168,85,247,0.3); } }
        .feature-preview-card { background: linear-gradient(135deg, rgba(0,20,40,0.8), rgba(20,0,40,0.8)); border: 1px solid rgba(0,255,255,0.2); border-radius: 12px; padding: 20px; transition: all 0.3s; }
        .feature-preview-card:hover { border-color: rgba(0,255,255,0.5); transform: translateY(-2px); }
    </style>
</head>
<body class="bg-black text-white">
    ${globalNav(user)}
    
    <div class="min-h-screen pt-24 pb-12">
        <div class="cyber-grid"></div>
        
        <div class="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
            <!-- Header -->
            <div class="text-center mb-8">
                <h1 class="text-3xl md:text-4xl font-black cyber-text mb-3">
                    <i class="fas fa-gamepad mr-3 text-cyan-400"></i>対戦モード
                </h1>
                <p class="text-gray-300 text-sm md:text-base">AIとディベートで対決しよう</p>
            </div>

            <!-- Coming Soon Main Card -->
            <div class="cyber-card text-center py-12 md:py-16 pulse-glow mb-8">
                <div class="mb-8">
                    <div class="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-500/50 mb-6">
                        <i class="fas fa-robot text-4xl md:text-6xl text-cyan-400"></i>
                    </div>
                </div>
                
                <h2 class="text-2xl md:text-4xl font-bold mb-4 cyber-text">Coming Soon</h2>
                <p class="text-lg md:text-xl text-gray-300 mb-2">対戦機能は現在開発中です</p>
                <p class="text-sm md:text-base text-gray-500 mb-8 max-w-lg mx-auto">
                    AIとのリアルタイムディベート対決機能を準備中です。<br>
                    リリースまでお待ちください。
                </p>
                
                <div class="inline-block px-6 py-3 bg-cyan-500/15 border-2 border-cyan-500/50 rounded-xl">
                    <i class="fas fa-clock mr-2 text-cyan-400"></i>
                    <span class="text-cyan-300 font-bold text-sm md:text-base">開発中 - リリース日未定</span>
                </div>
            </div>

            <!-- Preview Features -->
            <div class="cyber-card mb-8">
                <h3 class="text-xl md:text-2xl font-bold text-cyan-300 mb-6">
                    <i class="fas fa-sparkles mr-2"></i>実装予定の機能
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- AI Battle -->
                    <div class="feature-preview-card">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                <i class="fas fa-robot text-cyan-400"></i>
                            </div>
                            <h4 class="font-bold text-base md:text-lg">AI対戦</h4>
                        </div>
                        <p class="text-sm text-gray-400">AIとリアルタイムでディベート。難易度を選択して腕を磨こう。</p>
                        <div class="mt-3 flex items-center gap-2 text-xs text-yellow-400">
                            <i class="fas fa-coins"></i>
                            <span>50〜80クレジット消費</span>
                        </div>
                    </div>

                    <!-- User Battle -->
                    <div class="feature-preview-card">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <i class="fas fa-user-friends text-purple-400"></i>
                            </div>
                            <h4 class="font-bold text-base md:text-lg">ユーザー対戦</h4>
                        </div>
                        <p class="text-sm text-gray-400">他のプレイヤーとリアルタイムでディベート対決。レーティング制対戦。</p>
                        <div class="mt-3 flex items-center gap-2 text-xs text-gray-500">
                            <i class="fas fa-clock"></i>
                            <span>将来実装予定</span>
                        </div>
                    </div>

                    <!-- Theme Selection -->
                    <div class="feature-preview-card">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <i class="fas fa-vote-yea text-green-400"></i>
                            </div>
                            <h4 class="font-bold text-base md:text-lg">テーマ選択</h4>
                        </div>
                        <p class="text-sm text-gray-400">投票で選ばれた人気テーマやビルトインテーマから選択。ランダム選択も可能。</p>
                    </div>

                    <!-- Difficulty -->
                    <div class="feature-preview-card">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                                <i class="fas fa-fire text-red-400"></i>
                            </div>
                            <h4 class="font-bold text-base md:text-lg">難易度システム</h4>
                        </div>
                        <p class="text-sm text-gray-400">かんたん・ふつう・むずかしいの3段階。AIの反論レベルが変化。</p>
                    </div>
                </div>
            </div>

            <!-- Credit Info -->
            <div class="cyber-card">
                <h3 class="text-lg md:text-xl font-bold text-cyan-300 mb-4">
                    <i class="fas fa-coins mr-2 text-yellow-400"></i>対戦クレジット（予定）
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div class="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                        <i class="fas fa-seedling text-green-400 text-xl md:text-2xl mb-2"></i>
                        <div class="text-sm font-bold">かんたん</div>
                        <div class="text-yellow-400 font-bold mt-1">50 クレジット</div>
                    </div>
                    <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                        <i class="fas fa-fire text-yellow-400 text-xl md:text-2xl mb-2"></i>
                        <div class="text-sm font-bold">ふつう</div>
                        <div class="text-yellow-400 font-bold mt-1">50 クレジット</div>
                    </div>
                    <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                        <i class="fas fa-skull-crossbones text-red-400 text-xl md:text-2xl mb-2"></i>
                        <div class="text-sm font-bold">むずかしい</div>
                        <div class="text-yellow-400 font-bold mt-1">80 クレジット</div>
                    </div>
                </div>
            </div>

            <!-- Navigation Links -->
            <div class="text-center mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/theme-vote" class="inline-block px-6 py-3 bg-cyan-500/15 border border-cyan-500/40 rounded-lg text-cyan-300 hover:bg-cyan-500/25 transition-all text-sm md:text-base">
                    <i class="fas fa-vote-yea mr-2"></i>テーマ投票へ
                </a>
                <a href="/main" class="inline-block px-6 py-3 bg-purple-500/15 border border-purple-500/40 rounded-lg text-purple-300 hover:bg-purple-500/25 transition-all text-sm md:text-base">
                    <i class="fas fa-eye mr-2"></i>観戦へ
                </a>
                <a href="/community" class="inline-block px-6 py-3 bg-green-500/15 border border-green-500/40 rounded-lg text-green-300 hover:bg-green-500/25 transition-all text-sm md:text-base">
                    <i class="fas fa-users mr-2"></i>コミュニティへ
                </a>
            </div>
        </div>
    </div>
</body>
</html>
`;
