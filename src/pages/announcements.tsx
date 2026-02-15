import { globalNav } from '../components/global-nav';
import { i18nScript } from '../components/i18n';

export const announcementsPage = (userData: any) => `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>お知らせ - AI Debate Arena</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/styles.css" rel="stylesheet">
    <style>
        .reaction-btn {
            background: none;
            border: 1px solid rgba(0, 255, 255, 0.3);
            color: cyan;
            padding: 5px 12px;
            border-radius: 15px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
        
        .reaction-btn:hover {
            background: rgba(0, 255, 255, 0.2);
            border-color: cyan;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
        }
        
        .reaction-btn.reacted {
            background: linear-gradient(135deg, rgba(255, 0, 255, 0.3), rgba(255, 0, 128, 0.3));
            border-color: magenta;
        }
        
        .delete-btn {
            background: none;
            border: 1px solid rgba(255, 0, 0, 0.5);
            color: #ff6b6b;
            padding: 5px 12px;
            border-radius: 15px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
        
        .delete-btn:hover {
            background: rgba(255, 0, 0, 0.2);
            border-color: red;
        }
    </style>
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
                    class="w-full bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 min-h-[120px] mb-3"
                ></textarea>
                
                <!-- Image Attachment -->
                <div class="mb-3">
                    <label class="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <i class="fas fa-image text-cyan-400"></i> 画像添付（任意）
                    </label>
                    <input type="file" id="announcement-image" accept="image/*" 
                        class="w-full bg-slate-800/50 border border-cyan-500/20 rounded-lg p-2 text-white text-sm file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:bg-cyan-500/20 file:text-cyan-400 file:cursor-pointer">
                    <div id="image-preview" class="hidden mt-2">
                        <img id="preview-img" src="" class="max-h-40 rounded-lg border border-cyan-500/30">
                        <button onclick="clearImage()" class="text-red-400 text-xs mt-1 hover:text-red-300"><i class="fas fa-times mr-1"></i>削除</button>
                    </div>
                </div>
                
                <!-- Poll Creation -->
                <div class="mb-3">
                    <label class="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <input type="checkbox" id="add-poll" class="mr-1"> 
                        <i class="fas fa-poll text-cyan-400"></i> アンケートを追加
                    </label>
                    <div id="poll-section" class="hidden space-y-2">
                        <input type="text" id="poll-question" placeholder="アンケートの質問" 
                            class="w-full bg-slate-800/50 border border-cyan-500/20 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-cyan-500/50">
                        <div id="poll-options-container">
                            <input type="text" class="poll-option w-full bg-slate-800/50 border border-purple-500/20 rounded-lg p-2 text-white text-sm mb-1 focus:outline-none focus:border-purple-500/50" placeholder="選択肢 1">
                            <input type="text" class="poll-option w-full bg-slate-800/50 border border-purple-500/20 rounded-lg p-2 text-white text-sm mb-1 focus:outline-none focus:border-purple-500/50" placeholder="選択肢 2">
                        </div>
                        <button onclick="addPollOption()" class="text-xs text-cyan-400 hover:text-cyan-300">
                            <i class="fas fa-plus mr-1"></i>選択肢を追加（最大5つ）
                        </button>
                    </div>
                </div>
                
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
        const isDev = currentUser.user_id === 'dev';
        
        ${userData.user_id === 'dev' ? `
        // Image preview
        document.getElementById('announcement-image').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(ev) {
                    document.getElementById('preview-img').src = ev.target.result;
                    document.getElementById('image-preview').classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
        
        function clearImage() {
            document.getElementById('announcement-image').value = '';
            document.getElementById('image-preview').classList.add('hidden');
        }
        
        // Poll toggle
        document.getElementById('add-poll').addEventListener('change', function(e) {
            document.getElementById('poll-section').classList.toggle('hidden', !e.target.checked);
        });
        
        function addPollOption() {
            const container = document.getElementById('poll-options-container');
            const count = container.querySelectorAll('.poll-option').length;
            if (count >= 5) { alert('選択肢は最大5つまでです'); return; }
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'poll-option w-full bg-slate-800/50 border border-purple-500/20 rounded-lg p-2 text-white text-sm mb-1 focus:outline-none focus:border-purple-500/50';
            input.placeholder = '選択肢 ' + (count + 1);
            container.appendChild(input);
        }
        
        // Dev: Post announcement
        document.getElementById('post-announcement').addEventListener('click', async () => {
            const content = document.getElementById('announcement-content').value.trim();
            if (!content) {
                alert('内容を入力してください');
                return;
            }
            
            // Build image data URL
            let imageUrl = '';
            const imgFile = document.getElementById('announcement-image').files[0];
            if (imgFile) {
                imageUrl = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (ev) => resolve(ev.target.result);
                    reader.readAsDataURL(imgFile);
                });
            }
            
            // Build poll data
            let poll = null;
            if (document.getElementById('add-poll').checked) {
                const question = document.getElementById('poll-question').value.trim();
                const options = Array.from(document.querySelectorAll('.poll-option'))
                    .map(el => el.value.trim())
                    .filter(v => v.length > 0);
                if (question && options.length >= 2) {
                    poll = { question, options };
                }
            }
            
            try {
                const response = await fetch('/api/announcements/post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        content, 
                        type: 'announcement',
                        image_url: imageUrl || undefined,
                        poll: poll || undefined
                    })
                });
                
                const result = await response.json();
                if (result.success) {
                    document.getElementById('announcement-content').value = '';
                    clearImage();
                    document.getElementById('add-poll').checked = false;
                    document.getElementById('poll-section').classList.add('hidden');
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
        
        // Delete announcement (Dev only)
        async function deleteAnnouncement(announcementId) {
            if (!isDev) return;
            if (!confirm('このお知らせを削除しますか？')) return;
            
            try {
                const response = await fetch(\`/api/announcements/\${announcementId}\`, {
                    method: 'DELETE'
                });
                const result = await response.json();
                
                if (result.success) {
                    loadAnnouncements();
                } else {
                    alert('削除に失敗しました');
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('エラーが発生しました');
            }
        }
        
        // Toggle reaction
        async function toggleReaction(announcementId) {
            try {
                const response = await fetch(\`/api/announcements/\${announcementId}/reaction\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ emoji: '👍' })
                });
                const result = await response.json();
                
                if (result.success) {
                    loadAnnouncements();
                }
            } catch (error) {
                console.error('Reaction error:', error);
            }
        }
        
        // Escape HTML
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
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
                
                container.innerHTML = data.announcements.map(ann => {
                    const hasReacted = ann.user_has_reacted === 1;
                    
                    // Parse poll data
                    let pollHtml = '';
                    if (ann.poll_data) {
                        try {
                            const poll = typeof ann.poll_data === 'string' ? JSON.parse(ann.poll_data) : ann.poll_data;
                            if (poll && poll.question && poll.options) {
                                const totalVotes = (poll.votes || []).reduce((s, v) => s + (v || 0), 0);
                                pollHtml = '<div class="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">' +
                                    '<div class="text-purple-300 font-bold mb-3"><i class="fas fa-poll mr-2"></i>' + escapeHtml(poll.question) + '</div>' +
                                    poll.options.map((opt, i) => {
                                        const votes = (poll.votes || [])[i] || 0;
                                        const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                                        return '<div class="mb-2">' +
                                            '<button onclick="votePoll(' + ann.id + ',' + i + ')" class="w-full text-left relative overflow-hidden bg-slate-800/50 border border-purple-500/20 rounded-lg p-2 text-sm text-gray-300 hover:border-purple-500/50 transition">' +
                                            '<div class="absolute inset-0 bg-purple-500/20" style="width:' + pct + '%"></div>' +
                                            '<span class="relative">' + escapeHtml(opt) + ' <span class="text-purple-400 ml-2">(' + votes + '票 ' + pct + '%)</span></span>' +
                                            '</button></div>';
                                    }).join('') +
                                    '<div class="text-xs text-gray-500 mt-1">合計 ' + totalVotes + ' 票</div></div>';
                            }
                        } catch(e) { /* ignore poll parse error */ }
                    }
                    
                    // Image
                    let imageHtml = '';
                    if (ann.image_url) {
                        imageHtml = '<div class="mt-3 mb-3"><img src="' + ann.image_url + '" class="max-w-full max-h-80 rounded-lg border border-cyan-500/20" alt="添付画像"></div>';
                    }
                    
                    return \`
                        <div class="profile-card">
                            <div class="flex items-start justify-between mb-3">
                                <div class="flex items-center gap-2">
                                    <span class="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                        <i class="fas fa-bullhorn mr-1"></i>運営
                                    </span>
                                    <span class="text-xs text-gray-400">\${new Date(ann.created_at + (ann.created_at.includes && !ann.created_at.includes('Z') && !ann.created_at.includes('+') ? 'Z' : '')).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</span>
                                </div>
                            </div>
                            <div class="text-gray-300 whitespace-pre-wrap mb-2">\${escapeHtml(ann.content)}</div>
                            \${imageHtml}
                            \${pollHtml}
                            <div class="flex items-center gap-3 mt-3">
                                <button class="reaction-btn \${hasReacted ? 'reacted' : ''}" onclick="toggleReaction(\${ann.id})">
                                    <i class="fas fa-thumbs-up"></i>
                                    <span>\${ann.reaction_count || 0}</span>
                                </button>
                                \${isDev ? \`<button class="delete-btn" onclick="deleteAnnouncement(\${ann.id})"><i class="fas fa-trash"></i> 削除</button>\` : ''}
                            </div>
                        </div>
                    \`;
                }).join('');
            } catch (error) {
                console.error('Load announcements error:', error);
                document.getElementById('announcements-container').innerHTML = '<div class="text-center text-red-400 py-12">読み込みに失敗しました</div>';
            }
        }
        
        // Vote on poll
        async function votePoll(announcementId, optionIndex) {
            try {
                const response = await fetch('/api/announcements/' + announcementId + '/poll-vote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ option_index: optionIndex })
                });
                const result = await response.json();
                if (result.success) {
                    loadAnnouncements();
                } else {
                    alert(result.error || 'アンケート投票に失敗しました');
                }
            } catch (error) {
                console.error('Poll vote error:', error);
            }
        }
        
        loadAnnouncements();
        
        // Auto refresh every 30 seconds
        setInterval(loadAnnouncements, 30000);
    </script>
${i18nScript()}
</body>
</html>`
