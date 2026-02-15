import { globalNav } from '../components/global-nav';
import { i18nScript } from '../components/i18n';

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
        
        <div class="pt-24 pb-12">
            <div class="cyber-grid"></div>
            
            <div class="container mx-auto px-6 relative z-10">
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
                                <span class="jst-time" data-utc="${debate.created_at || ''}"></span>
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
                                    <div class="ai-name">AI Model</div>
                                    <div class="ai-model">意見A</div>
                                </div>
                            </div>
                            <div class="vs-divider">VS</div>
                            <div class="ai-card con">
                                <div class="ai-avatar"><i class="fas fa-lightbulb"></i></div>
                                <div class="ai-info">
                                    <div class="ai-name">AI Model</div>
                                    <div class="ai-model">意見B</div>
                                </div>
                            </div>
                        </div>
                        <a href="/watch?id=${debate.id}" class="match-watch-btn ${debate.status} block text-center no-underline">
                            <i class="fas fa-eye mr-2"></i>${debate.status === 'live' ? '今すぐ観戦' : debate.status === 'upcoming' ? '予約する' : '結果を見る'}
                        </a>
                    </div>
                    `).join('') : `
                    <div class="col-span-full flex flex-col items-center justify-center py-20" id="empty-state">
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

                <!-- Finished archives container (loaded dynamically) -->
                <div id="archive-grid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" style="display:none;"></div>
            </div>
        </div>

        <div id="toast" class="toast">
            <i class="fas fa-info-circle mr-2"></i>
            <span id="toast-message"></span>
        </div>

        <script>
            // JST time formatting
            function formatJST(utcStr) {
                if (!utcStr) return '日時未定';
                try {
                    const d = new Date(utcStr + (utcStr.includes('Z') || utcStr.includes('+') ? '' : 'Z'));
                    return d.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
                } catch(e) { return utcStr; }
            }
            // Convert all JST time elements
            document.querySelectorAll('.jst-time').forEach(el => {
                el.textContent = formatJST(el.dataset.utc);
            });

            let currentFilter = 'all';
            const debateGrid = document.getElementById('debate-grid');
            const archiveGrid = document.getElementById('archive-grid');

            // Tab filtering
            document.querySelectorAll('.tab-button').forEach(button => {
                button.addEventListener('click', () => {
                    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                    button.classList.add('active');
                    currentFilter = button.dataset.filter;

                    if (currentFilter === 'finished') {
                        // Show archive grid, hide debate grid
                        debateGrid.style.display = 'none';
                        archiveGrid.style.display = 'grid';
                        loadFinishedArchives();
                    } else {
                        // Show debate grid, hide archive grid
                        debateGrid.style.display = 'grid';
                        archiveGrid.style.display = 'none';
                        document.querySelectorAll('.match-card').forEach(card => {
                            if (currentFilter === 'all' || card.dataset.category === currentFilter) {
                                card.style.display = 'block';
                            } else {
                                card.style.display = 'none';
                            }
                        });
                        const emptyState = document.getElementById('empty-state');
                        if (emptyState) emptyState.style.display = '';
                    }
                });
            });

            // Load finished archives
            async function loadFinishedArchives() {
                try {
                    archiveGrid.innerHTML = '<div class="col-span-full text-center py-12"><i class="fas fa-spinner fa-spin text-4xl text-cyan-400"></i><p class="text-gray-400 mt-4">アーカイブを読み込み中...</p></div>';
                    
                    const res = await fetch('/api/archive/debates');
                    const data = await res.json();
                    
                    if (!data.success || !data.debates || data.debates.length === 0) {
                        archiveGrid.innerHTML = '<div class="col-span-full text-center py-12"><i class="fas fa-archive text-gray-600 text-6xl mb-6"></i><h3 class="text-2xl font-bold text-gray-400 mb-4">アーカイブはまだありません</h3></div>';
                        return;
                    }

                    archiveGrid.innerHTML = data.debates.map(d => {
                        const totalVotes = (d.agree_votes || 0) + (d.disagree_votes || 0);
                        const winnerLabel = d.winner === 'agree' ? '賛成側勝利' : d.winner === 'disagree' ? '反対側勝利' : '引き分け';
                        const winnerColor = d.winner === 'agree' ? 'text-green-400' : d.winner === 'disagree' ? 'text-red-400' : 'text-yellow-400';
                        return \`
                        <div class="match-card finished" style="border-color: rgba(107,114,128,0.4);">
                            <div class="match-status finished">
                                <i class="fas fa-trophy"></i> \${winnerLabel}
                            </div>
                            <div class="match-header">
                                <h3 class="match-title">\${d.theme || d.title || 'アーカイブ'}</h3>
                                <div class="match-type ai-vs-ai"><i class="fas fa-microchip"></i> AI vs AI</div>
                            </div>
                            <div class="match-details">
                                <div class="match-time">
                                    <i class="fas fa-calendar-alt text-cyan-400 mr-2"></i>
                                    \${formatJST(d.created_at)}
                                </div>
                                <div class="match-viewers">
                                    <i class="fas fa-chart-bar text-yellow-400 mr-2"></i>
                                    投票: \${totalVotes}票
                                </div>
                            </div>
                            <div style="display:flex; gap:8px; margin:10px 0;">
                                <div style="flex:1; background:rgba(16,185,129,0.2); border:1px solid rgba(16,185,129,0.4); border-radius:6px; padding:8px; text-align:center;">
                                    <div style="font-size:11px; color:#34d399;">賛成</div>
                                    <div style="font-weight:bold; color:white;">\${d.opinion_a || d.agree_position || '-'}</div>
                                    <div style="font-size:13px; color:#34d399; font-weight:bold;">\${d.agree_votes || 0}票</div>
                                </div>
                                <div style="flex:1; background:rgba(239,68,68,0.2); border:1px solid rgba(239,68,68,0.4); border-radius:6px; padding:8px; text-align:center;">
                                    <div style="font-size:11px; color:#f87171;">反対</div>
                                    <div style="font-weight:bold; color:white;">\${d.opinion_b || d.disagree_position || '-'}</div>
                                    <div style="font-size:13px; color:#f87171; font-weight:bold;">\${d.disagree_votes || 0}票</div>
                                </div>
                            </div>
                            <a href="/archive" class="match-watch-btn finished block text-center no-underline">
                                <i class="fas fa-play-circle mr-2"></i>アーカイブで視聴
                            </a>
                        </div>\`;
                    }).join('');
                } catch(err) {
                    console.error('Archive load error:', err);
                    archiveGrid.innerHTML = '<div class="col-span-full text-center py-12 text-red-400"><i class="fas fa-exclamation-triangle text-4xl mb-4"></i><p>読み込みに失敗しました</p></div>';
                }
            }

            function showToast(message) {
                const toast = document.getElementById('toast');
                const toastMessage = document.getElementById('toast-message');
                toastMessage.textContent = message;
                toast.classList.add('show');
                setTimeout(() => { toast.classList.remove('show'); }, 3000);
            }
        </script>
    ${i18nScript()}
</body>
    </html>
`
