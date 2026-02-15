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
    <style>
        body {
            margin: 0;
            overflow: hidden;
        }
        
        .fullscreen-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1f 100%);
        }
        
        .chat-header {
            padding: 20px;
            background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1));
            border-bottom: 2px solid cyan;
            flex-shrink: 0;
        }
        
        .language-tabs {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: center;
            margin-top: 15px;
        }
        
        .tab-button {
            padding: 8px 16px;
            border: 2px solid rgba(0, 255, 255, 0.3);
            background: rgba(0, 255, 255, 0.1);
            color: cyan;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: bold;
        }
        
        .tab-button:hover {
            background: rgba(0, 255, 255, 0.2);
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
        }
        
        .tab-button.active {
            background: linear-gradient(135deg, cyan, magenta);
            color: #000;
            border-color: cyan;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
        }
        
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .message-card {
            background: linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(255, 0, 255, 0.05));
            border: 1px solid rgba(0, 255, 255, 0.2);
            border-radius: 8px;
            padding: 10px;
            transition: all 0.3s ease;
        }
        
        .message-card:hover {
            border-color: cyan;
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
        }
        
        .message-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 6px;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
        }
        
        .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 2px solid cyan;
            object-fit: cover;
        }
        
        .user-name {
            color: cyan;
            font-weight: bold;
            text-decoration: none;
            font-size: 14px;
        }
        
        .user-name:hover {
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
        }
        
        .message-time {
            font-size: 10px;
            color: #888;
        }
        
        .message-content {
            color: #ddd;
            white-space: pre-wrap;
            word-wrap: break-word;
            line-height: 1.4;
            font-size: 14px;
        }
        
        .delete-btn {
            background: none;
            border: 1px solid rgba(255, 0, 0, 0.5);
            color: #ff6b6b;
            padding: 4px 8px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 11px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        
        .delete-btn:hover {
            background: rgba(255, 0, 0, 0.2);
            border-color: red;
        }
        
        .chat-input-area {
            padding: 20px;
            padding-bottom: 20px;
            background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1));
            border-top: 2px solid cyan;
            flex-shrink: 0;
        }
        
        .input-container {
            display: flex;
            gap: 10px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        #post-input {
            flex: 1;
            background: rgba(0, 0, 0, 0.5);
            border: 2px solid rgba(0, 255, 255, 0.3);
            border-radius: 25px;
            padding: 12px 20px;
            color: #fff;
            font-size: 14px;
            resize: none;
            min-height: 50px;
            max-height: 150px;
        }
        
        #post-input:focus {
            outline: none;
            border-color: cyan;
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
        }
        
        #send-btn {
            background: linear-gradient(135deg, cyan, magenta);
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            color: #000;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            flex-shrink: 0;
        }
        
        #send-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 0 25px rgba(0, 255, 255, 0.6);
        }
        
        .empty-state {
            text-align: center;
            color: #888;
            padding: 60px 20px;
        }
        
        .loading-state {
            text-align: center;
            color: cyan;
            padding: 60px 20px;
        }
    </style>
