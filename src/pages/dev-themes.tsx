import { globalNav } from '../components/global-nav';

export const devThemesPage = (user: any) => `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <title>テーマ管理 - Dev</title>
    <meta name="robots" content="noindex, nofollow">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/styles.css" rel="stylesheet">
    <style>
        .dev-card { background: linear-gradient(135deg, rgba(0,20,40,0.9), rgba(20,0,40,0.9)); border: 1px solid rgba(0,255,255,0.25); border-radius: 14px; padding: 24px; }
        .dev-input { background: rgba(0,20,40,0.8); border: 1px solid rgba(0,255,255,0.3); border-radius: 8px; padding: 10px 14px; color: #e5e7eb; width: 100%; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .dev-input:focus { border-color: #06b6d4; box-shadow: 0 0 8px rgba(6,182,212,0.3); }
        .dev-btn { padding: 9px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; border: none; }
        .btn-cyan  { background: rgba(6,182,212,0.25); border: 1px solid #06b6d4; color: #67e8f9; }
        .btn-cyan:hover  { background: rgba(6,182,212,0.4); }
        .btn-green { background: rgba(34,197,94,0.25); border: 1px solid #22c55e; color: #86efac; }
        .btn-green:hover { background: rgba(34,197,94,0.4); }
        .btn-red   { background: rgba(239,68,68,0.2); border: 1px solid #ef4444; color: #fca5a5; }
        .btn-red:hover   { background: rgba(239,68,68,0.35); }
        .btn-yellow{ background: rgba(234,179,8,0.2); border: 1px solid #eab308; color: #fde047; }
        .btn-yellow:hover{ background: rgba(234,179,8,0.35); }
        .status-badge { font-size: 11px; padding: 2px 8px; border-radius: 20px; font-weight: 700; }
        .status-active   { background: rgba(34,197,94,0.2); color: #86efac; border: 1px solid rgba(34,197,94,0.4); }
        .status-pending  { background: rgba(234,179,8,0.2); color: #fde047; border: 1px solid rgba(234,179,8,0.4); }
        .status-live     { background: rgba(239,68,68,0.2); color: #fca5a5; border: 1px solid rgba(239,68,68,0.4); }
        .status-upcoming { background: rgba(6,182,212,0.2); color: #67e8f9; border: 1px solid rgba(6,182,212,0.4); }
        .status-completed{ background: rgba(107,114,128,0.2); color: #9ca3af; border: 1px solid rgba(107,114,128,0.4); }
        .tab-btn { padding: 8px 22px; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 14px; transition: all 0.25s; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: #9ca3af; }
        .tab-btn.active { background: rgba(6,182,212,0.2); border-color: #06b6d4; color: #fff; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center; }
        .modal-box { background: #0a1628; border: 1px solid rgba(0,255,255,0.3); border-radius: 16px; padding: 28px; width: 90%; max-width: 500px; }
    </style>
</head>
<body class="bg-black text-white">
    ${globalNav(user)}

    <div class="min-h-screen pt-20 pb-12">
        <div class="cyber-grid"></div>
        <div class="container mx-auto px-4 max-w-5xl relative z-10">

            <!-- Header -->
            <div class="flex items-center gap-3 mb-6 pt-2">
                <i class="fas fa-cogs text-cyan-400 text-2xl"></i>
                <h1 class="text-2xl font-black cyber-text">テーマ管理 <span class="text-sm text-cyan-400 font-normal ml-2">[DEV]</span></h1>
            </div>

            <!-- Tabs -->
            <div class="flex gap-3 mb-6" id="mainTabs">
                <button class="tab-btn active" onclick="switchTab('themes')">
                    <i class="fas fa-list mr-1"></i>テーマ一覧
                </button>
                <button class="tab-btn" onclick="switchTab('schedule')">
                    <i class="fas fa-calendar mr-1"></i>スケジュール
                </button>
                <button class="tab-btn" onclick="switchTab('debates')">
                    <i class="fas fa-tv mr-1"></i>ディベート管理
                </button>
            </div>

            <!-- ===================== TAB: THEMES ===================== -->
            <div id="tab-themes">
                <!-- Add Theme -->
                <div class="dev-card mb-5">
                    <h2 class="text-lg font-bold text-cyan-300 mb-4"><i class="fas fa-plus mr-2"></i>テーマ追加</h2>
                    <div class="grid grid-cols-1 gap-3">
                        <input id="newTitle" class="dev-input" placeholder="テーマタイトル（例：AIは人類の脅威になるか）">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input id="newAgree" class="dev-input" placeholder="賛成側の主張">
                            <input id="newDisagree" class="dev-input" placeholder="反対側の主張">
                        </div>
                        <div class="flex gap-3">
                            <button class="dev-btn btn-green flex-1" onclick="addTheme()">
                                <i class="fas fa-plus mr-1"></i>追加
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Theme List -->
                <div class="dev-card">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-bold text-cyan-300"><i class="fas fa-list mr-2"></i>テーマ一覧</h2>
                        <button class="dev-btn btn-cyan" onclick="loadData()"><i class="fas fa-sync mr-1"></i>更新</button>
                    </div>
                    <div id="themesList" class="space-y-3">
                        <div class="text-gray-500 text-sm text-center py-6">読み込み中...</div>
                    </div>
                </div>
            </div>

            <!-- ===================== TAB: SCHEDULE ===================== -->
            <div id="tab-schedule" style="display:none">
                <div class="dev-card mb-5">
                    <h2 class="text-lg font-bold text-cyan-300 mb-4"><i class="fas fa-calendar-plus mr-2"></i>ディベートをスケジュール</h2>
                    <div class="grid grid-cols-1 gap-4">
                        <div>
                            <label class="text-xs text-gray-400 mb-1 block">テーマ選択（またはカスタム入力）</label>
                            <select id="schedThemeId" class="dev-input" onchange="onThemeSelect()">
                                <option value="">▼ テーマから選択</option>
                            </select>
                        </div>
                        <div id="customThemeFields">
                            <div class="grid grid-cols-1 gap-3">
                                <input id="schedTitle" class="dev-input" placeholder="テーマタイトル（手動入力）">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input id="schedAgree" class="dev-input" placeholder="賛成側の主張">
                                    <input id="schedDisagree" class="dev-input" placeholder="反対側の主張">
                                </div>
                            </div>
                        </div>
                        <div>
                            <label class="text-xs text-gray-400 mb-1 block">開始時間</label>
                            <div class="grid grid-cols-2 gap-3">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="startMode" value="now" checked onchange="updateStartMode()">
                                    <span class="text-sm">今すぐ開始</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="startMode" value="schedule" onchange="updateStartMode()">
                                    <span class="text-sm">日時指定</span>
                                </label>
                            </div>
                            <div id="scheduleDateField" style="display:none" class="mt-3">
                                <input type="datetime-local" id="schedDateTime" class="dev-input">
                            </div>
                        </div>
                        <button class="dev-btn btn-cyan w-full" onclick="scheduleDebate()">
                            <i class="fas fa-rocket mr-1"></i>スケジュール登録
                        </button>
                    </div>
                </div>
            </div>

            <!-- ===================== TAB: DEBATES ===================== -->
            <div id="tab-debates" style="display:none">
                <div class="dev-card">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-bold text-cyan-300"><i class="fas fa-tv mr-2"></i>ディベート一覧</h2>
                        <button class="dev-btn btn-cyan" onclick="loadData()"><i class="fas fa-sync mr-1"></i>更新</button>
                    </div>
                    <div id="debatesList" class="space-y-3">
                        <div class="text-gray-500 text-sm text-center py-6">読み込み中...</div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- Edit Modal -->
    <div id="editModal" class="modal-overlay" style="display:none">
        <div class="modal-box">
            <h3 class="text-lg font-bold text-cyan-300 mb-4"><i class="fas fa-edit mr-2"></i>テーマ編集</h3>
            <input type="hidden" id="editId">
            <div class="grid grid-cols-1 gap-3 mb-4">
                <input id="editTitle" class="dev-input" placeholder="テーマタイトル">
                <input id="editAgree" class="dev-input" placeholder="賛成側の主張">
                <input id="editDisagree" class="dev-input" placeholder="反対側の主張">
                <select id="editStatus" class="dev-input">
                    <option value="active">active（有効）</option>
                    <option value="pending">pending（審査中）</option>
                    <option value="rejected">rejected（却下）</option>
                </select>
            </div>
            <div class="flex gap-3">
                <button class="dev-btn btn-green flex-1" onclick="saveEdit()"><i class="fas fa-save mr-1"></i>保存</button>
                <button class="dev-btn btn-red flex-1" onclick="closeEditModal()"><i class="fas fa-times mr-1"></i>キャンセル</button>
            </div>
        </div>
    </div>

    <div id="toast" style="position:fixed;bottom:20px;right:20px;z-index:9999;display:none" class="px-5 py-3 rounded-xl text-sm font-bold shadow-lg"></div>

    <script>
    let allThemes = [];
    let allDebates = [];

    async function loadData() {
        try {
            const r = await fetch('/api/dev/themes');
            const d = await r.json();
            allThemes = d.themes || [];
            allDebates = d.debates || [];
            renderThemes();
            renderDebates();
            populateScheduleSelect();
        } catch(e) { showToast('データ取得失敗: ' + e.message, 'error'); }
    }

    function renderThemes() {
        const el = document.getElementById('themesList');
        if (!allThemes.length) { el.innerHTML = '<div class="text-gray-500 text-sm text-center py-6">テーマがありません</div>'; return; }
        el.innerHTML = allThemes.map(t => \`
            <div class="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="status-badge status-\${t.status || 'active'}">\${t.status || 'active'}</span>
                        <span class="text-xs text-gray-500">ID:\${t.id}</span>
                    </div>
                    <p class="text-sm font-bold text-white truncate">\${escHtml(t.title)}</p>
                    <p class="text-xs text-green-300 mt-1"><i class="fas fa-check mr-1"></i>\${escHtml(t.agree_opinion||'')}</p>
                    <p class="text-xs text-red-300"><i class="fas fa-times mr-1"></i>\${escHtml(t.disagree_opinion||'')}</p>
                </div>
                <div class="flex gap-2 shrink-0">
                    <button class="dev-btn btn-yellow px-3 py-1 text-xs" onclick="openEditModal(\${t.id})"><i class="fas fa-edit"></i></button>
                    <button class="dev-btn btn-red px-3 py-1 text-xs" onclick="deleteTheme(\${t.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        \`).join('');
    }

    function renderDebates() {
        const el = document.getElementById('debatesList');
        if (!allDebates.length) { el.innerHTML = '<div class="text-gray-500 text-sm text-center py-6">ディベートがありません</div>'; return; }
        el.innerHTML = allDebates.map(d => \`
            <div class="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="status-badge status-\${d.status}">\${d.status}</span>
                        \${d.scheduled_at ? \`<span class="text-xs text-cyan-400"><i class="fas fa-clock mr-1"></i>\${d.scheduled_at}</span>\` : ''}
                    </div>
                    <p class="text-sm font-bold text-white truncate">\${escHtml(d.title||d.topic||'')}</p>
                    <p class="text-xs text-green-300"><i class="fas fa-check mr-1"></i>\${escHtml(d.agree_position||'')}</p>
                    <p class="text-xs text-red-300"><i class="fas fa-times mr-1"></i>\${escHtml(d.disagree_position||'')}</p>
                </div>
                <div class="flex flex-col gap-2 shrink-0">
                    \${d.status !== 'live' ? \`<button class="dev-btn btn-green px-3 py-1 text-xs" onclick="setDebateStatus('\${d.id}','live')"><i class="fas fa-play mr-1"></i>開始</button>\` : ''}
                    \${d.status === 'live' ? \`<button class="dev-btn btn-red px-3 py-1 text-xs" onclick="setDebateStatus('\${d.id}','completed')"><i class="fas fa-stop mr-1"></i>終了</button>\` : ''}
                    \${d.status === 'upcoming' ? \`<button class="dev-btn btn-yellow px-3 py-1 text-xs" onclick="setDebateStatus('\${d.id}','live')"><i class="fas fa-bolt mr-1"></i>即開始</button>\` : ''}
                </div>
            </div>
        \`).join('');
    }

    function populateScheduleSelect() {
        const sel = document.getElementById('schedThemeId');
        const active = allThemes.filter(t => t.status === 'active');
        sel.innerHTML = '<option value="">▼ テーマから選択</option>' +
            active.map(t => \`<option value="\${t.id}">\${escHtml(t.title)}</option>\`).join('');
    }

    function onThemeSelect() {
        const id = document.getElementById('schedThemeId').value;
        const t = allThemes.find(x => x.id == id);
        if (t) {
            document.getElementById('schedTitle').value = t.title;
            document.getElementById('schedAgree').value = t.agree_opinion || '';
            document.getElementById('schedDisagree').value = t.disagree_opinion || '';
        }
    }

    function updateStartMode() {
        const mode = document.querySelector('input[name="startMode"]:checked').value;
        document.getElementById('scheduleDateField').style.display = mode === 'schedule' ? 'block' : 'none';
    }

    async function addTheme() {
        const title = document.getElementById('newTitle').value.trim();
        const agree = document.getElementById('newAgree').value.trim();
        const disagree = document.getElementById('newDisagree').value.trim();
        if (!title || !agree || !disagree) { showToast('全項目を入力してください', 'error'); return; }
        const r = await fetch('/api/dev/themes', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({title, agree_opinion:agree, disagree_opinion:disagree}) });
        const d = await r.json();
        if (d.success) {
            showToast('テーマを追加しました', 'success');
            document.getElementById('newTitle').value = '';
            document.getElementById('newAgree').value = '';
            document.getElementById('newDisagree').value = '';
            loadData();
        } else { showToast('エラー: ' + (d.error||'失敗'), 'error'); }
    }

    function openEditModal(id) {
        const t = allThemes.find(x => x.id == id);
        if (!t) return;
        document.getElementById('editId').value = id;
        document.getElementById('editTitle').value = t.title;
        document.getElementById('editAgree').value = t.agree_opinion || '';
        document.getElementById('editDisagree').value = t.disagree_opinion || '';
        document.getElementById('editStatus').value = t.status || 'active';
        document.getElementById('editModal').style.display = 'flex';
    }

    function closeEditModal() { document.getElementById('editModal').style.display = 'none'; }

    async function saveEdit() {
        const id = document.getElementById('editId').value;
        const title = document.getElementById('editTitle').value.trim();
        const agree = document.getElementById('editAgree').value.trim();
        const disagree = document.getElementById('editDisagree').value.trim();
        const status = document.getElementById('editStatus').value;
        if (!title || !agree || !disagree) { showToast('全項目を入力してください', 'error'); return; }
        const r = await fetch('/api/dev/themes/' + id, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({title, agree_opinion:agree, disagree_opinion:disagree, status}) });
        const d = await r.json();
        if (d.success) { showToast('保存しました', 'success'); closeEditModal(); loadData(); }
        else { showToast('エラー: ' + (d.error||'失敗'), 'error'); }
    }

    async function deleteTheme(id) {
        if (!confirm('このテーマを削除しますか？')) return;
        const r = await fetch('/api/dev/themes/' + id, { method:'DELETE' });
        const d = await r.json();
        if (d.success) { showToast('削除しました', 'success'); loadData(); }
        else { showToast('エラー: ' + (d.error||'失敗'), 'error'); }
    }

    async function scheduleDebate() {
        const themeId = document.getElementById('schedThemeId').value;
        const title = document.getElementById('schedTitle').value.trim();
        const agree = document.getElementById('schedAgree').value.trim();
        const disagree = document.getElementById('schedDisagree').value.trim();
        const mode = document.querySelector('input[name="startMode"]:checked').value;
        const dt = document.getElementById('schedDateTime').value;

        if (!title) { showToast('タイトルを入力またはテーマを選択してください', 'error'); return; }
        const start_at = mode === 'schedule' && dt ? new Date(dt).toISOString().replace('T',' ').substring(0,19) : 'now';

        const payload = { theme_id: themeId || null, title, agree_opinion: agree, disagree_opinion: disagree, start_at };
        const r = await fetch('/api/dev/debates/schedule', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        const d = await r.json();
        if (d.success) {
            showToast(\`スケジュール登録: \${d.status === 'live' ? '今すぐ開始' : d.scheduled_at || '予定済み'}\`, 'success');
            loadData();
        } else { showToast('エラー: ' + (d.error||'失敗'), 'error'); }
    }

    async function setDebateStatus(id, status) {
        const r = await fetch('/api/dev/debates/' + id, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({status}) });
        const d = await r.json();
        if (d.success) { showToast('ステータスを更新しました', 'success'); loadData(); }
        else { showToast('エラー: ' + (d.error||'失敗'), 'error'); }
    }

    function switchTab(name) {
        ['themes','schedule','debates'].forEach(t => {
            document.getElementById('tab-'+t).style.display = t === name ? 'block' : 'none';
        });
        document.querySelectorAll('#mainTabs .tab-btn').forEach((btn, i) => {
            btn.classList.toggle('active', ['themes','schedule','debates'][i] === name);
        });
    }

    function showToast(msg, type='success') {
        const el = document.getElementById('toast');
        el.textContent = msg;
        el.className = 'px-5 py-3 rounded-xl text-sm font-bold shadow-lg ' + (type==='success' ? 'bg-green-700 text-white' : 'bg-red-700 text-white');
        el.style.display = 'block';
        setTimeout(() => { el.style.display = 'none'; }, 3000);
    }

    function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

    loadData();
    </script>
</body>
</html>
`;
