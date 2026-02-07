import { globalNav } from '../components/global-nav';

export const communityPage = (userData: any) => `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>コミュニティ - AI Debate Arena</title>
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
                    <i class="fas fa-users mr-3"></i>コミュニティ
                </h1>
                <p class="text-cyan-300">言語別スペースで交流</p>
            </div>
            <div class="flex justify-center gap-4 mb-8 flex-wrap">
                <button class="tab-button active" data-lang="ja"><i class="fas fa-flag mr-2"></i>日本語</button>
                <button class="tab-button" data-lang="en"><i class="fas fa-flag mr-2"></i>English</button>
                <button class="tab-button" data-lang="zh"><i class="fas fa-flag mr-2"></i>中文</button>
                <button class="tab-button" data-lang="ko"><i class="fas fa-flag mr-2"></i>한국어</button>
                <button class="tab-button" data-lang="es"><i class="fas fa-flag mr-2"></i>Español</button>
                <button class="tab-button" data-lang="fr"><i class="fas fa-flag mr-2"></i>Français</button>
            </div>
            <div class="grid md:grid-cols-3 gap-6">
                <div class="md:col-span-1">
                    <div class="profile-card sticky top-24">
                        <h3 class="text-xl font-bold text-cyan-400 mb-4">
                            <i class="fas fa-pen mr-2"></i>新規投稿
                        </h3>
                        <textarea id="post-content" placeholder="投稿内容を入力..." class="w-full bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 min-h-[150px]"></textarea>
                        <button id="submit-post" class="btn-primary w-full mt-3">
                            <i class="fas fa-paper-plane mr-2"></i>投稿
                        </button>
                    </div>
                </div>
                <div class="md:col-span-2">
                    <div class="mb-4">
                        <h3 class="text-xl font-bold text-cyan-400">
                            <i class="fas fa-comments mr-2"></i><span id="current-lang-name">日本語</span> スペース
                        </h3>
                        <div class="text-sm text-gray-400 mt-1">投稿数: <span id="post-count">0</span></div>
                    </div>
                    <div id="posts-container" class="space-y-4">
                        <div class="text-center text-gray-400 py-12">
                            <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
                            <div>読み込み中...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        const currentUser = { user_id: '${userData.user_id}' };
        let currentLang = 'ja';
        
        const langNames = {
            'ja': '日本語',
            'en': 'English',
            'zh': '中文',
            'ko': '한국어',
            'es': 'Español',
            'fr': 'Français'
        };
        
        // Load posts
        async function loadPosts() {
            try {
                const response = await fetch(\`/api/community/posts?language=\${currentLang}\`);
                const data = await response.json();
                
                const container = document.getElementById('posts-container');
                if (!container) return;
                
                if (!data.success || !data.posts || data.posts.length === 0) {
                    container.innerHTML = '<div class="text-center text-gray-400 py-12">まだ投稿がありません</div>';
                    return;
                }
                
                container.innerHTML = data.posts.map(post => \`
                    <div class="profile-card">
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex items-center gap-2">
                                <span class="text-cyan-400 font-bold">@\${post.user_id}</span>
                                <span class="text-xs text-gray-400">\${new Date(post.created_at).toLocaleString('ja-JP')}</span>
                            </div>
                        </div>
                        <div class="text-gray-300 whitespace-pre-wrap">\${post.content}</div>
                    </div>
                \`).join('');
            } catch (error) {
                console.error('Load posts error:', error);
                const container = document.getElementById('posts-container');
                if (container) {
                    container.innerHTML = '<div class="text-center text-red-400 py-12">読み込みに失敗しました</div>';
                }
            }
        }
        
        // Load stats
        async function loadStats() {
            try {
                const response = await fetch(\`/api/community/stats?language=\${currentLang}\`);
                const data = await response.json();
                
                const countElement = document.getElementById('post-count');
                if (countElement) {
                    countElement.textContent = data.count || 0;
                }
            } catch (error) {
                console.error('Load stats error:', error);
            }
        }
        
        // Submit post
        document.getElementById('submit-post').addEventListener('click', async () => {
            const content = document.getElementById('post-content').value.trim();
            if (!content) {
                alert('内容を入力してください');
                return;
            }
            
            try {
                const response = await fetch('/api/community/post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content, language: currentLang })
                });
                
                const result = await response.json();
                if (result.success) {
                    document.getElementById('post-content').value = '';
                    loadPosts();
                    loadStats();
                } else {
                    alert('投稿に失敗しました');
                }
            } catch (error) {
                console.error('Post error:', error);
                alert('エラーが発生しました');
            }
        });
        
        // Language tabs
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', () => {
                currentLang = btn.dataset.lang;
                
                document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const langNameElement = document.getElementById('current-lang-name');
                if (langNameElement) {
                    langNameElement.textContent = langNames[currentLang];
                }
                
                loadPosts();
                loadStats();
            });
        });
        
        // Initial load
        loadPosts();
        loadStats();
    </script>
</body>
</html>`
