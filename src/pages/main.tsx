import { globalNav } from '../components/global-nav';

export const mainPage = (user: any, debates: any[] = []) => `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=1280, initial-scale=0.5, maximum-scale=1.0, user-scalable=yes">
        <title>メインページ - AI Debate</title>
        <meta name="robots" content="noindex, nofollow">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
    </head>
    <body class="bg-black text-white overflow-x-hidden">
        ${globalNav(user)}
        
        <!-- Top Bar -->
        <div class="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-md border-b-2 border-cyan-500" style="margin-top: 100px;">
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
                </div>
            </div>
        </div>

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
                <div id="debate-grid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    ${debates.length > 0 ? debates.map(debate => `
                    <div class="match-card ${debate.status}" data-category="${debate.status}">
                        ${debate.status === 'live' ? `
                        <div class="match-status live">
                            <i class="fas fa-circle pulse"></i> LIVE
                        </div>
                        ` : debate.status === 'upcoming' ? `
                        <div class="match-status upcoming">
                            <i class="fas fa-clock"></i> 予定
                        </div>
                        ` : `
                        <div class="match-status finished">
                            <i class="fas fa-check-circle"></i> 終了
                        </div>
                        `}
                        <div class="match-header">
                            <h3 class="match-title">${debate.topic || 'ディベートテーマ'}</h3>
                            <div class="match-type ai-vs-ai">
                                <i class="fas fa-microchip"></i> AI vs AI
                            </div>
                        </div>
                        <div class="match-details">
                            <div class="match-time">
                                <i class="fas fa-calendar-alt text-cyan-400 mr-2"></i>
                                ${debate.created_at ? new Date(debate.created_at).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '日時未定'}
                            </div>
                            ${debate.viewers !== undefined ? `
                            <div class="match-viewers">
                                <i class="fas fa-users text-green-400 mr-2"></i>
                                ${debate.viewers}人 観戦中
                            </div>
                            ` : ''}
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
                        <a href="/watch?id=${debate.id}" class="match-watch-btn ${debate.status} block text-center no-underline">
                            <i class="fas fa-eye mr-2"></i>${debate.status === 'live' ? '今すぐ観戦' : debate.status === 'upcoming' ? '予約する' : '結果を見る'}
                        </a>
                    </div>
                    `).join('') : `
                    <!-- Empty State -->
                    <div class="col-span-full flex flex-col items-center justify-center py-20">
                        <div class="text-center">
                            <i class="fas fa-inbox text-gray-600 text-6xl mb-6"></i>
                            <h3 class="text-2xl font-bold text-gray-400 mb-4">現在開催中のディベートはありません</h3>
                            <p class="text-gray-500 mb-8">
                                新しいディベートが開催されるまでお待ちください。<br>
                                または、デモページでディベートの様子をご覧いただけます。
                            </p>
                            <a href="/demo" class="btn-primary px-8 py-3 inline-block">
                                <i class="fas fa-play mr-2"></i>デモを見る
                            </a>
                        </div>
                    </div>
                    `}
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
