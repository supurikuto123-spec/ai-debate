import { globalNav } from '../components/global-nav';

export const themeVotePage = (user: any) => `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <title>テーマ投票 - AI Debate Arena</title>
    <meta name="description" content="次回のディベートテーマに投票しよう！みんなで議論したいテーマを提案・投票できます。">
    <meta name="robots" content="index, follow">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/styles.css" rel="stylesheet">
</head>
<body class="bg-black text-white">
    ${globalNav(user)}
    
    <div class="min-h-screen pt-24 pb-12">
        <div class="cyber-grid"></div>
        
        <div class="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
            <!-- Header -->
            <div class="cyber-card mb-8">
                <h1 class="text-3xl md:text-4xl font-black cyber-text mb-4 flex items-center">
                    <i class="fas fa-vote-yea mr-4 text-cyan-400"></i>
                    テーマ投票
                </h1>
                <p class="text-gray-300">
                    次回のディベートテーマを決めよう！気になるテーマに投票したり、新しいテーマを提案できます。
                </p>
                <div class="mt-3 text-sm text-gray-400">
                    <span class="text-yellow-400"><i class="fas fa-coins mr-1"></i>テーマ提案: 20クレジット消費</span>
                    <span class="mx-3">|</span>
                    <span class="text-green-400"><i class="fas fa-thumbs-up mr-1"></i>投票: 無料</span>
                </div>
            </div>

            <!-- Propose New Theme -->
            <div class="cyber-card mb-8">
                <h2 class="text-2xl font-bold text-cyan-300 mb-4 flex items-center">
                    <i class="fas fa-lightbulb mr-3"></i>
                    新しいテーマを提案
                    <span class="ml-auto text-sm text-yellow-400 font-normal">
                        <i class="fas fa-coins mr-1"></i>20クレジット消費
                    </span>
                </h2>
                
                <form id="proposeForm" class="space-y-4">
                    <div>
                        <label class="block text-cyan-300 font-bold mb-2">
                            テーマ <span class="text-red-400">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="themeTitle" 
                            placeholder="例：リモートワークは生産性を向上させるか"
                            class="w-full bg-gray-900 border-2 border-cyan-500 rounded p-3 text-white focus:outline-none focus:border-cyan-300" 
                            maxlength="100"
                            required
                        >
                    </div>

                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-cyan-400 font-bold mb-2">
                                <i class="fas fa-arrow-right mr-2"></i>立場A
                            </label>
                            <textarea 
                                id="agreeOpinion" 
                                rows="3"
                                placeholder="例：リモートワークにより通勤時間が削減され、集中して仕事ができる環境が整う"
                                class="w-full bg-gray-900 border-2 border-cyan-500 rounded p-3 text-white focus:outline-none focus:border-cyan-300 resize-none" 
                                maxlength="200"
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label class="block text-pink-400 font-bold mb-2">
                                <i class="fas fa-arrow-left mr-2"></i>立場B
                            </label>
                            <textarea 
                                id="disagreeOpinion" 
                                rows="3"
                                placeholder="例：対面コミュニケーションが減少し、チームワークや創造性が低下する"
                                class="w-full bg-gray-900 border-2 border-pink-500 rounded p-3 text-white focus:outline-none focus:border-pink-300 resize-none" 
                                maxlength="200"
                                required
                            ></textarea>
                        </div>
                    </div>

                    <div>
                        <label class="block text-cyan-300 font-bold mb-2">
                            カテゴリー
                        </label>
                        <select id="category" class="w-full bg-gray-900 border-2 border-cyan-500 rounded p-3 text-white focus:outline-none focus:border-cyan-300">
                            <option value="technology">テクノロジー</option>
                            <option value="society">社会</option>
                            <option value="economy">経済</option>
                            <option value="education">教育</option>
                            <option value="environment">環境</option>
                            <option value="politics">政治</option>
                            <option value="culture">文化</option>
                            <option value="other">その他</option>
                        </select>
                    </div>

                    <button type="submit" class="btn-primary w-full">
                        <i class="fas fa-paper-plane mr-2"></i>テーマを提案する（20クレジット消費。）
                    </button>
                </form>
            </div>

            <!-- Vote for Themes -->
            <div class="cyber-card">
                <h2 class="text-2xl font-bold text-cyan-300 mb-6 flex items-center">
                    <i class="fas fa-poll mr-3"></i>
                    投票可能なテーマ
                    <span class="ml-auto text-sm text-gray-400">
                        <span id="themeCount">読み込み中...</span>
                    </span>
                </h2>

                <!-- Category Filter -->
                <div class="flex flex-wrap gap-2 mb-4">
                    <button class="filter-btn active" data-category="all">
                        <i class="fas fa-th mr-2"></i>すべて
                    </button>
                    <button class="filter-btn" data-category="technology">
                        <i class="fas fa-microchip mr-2"></i>テクノロジー
                    </button>
                    <button class="filter-btn" data-category="society">
                        <i class="fas fa-users mr-2"></i>社会
                    </button>
                    <button class="filter-btn" data-category="economy">
                        <i class="fas fa-chart-line mr-2"></i>経済
                    </button>
                    <button class="filter-btn" data-category="education">
                        <i class="fas fa-graduation-cap mr-2"></i>教育
                    </button>
                    <button class="filter-btn" data-category="environment">
                        <i class="fas fa-leaf mr-2"></i>環境
                    </button>
                    <button class="filter-btn" data-category="other">
                        <i class="fas fa-ellipsis-h mr-2"></i>その他
                    </button>
                </div>

                <!-- Sort Tabs -->
                <div class="flex gap-2 mb-6">
                    <button class="sort-tab active" data-sort="votes" onclick="changeSort('votes')">
                        <i class="fas fa-fire mr-1"></i>いいね順
                    </button>
                    <button class="sort-tab" data-sort="recent" onclick="changeSort('recent')">
                        <i class="fas fa-clock mr-1"></i>新着順
                    </button>
                    ${user.user_id === 'dev' ? `
                    <button class="sort-tab" data-sort="adopted" onclick="changeSort('adopted')">
                        <i class="fas fa-check-circle mr-1"></i>採用済み
                    </button>
                    ` : ''}
                </div>

                <!-- Themes List -->
                <div id="themesList" class="space-y-4">
                    <div class="text-center text-gray-400 py-8">
                        <i class="fas fa-spinner fa-spin text-4xl mb-4 text-cyan-400"></i>
                        <p>テーマを読み込み中...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <style>
        .filter-btn {
            padding: 8px 16px;
            background: rgba(6, 182, 212, 0.1);
            border: 1px solid rgba(6, 182, 212, 0.3);
            border-radius: 6px;
            color: #06b6d4;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .filter-btn:hover {
            background: rgba(6, 182, 212, 0.2);
            border-color: #06b6d4;
        }
        .filter-btn.active {
            background: rgba(6, 182, 212, 0.3);
            border-color: #06b6d4;
            color: #ffffff;
        }
        .sort-tab {
            padding: 8px 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            color: #9ca3af;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
            font-weight: 600;
        }
        .sort-tab:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
        }
        .sort-tab.active {
            background: rgba(6, 182, 212, 0.25);
            border-color: #06b6d4;
            color: #06b6d4;
        }
        .theme-card {
            background: rgba(17, 24, 39, 0.8);
            border: 1px solid rgba(6, 182, 212, 0.3);
            border-radius: 8px;
            padding: 20px;
            transition: all 0.3s;
        }
        .theme-card:hover {
            border-color: #06b6d4;
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
        }
        .theme-card.adopted {
            border-color: rgba(34, 197, 94, 0.5);
            background: rgba(17, 24, 39, 0.9);
        }
        .adopt-btn {
            padding: 6px 14px;
            background: rgba(34, 197, 94, 0.15);
            border: 1px solid rgba(34, 197, 94, 0.4);
            border-radius: 6px;
            color: #22c55e;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
        }
        .adopt-btn:hover {
            background: rgba(34, 197, 94, 0.3);
            border-color: #22c55e;
        }
        .adopt-btn.adopted {
            background: rgba(34, 197, 94, 0.3);
            border-color: #22c55e;
            color: #fff;
        }
        .proposer-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 2px 8px;
            background: rgba(139, 92, 246, 0.15);
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: 12px;
            font-size: 12px;
            color: #a78bfa;
        }
    </style>

    <script>
        const userId = '${user.user_id}';
        const isDev = userId === 'dev';
        let userCredits = ${user.credits || 0};
        let currentFilter = 'all';
        let currentSort = 'votes';

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.category;
                loadThemes();
            });
        });

        // Sort change
        function changeSort(sort) {
            currentSort = sort;
            document.querySelectorAll('.sort-tab').forEach(t => t.classList.toggle('active', t.dataset.sort === sort));
            loadThemes();
        }

        // Load themes
        async function loadThemes() {
            try {
                const response = await fetch(\`/api/theme-votes?category=\${currentFilter}&sort=\${currentSort}\`);
                const data = await response.json();

                if (!data.success) throw new Error(data.error);

                const themesList = document.getElementById('themesList');
                document.getElementById('themeCount').textContent = \`\${data.themes.length}件のテーマ\`;

                if (data.themes.length === 0) {
                    themesList.innerHTML = \`
                        <div class="text-center text-gray-400 py-8">
                            <i class="fas fa-inbox text-4xl mb-4"></i>
                            <p>まだテーマが提案されていません</p>
                        </div>
                    \`;
                    return;
                }

                themesList.innerHTML = data.themes.map(theme => \`
                    <div class="theme-card \${theme.adopted ? 'adopted' : ''}">
                        <div class="flex justify-between items-start mb-3">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-2">
                                    <h3 class="text-xl font-bold text-white">\${escapeHtml(theme.title)}</h3>
                                    \${theme.adopted ? '<span class="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30"><i class="fas fa-check-circle mr-1"></i>採用</span>' : ''}
                                </div>
                                <div class="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                                    <span><i class="fas fa-tag mr-1"></i>\${getCategoryName(theme.category)}</span>
                                    <span class="proposer-badge">
                                        <i class="fas fa-user-edit"></i>
                                        <a href="/user/\${theme.proposed_by}" class="hover:text-purple-300">@\${theme.proposed_by}</a>
                                    </span>
                                    <span><i class="fas fa-clock mr-1"></i>\${formatDate(theme.created_at)}</span>
                                </div>
                            </div>
                            <div class="text-center ml-4">
                                <div class="text-2xl font-bold text-cyan-400">\${theme.vote_count}</div>
                                <div class="text-xs text-gray-400">票</div>
                            </div>
                        </div>

                        <div class="grid md:grid-cols-2 gap-3 mb-4">
                            <div class="bg-cyan-500/10 border border-cyan-500/30 rounded p-3">
                                <div class="text-cyan-400 font-bold text-sm mb-1">
                                    <i class="fas fa-arrow-right mr-1"></i>立場A
                                </div>
                                <p class="text-sm text-gray-300">\${escapeHtml(theme.agree_opinion || '')}</p>
                            </div>
                            <div class="bg-pink-500/10 border border-pink-500/30 rounded p-3">
                                <div class="text-pink-400 font-bold text-sm mb-1">
                                    <i class="fas fa-arrow-left mr-1"></i>立場B
                                </div>
                                <p class="text-sm text-gray-300">\${escapeHtml(theme.disagree_opinion || '')}</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <button 
                                onclick="voteTheme('\${theme.id}', \${theme.has_voted})" 
                                class="btn-primary flex-1 \${theme.has_voted ? 'opacity-50' : ''}"
                                \${theme.has_voted ? 'disabled' : ''}
                            >
                                <i class="fas fa-\${theme.has_voted ? 'check' : 'thumbs-up'} mr-2"></i>
                                \${theme.has_voted ? '投票済み' : 'このテーマに投票（無料）'}
                            </button>
                            \${isDev ? \`
                                <button 
                                    onclick="adoptTheme('\${theme.id}', \${theme.adopted ? 1 : 0})"
                                    class="adopt-btn \${theme.adopted ? 'adopted' : ''}"
                                >
                                    <i class="fas fa-\${theme.adopted ? 'check-circle' : 'star'} mr-1"></i>
                                    \${theme.adopted ? '採用済' : '採用'}
                                </button>
                            \` : ''}
                        </div>
                    </div>
                \`).join('');
            } catch (error) {
                console.error('Load themes error:', error);
                document.getElementById('themesList').innerHTML = \`
                    <div class="text-center text-red-400 py-8">
                        <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                        <p>テーマの読み込みに失敗しました</p>
                    </div>
                \`;
            }
        }

        // Propose theme
        document.getElementById('proposeForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            try {
                const response = await fetch('/api/theme-votes/propose', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: document.getElementById('themeTitle').value,
                        agree_opinion: document.getElementById('agreeOpinion').value,
                        disagree_opinion: document.getElementById('disagreeOpinion').value,
                        category: document.getElementById('category').value
                    })
                });

                const result = await response.json();

                if (result.success) {
                    if (result.new_credits !== undefined) {
                        userCredits = result.new_credits;
                        if (window.updateCreditsDisplay) window.updateCreditsDisplay(result.new_credits);
                    }
                    alert('テーマを提案しました！');
                    e.target.reset();
                    loadThemes();
                } else {
                    alert(result.error || 'テーマの提案に失敗しました');
                }
            } catch (error) {
                console.error('Propose error:', error);
                alert('テーマの提案に失敗しました');
            }
        });

        // Vote for theme (free)
        async function voteTheme(themeId, hasVoted) {
            if (hasVoted) return;

            try {
                const response = await fetch(\`/api/theme-votes/\${themeId}/vote\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                const result = await response.json();

                if (result.success) {
                    if (result.new_credits !== undefined) {
                        userCredits = result.new_credits;
                        if (window.updateCreditsDisplay) window.updateCreditsDisplay(result.new_credits);
                    }
                    loadThemes();
                } else {
                    alert(result.error || '投票に失敗しました');
                }
            } catch (error) {
                console.error('Vote error:', error);
                alert('投票に失敗しました');
            }
        }

        // Adopt theme (dev only)
        async function adoptTheme(themeId, currentlyAdopted) {
            if (!isDev) return;
            
            try {
                const response = await fetch(\`/api/theme-votes/\${themeId}/adopt\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ adopt: !currentlyAdopted })
                });

                const result = await response.json();

                if (result.success) {
                    loadThemes();
                } else {
                    alert(result.error || '採用操作に失敗しました');
                }
            } catch (error) {
                console.error('Adopt error:', error);
                alert('採用操作に失敗しました');
            }
        }

        // Helper functions
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function getCategoryName(category) {
            const names = {
                technology: 'テクノロジー',
                society: '社会',
                economy: '経済',
                education: '教育',
                environment: '環境',
                politics: '政治',
                culture: '文化',
                other: 'その他'
            };
            return names[category] || category;
        }

        function formatDate(dateStr) {
            const date = new Date(dateStr + (dateStr.includes('Z') || dateStr.includes('+') ? '' : 'Z'));
            const now = new Date();
            const diff = now - date;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            
            if (days === 0) return '今日';
            if (days === 1) return '昨日';
            if (days < 7) return \`\${days}日前\`;
            return date.toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo', month: 'short', day: 'numeric' });
        }

        // Initial load
        loadThemes();
    </script>
</body>
</html>
`;
