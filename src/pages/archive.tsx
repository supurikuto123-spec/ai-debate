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
    <style>
        .archive-viewer {
            background: linear-gradient(135deg, rgba(0, 20, 40, 0.95), rgba(20, 0, 40, 0.95));
            border: 2px solid rgba(0, 255, 255, 0.3);
            border-radius: 12px;
        }
        .bubble-agree {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05));
            border-left: 4px solid #22c55e;
            border-radius: 8px;
        }
        .bubble-disagree {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05));
            border-right: 4px solid #ef4444;
            border-radius: 8px;
        }
        .btn-purchased {
            background: rgba(34, 197, 94, 0.2);
            border: 2px solid #22c55e;
            color: #22c55e;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn-purchased:hover {
            background: rgba(34, 197, 94, 0.3);
        }
    </style>
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
                    <span class="text-yellow-300 font-bold">視聴料: 50クレジット</span>
                </div>
            </div>
            <div class="flex justify-center gap-4 mb-8">
                <button class="tab-button active" data-filter="all"><i class="fas fa-th mr-2"></i>すべて</button>
                <button class="tab-button" data-filter="completed"><i class="fas fa-check-circle mr-2"></i>完了</button>
            </div>

            <!-- Archive List -->
            <div id="archive-grid" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div class="text-center text-gray-400 py-12 col-span-full">
                    <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
                    <div>読み込み中...</div>
                </div>
            </div>

            <!-- Archive Viewer (hidden by default) -->
            <div id="archive-viewer" class="hidden">
                <button onclick="closeViewer()" class="mb-4 text-cyan-400 hover:text-cyan-300 transition">
                    <i class="fas fa-arrow-left mr-2"></i>アーカイブ一覧に戻る
                </button>
                <div class="archive-viewer p-6">
                    <div class="text-center mb-6">
                        <h2 id="viewer-theme" class="text-2xl font-bold text-cyan-300 mb-3"></h2>
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div class="bg-green-500/20 border border-green-500/30 rounded p-3">
                                <div class="text-green-400 font-bold text-sm mb-1"><i class="fas fa-check mr-1"></i>賛成派（意見A）</div>
                                <p id="viewer-opinion-a" class="text-sm text-gray-300"></p>
                            </div>
                            <div class="bg-red-500/20 border border-red-500/30 rounded p-3">
                                <div class="text-red-400 font-bold text-sm mb-1"><i class="fas fa-times mr-1"></i>反対派（意見B）</div>
                                <p id="viewer-opinion-b" class="text-sm text-gray-300"></p>
                            </div>
                        </div>
                        <div class="flex justify-center gap-8 text-sm">
                            <span class="text-green-400"><i class="fas fa-thumbs-up mr-1"></i>賛成: <span id="viewer-agree-votes">0</span>票</span>
                            <span class="text-red-400"><i class="fas fa-thumbs-down mr-1"></i>反対: <span id="viewer-disagree-votes">0</span>票</span>
                            <span id="viewer-winner" class="text-yellow-400 font-bold"></span>
                        </div>
                    </div>
                    <div id="viewer-messages" class="space-y-4 max-h-[600px] overflow-y-auto p-4">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        const currentUser = { user_id: '${userData.user_id}', credits: ${userData.user_id === 'dev' ? 999999999 : (userData.credits || 0)} };
        let purchasedDebateIds = [];
        
        async function loadPurchasedStatus() {
            try {
                const response = await fetch('/api/archive/purchased');
                const data = await response.json();
                if (data.success) {
                    purchasedDebateIds = data.purchased_ids || [];
                }
            } catch (error) {
                console.error('Load purchased status error:', error);
            }
        }
        
        function isPurchased(debateId) {
            if (currentUser.user_id === 'dev') return true;
            if (purchasedDebateIds.includes('all')) return true;
            return purchasedDebateIds.includes(debateId) || purchasedDebateIds.includes(String(debateId));
        }
        
        async function loadDebates() {
            await loadPurchasedStatus();
            
            try {
                const response = await fetch('/api/archive/debates');
                const data = await response.json();
                
                const grid = document.getElementById('archive-grid');
                if (!data.success || !data.debates || data.debates.length === 0) {
                    grid.innerHTML = '<div class="text-center text-gray-400 py-12 col-span-full"><i class="fas fa-inbox text-4xl mb-4"></i><div>まだアーカイブがありません</div></div>';
                    return;
                }
                
                grid.innerHTML = data.debates.map(debate => {
                    const purchased = isPurchased(debate.debate_id);
                    const btnClass = purchased ? 'btn-purchased' : 'btn-watch';
                    const btnText = purchased 
                        ? '<i class="fas fa-check-circle mr-2"></i>購入済み - 視聴する' 
                        : '<i class="fas fa-play-circle mr-2"></i>視聴する（50クレジット）';
                    
                    return \`
                    <div class="match-card" data-status="\${debate.status}">
                        <div class="match-header mb-4">
                            <div class="flex justify-between items-center mb-2">
                                <span class="badge-new">完了</span>
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

                        <div class="flex justify-between text-sm text-gray-400 mb-3">
                            <span><i class="fas fa-thumbs-up text-green-400 mr-1"></i>\${debate.agree_votes || 0}票</span>
                            <span class="text-yellow-400 font-bold">\${debate.winner === 'agree' ? '意見A勝利' : debate.winner === 'disagree' ? '意見B勝利' : '引き分け'}</span>
                            <span><i class="fas fa-thumbs-down text-red-400 mr-1"></i>\${debate.disagree_votes || 0}票</span>
                        </div>

                        <button onclick="purchaseDebate(\${debate.id}, '\${debate.debate_id}')" class="\${btnClass} w-full py-3 px-4 rounded-lg font-bold text-sm transition-all">
                            \${btnText}
                        </button>
                    </div>
                \`;
                }).join('');
            } catch (error) {
                console.error('Load debates error:', error);
                document.getElementById('archive-grid').innerHTML = '<div class="text-center text-red-400 py-12 col-span-full">読み込みに失敗しました</div>';
            }
        }
        
        async function purchaseDebate(id, debateId) {
            const alreadyPurchased = isPurchased(debateId);
            
            if (!alreadyPurchased && currentUser.user_id !== 'dev') {
                if (currentUser.credits < 50) {
                    alert('クレジットが不足しています（必要: 50クレジット）');
                    return;
                }
                if (!confirm('50クレジットを消費してこのディベートを視聴しますか？')) {
                    return;
                }
            }
            
            try {
                const response = await fetch('/api/archive/purchase', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ debate_id: debateId || id.toString() })
                });
                
                const result = await response.json();
                if (result.success || currentUser.user_id === 'dev') {
                    if (!result.already_purchased && currentUser.user_id !== 'dev') {
                        currentUser.credits -= 50;
                    }
                    // Add to purchased list
                    if (!purchasedDebateIds.includes(debateId)) {
                        purchasedDebateIds.push(debateId);
                    }
                    loadArchivedDebate(id);
                } else {
                    alert(result.error || '購入に失敗しました');
                }
            } catch (error) {
                console.error('Purchase error:', error);
                alert('エラーが発生しました');
            }
        }
        
        async function loadArchivedDebate(archiveId) {
            try {
                const detailResponse = await fetch('/api/archive/detail/' + archiveId);
                const detailData = await detailResponse.json();
                
                if (!detailData.success) {
                    alert('ディベート詳細の読み込みに失敗しました');
                    return;
                }
                
                const detail = detailData.debate;
                
                // Show viewer, hide grid
                document.getElementById('archive-grid').classList.add('hidden');
                document.querySelector('.flex.justify-center.gap-4.mb-8').classList.add('hidden');
                document.getElementById('archive-viewer').classList.remove('hidden');
                
                // Populate viewer
                document.getElementById('viewer-theme').textContent = detail.title || detail.topic;
                document.getElementById('viewer-opinion-a').textContent = detail.agree_position;
                document.getElementById('viewer-opinion-b').textContent = detail.disagree_position;
                document.getElementById('viewer-agree-votes').textContent = detail.agree_votes || 0;
                document.getElementById('viewer-disagree-votes').textContent = detail.disagree_votes || 0;
                
                const winnerText = detail.winner === 'agree' ? '勝者: 意見A' : detail.winner === 'disagree' ? '勝者: 意見B' : '引き分け';
                document.getElementById('viewer-winner').innerHTML = '<i class="fas fa-trophy mr-1"></i>' + winnerText;
                
                // Parse and display messages
                const messagesContainer = document.getElementById('viewer-messages');
                let messages = [];
                try {
                    messages = JSON.parse(detail.messages || '[]');
                } catch (e) {
                    messages = [];
                }
                
                if (messages.length === 0) {
                    messagesContainer.innerHTML = '<div class="text-center text-gray-400 p-8">メッセージがありません</div>';
                    return;
                }
                
                messagesContainer.innerHTML = messages.map((msg, i) => {
                    const side = msg.side || (i % 2 === 0 ? 'agree' : 'disagree');
                    const bubbleClass = side === 'agree' ? 'bubble-agree' : 'bubble-disagree';
                    const iconClass = side === 'agree' ? 'fa-brain' : 'fa-lightbulb';
                    const gradientClass = side === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500';
                    const opinionLabel = side === 'agree' ? '意見A' : '意見B';
                    
                    return '<div class="' + bubbleClass + ' p-4">' +
                        '<div class="flex items-center gap-3 mb-2">' +
                        '<div class="w-8 h-8 rounded-full bg-gradient-to-br ' + gradientClass + ' flex items-center justify-center flex-shrink-0">' +
                        '<i class="fas ' + iconClass + ' text-sm"></i></div>' +
                        '<span class="font-bold text-sm">' + opinionLabel + '</span>' +
                        '</div>' +
                        '<p class="text-sm leading-relaxed text-gray-200">' + (msg.content || '') + '</p>' +
                        '</div>';
                }).join('');
                
            } catch (error) {
                console.error('Load archived debate error:', error);
                alert('ディベートの読み込みに失敗しました');
            }
        }
        
        function closeViewer() {
            document.getElementById('archive-viewer').classList.add('hidden');
            document.getElementById('archive-grid').classList.remove('hidden');
            document.querySelector('.flex.justify-center.gap-4.mb-8').classList.remove('hidden');
            // Reload to update button states
            loadDebates();
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
        
        loadDebates();
    </script>
</body>
</html>`
