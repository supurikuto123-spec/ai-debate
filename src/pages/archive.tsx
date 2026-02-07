import { globalNav } from '../components/global-nav';

export const archivePage = (userData: any) => `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>アーカイブ - AI Debate Arena</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/styles.css" rel="stylesheet">
</head>
<body class="bg-black text-white">
    ${globalNav(userData)}
    <div class="pt-20 pb-12 min-h-screen">
        <div class="cyber-grid"></div>
        <div class="container mx-auto px-6 relative z-10">
            <div class="text-center mb-8">
                <h1 class="text-4xl font-black cyber-text mb-2">
                    <i class="fas fa-archive mr-3"></i>アーカイブ
                </h1>
                <p class="text-cyan-300">過去のディベートを視聴</p>
                <div class="mt-3 inline-block px-4 py-2 bg-cyan-500/20 border-2 border-cyan-500 rounded-lg">
                    <i class="fas fa-coins text-yellow-400 mr-2"></i>
                    <span class="text-yellow-300 font-bold">視聴料: 15クレジット</span>
                </div>
            </div>
            <div class="flex justify-center gap-4 mb-8">
                <button class="tab-button active" data-filter="all"><i class="fas fa-th mr-2"></i>すべて</button>
                <button class="tab-button" data-filter="completed"><i class="fas fa-check-circle mr-2"></i>完了</button>
                <button class="tab-button" data-filter="live"><i class="fas fa-broadcast-tower mr-2"></i>進行中</button>
            </div>
            <div id="archive-grid" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div class="text-center text-gray-400 py-12 col-span-full">
                    <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
                    <div>読み込み中...</div>
                </div>
            </div>
        </div>
    </div>
    <script>
        const currentUser = { user_id: '${userData.user_id}', credits: ${userData.credits} };
        
        // Load debates
        async function loadDebates() {
            try {
                const response = await fetch('/api/archive/debates');
                const data = await response.json();
                
                const grid = document.getElementById('archive-grid');
                if (!data.success || !data.debates || data.debates.length === 0) {
                    grid.innerHTML = '<div class="text-center text-gray-400 py-12 col-span-full">まだディベートがありません</div>';
                    return;
                }
                
                grid.innerHTML = data.debates.map(debate => \`
                    <div class="match-card" data-status="\${debate.status}">
                        <div class="match-header mb-4">
                            <div class="flex justify-between items-center mb-2">
                                <span class="badge-\${debate.status === 'completed' ? 'new' : 'hot'}">\${debate.status === 'completed' ? '完了' : '進行中'}</span>
                                <span class="text-xs text-gray-400">
                                    <i class="fas fa-comments mr-1"></i>\${debate.message_count || 0}件
                                </span>
                            </div>
                            <h3 class="text-xl font-bold text-cyan-300 mb-2">\${debate.theme}</h3>
                        </div>
                        
                        <div class="match-opinions mb-4">
                            <div class="opinion-box agree">
                                <div class="text-xs text-green-400 mb-1">賛成派</div>
                                <p class="text-sm">\${debate.opinion_a}</p>
                            </div>
                            <div class="opinion-box disagree">
                                <div class="text-xs text-red-400 mb-1">反対派</div>
                                <p class="text-sm">\${debate.opinion_b}</p>
                            </div>
                        </div>

                        <button onclick="purchaseDebate(\${debate.id})" class="btn-watch">
                            <i class="fas fa-play-circle mr-2"></i>視聴する（15クレジット）
                        </button>
                    </div>
                \`).join('');
            } catch (error) {
                console.error('Load debates error:', error);
                document.getElementById('archive-grid').innerHTML = '<div class="text-center text-red-400 py-12 col-span-full">読み込みに失敗しました</div>';
            }
        }
        
        // Purchase debate
        async function purchaseDebate(debateId) {
            if (currentUser.credits < 15 && currentUser.user_id !== 'dev') {
                alert('クレジットが不足しています');
                return;
            }
            
            if (!confirm('15クレジットを消費してこのディベートを視聴しますか？')) {
                return;
            }
            
            try {
                const response = await fetch('/api/archive/purchase', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ debate_id: debateId })
                });
                
                const result = await response.json();
                if (result.success) {
                    window.location.href = \`/watch/\${debateId}\`;
                } else {
                    alert(result.error || '購入に失敗しました');
                }
            } catch (error) {
                console.error('Purchase error:', error);
                alert('エラーが発生しました');
            }
        }
        
        // Filter tabs
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                document.querySelectorAll('.match-card').forEach(card => {
                    if (filter === 'all') {
                        card.style.display = '';
                    } else {
                        card.style.display = card.dataset.status === filter ? '' : 'none';
                    }
                });
            });
        });
        
        // Initial load
        loadDebates();
    </script>
</body>
</html>`
