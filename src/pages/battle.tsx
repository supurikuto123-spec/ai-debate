import { globalNav } from '../components/global-nav';

export const battlePage = (user: any) => `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <title>対戦 - AI Debate Arena</title>
    <meta name="robots" content="noindex, nofollow">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/styles.css" rel="stylesheet">
    <style>
        .battle-tab { padding: 10px 26px; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 15px; transition: all 0.3s; background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.1); color: #9ca3af; }
        .battle-tab:hover { background: rgba(6,182,212,0.15); border-color: rgba(6,182,212,0.4); }
        .battle-tab.active { background: rgba(6,182,212,0.25); border-color: #06b6d4; color: #fff; box-shadow: 0 0 20px rgba(6,182,212,0.3); }
        .mode-card { background: linear-gradient(135deg, rgba(0,20,40,0.9), rgba(20,0,40,0.9)); border: 2px solid rgba(0,255,255,0.3); border-radius: 16px; padding: 28px; transition: all 0.3s; }
        .mode-card:hover { border-color: rgba(0,255,255,0.6); transform: translateY(-2px); }
        .stance-btn { flex:1; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.3s; border: 2px solid; }
        .stance-agree { background: rgba(34,197,94,0.15); border-color: rgba(34,197,94,0.5); color: #86efac; }
        .stance-agree:hover, .stance-agree.selected { background: rgba(34,197,94,0.35); border-color: #22c55e; }
        .stance-disagree { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.5); color: #fca5a5; }
        .stance-disagree:hover, .stance-disagree.selected { background: rgba(239,68,68,0.35); border-color: #ef4444; }
        .chat-bubble-agree { background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.4); border-radius: 12px 12px 12px 3px; padding: 10px 14px; max-width: 80%; }
        .chat-bubble-disagree { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.4); border-radius: 12px 12px 3px 12px; padding: 10px 14px; max-width: 80%; margin-left: auto; }
        .chat-bubble-ai { background: rgba(6,182,212,0.15); border: 1px solid rgba(6,182,212,0.4); border-radius: 12px 12px 3px 12px; padding: 10px 14px; max-width: 80%; margin-left: auto; }
        #chatLog { height: 420px; overflow-y: auto; scroll-behavior: smooth; }
        #chatLog::-webkit-scrollbar { width: 4px; } #chatLog::-webkit-scrollbar-thumb { background: rgba(6,182,212,0.4); border-radius: 4px; }
        .pulse-dot { width: 10px; height: 10px; border-radius: 50%; background: #22c55e; animation: pulseDot 1.5s ease-in-out infinite; }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.5;transform:scale(0.7);} }
        .waiting-spinner { border: 3px solid rgba(6,182,212,0.3); border-top-color: #06b6d4; border-radius: 50%; width: 32px; height: 32px; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .diff-btn { padding: 10px 18px; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 13px; transition: all 0.2s; border: 2px solid; }
        .diff-easy { background: rgba(34,197,94,0.15); border-color: rgba(34,197,94,0.5); color: #86efac; }
        .diff-easy:hover, .diff-easy.selected { background: rgba(34,197,94,0.35); border-color: #22c55e; }
        .diff-normal { background: rgba(234,179,8,0.15); border-color: rgba(234,179,8,0.5); color: #fde047; }
        .diff-normal:hover, .diff-normal.selected { background: rgba(234,179,8,0.35); border-color: #eab308; }
        .diff-hard { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.5); color: #fca5a5; }
        .diff-hard:hover, .diff-hard.selected { background: rgba(239,68,68,0.35); border-color: #ef4444; }
        .theme-option { padding: 12px 14px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: all 0.2s; }
        .theme-option:hover, .theme-option.selected { background: rgba(6,182,212,0.15); border-color: rgba(6,182,212,0.5); }
    </style>
</head>
<body class="bg-black text-white">
    ${globalNav(user)}

    <div class="min-h-screen pt-20 pb-12">
        <div class="cyber-grid"></div>
        <div class="container mx-auto px-4 max-w-4xl relative z-10">

            <!-- Header -->
            <div class="text-center mb-6 pt-2">
                <h1 class="text-3xl font-black cyber-text mb-2">
                    <i class="fas fa-gamepad mr-2 text-cyan-400"></i>対戦モード
                </h1>
                <p class="text-gray-400 text-sm">ユーザー対戦 / AI対戦</p>
            </div>

            <!-- Tabs -->
            <div class="flex gap-3 justify-center mb-7" id="modeTabs">
                <button class="battle-tab active" onclick="switchMode('pvp')">
                    <i class="fas fa-user-friends mr-2"></i>ユーザー対戦
                </button>
                <button class="battle-tab" onclick="switchMode('ai')">
                    <i class="fas fa-robot mr-2"></i>AI対戦
                </button>
            </div>

            <!-- ==================== PvP MODE ==================== -->
            <div id="pvpSection">
                <!-- Step 1: Lobby -->
                <div id="pvpLobby" class="mode-card">
                    <h2 class="text-xl font-bold text-cyan-300 mb-5"><i class="fas fa-search mr-2"></i>マッチング</h2>
                    <p class="text-sm text-gray-400 mb-5">現在ライブ中のディベートテーマで対戦します。立場を選んでマッチング開始！</p>
                    <div class="flex gap-4 mb-5">
                        <button class="stance-btn stance-agree" id="pvpAgreeBtn" onclick="selectPvpStance('agree')">
                            <i class="fas fa-thumbs-up mr-2"></i>賛成
                        </button>
                        <button class="stance-btn stance-disagree" id="pvpDisagreeBtn" onclick="selectPvpStance('disagree')">
                            <i class="fas fa-thumbs-down mr-2"></i>反対
                        </button>
                    </div>
                    <button id="pvpJoinBtn" class="w-full py-3 rounded-xl font-bold text-base bg-cyan-500/20 border-2 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/35 transition-all" onclick="joinPvpQueue()" disabled>
                        <i class="fas fa-play mr-2"></i>マッチング開始
                    </button>
                </div>

                <!-- Step 2: Waiting -->
                <div id="pvpWaiting" class="mode-card text-center" style="display:none">
                    <div class="flex justify-center mb-4"><div class="waiting-spinner"></div></div>
                    <p class="text-cyan-300 font-bold text-lg mb-2">対戦相手を探しています...</p>
                    <p class="text-gray-400 text-sm mb-5">しばらくお待ちください</p>
                    <button onclick="leavePvpQueue()" class="px-6 py-2 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300 font-bold text-sm hover:bg-red-500/35 transition-all">
                        <i class="fas fa-times mr-1"></i>キャンセル
                    </button>
                </div>

                <!-- Step 3: Battle Room -->
                <div id="pvpRoom" style="display:none">
                    <div class="mode-card mb-4">
                        <div class="flex items-center justify-between mb-3">
                            <div id="pvpRoomTheme" class="text-sm font-bold text-cyan-300"></div>
                            <div id="pvpTurnIndicator" class="text-xs text-gray-400"></div>
                        </div>
                        <div class="flex items-center gap-3 mb-3 text-xs text-gray-400">
                            <span id="pvpPlayerA" class="text-green-300 font-bold"></span>
                            <span>vs</span>
                            <span id="pvpPlayerB" class="text-red-300 font-bold"></span>
                        </div>
                        <div id="chatLog" class="mb-4 space-y-3 p-3 bg-black/30 rounded-xl border border-white/10"></div>
                        <div id="pvpInputArea" class="flex gap-3">
                            <textarea id="pvpInput" class="flex-1 bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-cyan-500/60" rows="2" placeholder="メッセージを入力... (最大300字)" maxlength="300" onkeydown="pvpEnterSend(event)"></textarea>
                            <button onclick="sendPvpMessage()" class="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-bold text-sm hover:bg-cyan-500/35 transition-all">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div id="pvpWaitOpponent" class="text-center text-gray-400 text-sm py-3" style="display:none">
                            <i class="fas fa-clock mr-1"></i>相手の返答を待っています...
                        </div>
                        <div class="flex gap-3 mt-3">
                            <button onclick="endPvpBattle()" class="flex-1 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-sm hover:bg-red-500/35 transition-all">
                                <i class="fas fa-flag mr-1"></i>降参
                            </button>
                        </div>
                    </div>
                    <div id="pvpResultCard" style="display:none" class="mode-card text-center">
                        <h3 class="text-2xl font-black cyber-text mb-3">対戦終了</h3>
                        <div id="pvpResultText" class="text-lg text-gray-300 mb-4"></div>
                        <button onclick="resetPvp()" class="px-8 py-3 rounded-xl bg-cyan-500/20 border-2 border-cyan-500/50 text-cyan-300 font-bold hover:bg-cyan-500/35 transition-all">
                            <i class="fas fa-redo mr-2"></i>もう一度
                        </button>
                    </div>
                </div>
            </div>

            <!-- ==================== AI MODE ==================== -->
            <div id="aiSection" style="display:none">
                <!-- Setup -->
                <div id="aiSetup" class="mode-card">
                    <h2 class="text-xl font-bold text-cyan-300 mb-5"><i class="fas fa-robot mr-2"></i>AI対戦設定</h2>

                    <!-- Theme selection -->
                    <div class="mb-5">
                        <label class="text-sm text-gray-300 font-bold mb-2 block"><i class="fas fa-list mr-1"></i>テーマ選択</label>
                        <div id="aiThemeList" class="grid grid-cols-1 gap-2 mb-3 max-h-48 overflow-y-auto">
                            <div class="text-gray-500 text-sm text-center py-3">読み込み中...</div>
                        </div>
                        <div class="theme-option" id="customThemeOption" onclick="toggleCustomTheme()">
                            <div class="flex items-center gap-2">
                                <i class="fas fa-pen text-cyan-400 text-sm"></i>
                                <span class="text-sm font-bold text-cyan-300">カスタムテーマを入力</span>
                            </div>
                            <div id="customThemeInputs" class="mt-3" style="display:none">
                                <input id="aiCustomTheme" class="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-sm text-white mb-2 focus:outline-none focus:border-cyan-500/50" placeholder="テーマ（例：AIは人類の脅威になるか）">
                                <div class="grid grid-cols-2 gap-2">
                                    <input id="aiCustomAgree" class="bg-black/40 border border-green-500/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50" placeholder="賛成側の主張">
                                    <input id="aiCustomDisagree" class="bg-black/40 border border-red-500/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500/50" placeholder="反対側の主張">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Stance -->
                    <div class="mb-5">
                        <label class="text-sm text-gray-300 font-bold mb-2 block"><i class="fas fa-balance-scale mr-1"></i>あなたの立場</label>
                        <div class="flex gap-4">
                            <button class="stance-btn stance-agree" id="aiAgreeBtn" onclick="selectAiStance('agree')">
                                <i class="fas fa-thumbs-up mr-2"></i>賛成
                            </button>
                            <button class="stance-btn stance-disagree" id="aiDisagreeBtn" onclick="selectAiStance('disagree')">
                                <i class="fas fa-thumbs-down mr-2"></i>反対
                            </button>
                        </div>
                    </div>

                    <!-- Difficulty -->
                    <div class="mb-6">
                        <label class="text-sm text-gray-300 font-bold mb-2 block"><i class="fas fa-fire mr-1"></i>難易度</label>
                        <div class="flex gap-3">
                            <button class="diff-btn diff-easy selected" id="diffEasy" onclick="selectDifficulty('easy')">
                                <i class="fas fa-seedling mr-1"></i>かんたん
                            </button>
                            <button class="diff-btn diff-normal" id="diffNormal" onclick="selectDifficulty('normal')">
                                <i class="fas fa-fire mr-1"></i>ふつう
                            </button>
                            <button class="diff-btn diff-hard" id="diffHard" onclick="selectDifficulty('hard')">
                                <i class="fas fa-skull mr-1"></i>むずかしい
                            </button>
                        </div>
                    </div>

                    <button id="aiStartBtn" onclick="startAiBattle()" class="w-full py-3 rounded-xl font-bold bg-cyan-500/20 border-2 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/35 transition-all" disabled>
                        <i class="fas fa-play mr-2"></i>AI対戦開始（50クレジット）
                    </button>
                </div>

                <!-- Battle Room -->
                <div id="aiBattleRoom" style="display:none">
                    <div class="mode-card mb-4">
                        <div class="flex items-center justify-between mb-3">
                            <div id="aiRoomTheme" class="text-sm font-bold text-cyan-300 flex-1"></div>
                            <div id="aiTurnCount" class="text-xs text-gray-400"></div>
                        </div>
                        <div class="flex items-center gap-3 mb-3 text-xs">
                            <span id="aiHumanLabel" class="text-green-300 font-bold"></span>
                            <span class="text-gray-500">vs</span>
                            <span class="text-red-300 font-bold"><i class="fas fa-robot mr-1"></i>AI</span>
                        </div>
                        <div id="aiChatLog" class="mb-4 space-y-3 p-3 bg-black/30 rounded-xl border border-white/10 h-96 overflow-y-auto"></div>
                        <div id="aiInputArea" class="flex gap-3">
                            <textarea id="aiInput" class="flex-1 bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-cyan-500/60" rows="2" placeholder="あなたの主張を入力... (最大300字)" maxlength="300" onkeydown="aiEnterSend(event)"></textarea>
                            <button onclick="sendAiMessage()" class="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-bold text-sm hover:bg-cyan-500/35 transition-all">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div id="aiThinking" class="text-center text-cyan-400 text-sm py-3" style="display:none">
                            <i class="fas fa-cog fa-spin mr-2"></i>AIが考えています...
                        </div>
                        <div class="flex gap-3 mt-3">
                            <button onclick="endAiBattle('human_surrender')" class="flex-1 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-sm hover:bg-red-500/35 transition-all">
                                <i class="fas fa-flag mr-1"></i>降参
                            </button>
                        </div>
                    </div>
                    <div id="aiResultCard" style="display:none" class="mode-card text-center">
                        <h3 class="text-2xl font-black cyber-text mb-3">対戦結果</h3>
                        <div id="aiResultText" class="text-lg text-gray-300 mb-4"></div>
                        <button onclick="resetAi()" class="px-8 py-3 rounded-xl bg-cyan-500/20 border-2 border-cyan-500/50 text-cyan-300 font-bold hover:bg-cyan-500/35 transition-all">
                            <i class="fas fa-redo mr-2"></i>もう一度
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div id="toast" style="position:fixed;bottom:20px;right:20px;z-index:9999;display:none;" class="px-5 py-3 rounded-xl text-sm font-bold shadow-lg"></div>

    <script>
    const CURRENT_USER = ${JSON.stringify(user?.user_id || '')};

    // ─── Common ───
    let currentMode = 'pvp';
    function switchMode(mode) {
        currentMode = mode;
        document.getElementById('pvpSection').style.display = mode === 'pvp' ? 'block' : 'none';
        document.getElementById('aiSection').style.display = mode === 'ai' ? 'block' : 'none';
        document.querySelectorAll('#modeTabs .battle-tab').forEach((b,i) => b.classList.toggle('active', ['pvp','ai'][i] === mode));
        if (mode === 'ai') loadAiThemes();
    }

    function showToast(msg, type='success') {
        const el = document.getElementById('toast');
        el.textContent = msg;
        el.className = 'px-5 py-3 rounded-xl text-sm font-bold shadow-lg ' + (type === 'success' ? 'bg-green-700 text-white' : 'bg-red-700 text-white');
        el.style.display = 'block';
        setTimeout(() => { el.style.display = 'none'; }, 3000);
    }

    function escHtml(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

    // ─── PvP ───
    let pvpStance = null;
    let pvpRoomId = null;
    let pvpYourStance = null;
    let pvpMessages = [];
    let pvpPollInterval = null;

    function selectPvpStance(s) {
        pvpStance = s;
        document.getElementById('pvpAgreeBtn').classList.toggle('selected', s === 'agree');
        document.getElementById('pvpDisagreeBtn').classList.toggle('selected', s === 'disagree');
        document.getElementById('pvpJoinBtn').disabled = false;
    }

    async function joinPvpQueue() {
        if (!pvpStance) return;
        try {
            const r = await fetch('/api/battle/queue/join', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({mode:'pvp', stance: pvpStance}) });
            const d = await r.json();
            if (d.success || !d.error) {
                document.getElementById('pvpLobby').style.display = 'none';
                document.getElementById('pvpWaiting').style.display = 'block';
                pvpPollInterval = setInterval(pollPvpQueue, 2000);
            } else { showToast('エラー: ' + d.error, 'error'); }
        } catch(e) { showToast('通信エラー', 'error'); }
    }

    async function leavePvpQueue() {
        clearInterval(pvpPollInterval);
        await fetch('/api/battle/queue/leave', { method:'DELETE' });
        document.getElementById('pvpWaiting').style.display = 'none';
        document.getElementById('pvpLobby').style.display = 'block';
    }

    async function pollPvpQueue() {
        try {
            const r = await fetch('/api/battle/queue/status');
            const d = await r.json();
            if (d.status === 'matched') {
                clearInterval(pvpPollInterval);
                pvpRoomId = d.room_id;
                pvpYourStance = d.your_stance;
                document.getElementById('pvpWaiting').style.display = 'none';
                document.getElementById('pvpRoom').style.display = 'block';
                showToast('マッチング成立！対戦相手: ' + (d.opponent || '?'), 'success');
                await loadPvpRoom();
                pvpPollInterval = setInterval(loadPvpRoom, 3000);
            }
        } catch(e) {}
    }

    async function loadPvpRoom() {
        if (!pvpRoomId) return;
        try {
            const r = await fetch('/api/battle/room/' + pvpRoomId);
            const d = await r.json();
            if (d.error) return;
            document.getElementById('pvpRoomTheme').textContent = d.debate?.title || 'テーマ未設定';
            const stance = pvpYourStance || d.your_stance;
            pvpYourStance = stance;
            const meLabel = stance === 'agree' ? '賛成' : '反対';
            document.getElementById('pvpPlayerA').textContent = d.player_a + '（賛成）';
            document.getElementById('pvpPlayerB').textContent = (d.player_b || '待機中') + '（反対）';

            const msgs = d.messages || [];
            if (msgs.length !== pvpMessages.length) {
                pvpMessages = msgs;
                renderPvpChat(msgs, stance, d.debate);
            }

            if (d.status === 'ended') {
                clearInterval(pvpPollInterval);
                showPvpResult(d.winner, stance);
            }
        } catch(e) {}
    }

    function renderPvpChat(msgs, myStance, debate) {
        const log = document.getElementById('chatLog');
        log.innerHTML = msgs.length === 0
            ? '<div class="text-center text-gray-500 text-sm py-8">まだメッセージはありません。最初の一手を打ちましょう！</div>'
            : msgs.map(m => {
                const isMe = m.user_id === CURRENT_USER;
                const stanceLabel = m.stance === 'agree' ? '<span class="text-green-400">賛成</span>' : '<span class="text-red-400">反対</span>';
                const cls = m.stance === 'agree' ? 'chat-bubble-agree' : 'chat-bubble-disagree';
                return \`<div class="\${cls}">
                    <div class="text-xs text-gray-400 mb-1">\${escHtml(m.username)} [\${stanceLabel}] \${isMe ? '(あなた)' : ''}</div>
                    <p class="text-sm text-white">\${escHtml(m.content)}</p>
                </div>\`;
            }).join('');
        log.scrollTop = log.scrollHeight;
    }

    async function sendPvpMessage() {
        const input = document.getElementById('pvpInput');
        const content = input.value.trim();
        if (!content || !pvpRoomId) return;
        input.value = '';
        try {
            const r = await fetch('/api/battle/room/' + pvpRoomId + '/message', {
                method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ content })
            });
            const d = await r.json();
            if (!d.success) showToast('送信失敗: ' + (d.error||''), 'error');
            else await loadPvpRoom();
        } catch(e) { showToast('通信エラー', 'error'); }
    }

    function pvpEnterSend(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendPvpMessage(); } }

    async function endPvpBattle() {
        if (!confirm('降参しますか？')) return;
        clearInterval(pvpPollInterval);
        await fetch('/api/battle/room/' + pvpRoomId + '/end', {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ winner: pvpYourStance === 'agree' ? 'disagree' : 'agree' })
        });
        showPvpResult(pvpYourStance === 'agree' ? 'disagree' : 'agree', pvpYourStance);
    }

    function showPvpResult(winner, myStance) {
        document.getElementById('pvpInputArea').style.display = 'none';
        document.getElementById('pvpResultCard').style.display = 'block';
        const won = winner === myStance;
        document.getElementById('pvpResultText').innerHTML = won
            ? '<span class="text-yellow-400 font-black text-2xl">🏆 あなたの勝利！</span>'
            : '<span class="text-gray-400">敗北... 次は頑張ろう</span>';
    }

    function resetPvp() {
        clearInterval(pvpPollInterval);
        pvpRoomId = null; pvpYourStance = null; pvpStance = null; pvpMessages = [];
        document.getElementById('pvpRoom').style.display = 'none';
        document.getElementById('pvpResultCard').style.display = 'none';
        document.getElementById('pvpInputArea').style.display = 'flex';
        document.getElementById('pvpAgreeBtn').classList.remove('selected');
        document.getElementById('pvpDisagreeBtn').classList.remove('selected');
        document.getElementById('pvpJoinBtn').disabled = true;
        document.getElementById('pvpLobby').style.display = 'block';
    }

    // ─── AI Battle ───
    let aiStance = null;
    let aiDifficulty = 'easy';
    let aiTheme = null;
    let aiHistory = [];
    let aiTurnCount = 0;
    const MAX_AI_TURNS = 10;
    const DIFFICULTY_TEMPS = { easy: 0.5, normal: 0.75, hard: 1.0 };

    async function loadAiThemes() {
        try {
            const r = await fetch('/api/dev/themes');
            const d = await r.json();
            const themes = (d.themes || []).filter(t => t.status === 'active').slice(0, 8);
            const el = document.getElementById('aiThemeList');
            if (!themes.length) { el.innerHTML = '<div class="text-gray-500 text-sm text-center py-3">テーマが見つかりません</div>'; return; }
            el.innerHTML = themes.map(t => \`
                <div class="theme-option" onclick="selectAiTheme(this, \${JSON.stringify(escHtml(t.title))}, \${JSON.stringify(escHtml(t.agree_opinion||''))}, \${JSON.stringify(escHtml(t.disagree_opinion||''))})">
                    <p class="text-sm font-bold text-white">\${escHtml(t.title)}</p>
                    <p class="text-xs text-green-300 mt-1"><i class="fas fa-check mr-1"></i>\${escHtml(t.agree_opinion||'')}</p>
                    <p class="text-xs text-red-300"><i class="fas fa-times mr-1"></i>\${escHtml(t.disagree_opinion||'')}</p>
                </div>
            \`).join('');
        } catch(e) { document.getElementById('aiThemeList').innerHTML = '<div class="text-gray-500 text-sm">読み込み失敗</div>'; }
    }

    function selectAiTheme(el, title, agree, disagree) {
        document.querySelectorAll('#aiThemeList .theme-option').forEach(e => e.classList.remove('selected'));
        document.getElementById('customThemeOption').classList.remove('selected');
        el.classList.add('selected');
        aiTheme = { title, agree_opinion: agree, disagree_opinion: disagree };
        document.getElementById('customThemeInputs').style.display = 'none';
        updateAiStartBtn();
    }

    function toggleCustomTheme() {
        const inp = document.getElementById('customThemeInputs');
        const showing = inp.style.display !== 'none';
        inp.style.display = showing ? 'none' : 'block';
        document.querySelectorAll('#aiThemeList .theme-option').forEach(e => e.classList.remove('selected'));
        document.getElementById('customThemeOption').classList.toggle('selected', !showing);
        if (showing) { aiTheme = null; updateAiStartBtn(); }
    }

    function selectAiStance(s) {
        aiStance = s;
        document.getElementById('aiAgreeBtn').classList.toggle('selected', s === 'agree');
        document.getElementById('aiDisagreeBtn').classList.toggle('selected', s === 'disagree');
        updateAiStartBtn();
    }

    function selectDifficulty(d) {
        aiDifficulty = d;
        ['easy','normal','hard'].forEach(x => document.getElementById('diff' + x.charAt(0).toUpperCase() + x.slice(1)).classList.toggle('selected', x === d));
    }

    function updateAiStartBtn() {
        const hasTheme = aiTheme !== null || (document.getElementById('customThemeInputs').style.display !== 'none');
        document.getElementById('aiStartBtn').disabled = !(hasTheme && aiStance);
    }

    async function startAiBattle() {
        // Handle custom theme
        const customShowing = document.getElementById('customThemeInputs').style.display !== 'none';
        if (customShowing) {
            const t = document.getElementById('aiCustomTheme').value.trim();
            const a = document.getElementById('aiCustomAgree').value.trim();
            const b = document.getElementById('aiCustomDisagree').value.trim();
            if (!t) { showToast('テーマを入力してください', 'error'); return; }
            aiTheme = { title: t, agree_opinion: a || '賛成の立場', disagree_opinion: b || '反対の立場' };
        }
        if (!aiTheme || !aiStance) { showToast('テーマと立場を選択してください', 'error'); return; }

        aiHistory = [];
        aiTurnCount = 0;
        document.getElementById('aiSetup').style.display = 'none';
        document.getElementById('aiBattleRoom').style.display = 'block';
        document.getElementById('aiRoomTheme').textContent = aiTheme.title;
        const myStanceLabel = aiStance === 'agree' ? '賛成（' + (aiTheme.agree_opinion||'賛成') + '）' : '反対（' + (aiTheme.disagree_opinion||'反対') + '）';
        document.getElementById('aiHumanLabel').textContent = 'あなた ' + myStanceLabel;
        document.getElementById('aiChatLog').innerHTML = '<div class="text-center text-gray-500 text-sm py-4">ディベートを開始！あなたの主張を入力してください。</div>';
        updateAiTurnCount();
    }

    function updateAiTurnCount() {
        document.getElementById('aiTurnCount').textContent = 'ターン ' + aiTurnCount + '/' + MAX_AI_TURNS;
    }

    async function sendAiMessage() {
        const input = document.getElementById('aiInput');
        const content = input.value.trim();
        if (!content) return;
        input.value = '';
        input.disabled = true;

        const aiStanceStr = aiStance === 'agree' ? 'disagree' : 'agree';
        aiHistory.push({ content, is_ai: false, stance: aiStance, username: 'あなた' });
        aiTurnCount++;
        renderAiChat();
        updateAiTurnCount();

        if (aiTurnCount > MAX_AI_TURNS) { endAiBattle('max_turns'); input.disabled = false; return; }

        document.getElementById('aiThinking').style.display = 'block';
        try {
            const r = await fetch('/api/battle/ai/message', {
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({
                    theme: aiTheme.title,
                    ai_stance: aiStanceStr,
                    human_stance: aiStance,
                    difficulty: aiDifficulty,
                    conversation_history: aiHistory,
                    human_message: content
                })
            });
            const d = await r.json();
            document.getElementById('aiThinking').style.display = 'none';
            if (d.error) { showToast('AI エラー: ' + d.error, 'error'); input.disabled = false; return; }
            aiHistory.push({ content: d.message, is_ai: true, stance: aiStanceStr, username: 'AI' });
            aiTurnCount++;
            updateAiTurnCount();
            renderAiChat();
            if (aiTurnCount >= MAX_AI_TURNS) { endAiBattle('max_turns'); }
        } catch(e) {
            document.getElementById('aiThinking').style.display = 'none';
            showToast('通信エラー', 'error');
        }
        input.disabled = false;
    }

    function aiEnterSend(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAiMessage(); } }

    function renderAiChat() {
        const log = document.getElementById('aiChatLog');
        log.innerHTML = aiHistory.map(m => {
            const cls = m.is_ai ? 'chat-bubble-ai' : (m.stance === 'agree' ? 'chat-bubble-agree' : 'chat-bubble-disagree');
            const stanceLabel = m.stance === 'agree' ? '<span class="text-green-400">賛成</span>' : '<span class="text-red-400">反対</span>';
            return \`<div class="\${cls}">
                <div class="text-xs text-gray-400 mb-1">\${m.is_ai ? '<i class="fas fa-robot mr-1"></i>AI' : 'あなた'} [\${stanceLabel}]</div>
                <p class="text-sm text-white">\${escHtml(m.content)}</p>
            </div>\`;
        }).join('');
        log.scrollTop = log.scrollHeight;
    }

    function endAiBattle(reason) {
        document.getElementById('aiInputArea').style.display = 'none';
        document.getElementById('aiThinking').style.display = 'none';
        document.getElementById('aiResultCard').style.display = 'block';
        let resultHtml = '';
        if (reason === 'human_surrender') {
            resultHtml = '<span class="text-red-400 font-bold">降参 — AIの勝利</span><p class="text-gray-400 text-sm mt-2">次は頑張ろう！</p>';
        } else if (reason === 'max_turns') {
            resultHtml = '<span class="text-yellow-400 font-bold">⏱ 制限ターン到達！</span><p class="text-gray-400 text-sm mt-2">引き分けです。観客の投票で勝敗が決まります。</p>';
        } else {
            resultHtml = '<span class="text-gray-300">対戦終了</span>';
        }
        document.getElementById('aiResultText').innerHTML = resultHtml;
    }

    function resetAi() {
        aiStance = null; aiTheme = null; aiHistory = []; aiTurnCount = 0; aiDifficulty = 'easy';
        document.getElementById('aiBattleRoom').style.display = 'none';
        document.getElementById('aiResultCard').style.display = 'none';
        document.getElementById('aiInputArea').style.display = 'flex';
        document.getElementById('aiSetup').style.display = 'block';
        document.getElementById('aiAgreeBtn').classList.remove('selected');
        document.getElementById('aiDisagreeBtn').classList.remove('selected');
        document.getElementById('aiStartBtn').disabled = true;
        loadAiThemes();
    }
    </script>
</body>
</html>
`;
