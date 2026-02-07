import { globalNav } from '../components/global-nav';

export const announcementsPage = (userData: any) => `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>お知らせ - AI Debate Arena</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/styles.css" rel="stylesheet">
</head>
<body class="bg-black text-white">
    ${globalNav(userData)}
    <div class="pt-20 pb-12 min-h-screen">
        <div class="cyber-grid"></div>
        <div class="container mx-auto px-6 relative z-10 max-w-4xl">
            <div class="text-center mb-8">
                <h1 class="text-4xl font-black cyber-text mb-2">
                    <i class="fas fa-bullhorn mr-3"></i>お知らせ
                </h1>
                <p class="text-cyan-300">運営からの最新情報</p>
            </div>
            
            ${userData.user_id === 'dev' ? `
            <!-- Dev Only: Post Form -->
            <div class="profile-card mb-6">
                <h3 class="text-xl font-bold text-cyan-400 mb-4">
                    <i class="fas fa-pen mr-2"></i>新規お知らせ投稿（Dev専用）
                </h3>
                <textarea 
                    id="announcement-content" 
                    placeholder="お知らせ内容を入力..." 
                    class="w-full bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 min-h-[150px] mb-3"
                ></textarea>
                <button id="post-announcement" class="btn-primary w-full">
                    <i class="fas fa-paper-plane mr-2"></i>投稿
                </button>
            </div>
            ` : ''}
            
            <div id="announcements-container" class="space-y-6">
                <div class="text-center text-gray-400 py-12">
                    <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
                    <div>読み込み中...</div>
                </div>
            </div>
        </div>
    </div>
    <script>
        const currentUser = { user_id: '${userData.user_id}' };
        
        ${userData.user_id === 'dev' ? `
        // Dev: Post announcement
        document.getElementById('post-announcement').addEventListener('click', async () => {
            const content = document.getElementById('announcement-content').value.trim();
            if (!content) {
                alert('内容を入力してください');
                return;
            }
            
            try {
                const response = await fetch('/api/announcements/post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content, type: 'announcement' })
                });
                
                const result = await response.json();
                if (result.success) {
                    document.getElementById('announcement-content').value = '';
                    loadAnnouncements();
                } else {
                    alert('投稿に失敗しました');
                }
            } catch (error) {
                console.error('Post error:', error);
                alert('エラーが発生しました');
            }
        });
        ` : ''}
        
        // Load announcements
        async function loadAnnouncements() {
            try {
                const response = await fetch('/api/announcements');
                const data = await response.json();
                
                const container = document.getElementById('announcements-container');
                if (!data.success || !data.announcements || data.announcements.length === 0) {
                    container.innerHTML = '<div class="text-center text-gray-400 py-12">まだお知らせがありません</div>';
                    return;
                }
                
                container.innerHTML = data.announcements.map(ann => \`
                    <div class="profile-card">
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex items-center gap-2">
                                <span class="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                    <i class="fas fa-bullhorn mr-1"></i>運営
                                </span>
                                <span class="text-xs text-gray-400">\${new Date(ann.created_at).toLocaleString('ja-JP')}</span>
                            </div>
                        </div>
                        <div class="text-gray-300 whitespace-pre-wrap">\${ann.content}</div>
                    </div>
                \`).join('');
            } catch (error) {
                console.error('Load announcements error:', error);
                document.getElementById('announcements-container').innerHTML = '<div class="text-center text-red-400 py-12">読み込みに失敗しました</div>';
            }
        }
        
        loadAnnouncements();
    </script>
</body>
</html>`
