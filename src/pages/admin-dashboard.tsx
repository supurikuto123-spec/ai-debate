import { globalNav } from '../components/global-nav';

export const adminDashboardPage = (userData: any) => `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>開発者ダッシュボード - AI Debate</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/styles.css" rel="stylesheet">
    <style>
        .dev-card {
            background: linear-gradient(135deg, rgba(0,20,40,0.95), rgba(20,0,40,0.95));
            border: 2px solid rgba(0,255,255,0.3);
            border-radius: 12px;
            padding: 24px;
            transition: all 0.3s ease;
        }
        .dev-card:hover {
            border-color: #00ffff;
            box-shadow: 0 0 20px rgba(0,255,255,0.2);
        }
        .stat-badge {
            background: linear-gradient(135deg, rgba(0,255,255,0.15), rgba(255,0,255,0.15));
            border: 1px solid rgba(0,255,255,0.4);
            border-radius: 8px;
            padding: 12px 20px;
            text-align: center;
        }
        .user-row {
            background: rgba(0,0,0,0.4);
            border: 1px solid rgba(0,255,255,0.15);
            border-radius: 8px;
            padding: 14px 18px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
        }
        .user-row:hover { border-color: rgba(0,255,255,0.4); }
        .dev-badge-pill {
            background: linear-gradient(135deg, #ffd700, #ff8c00);
            color: #000;
            font-size: 11px;
            font-weight: 900;
            padding: 3px 10px;
            border-radius: 12px;
            letter-spacing: 1px;
        }
        .tab-btn {
            background: rgba(0,255,255,0.1);
            border: 1px solid rgba(0,255,255,0.3);
            color: #00ffff;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s;
        }
        .tab-btn.active, .tab-btn:hover {
            background: rgba(0,255,255,0.25);
            border-color: #00ffff;
            box-shadow: 0 0 10px rgba(0,255,255,0.3);
        }
        .action-btn {
            padding: 6px 16px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
            border: 2px solid;
        }
        .btn-grant-dev {
            background: rgba(255,215,0,0.15);
            border-color: #ffd700;
            color: #ffd700;
        }
        .btn-grant-dev:hover { background: rgba(255,215,0,0.3); }
        .btn-revoke-dev {
            background: rgba(239,68,68,0.15);
            border-color: #ef4444;
            color: #ef4444;
        }
        .btn-revoke-dev:hover { background: rgba(239,68,68,0.3); }
        .btn-add-credits {
            background: rgba(34,197,94,0.15);
            border-color: #22c55e;
            color: #22c55e;
        }
        .btn-add-credits:hover { background: rgba(34,197,94,0.3); }
        .btn-danger {
            background: rgba(239,68,68,0.15);
            border-color: #ef4444;
            color: #ef4444;
        }
        .btn-danger:hover { background: rgba(239,68,68,0.3); }
        .search-input {
            background: rgba(0,0,0,0.5);
            border: 2px solid rgba(0,255,255,0.3);
            color: #fff;
            padding: 10px 16px;
            border-radius: 8px;
            width: 100%;
            outline: none;
            font-size: 14px;
        }
        .search-input:focus { border-color: #00ffff; }
        .panel-section {
            margin-bottom: 32px;
        }
        .panel-title {
            font-size: 1.1rem;
            font-weight: bold;
            color: #00ffff;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            border-bottom: 1px solid rgba(0,255,255,0.2);
            padding-bottom: 8px;
        }
        .notification {
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 14px 20px;
            border-radius: 10px;
            font-weight: bold;
            font-size: 14px;
            z-index: 9999;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            max-width: 320px;
        }
        .notification.show { transform: translateX(0); }
        .notification.success { background: rgba(34,197,94,0.2); border: 2px solid #22c55e; color: #22c55e; }
        .notification.error { background: rgba(239,68,68,0.2); border: 2px solid #ef4444; color: #ef4444; }
    </style>
</head>
<body class="bg-black text-white min-h-screen">
    ${globalNav(userData)}
    
    <div id="notif" class="notification"></div>

    <div class="pt-20 pb-12">
        <div class="container mx-auto px-4 max-w-6xl">
            <!-- Header -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-black mb-2" style="background:linear-gradient(135deg,#ffd700,#ff8c00,#ff00cc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
                    <i class="fas fa-crown mr-3" style="-webkit-text-fill-color:#ffd700;"></i>開発者ダッシュボード
                </h1>
                <p class="text-gray-400">dev専用管理パネル - ログイン中: <span class="text-cyan-400 font-bold">@${userData.user_id}</span></p>
            </div>

            <!-- Stats Summary -->
            <div id="stats-grid" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="stat-badge"><div class="text-2xl font-bold text-cyan-400" id="stat-users">-</div><div class="text-xs text-gray-400 mt-1">総ユーザー数</div></div>
                <div class="stat-badge"><div class="text-2xl font-bold text-yellow-400" id="stat-debates">-</div><div class="text-xs text-gray-400 mt-1">総ディベート数</div></div>
                <div class="stat-badge"><div class="text-2xl font-bold text-green-400" id="stat-posts">-</div><div class="text-xs text-gray-400 mt-1">コミュニティ投稿</div></div>
                <div class="stat-badge"><div class="text-2xl font-bold text-pink-400" id="stat-archives">-</div><div class="text-xs text-gray-400 mt-1">アーカイブ数</div></div>
            </div>

            <!-- Tabs -->
            <div class="flex flex-wrap gap-3 mb-6">
                <button class="tab-btn active" data-tab="users" onclick="switchTab('users', this)"><i class="fas fa-users mr-2"></i>ユーザー管理</button>
                <button class="tab-btn" data-tab="dev-management" onclick="switchTab('dev-management', this)"><i class="fas fa-crown mr-2"></i>dev権限管理</button>
                <button class="tab-btn" data-tab="credits" onclick="switchTab('credits', this)"><i class="fas fa-coins mr-2"></i>クレジット操作</button>
                <button class="tab-btn" data-tab="debates" onclick="switchTab('debates', this)"><i class="fas fa-comments mr-2"></i>ディベート管理</button>
                <button class="tab-btn" data-tab="system" onclick="switchTab('system', this)"><i class="fas fa-tools mr-2"></i>システム操作</button>
            </div>

            <!-- Tab: Users -->
            <div id="tab-users" class="tab-content">
                <div class="dev-card">
                    <div class="panel-title"><i class="fas fa-users"></i>ユーザー一覧</div>
                    <div class="mb-4 flex gap-3">
                        <input class="search-input" id="user-search" placeholder="ユーザーID / メール / ユーザー名で検索..." oninput="filterUsers()">
                        <button class="tab-btn" onclick="loadUsers()"><i class="fas fa-sync mr-1"></i>更新</button>
                    </div>
                    <div id="user-list" class="space-y-2">
                        <div class="text-center text-gray-400 py-8"><i class="fas fa-spinner fa-spin mr-2"></i>読み込み中...</div>
                    </div>
                </div>
            </div>

            <!-- Tab: Dev Management -->
            <div id="tab-dev-management" class="tab-content hidden">
                <div class="dev-card">
                    <div class="panel-title"><i class="fas fa-crown" style="color:#ffd700;"></i>dev権限管理</div>
                    <div class="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p class="text-yellow-300 text-sm"><i class="fas fa-info-circle mr-2"></i>dev権限を付与されたユーザーは、ハンバーガーメニュー・コマンドパネル・このダッシュボードへのアクセスがdev本人と同等になります。</p>
                    </div>
                    <div class="panel-title"><i class="fas fa-user-plus"></i>ユーザーにdev権限を付与</div>
                    <div class="flex gap-3 mb-6">
                        <input class="search-input flex-1" id="grant-user-id" placeholder="付与するユーザーのuser_idを入力...">
                        <button class="action-btn btn-grant-dev" onclick="grantDevRole()">
                            <i class="fas fa-crown mr-2"></i>dev権限付与
                        </button>
                    </div>
                    <div class="panel-title"><i class="fas fa-shield-alt" style="color:#ffd700;"></i>現在のdev権限ユーザー</div>
                    <div id="dev-users-list" class="space-y-2">
                        <div class="text-center text-gray-400 py-4"><i class="fas fa-spinner fa-spin mr-2"></i>読み込み中...</div>
                    </div>
                </div>
            </div>

            <!-- Tab: Credits -->
            <div id="tab-credits" class="tab-content hidden">
                <div class="dev-card">
                    <div class="panel-title"><i class="fas fa-coins" style="color:#ffd700;"></i>クレジット一括操作</div>
                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <label class="text-sm text-gray-400 mb-2 block">対象ユーザーID</label>
                            <input class="search-input mb-3" id="credit-user-id" placeholder="user_idを入力...">
                            <label class="text-sm text-gray-400 mb-2 block">付与クレジット数</label>
                            <input class="search-input mb-3" id="credit-amount" type="number" placeholder="例: 1000" min="1" max="999999">
                            <label class="text-sm text-gray-400 mb-2 block">理由（任意）</label>
                            <input class="search-input mb-4" id="credit-reason" placeholder="例: キャンペーン報酬">
                            <button class="action-btn btn-add-credits w-full py-3" onclick="grantCredits()">
                                <i class="fas fa-plus-circle mr-2"></i>クレジット付与
                            </button>
                        </div>
                        <div>
                            <div class="panel-title"><i class="fas fa-list"></i>最近のクレジット取引</div>
                            <div id="recent-transactions" class="space-y-2 max-h-80 overflow-y-auto">
                                <div class="text-center text-gray-400 py-4"><i class="fas fa-spinner fa-spin mr-2"></i>読み込み中...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab: Debates -->
            <div id="tab-debates" class="tab-content hidden">
                <div class="dev-card">
                    <div class="panel-title"><i class="fas fa-comments"></i>ディベート管理</div>
                    <div id="debates-list" class="space-y-2">
                        <div class="text-center text-gray-400 py-8"><i class="fas fa-spinner fa-spin mr-2"></i>読み込み中...</div>
                    </div>
                </div>
            </div>

            <!-- Tab: System -->
            <div id="tab-system" class="tab-content hidden">
                <div class="dev-card">
                    <div class="panel-title"><i class="fas fa-tools"></i>システム操作</div>
                    <div class="grid md:grid-cols-2 gap-4">
                        <button class="action-btn btn-danger w-full py-4" onclick="deleteAllArchives()">
                            <i class="fas fa-trash-alt mr-2"></i>アーカイブ全削除
                        </button>
                        <button class="action-btn btn-add-credits w-full py-4" onclick="loadSystemStats()">
                            <i class="fas fa-chart-bar mr-2"></i>システム統計更新
                        </button>
                    </div>
                    <div class="mt-6">
                        <div class="panel-title"><i class="fas fa-terminal"></i>コマンド実行</div>
                        <div class="flex gap-3">
                            <input class="search-input flex-1" id="sys-cmd" placeholder="コマンドを入力... (例: !s-5, !@user+coin500)">
                            <button class="tab-btn" onclick="execSysCmd()"><i class="fas fa-play mr-1"></i>実行</button>
                        </div>
                        <div id="sys-cmd-result" class="mt-3 p-3 bg-black/60 border border-gray-700 rounded font-mono text-sm text-gray-400 hidden min-h-10"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    const currentDev = { user_id: '${userData.user_id}' };
    let allUsers = [];

    function showNotif(msg, type = 'success') {
        const el = document.getElementById('notif');
        el.textContent = msg;
        el.className = 'notification show ' + type;
        setTimeout(() => el.classList.remove('show'), 3500);
    }

    function switchTab(tab, btn) {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        document.getElementById('tab-' + tab).classList.remove('hidden');
        btn.classList.add('active');
        if (tab === 'users') loadUsers();
        if (tab === 'dev-management') loadDevUsers();
        if (tab === 'credits') loadRecentTransactions();
        if (tab === 'debates') loadDebates();
    }

    async function loadSystemStats() {
        try {
            const res = await fetch('/api/admin/stats');
            if (!res.ok) return;
            const data = await res.json();
            if (data.success) {
                document.getElementById('stat-users').textContent = data.stats.total_users.toLocaleString();
                document.getElementById('stat-debates').textContent = data.stats.total_debates.toLocaleString();
                document.getElementById('stat-posts').textContent = data.stats.total_posts.toLocaleString();
                document.getElementById('stat-archives').textContent = data.stats.total_archives.toLocaleString();
            }
        } catch(e) {}
    }

    async function loadUsers() {
        const list = document.getElementById('user-list');
        list.innerHTML = '<div class="text-center text-gray-400 py-4"><i class="fas fa-spinner fa-spin mr-2"></i>読み込み中...</div>';
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (!data.success) { list.innerHTML = '<div class="text-red-400 p-4">読み込み失敗</div>'; return; }
            allUsers = data.users || [];
            renderUsers(allUsers);
        } catch(e) {
            list.innerHTML = '<div class="text-red-400 p-4">エラーが発生しました</div>';
        }
    }

    function filterUsers() {
        const q = document.getElementById('user-search').value.toLowerCase();
        const filtered = allUsers.filter(u => 
            u.user_id.toLowerCase().includes(q) ||
            (u.email||'').toLowerCase().includes(q) ||
            (u.username||'').toLowerCase().includes(q)
        );
        renderUsers(filtered);
    }

    function renderUsers(users) {
        const list = document.getElementById('user-list');
        if (!users.length) { list.innerHTML = '<div class="text-gray-400 p-4 text-center">ユーザーが見つかりません</div>'; return; }
        list.innerHTML = users.map(u => {
            const lastAccess = u.last_access_at ? formatTime(u.last_access_at) : '未記録';
            const isBanned = u.is_banned;
            const isPostBan = u.post_ban;
            const isDebateBan = u.debate_ban;
            const isCreditFreeze = u.credit_freeze;
            const hasRestriction = isPostBan || isDebateBan || isCreditFreeze;
            return \`
            <div class="user-row \${isBanned ? 'opacity-60' : ''}" style="\${isBanned ? 'border-color:rgba(239,68,68,0.5);background:rgba(239,68,68,0.05);' : hasRestriction ? 'border-color:rgba(251,191,36,0.4);background:rgba(251,191,36,0.03);' : ''}">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                    <div style="flex:1;min-width:0;">
                        <div class="font-bold text-cyan-300 flex items-center gap-2 flex-wrap">
                            @\${escHtml(u.user_id)}
                            \${u.is_dev ? '<span class=\\"dev-badge-pill\\"><i class=\\"fas fa-crown mr-1\\"></i>DEV</span>' : ''}
                            \${isBanned ? '<span style=\\"background:rgba(239,68,68,0.2);color:#f87171;border:1px solid #ef4444;border-radius:8px;padding:2px 8px;font-size:11px;font-weight:700;\\"><i class=\\"fas fa-ban mr-1\\"></i>BAN</span>' : ''}
                            \${isPostBan ? '<span style=\\"background:rgba(251,191,36,0.2);color:#fbbf24;border:1px solid #f59e0b;border-radius:8px;padding:2px 8px;font-size:11px;font-weight:700;\\"><i class=\\"fas fa-comment-slash mr-1\\"></i>投稿禁</span>' : ''}
                            \${isDebateBan ? '<span style=\\"background:rgba(249,115,22,0.2);color:#fb923c;border:1px solid #f97316;border-radius:8px;padding:2px 8px;font-size:11px;font-weight:700;\\"><i class=\\"fas fa-gavel mr-1\\"></i>議論禁</span>' : ''}
                            \${isCreditFreeze ? '<span style=\\"background:rgba(99,102,241,0.2);color:#818cf8;border:1px solid #6366f1;border-radius:8px;padding:2px 8px;font-size:11px;font-weight:700;\\"><i class=\\"fas fa-snowflake mr-1\\"></i>凍結</span>' : ''}
                        </div>
                        <div class="text-xs text-gray-400">\${escHtml(u.email||'')} · \${escHtml(u.username||'')}</div>
                        <div class="text-xs text-gray-500">\${Number(u.credits||0).toLocaleString()} Credits · 登録: \${(u.created_at||'').slice(0,10)}</div>
                        <div class="text-xs text-gray-600"><i class="fas fa-clock mr-1"></i>最終アクセス: \${lastAccess}</div>
                        \${isBanned && u.ban_reason ? '<div class="text-xs text-red-400 mt-1"><i class="fas fa-ban mr-1"></i>' + escHtml(u.ban_reason) + '</div>' : ''}
                        \${hasRestriction && u.restriction_reason ? '<div class="text-xs text-yellow-500 mt-1"><i class="fas fa-exclamation-triangle mr-1"></i>' + escHtml(u.restriction_reason) + '</div>' : ''}
                    </div>
                </div>
                <div class="flex gap-1 flex-shrink-0 flex-wrap justify-end" style="max-width:340px;">
                    \${u.is_dev
                        ? \`<button class="action-btn btn-revoke-dev" onclick="revokeDevRole('\${escHtml(u.user_id)}')"><i class="fas fa-crown mr-1"></i>dev剥奪</button>\`
                        : \`<button class="action-btn btn-grant-dev" onclick="quickGrantDev('\${escHtml(u.user_id)}')"><i class="fas fa-crown mr-1"></i>dev</button>\`
                    }
                    <button class="action-btn btn-add-credits" onclick="quickAddCredits('\${escHtml(u.user_id)}')"><i class="fas fa-coins mr-1"></i>付与</button>
                    \${isBanned
                        ? \`<button class="action-btn" style="background:rgba(34,197,94,0.15);border-color:#22c55e;color:#22c55e;" onclick="applyRestriction('\${escHtml(u.user_id)}','unban')"><i class="fas fa-unlock mr-1"></i>BAN解除</button>\`
                        : \`<button class="action-btn btn-danger" onclick="applyRestriction('\${escHtml(u.user_id)}','ban')"><i class="fas fa-ban mr-1"></i>BAN</button>\`
                    }
                    \${isPostBan
                        ? \`<button class="action-btn" style="background:rgba(34,197,94,0.1);border-color:#22c55e;color:#86efac;font-size:11px;" onclick="applyRestriction('\${escHtml(u.user_id)}','post_unban')"><i class="fas fa-comment mr-1"></i>投稿解除</button>\`
                        : \`<button class="action-btn" style="background:rgba(251,191,36,0.1);border-color:#f59e0b;color:#fbbf24;font-size:11px;" onclick="applyRestriction('\${escHtml(u.user_id)}','post_ban')"><i class="fas fa-comment-slash mr-1"></i>投稿禁</button>\`
                    }
                    \${isDebateBan
                        ? \`<button class="action-btn" style="background:rgba(34,197,94,0.1);border-color:#22c55e;color:#86efac;font-size:11px;" onclick="applyRestriction('\${escHtml(u.user_id)}','debate_unban')"><i class="fas fa-comments mr-1"></i>議論解除</button>\`
                        : \`<button class="action-btn" style="background:rgba(249,115,22,0.1);border-color:#f97316;color:#fb923c;font-size:11px;" onclick="applyRestriction('\${escHtml(u.user_id)}','debate_ban')"><i class="fas fa-gavel mr-1"></i>議論禁</button>\`
                    }
                    \${isCreditFreeze
                        ? \`<button class="action-btn" style="background:rgba(34,197,94,0.1);border-color:#22c55e;color:#86efac;font-size:11px;" onclick="applyRestriction('\${escHtml(u.user_id)}','credit_unfreeze')"><i class="fas fa-fire mr-1"></i>凍結解除</button>\`
                        : \`<button class="action-btn" style="background:rgba(99,102,241,0.1);border-color:#6366f1;color:#818cf8;font-size:11px;" onclick="applyRestriction('\${escHtml(u.user_id)}','credit_freeze')"><i class="fas fa-snowflake mr-1"></i>凍結</button>\`
                    }
                    <button class="action-btn" style="background:rgba(139,92,246,0.15);border-color:#8b5cf6;color:#a78bfa;" onclick="sendNotif('\${escHtml(u.user_id)}')"><i class="fas fa-bell mr-1"></i>通知</button>
                </div>
            </div>
            \`;
        }).join('');
    }

    async function loadDevUsers() {
        const list = document.getElementById('dev-users-list');
        list.innerHTML = '<div class="text-center text-gray-400 py-4"><i class="fas fa-spinner fa-spin mr-2"></i>読み込み中...</div>';
        try {
            const res = await fetch('/api/admin/dev-users');
            const data = await res.json();
            if (!data.success || !data.users.length) {
                list.innerHTML = '<div class="text-gray-400 p-4 text-center">dev権限ユーザーが見つかりません</div>';
                return;
            }
            list.innerHTML = data.users.map(u => \`
                <div class="user-row">
                    <div>
                        <div class="font-bold text-yellow-300 flex items-center gap-2">
                            <i class="fas fa-crown text-yellow-400"></i> @\${escHtml(u.user_id)}
                            <span class="dev-badge-pill">DEV</span>
                        </div>
                        <div class="text-xs text-gray-400">\${escHtml(u.email||'')} · \${escHtml(u.username||'')}</div>
                        \${u.granted_by ? '<div class="text-xs text-gray-500">付与者: @' + escHtml(u.granted_by) + '</div>' : '<div class="text-xs text-gray-500">オリジナルdev</div>'}
                    </div>
                    \${u.user_id !== currentDev.user_id ? \`<button class="action-btn btn-revoke-dev" onclick="revokeDevRole('\${escHtml(u.user_id)}')"><i class="fas fa-ban mr-1"></i>dev権限剥奪</button>\` : ''}
                </div>
            \`).join('');
        } catch(e) {
            list.innerHTML = '<div class="text-red-400 p-4">エラーが発生しました</div>';
        }
    }

    async function grantDevRole() {
        const userId = document.getElementById('grant-user-id').value.trim();
        if (!userId) { showNotif('ユーザーIDを入力してください', 'error'); return; }
        if (!confirm(\`@\${userId} にdev権限を付与しますか？\`)) return;
        try {
            const res = await fetch('/api/admin/dev-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target_user_id: userId, action: 'grant' })
            });
            const data = await res.json();
            if (data.success) {
                showNotif(\`✅ @\${userId} にdev権限を付与しました\`);
                document.getElementById('grant-user-id').value = '';
                loadDevUsers();
            } else {
                showNotif(data.error || '失敗しました', 'error');
            }
        } catch(e) { showNotif('エラーが発生しました', 'error'); }
    }

    async function quickGrantDev(userId) {
        if (!confirm(\`@\${userId} にdev権限を付与しますか？\`)) return;
        try {
            const res = await fetch('/api/admin/dev-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target_user_id: userId, action: 'grant' })
            });
            const data = await res.json();
            if (data.success) { showNotif(\`✅ @\${userId} にdev権限を付与しました\`); loadUsers(); }
            else showNotif(data.error || '失敗しました', 'error');
        } catch(e) { showNotif('エラーが発生しました', 'error'); }
    }

    async function revokeDevRole(userId) {
        if (!confirm(\`@\${userId} のdev権限を剥奪しますか？\`)) return;
        try {
            const res = await fetch('/api/admin/dev-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target_user_id: userId, action: 'revoke' })
            });
            const data = await res.json();
            if (data.success) { showNotif(\`✅ @\${userId} のdev権限を剥奪しました\`); loadDevUsers(); loadUsers(); }
            else showNotif(data.error || '失敗しました', 'error');
        } catch(e) { showNotif('エラーが発生しました', 'error'); }
    }

    function quickAddCredits(userId) {
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        document.getElementById('tab-credits').classList.remove('hidden');
        document.querySelector('[data-tab=credits]').classList.add('active');
        document.getElementById('credit-user-id').value = userId;
        loadRecentTransactions();
    }

    async function grantCredits() {
        const userId = document.getElementById('credit-user-id').value.trim();
        const amount = parseInt(document.getElementById('credit-amount').value, 10);
        const reason = document.getElementById('credit-reason').value.trim() || 'admin_grant';
        if (!userId || isNaN(amount) || amount <= 0) { showNotif('ユーザーIDと正しいクレジット数を入力してください', 'error'); return; }
        if (!confirm(\`@\${userId} に \${amount.toLocaleString()} クレジットを付与しますか？\`)) return;
        try {
            const res = await fetch('/api/admin/credits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target_user_id: userId, amount, reason })
            });
            const data = await res.json();
            if (data.success) {
                showNotif(\`✅ @\${userId} に \${amount.toLocaleString()} クレジットを付与しました\`);
                document.getElementById('credit-amount').value = '';
                loadRecentTransactions();
            } else showNotif(data.error || '失敗しました', 'error');
        } catch(e) { showNotif('エラーが発生しました', 'error'); }
    }

    async function loadRecentTransactions() {
        const list = document.getElementById('recent-transactions');
        list.innerHTML = '<div class="text-center text-gray-400 py-2"><i class="fas fa-spinner fa-spin"></i></div>';
        try {
            const res = await fetch('/api/admin/transactions');
            const data = await res.json();
            if (!data.success || !data.transactions.length) { list.innerHTML = '<div class="text-gray-400 text-sm p-2">取引なし</div>'; return; }
            list.innerHTML = data.transactions.map(t => \`
                <div class="flex justify-between text-sm py-1 border-b border-gray-800">
                    <span class="text-gray-300">@\${escHtml(t.user_id)}</span>
                    <span class="\${t.amount > 0 ? 'text-green-400' : 'text-red-400'}">\${t.amount > 0 ? '+' : ''}\${t.amount.toLocaleString()}</span>
                    <span class="text-gray-500 text-xs">\${(t.created_at||'').slice(0,10)}</span>
                </div>
            \`).join('');
        } catch(e) { list.innerHTML = '<div class="text-red-400 text-sm p-2">エラー</div>'; }
    }

    async function loadDebates() {
        const list = document.getElementById('debates-list');
        list.innerHTML = '<div class="text-center text-gray-400 py-8"><i class="fas fa-spinner fa-spin mr-2"></i>読み込み中...</div>';
        try {
            const res = await fetch('/api/admin/debates');
            const data = await res.json();
            if (!data.success || !data.debates.length) { list.innerHTML = '<div class="text-gray-400 p-4 text-center">ディベートなし</div>'; return; }
            list.innerHTML = data.debates.map(d => \`
                <div class="user-row">
                    <div class="flex-1 min-w-0">
                        <div class="font-bold text-cyan-300 truncate">\${escHtml(d.theme||d.title||'')}</div>
                        <div class="text-xs text-gray-400">\${d.status} · \${(d.created_at||'').slice(0,10)} · ID: \${d.id}</div>
                    </div>
                    <div class="text-xs text-gray-400 flex-shrink-0">
                        \${d.status === 'live' ? '<span class="text-green-400 font-bold">LIVE</span>' : d.status === 'completed' ? '<span class="text-blue-400">完了</span>' : '<span class="text-gray-400">予定</span>'}
                    </div>
                </div>
            \`).join('');
        } catch(e) { list.innerHTML = '<div class="text-red-400 p-4">エラーが発生しました</div>'; }
    }

    async function deleteAllArchives() {
        if (!confirm('すべてのアーカイブを削除しますか？この操作は元に戻せません。')) return;
        try {
            const res = await fetch('/api/archive/all', { method: 'DELETE' });
            const data = await res.json();
            if (data.success) showNotif('✅ アーカイブを全削除しました');
            else showNotif(data.error || '失敗しました', 'error');
        } catch(e) { showNotif('エラーが発生しました', 'error'); }
    }

    async function execSysCmd() {
        const cmd = document.getElementById('sys-cmd').value.trim();
        if (!cmd) return;
        const resultEl = document.getElementById('sys-cmd-result');
        resultEl.classList.remove('hidden');
        resultEl.textContent = '実行中...';
        try {
            const res = await fetch('/api/commands/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: cmd, source: 'dashboard' })
            });
            const data = await res.json();
            resultEl.style.color = data.success ? '#22c55e' : '#ef4444';
            resultEl.textContent = data.success ? '✅ ' + (data.message || 'コマンド実行完了') : '❌ ' + (data.error || '失敗');
        } catch(e) { resultEl.style.color = '#ef4444'; resultEl.textContent = '❌ エラーが発生しました'; }
    }

    function escHtml(s) {
        return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function formatTime(ts) {
        if (!ts) return '未記録';
        try {
            const d = new Date(ts.includes('Z') ? ts : ts + 'Z');
            const now = new Date();
            const diff = Math.floor((now - d) / 1000);
            if (diff < 60) return '今';
            if (diff < 3600) return Math.floor(diff/60) + '分前';
            if (diff < 86400) return Math.floor(diff/3600) + '時間前';
            if (diff < 86400 * 7) return Math.floor(diff/86400) + '日前';
            return d.toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo', year:'numeric', month:'numeric', day:'numeric' });
        } catch(e) { return ts.slice(0,16); }
    }

    async function toggleBan(userId, doBan) {
        return applyRestriction(userId, doBan ? 'ban' : 'unban');
    }

    const restrictionLabels = {
        ban: { label: 'BAN', msg: 'BANしますか？', done: 'BANしました', needReason: true },
        unban: { label: 'BAN解除', msg: 'BANを解除しますか？', done: 'BAN解除しました', needReason: false },
        post_ban: { label: '投稿禁止', msg: '投稿機能を制限しますか？', done: '投稿禁止にしました', needReason: true },
        post_unban: { label: '投稿制限解除', msg: '投稿制限を解除しますか？', done: '投稿制限解除しました', needReason: false },
        debate_ban: { label: 'ディベート禁止', msg: 'ディベート参加を禁止しますか？', done: 'ディベート禁止にしました', needReason: true },
        debate_unban: { label: 'ディベート制限解除', msg: 'ディベート制限を解除しますか？', done: 'ディベート制限解除しました', needReason: false },
        credit_freeze: { label: 'クレジット凍結', msg: 'クレジットを凍結しますか？', done: 'クレジット凍結しました', needReason: true },
        credit_unfreeze: { label: 'クレジット凍結解除', msg: 'クレジット凍結を解除しますか？', done: 'クレジット凍結解除しました', needReason: false },
    };

    // ── 制限モーダル ──
    let _restrictTarget = null;
    let _restrictAction = null;

    function applyRestriction(userId, action) {
        const info = restrictionLabels[action];
        if (!info) return;
        _restrictTarget = userId;
        _restrictAction = action;
        const modal = document.getElementById('restrictModal');
        const title = document.getElementById('restrictModalTitle');
        const reasonRow = document.getElementById('restrictReasonRow');
        const daysRow = document.getElementById('restrictDaysRow');
        const permanentRow = document.getElementById('restrictPermanentRow');
        title.textContent = \`@\${userId} を「\${info.label}」\`;
        (document.getElementById('restrictReason') as HTMLInputElement).value = '';
        (document.getElementById('restrictDays') as HTMLInputElement).value = '7';
        (document.getElementById('restrictDaysNum') as HTMLInputElement).value = '7';
        (document.getElementById('restrictPermanent') as HTMLInputElement).checked = false;
        updateDaysDisplay();
        if (info.needReason) {
            reasonRow.style.display = 'block';
            daysRow.style.display = 'block';
            permanentRow.style.display = 'block';
        } else {
            reasonRow.style.display = 'none';
            daysRow.style.display = 'none';
            permanentRow.style.display = 'none';
        }
        modal.style.display = 'flex';
    }

    function updateDaysDisplay() {
        const isPerm = document.getElementById('restrictPermanent').checked;
        const daysInput = document.getElementById('restrictDays') as HTMLInputElement;
        const daysNumInput = document.getElementById('restrictDaysNum') as HTMLInputElement;
        const daysLabel = document.getElementById('restrictDaysLabel');
        daysInput.disabled = isPerm;
        daysNumInput.disabled = isPerm;
        daysInput.style.opacity = isPerm ? '0.4' : '1';
        daysNumInput.style.opacity = isPerm ? '0.4' : '1';
        if (isPerm) { daysLabel.textContent = '永久制限'; daysLabel.style.color = '#f87171'; }
        else {
            const d = parseInt(daysInput.value) || 7;
            daysNumInput.value = String(d);
            daysLabel.textContent = d + '日間';
            daysLabel.style.color = '#fbbf24';
        }
    }

    function syncSliderFromNum() {
        const num = parseInt((document.getElementById('restrictDaysNum') as HTMLInputElement).value) || 1;
        const clamped = Math.min(365, Math.max(1, num));
        (document.getElementById('restrictDays') as HTMLInputElement).value = String(clamped);
        (document.getElementById('restrictDaysNum') as HTMLInputElement).value = String(clamped);
        const daysLabel = document.getElementById('restrictDaysLabel');
        daysLabel.textContent = clamped + '日間';
        daysLabel.style.color = '#fbbf24';
    }

    function setDaysPreset(d) {
        (document.getElementById('restrictDays') as HTMLInputElement).value = String(d);
        (document.getElementById('restrictDaysNum') as HTMLInputElement).value = String(d);
        updateDaysDisplay();
    }

    async function confirmRestriction() {
        const info = restrictionLabels[_restrictAction];
        const reason = (document.getElementById('restrictReason') as HTMLInputElement).value.trim();
        const isPerm = (document.getElementById('restrictPermanent') as HTMLInputElement).checked;
        const days = isPerm ? 0 : (parseInt((document.getElementById('restrictDays') as HTMLInputElement).value) || 7);
        if (info.needReason && !reason) { showNotif('理由を入力してください', 'error'); return; }
        document.getElementById('restrictModal').style.display = 'none';
        try {
            const res = await fetch('/api/admin/ban', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target_user_id: _restrictTarget, action: _restrictAction, reason, days })
            });
            const data = await res.json();
            if (data.success) {
                const durationText = days === 0 ? '永久' : days + '日間';
                showNotif(\`✅ @\${_restrictTarget} を\${info.done}（\${info.needReason ? durationText : ''}）\`);
                loadUsers();
            } else showNotif(data.error || '失敗', 'error');
        } catch(e) { showNotif('エラー', 'error'); }
    }

    function closeRestrictModal() { document.getElementById('restrictModal').style.display = 'none'; }

    async function sendNotif(userId) {
        const title = prompt('通知タイトル:');
        if (!title) return;
        const body = prompt('通知内容:');
        if (!body) return;
        const typeOpt = prompt('タイプ (info/warning/success/credit):', 'info') || 'info';
        try {
            const res = await fetch('/api/admin/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target_user_id: userId, title, body, type: typeOpt })
            });
            const data = await res.json();
            if (data.success) showNotif(\`✅ @\${userId} に通知を送信しました\`);
            else showNotif(data.error || '失敗', 'error');
        } catch(e) { showNotif('エラー', 'error'); }
    }

    // Init
    loadSystemStats();
    loadUsers();
    </script>

    <!-- 制限モーダル -->
    <div id="restrictModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999;align-items:center;justify-content:center;backdrop-filter:blur(6px);">
        <div style="background:linear-gradient(135deg,rgba(0,20,40,0.98),rgba(30,0,50,0.98));border:2px solid rgba(239,68,68,0.6);border-radius:16px;padding:28px;width:90%;max-width:460px;box-shadow:0 0 40px rgba(239,68,68,0.3);">
            <div class="flex items-center gap-3 mb-5">
                <i class="fas fa-ban text-red-400 text-2xl"></i>
                <h3 id="restrictModalTitle" class="text-lg font-bold text-white"></h3>
            </div>
            <div id="restrictReasonRow" class="mb-4">
                <label class="text-xs text-gray-400 mb-1 block"><i class="fas fa-comment mr-1"></i>制限理由 <span class="text-red-400">*必須</span></label>
                <textarea id="restrictReason" rows="2" placeholder="例: 規約違反（スパム行為）" style="width:100%;background:rgba(0,0,0,0.5);border:1px solid rgba(239,68,68,0.4);border-radius:8px;padding:10px;color:#fff;font-size:14px;resize:none;outline:none;"></textarea>
            </div>
            <div id="restrictPermanentRow" class="mb-3">
                <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
                    <input type="checkbox" id="restrictPermanent" onchange="updateDaysDisplay()" style="width:18px;height:18px;accent-color:#ef4444;">
                    <span class="text-sm font-bold text-red-300"><i class="fas fa-infinity mr-1"></i>永久制限</span>
                </label>
            </div>
            <div id="restrictDaysRow" class="mb-5">
                <label class="text-xs text-gray-400 mb-2 block"><i class="fas fa-calendar mr-1"></i>制限期間</label>
                <div class="flex items-center gap-3 mb-2">
                    <input type="range" id="restrictDays" min="1" max="365" value="7" oninput="(document.getElementById('restrictDaysNum').value=this.value,updateDaysDisplay())" style="flex:1;accent-color:#06b6d4;height:6px;">
                    <input type="number" id="restrictDaysNum" min="1" max="365" value="7" onchange="syncSliderFromNum()" style="width:70px;background:rgba(0,0,0,0.5);border:1px solid rgba(6,182,212,0.4);border-radius:8px;padding:6px 8px;color:#fff;font-size:14px;font-weight:700;text-align:center;outline:none;">
                    <span id="restrictDaysLabel" class="text-yellow-400 font-bold text-sm w-16 text-right">7日間</span>
                </div>
                <div class="flex gap-2 mt-2 flex-wrap">
                    <button onclick="setDaysPreset(1)" style="padding:4px 10px;font-size:11px;border-radius:6px;background:rgba(6,182,212,0.15);border:1px solid rgba(6,182,212,0.4);color:#67e8f9;cursor:pointer;">1日</button>
                    <button onclick="setDaysPreset(3)" style="padding:4px 10px;font-size:11px;border-radius:6px;background:rgba(6,182,212,0.15);border:1px solid rgba(6,182,212,0.4);color:#67e8f9;cursor:pointer;">3日</button>
                    <button onclick="setDaysPreset(7)" style="padding:4px 10px;font-size:11px;border-radius:6px;background:rgba(6,182,212,0.15);border:1px solid rgba(6,182,212,0.4);color:#67e8f9;cursor:pointer;">1週</button>
                    <button onclick="setDaysPreset(14)" style="padding:4px 10px;font-size:11px;border-radius:6px;background:rgba(6,182,212,0.15);border:1px solid rgba(6,182,212,0.4);color:#67e8f9;cursor:pointer;">2週</button>
                    <button onclick="setDaysPreset(30)" style="padding:4px 10px;font-size:11px;border-radius:6px;background:rgba(234,179,8,0.15);border:1px solid rgba(234,179,8,0.4);color:#fde047;cursor:pointer;">30日</button>
                    <button onclick="setDaysPreset(90)" style="padding:4px 10px;font-size:11px;border-radius:6px;background:rgba(234,179,8,0.15);border:1px solid rgba(234,179,8,0.4);color:#fde047;cursor:pointer;">90日</button>
                    <button onclick="setDaysPreset(365)" style="padding:4px 10px;font-size:11px;border-radius:6px;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.4);color:#fca5a5;cursor:pointer;">1年</button>
                </div>
            </div>
            <div class="flex gap-3">
                <button onclick="confirmRestriction()" style="flex:1;padding:12px;background:linear-gradient(135deg,rgba(239,68,68,0.3),rgba(220,38,38,0.3));border:2px solid #ef4444;border-radius:10px;color:#fca5a5;font-weight:700;font-size:15px;cursor:pointer;">
                    <i class="fas fa-check mr-2"></i>制限を適用
                </button>
                <button onclick="closeRestrictModal()" style="padding:12px 20px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.2);border-radius:10px;color:#9ca3af;font-weight:700;cursor:pointer;">
                    <i class="fas fa-times mr-1"></i>キャンセル
                </button>
            </div>
        </div>
    </div>
</body>
</html>`;