</head>
<body>
    ${globalNav(userData)}
    
    <div class="fullscreen-container">
        <div class="chat-header">
            <h1 class="text-3xl font-black text-center cyber-text">
                <i class="fas fa-users mr-3"></i>コミュニティ
            </h1>
            <p class="text-center text-cyan-300 text-sm mt-1">
                <span id="current-lang-name">日本語</span> スペース - 投稿数: <span id="post-count">0</span>
            </p>
            <div class="language-tabs">
                <button class="tab-button active" data-lang="ja"><i class="fas fa-flag mr-2"></i>日本語</button>
                <button class="tab-button" data-lang="en"><i class="fas fa-flag mr-2"></i>English</button>
                <button class="tab-button" data-lang="zh"><i class="fas fa-flag mr-2"></i>中文</button>
                <button class="tab-button" data-lang="ko"><i class="fas fa-flag mr-2"></i>한국어</button>
                <button class="tab-button" data-lang="es"><i class="fas fa-flag mr-2"></i>Español</button>
                <button class="tab-button" data-lang="fr"><i class="fas fa-flag mr-2"></i>Français</button>
            </div>
        </div>
        
        <div class="chat-messages" id="messages-container">
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
                <div>読み込み中...</div>
            </div>
        </div>
        
        <div class="chat-input-area">
            <div class="input-container">
                <textarea 
                    id="post-input" 
                    placeholder="メッセージを入力..."
                    rows="1"
                ></textarea>
                <button id="send-btn">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    </div>
    
    <script>
        const currentUser = { user_id: '${userData.user_id}', username: '${userData.username || userData.user_id}' };
        let currentLang = 'ja';
        let isUserAtBottom = true; // Track if user is at bottom
        let userReactions = {}; // Track user's reactions
        
        const langNames = {
            'ja': '日本語',
            'en': 'English',
            'zh': '中文',
            'ko': '한국어',
            'es': 'Español',
            'fr': 'Français'
        };
        
        // Get avatar URL
        function getAvatarUrl(post) {
            // Priority 1: Uploaded avatar (avatar_url starts with /api/avatar/)
            if (post.avatar_url) {
                return post.avatar_url;
            }
            // Priority 2: DiceBear with avatar_type and avatar_value
            if (post.avatar_type && post.avatar_type !== 'upload') {
                return \`https://api.dicebear.com/7.x/\${post.avatar_type}/svg?seed=\${post.avatar_value || post.user_id}\`;
            }
            // Fallback: Default bottts with user_id as seed
            return \`https://api.dicebear.com/7.x/bottts/svg?seed=\${post.user_id}\`;
        }
        
        // Navigate to user profile
        function viewProfile(userId) {
            window.location.href = \`/user/\${userId}\`;
        }
        
        // Delete post
        async function deletePost(postId) {
            if (!confirm('この投稿を削除しますか？')) return;
            
            try {
                const response = await fetch(\`/api/community/post/\${postId}\`, {
                    method: 'DELETE'
                });
                const result = await response.json();
                
                if (result.success) {
                    loadPosts();
                    loadStats();
                } else {
                    alert('削除に失敗しました');
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('エラーが発生しました');
            }
        }
        
        // Load posts
        async function loadPosts() {
            try {
                const response = await fetch(\`/api/community/posts?language=\${currentLang}\`);
                const data = await response.json();
                
                const container = document.getElementById('messages-container');
                if (!container) return;
                
                if (!data.success || !data.posts || data.posts.length === 0) {
                    container.innerHTML = '<div class="empty-state"><i class="fas fa-comment-slash text-4xl mb-4 block"></i><div>まだ投稿がありません</div></div>';
                    return;
                }
                
                container.innerHTML = data.posts.map(post => {
                    const isOwner = post.user_id === currentUser.user_id;
                    
                    return \`
                        <div class="message-card">
                            <div class="message-header">
                                <div class="user-info" onclick="viewProfile('\${post.user_id}')">
                                    <img src="\${getAvatarUrl(post)}" alt="\${post.user_id}" class="user-avatar" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=\${post.user_id}'" />
                                    <div>
                                        <div class="user-name">@\${post.user_id}</div>
                                        <div class="message-time">\${new Date(post.created_at + (post.created_at.includes && !post.created_at.includes('Z') && !post.created_at.includes('+') ? 'Z' : '')).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                </div>
                                \${isOwner ? \`<button class="delete-btn" onclick="deletePost(\${post.id})"><i class="fas fa-trash"></i></button>\` : ''}
                            </div>
                            <div class="message-content">\${escapeHtml(post.content)}</div>
                        </div>
                    \`;
                }).join('');
                
                // Only auto scroll to bottom if user was already at bottom
                setTimeout(() => {
                    if (isUserAtBottom) {
                        container.scrollTop = container.scrollHeight;
                    }
                }, 100);
            } catch (error) {
                console.error('Load posts error:', error);
                const container = document.getElementById('messages-container');
                if (container) {
                    container.innerHTML = '<div class="empty-state" style="color: #ff6b6b;"><i class="fas fa-exclamation-triangle text-4xl mb-4 block"></i><div>読み込みに失敗しました</div></div>';
                }
            }
        }
        
        // Escape HTML
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
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
        
        // Send post
        async function sendPost() {
            const content = document.getElementById('post-input').value.trim();
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
                    document.getElementById('post-input').value = '';
                    loadPosts();
                    loadStats();
                } else {
                    alert('投稿に失敗しました');
                }
            } catch (error) {
                console.error('Post error:', error);
                alert('エラーが発生しました');
            }
        }
        
        // Send button
        document.getElementById('send-btn').addEventListener('click', sendPost);
        
        // Enter key to send (Shift+Enter for new line)
        document.getElementById('post-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendPost();
            }
        });
        
        // Auto-resize textarea
        document.getElementById('post-input').addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 150) + 'px';
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
        
        // Track scroll position to determine if user is at bottom
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
            messagesContainer.addEventListener('scroll', () => {
                const threshold = 50; // 50px from bottom
                const position = messagesContainer.scrollTop + messagesContainer.clientHeight;
                const height = messagesContainer.scrollHeight;
                isUserAtBottom = (height - position) < threshold;
            });
        }
        
        // Initial load
        loadPosts();
        loadStats();
        
        // Auto refresh every 30 seconds
        setInterval(() => {
            loadPosts();
            loadStats();
        }, 30000);
    </script>
</body>
</html>`
