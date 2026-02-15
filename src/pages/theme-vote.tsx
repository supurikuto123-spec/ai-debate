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
            </div>

            <!-- Propose New Theme -->
            <div class="cyber-card mb-8">
                <h2 class="text-2xl font-bold text-cyan-300 mb-4 flex items-center">
                    <i class="fas fa-lightbulb mr-3"></i>
                    新しいテーマを提案
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
                            <label class="block text-green-400 font-bold mb-2">
                                <i class="fas fa-check mr-2"></i>賛成意見（A側）
                            </label>
                            <textarea 
                                id="agreeOpinion" 
                                rows="3"
                                placeholder="例：リモートワークにより通勤時間が削減され、集中して仕事ができる環境が整う"
                                class="w-full bg-gray-900 border-2 border-green-500 rounded p-3 text-white focus:outline-none focus:border-green-300 resize-none" 
                                maxlength="200"
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label class="block text-red-400 font-bold mb-2">
                                <i class="fas fa-times mr-2"></i>反対意見（B側）
                            </label>
                            <textarea 
                                id="disagreeOpinion" 
                                rows="3"
                                placeholder="例：対面コミュニケーションが減少し、チームワークや創造性が低下する"
                                class="w-full bg-gray-900 border-2 border-red-500 rounded p-3 text-white focus:outline-none focus:border-red-300 resize-none" 
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
                        <i class="fas fa-paper-plane mr-2"></i>テーマを提案する（10クレジット消費）
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

                <!-- Filter -->
                <div class="flex flex-wrap gap-2 mb-6">
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

                <!-- Sort -->
                <div class="flex gap-2 mb-6">
                    <select id="sortBy" class="bg-gray-900 border border-cyan-500 rounded px-4 py-2 text-white text-sm">
                        <option value="votes">投票数順</option>
                        <option value="recent">新着順</option>
                    </select>
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
    </style>

    <script>
        const userId = '${user.user_id}';
        const isDevUser = userId === 'dev';
        const userCredits = isDevUser ? 999999999 : ${user.credits || 0};
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
        document.getElementById('sortBy').addEventListener('change', (e) => {
            currentSort = e.target.value;
            loadThemes();
        });

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
                    <div class="theme-card">
                        <div class="flex justify-between items-start mb-3">
                            <div class="flex-1">
                                <h3 class="text-xl font-bold text-white mb-2">\${theme.title}</h3>
                                <div class="flex items-center gap-4 text-sm text-gray-400">
                                    <span><i class="fas fa-tag mr-1"></i>\${getCategoryName(theme.category)}</span>
                                    <span><i class="fas fa-user mr-1"></i>@\${theme.proposed_by}</span>
                                    <span><i class="fas fa-clock mr-1"></i>\${formatDate(theme.created_at)}</span>
                                </div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-cyan-400">\${theme.vote_count}</div>
                                <div class="text-xs text-gray-400">票</div>
                            </div>
                        </div>

                        <div class="grid md:grid-cols-2 gap-3 mb-4">
                            <div class="bg-green-500/10 border border-green-500/30 rounded p-3">
                                <div class="text-green-400 font-bold text-sm mb-1">
                                    <i class="fas fa-check mr-1"></i>賛成（A側）
                                </div>
                                <p class="text-sm text-gray-300">\${theme.agree_opinion}</p>
                            </div>
                            <div class="bg-red-500/10 border border-red-500/30 rounded p-3">
                                <div class="text-red-400 font-bold text-sm mb-1">
                                    <i class="fas fa-times mr-1"></i>反対（B側）
                                </div>
                                <p class="text-sm text-gray-300">\${theme.disagree_opinion}</p>
                            </div>
                        </div>

                        <button 
                            onclick="voteTheme('\${theme.id}', \${theme.has_voted})" 
                            class="btn-primary w-full \${theme.has_voted ? 'opacity-50 cursor-not-allowed' : ''}"
                            \${theme.has_voted ? 'disabled' : ''}
                        >
                            <i class="fas fa-\${theme.has_voted ? 'check' : 'thumbs-up'} mr-2"></i>
                            \${theme.has_voted ? '投票済み' : 'このテーマに投票（5クレジット）'}
                        </button>
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

            if (userCredits < 10) {
                alert('クレジットが不足しています（必要: 10クレジット）');
                return;
            }

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
                    alert('テーマを提案しました！');
                    e.target.reset();
                    loadThemes();
                    location.reload();
                } else {
                    alert(result.error || 'テーマの提案に失敗しました');
                }
            } catch (error) {
                console.error('Propose error:', error);
                alert('テーマの提案に失敗しました');
            }
        });

        // Vote for theme
        async function voteTheme(themeId, hasVoted) {
            if (hasVoted) return;

            if (userCredits < 5) {
                alert('クレジットが不足しています（必要: 5クレジット）');
                return;
            }

            try {
                const response = await fetch(\`/api/theme-votes/\${themeId}/vote\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                const result = await response.json();

                if (result.success) {
                    alert('投票しました！');
                    loadThemes();
                    location.reload();
                } else {
                    alert(result.error || '投票に失敗しました');
                }
            } catch (error) {
                console.error('Vote error:', error);
                alert('投票に失敗しました');
            }
        }

        // Helper functions
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
            const date = new Date(dateStr);
            const now = new Date();
            const diff = now - date;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            
            if (days === 0) return '今日';
            if (days === 1) return '昨日';
            if (days < 7) return \`\${days}日前\`;
            return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
        }

        // Initial load
        loadThemes();
    </script>
</body>
</html>
`;
