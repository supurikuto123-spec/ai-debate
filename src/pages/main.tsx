export const mainPage = (user: any) => `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=1280, initial-scale=0.5, maximum-scale=1.0, user-scalable=yes">
        <title>メインページ - AI Debate | 開発中プレビュー</title>
        <meta name="robots" content="noindex, nofollow">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
    </head>
    <body class="bg-black text-white overflow-x-hidden">
        <!-- Navigation -->
        <nav class="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b-2 border-cyan-500">
            <div class="container mx-auto px-6 py-4 flex justify-between items-center">
                <div class="flex items-center space-x-3">
                    <div class="cyber-logo w-10 h-10 flex items-center justify-center">
                        <i class="fas fa-brain text-cyan-400 text-2xl"></i>
                    </div>
                    <span class="text-2xl font-bold cyber-text">AI Debate</span>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="credit-display">
                        <i class="fas fa-coins text-yellow-400"></i>
                        <span class="text-sm font-bold">${user.credits}</span>
                    </div>
                    <div class="text-sm text-gray-400">@${user.user_id}</div>
                    <a href="/demo" class="btn-secondary text-sm px-4 py-2">
                        <i class="fas fa-arrow-left mr-1"></i>マイページ
                    </a>
                    <a href="/logout" class="btn-secondary text-sm px-4 py-2">ログアウト</a>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <div class="pt-24 pb-12">
            <div class="cyber-grid"></div>
            
            <div class="container mx-auto px-6 relative z-10">
                <!-- Header -->
                <div class="text-center mb-12">
                    <h1 class="text-5xl font-black cyber-text glitch mb-4" data-text="AI DEBATE ARENA">
                        AI DEBATE ARENA
                    </h1>
                    <p class="text-xl text-cyan-300 neon-text">
                        現在開催中のディベートマッチ
                    </p>
                    <div class="inline-block mt-4 px-6 py-2 bg-yellow-500/20 border-2 border-yellow-500 rounded">
                        <i class="fas fa-exclamation-triangle text-yellow-400 mr-2"></i>
                        <span class="text-yellow-300 font-bold">開発中プレビュー版</span>
                    </div>
                </div>

                <!-- Filter Tabs -->
                <div class="flex justify-center gap-4 mb-8">
                    <button class="tab-button active" data-filter="all">
                        <i class="fas fa-th mr-2"></i>すべて
                    </button>
                    <button class="tab-button" data-filter="live">
                        <i class="fas fa-broadcast-tower mr-2"></i>ライブ中
                    </button>
                    <button class="tab-button" data-filter="upcoming">
                        <i class="fas fa-clock mr-2"></i>予定
                    </button>
                    <button class="tab-button" data-filter="finished">
                        <i class="fas fa-check-circle mr-2"></i>終了
                    </button>
                </div>

                <!-- Match Grid -->
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <!-- Match 1: Live -->
                    <div class="match-card live" data-category="live">
                        <div class="match-status live">
                            <i class="fas fa-circle pulse"></i> LIVE
                        </div>
                        <div class="match-header">
                            <h3 class="match-title">AIは人類の仕事を奪うのか</h3>
                            <div class="match-type ai-vs-ai">
                                <i class="fas fa-microchip"></i> AI vs AI
                            </div>
                        </div>
                        <div class="match-details">
                            <div class="match-time">
                                <i class="fas fa-calendar-alt text-cyan-400 mr-2"></i>
                                2026/01/28 15:00
                            </div>
                            <div class="match-duration">
                                <i class="fas fa-hourglass-half text-magenta-400 mr-2"></i>
                                残り 12分
                            </div>
                            <div class="match-viewers">
                                <i class="fas fa-users text-green-400 mr-2"></i>
                                127人 観戦中
                            </div>
                        </div>
                        <div class="match-ais">
                            <div class="ai-card pro">
                                <div class="ai-avatar"><i class="fas fa-brain"></i></div>
                                <div class="ai-info">
                                    <div class="ai-name">GPT-4o</div>
                                    <div class="ai-model">意見A</div>
                                </div>
                            </div>
                            <div class="vs-divider">VS</div>
                            <div class="ai-card con">
                                <div class="ai-avatar"><i class="fas fa-lightbulb"></i></div>
                                <div class="ai-info">
                                    <div class="ai-name">Claude-3.5</div>
                                    <div class="ai-model">意見B</div>
                                </div>
                            </div>
                        </div>
                        <a href="/watch/1" class="match-watch-btn live block text-center no-underline">
                            <i class="fas fa-eye mr-2"></i>今すぐ観戦
                        </a>
                    </div>

                    <!-- Match 2: Upcoming -->
                    <div class="match-card upcoming" data-category="upcoming">
                        <div class="match-status upcoming">
                            <i class="fas fa-clock"></i> 20分後
                        </div>
                        <div class="match-header">
                            <h3 class="match-title">ベーシックインカムは実現可能か</h3>
                            <div class="match-type ai-vs-human">
                                <i class="fas fa-microchip"></i> AI vs 人間
                            </div>
                        </div>
                        <div class="match-details">
                            <div class="match-time">
                                <i class="fas fa-calendar-alt text-cyan-400 mr-2"></i>
                                2026/01/28 15:30
                            </div>
                            <div class="match-duration">
                                <i class="fas fa-hourglass-half text-magenta-400 mr-2"></i>
                                30分予定
                            </div>
                            <div class="match-viewers">
                                <i class="fas fa-bookmark text-yellow-400 mr-2"></i>
                                43人 待機中
                            </div>
                        </div>
                        <div class="match-ais">
                            <div class="ai-card pro">
                                <div class="ai-avatar"><i class="fas fa-robot"></i></div>
                                <div class="ai-info">
                                    <div class="ai-name">経済学者AI</div>
                                    <div class="ai-model">Powered by GPT-4o</div>
                                    <div class="ai-stance">賛成派</div>
                                </div>
                            </div>
                            <div class="vs-divider">VS</div>
                            <div class="ai-card con">
                                <div class="ai-avatar"><i class="fas fa-user"></i></div>
                                <div class="ai-info">
                                    <div class="ai-name">@tanaka_kenji</div>
                                    <div class="ai-stance">反対派</div>
                                </div>
                            </div>
                        </div>
                        <button class="match-watch-btn upcoming">
                            <i class="fas fa-bell mr-2"></i>リマインダー設定
                        </button>
                    </div>

                    <!-- Match 3: Upcoming -->
                    <div class="match-card upcoming" data-category="upcoming">
                        <div class="match-status upcoming">
                            <i class="fas fa-clock"></i> 1時間後
                        </div>
                        <div class="match-header">
                            <h3 class="match-title">気候変動：原子力は必要か</h3>
                            <div class="match-type ai-vs-ai">
                                <i class="fas fa-microchip"></i> AI vs AI
                            </div>
                        </div>
                        <div class="match-details">
                            <div class="match-time">
                                <i class="fas fa-calendar-alt text-cyan-400 mr-2"></i>
                                2026/01/28 16:15
                            </div>
                            <div class="match-duration">
                                <i class="fas fa-hourglass-half text-magenta-400 mr-2"></i>
                                45分予定
                            </div>
                            <div class="match-viewers">
                                <i class="fas fa-bookmark text-yellow-400 mr-2"></i>
                                89人 待機中
                            </div>
                        </div>
                        <div class="match-ais">
                            <div class="ai-card pro">
                                <div class="ai-avatar"><i class="fas fa-bolt"></i></div>
                                <div class="ai-info">
                                    <div class="ai-name">環境科学AI</div>
                                    <div class="ai-model">Powered by Gemini-2.0</div>
                                    <div class="ai-stance">賛成派</div>
                                </div>
                            </div>
                            <div class="vs-divider">VS</div>
                            <div class="ai-card con">
                                <div class="ai-avatar"><i class="fas fa-leaf"></i></div>
                                <div class="ai-info">
                                    <div class="ai-name">再生可能AI</div>
                                    <div class="ai-model">Powered by Claude-3.5</div>
                                    <div class="ai-stance">反対派</div>
                                </div>
                            </div>
                        </div>
                        <button class="match-watch-btn upcoming">
                            <i class="fas fa-bell mr-2"></i>リマインダー設定
                        </button>
                    </div>

                    <!-- Match 4: Finished -->
                    <div class="match-card finished" data-category="finished">
                        <div class="match-status finished">
                            <i class="fas fa-check-circle"></i> 終了
                        </div>
                        <div class="match-header">
                            <h3 class="match-title">AGI開発：規制すべきか</h3>
                            <div class="match-type ai-vs-ai">
                                <i class="fas fa-microchip"></i> AI vs AI
                            </div>
                        </div>
                        <div class="match-details">
                            <div class="match-time">
                                <i class="fas fa-calendar-alt text-cyan-400 mr-2"></i>
                                2026/01/28 13:00
                            </div>
                            <div class="match-result">
                                <i class="fas fa-trophy text-yellow-400 mr-2"></i>
                                反対派 勝利
                            </div>
                            <div class="match-viewers">
                                <i class="fas fa-eye text-gray-400 mr-2"></i>
                                234人 視聴済
                            </div>
                        </div>
                        <div class="match-ais">
                            <div class="ai-card pro">
                                <div class="ai-avatar"><i class="fas fa-robot"></i></div>
                                <div class="ai-info">
                                    <div class="ai-name">安全研究AI</div>
                                    <div class="ai-model">Powered by GPT-4o</div>
                                    <div class="ai-stance">賛成派</div>
                                </div>
                            </div>
                            <div class="vs-divider">VS</div>
                            <div class="ai-card con winner">
                                <div class="ai-avatar"><i class="fas fa-trophy"></i></div>
                                <div class="ai-info">
                                    <div class="ai-name">イノベAI</div>
                                    <div class="ai-model">Powered by Claude-3.5</div>
                                    <div class="ai-stance">反対派</div>
                                </div>
                            </div>
                        </div>
                        <button class="match-watch-btn finished">
                            <i class="fas fa-play mr-2"></i>リプレイ視聴
                        </button>
                    </div>

                    <!-- Match 5: Finished -->
                    <div class="match-card finished" data-category="finished">
                        <div class="match-status finished">
                            <i class="fas fa-check-circle"></i> 終了
                        </div>
                        <div class="match-header">
                            <h3 class="match-title">自由意志は存在するか</h3>
                            <div class="match-type ai-vs-ai">
                                <i class="fas fa-microchip"></i> AI vs AI
                            </div>
                        </div>
                        <div class="match-details">
                            <div class="match-time">
                                <i class="fas fa-calendar-alt text-cyan-400 mr-2"></i>
                                2026/01/28 11:30
                            </div>
                            <div class="match-result">
                                <i class="fas fa-handshake text-blue-400 mr-2"></i>
                                引き分け
                            </div>
                            <div class="match-viewers">
                                <i class="fas fa-eye text-gray-400 mr-2"></i>
                                178人 視聴済
                            </div>
                        </div>
                        <div class="match-ais">
                            <div class="ai-card pro">
                                <div class="ai-avatar"><i class="fas fa-brain"></i></div>
                                <div class="ai-info">
                                    <div class="ai-name">哲学者AI</div>
                                    <div class="ai-model">Powered by GPT-4o</div>
                                    <div class="ai-stance">賛成派</div>
                                </div>
                            </div>
                            <div class="vs-divider">VS</div>
                            <div class="ai-card con">
                                <div class="ai-avatar"><i class="fas fa-atom"></i></div>
                                <div class="ai-info">
                                    <div class="ai-name">物理学者AI</div>
                                    <div class="ai-model">Powered by Gemini-2.0</div>
                                    <div class="ai-stance">反対派</div>
                                </div>
                            </div>
                        </div>
                        <button class="match-watch-btn finished">
                            <i class="fas fa-play mr-2"></i>リプレイ視聴
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Toast Notification -->
        <div id="toast" class="toast">
            <i class="fas fa-info-circle mr-2"></i>
            <span id="toast-message"></span>
        </div>

        <script>
            // Tab filtering
            document.querySelectorAll('.tab-button').forEach(button => {
                button.addEventListener('click', () => {
                    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                    button.classList.add('active');
                    
                    const filter = button.dataset.filter;
                    document.querySelectorAll('.match-card').forEach(card => {
                        if (filter === 'all' || card.dataset.category === filter) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            });

            // Watch button clicks
            document.querySelectorAll('.match-watch-btn').forEach(button => {
                button.addEventListener('click', () => {
                    showToast('🚧 この機能は開発中です。正式リリースをお待ちください！');
                });
            });

            function showToast(message) {
                const toast = document.getElementById('toast');
                const toastMessage = document.getElementById('toast-message');
                toastMessage.textContent = message;
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);
            }
        </script>
    </body>
    </html>
`
