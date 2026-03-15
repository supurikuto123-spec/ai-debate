import { globalNav } from '../components/global-nav';

export const battlePage = (user: any) => {
  const safeUserId = JSON.stringify(user?.user_id || '');
  const safeUsername = JSON.stringify(user?.username || user?.user_id || 'あなた');
  const userCredits = Number(user?.credits || 0);

  return `<!DOCTYPE html>
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
        .battle-tab{padding:10px 26px;border-radius:10px;cursor:pointer;font-weight:700;font-size:15px;transition:all 0.3s;background:rgba(255,255,255,0.05);border:2px solid rgba(255,255,255,0.1);color:#9ca3af;}
        .battle-tab:hover{background:rgba(6,182,212,0.15);border-color:rgba(6,182,212,0.4);}
        .battle-tab.active{background:rgba(6,182,212,0.25);border-color:#06b6d4;color:#fff;box-shadow:0 0 20px rgba(6,182,212,0.3);}
        .mode-card{background:linear-gradient(135deg,rgba(0,20,40,0.9),rgba(20,0,40,0.9));border:2px solid rgba(0,255,255,0.3);border-radius:16px;padding:24px;transition:all 0.3s;}
        .stance-btn{flex:1;padding:14px;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer;transition:all 0.3s;border:2px solid;}
        .stance-agree{background:rgba(34,197,94,0.15);border-color:rgba(34,197,94,0.5);color:#86efac;}
        .stance-agree.selected{background:rgba(34,197,94,0.35);border-color:#22c55e;box-shadow:0 0 15px rgba(34,197,94,0.3);}
        .stance-disagree{background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.5);color:#fca5a5;}
        .stance-disagree.selected{background:rgba(239,68,68,0.35);border-color:#ef4444;box-shadow:0 0 15px rgba(239,68,68,0.3);}
        .chat-msg-agree{background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.35);border-radius:14px 14px 14px 4px;padding:10px 14px;max-width:82%;}
        .chat-msg-disagree{background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.35);border-radius:14px 14px 4px 14px;padding:10px 14px;max-width:82%;margin-left:auto;}
        .chat-msg-ai{background:rgba(6,182,212,0.12);border:1px solid rgba(6,182,212,0.35);border-radius:14px 14px 4px 14px;padding:10px 14px;max-width:82%;margin-left:auto;}
        #chatLog,#aiChatLog{height:380px;overflow-y:auto;scroll-behavior:smooth;}
        #chatLog::-webkit-scrollbar,#aiChatLog::-webkit-scrollbar{width:4px;}
        #chatLog::-webkit-scrollbar-thumb,#aiChatLog::-webkit-scrollbar-thumb{background:rgba(6,182,212,0.4);border-radius:4px;}
        .waiting-spinner{border:3px solid rgba(6,182,212,0.2);border-top-color:#06b6d4;border-radius:50%;width:40px;height:40px;animation:spin 0.8s linear infinite;display:inline-block;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .diff-btn{padding:10px 16px;border-radius:10px;cursor:pointer;font-weight:700;font-size:13px;transition:all 0.2s;border:2px solid;}
        .diff-easy{background:rgba(34,197,94,0.15);border-color:rgba(34,197,94,0.5);color:#86efac;}
        .diff-easy.selected{background:rgba(34,197,94,0.35);border-color:#22c55e;}
        .diff-normal{background:rgba(234,179,8,0.15);border-color:rgba(234,179,8,0.5);color:#fde047;}
        .diff-normal.selected{background:rgba(234,179,8,0.35);border-color:#eab308;}
        .diff-hard{background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.5);color:#fca5a5;}
        .diff-hard.selected{background:rgba(239,68,68,0.35);border-color:#ef4444;}
        .theme-option{padding:12px 14px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);cursor:pointer;transition:all 0.2s;}
        .theme-option.selected{background:rgba(6,182,212,0.15);border-color:rgba(6,182,212,0.5);}
        .turn-indicator{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;}
        .your-turn{background:rgba(34,197,94,0.2);border:1px solid #22c55e;color:#86efac;}
        .opp-turn{background:rgba(107,114,128,0.2);border:1px solid #6b7280;color:#9ca3af;}
        .live-badge{display:inline-flex;align-items:center;gap:6px;}
        .pulse-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;animation:pd 1.5s ease-in-out infinite;}
        @keyframes pd{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(0.6);}}
        .rating-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:700;background:rgba(139,92,246,0.2);border:1px solid rgba(139,92,246,0.5);color:#c4b5fd;}
        /* 先攻演出 */
        @keyframes flashIn{0%{opacity:0;transform:scale(0.5);}60%{transform:scale(1.15);}100%{opacity:1;transform:scale(1);}}
        .flash-in{animation:flashIn 0.6s cubic-bezier(0.175,0.885,0.32,1.275) forwards;}
        /* クレジット計算UI */
        .credit-preview{background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.3);border-radius:10px;padding:12px 16px;}
    </style>
</head>
<body class="bg-black text-white">
    ${globalNav(user)}

    <div class="min-h-screen pt-20 pb-12">
        <div class="cyber-grid"></div>
        <div class="container mx-auto px-4 max-w-4xl relative z-10">

            <div class="text-center mb-6 pt-2">
                <h1 class="text-3xl font-black cyber-text mb-2">
                    <i class="fas fa-gamepad mr-2 text-cyan-400"></i>対戦モード
                </h1>
                <p class="text-gray-400 text-sm">ユーザー対戦 / AI対戦</p>
            </div>

            <div class="flex gap-3 justify-center mb-7" id="modeTabs">
                <button class="battle-tab active" onclick="switchMode('pvp')">
                    <i class="fas fa-user-friends mr-2"></i>ユーザー対戦
                </button>
                <button class="battle-tab" onclick="switchMode('ai')">
                    <i class="fas fa-robot mr-2"></i>AI対戦
                </button>
            </div>

            <!-- ===== PvP ===== -->
            <div id="pvpSection">

                <!-- ロビー -->
                <div id="pvpLobby" class="mode-card">
                    <h2 class="text-xl font-bold text-cyan-300 mb-4"><i class="fas fa-search mr-2"></i>マッチング</h2>
                    <!-- ライブディベート情報 -->
                    <div id="pvpLiveInfo" class="mb-4" style="display:none">
                        <div class="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                            <div class="live-badge mb-2"><div class="pulse-dot"></div><span class="text-green-400 font-bold text-sm">ライブ中のディベートで対戦</span></div>
                            <p id="pvpLiveTitle" class="font-bold text-white mb-2"></p>
                            <div class="grid grid-cols-2 gap-2 text-xs">
                                <div class="bg-green-900/30 rounded-lg p-2"><span class="text-green-400 font-bold">賛成: </span><span id="pvpLiveAgree" class="text-gray-200"></span></div>
                                <div class="bg-red-900/30 rounded-lg p-2"><span class="text-red-400 font-bold">反対: </span><span id="pvpLiveDisagree" class="text-gray-200"></span></div>
                            </div>
                        </div>
                    </div>
                    <div id="pvpNoLive" class="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-3 mb-4 text-sm text-yellow-400" style="display:none">
                        <i class="fas fa-exclamation-triangle mr-2"></i>現在ライブ中のディベートがありません。テーマなしで対戦できます。
                    </div>
                    <p class="text-sm text-gray-400 mb-4">立場を選んでマッチング開始！先後攻はランダムで決定されます。</p>
                    <div class="flex gap-4 mb-5">
                        <button class="stance-btn stance-agree" id="pvpAgreeBtn" onclick="selectPvpStance('agree')"><i class="fas fa-thumbs-up mr-2"></i>賛成</button>
                        <button class="stance-btn stance-disagree" id="pvpDisagreeBtn" onclick="selectPvpStance('disagree')"><i class="fas fa-thumbs-down mr-2"></i>反対</button>
                    </div>
                    <button id="pvpJoinBtn" disabled onclick="joinPvpQueue()" class="w-full py-3 rounded-xl font-bold bg-cyan-500/20 border-2 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/35 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        <i class="fas fa-play mr-2"></i>マッチング開始
                    </button>
                </div>

                <!-- 待機中 -->
                <div id="pvpWaiting" style="display:none" class="mode-card text-center py-10">
                    <div class="flex justify-center mb-5"><div class="waiting-spinner"></div></div>
                    <p class="text-cyan-300 font-bold text-xl mb-2">対戦相手を探しています…</p>
                    <p id="pvpWaitTime" class="text-gray-500 text-sm mb-6">0秒</p>
                    <button onclick="leavePvpQueue()" class="px-6 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-sm">
                        <i class="fas fa-times mr-1"></i>キャンセル
                    </button>
                </div>

                <!-- 先後攻演出 -->
                <div id="pvpCoinFlip" style="display:none" class="mode-card text-center py-10">
                    <p class="text-lg text-gray-300 mb-4">先後攻を決定中…</p>
                    <div id="coinDisplay" class="text-6xl mb-4">🪙</div>
                    <p id="coinResult" class="text-2xl font-black cyber-text" style="opacity:0"></p>
                </div>

                <!-- バトルルーム -->
                <div id="pvpRoom" style="display:none">
                    <div class="mode-card mb-3">
                        <div class="flex items-start justify-between mb-3 gap-3">
                            <div class="flex-1">
                                <p id="pvpRoomTheme" class="font-bold text-cyan-300 text-sm mb-1"></p>
                                <div class="flex gap-2 text-xs flex-wrap">
                                    <span id="pvpRoomAgree" class="bg-green-900/30 text-green-300 px-2 py-1 rounded-lg"></span>
                                    <span id="pvpRoomDisagree" class="bg-red-900/30 text-red-300 px-2 py-1 rounded-lg"></span>
                                </div>
                            </div>
                            <div class="text-right shrink-0">
                                <div id="pvpTurnBadge" class="turn-indicator mb-1"></div>
                                <div class="text-xs text-gray-500">ターン <span id="pvpTurnNum">0</span>/10</div>
                                <div id="pvpInputTimer" class="text-xs text-yellow-400 font-bold mt-1" style="display:none">⏱ <span id="pvpTimerSec">60</span>秒</div>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 mb-3 text-xs">
                            <span id="pvpPlayerA" class="text-green-300 font-bold"></span>
                            <span class="text-gray-500">vs</span>
                            <span id="pvpPlayerB" class="text-red-300 font-bold"></span>
                        </div>
                        <div id="chatLog" class="mb-4 p-3 bg-black/30 rounded-xl border border-white/10 space-y-3"></div>
                        <div id="pvpInputArea" class="flex gap-3">
                            <textarea id="pvpInput" class="flex-1 bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-cyan-500/60" rows="2" placeholder="メッセージを入力… (最大300字)" maxlength="300" onkeydown="pvpEnterSend(event)"></textarea>
                            <button onclick="sendPvpMessage()" class="px-4 self-end py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-bold text-sm hover:bg-cyan-500/35 transition-all">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div id="pvpWaitMsg" style="display:none" class="text-center text-gray-500 text-sm py-3">
                            <i class="fas fa-clock mr-1"></i>相手の返答を待っています…
                        </div>
                        <div class="flex gap-2 mt-3">
                            <button onclick="pvpSurrender()" class="flex-1 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-sm hover:bg-red-500/35">
                                <i class="fas fa-flag mr-1"></i>降参
                            </button>
                        </div>
                    </div>
                    <!-- リザルト -->
                    <div id="pvpResult" style="display:none" class="mode-card text-center">
                        <h3 class="text-2xl font-black cyber-text mb-3">対戦結果</h3>
                        <div id="pvpResultMain" class="mb-3"></div>
                        <div id="pvpJudgeComment" class="text-sm text-gray-300 bg-white/5 rounded-xl p-4 mb-4 text-left" style="display:none"></div>
                        <div id="pvpScoreBar" class="mb-4" style="display:none">
                            <div class="flex justify-between text-xs text-gray-400 mb-1"><span id="pvpScoreA"></span><span id="pvpScoreB"></span></div>
                            <div class="h-3 bg-gray-800 rounded-full overflow-hidden">
                                <div id="pvpScoreBarFill" class="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-1000" style="width:50%"></div>
                            </div>
                        </div>
                        <div id="pvpRatingChange" class="text-sm text-purple-300 mb-4 font-bold" style="display:none"></div>
                        <button onclick="resetPvp()" class="px-8 py-3 rounded-xl bg-cyan-500/20 border-2 border-cyan-500/50 text-cyan-300 font-bold hover:bg-cyan-500/35">
                            <i class="fas fa-redo mr-2"></i>もう一度
                        </button>
                    </div>
                </div>
            </div>

            <!-- ===== AI ===== -->
            <div id="aiSection" style="display:none">

                <!-- セットアップ -->
                <div id="aiSetup" class="mode-card">
                    <h2 class="text-xl font-bold text-cyan-300 mb-5"><i class="fas fa-robot mr-2"></i>AI対戦設定</h2>

                    <!-- テーマ -->
                    <div class="mb-5">
                        <label class="text-sm text-gray-300 font-bold mb-2 block"><i class="fas fa-list mr-1"></i>テーマ選択</label>
                        <div id="aiThemeList" class="space-y-2 mb-3 max-h-52 overflow-y-auto pr-1">
                            <div class="text-gray-500 text-sm text-center py-3">読み込み中…</div>
                        </div>
                        <div class="theme-option" id="customThemeOpt" onclick="toggleCustomTheme()">
                            <div class="flex items-center gap-2"><i class="fas fa-pen text-cyan-400 text-sm"></i><span class="text-sm font-bold text-cyan-300">カスタムテーマを入力</span></div>
                            <div id="customThemeInputs" style="display:none" class="mt-3 space-y-2">
                                <input id="aiCustomTheme" class="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" placeholder="テーマ（例：AIは人類の脅威になるか）">
                                <div class="grid grid-cols-2 gap-2">
                                    <input id="aiCustomAgree" class="bg-black/40 border border-green-500/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" placeholder="賛成側の主張">
                                    <input id="aiCustomDisagree" class="bg-black/40 border border-red-500/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" placeholder="反対側の主張">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 立場 -->
                    <div class="mb-5">
                        <label class="text-sm text-gray-300 font-bold mb-2 block"><i class="fas fa-balance-scale mr-1"></i>あなたの立場</label>
                        <div class="flex gap-4">
                            <button class="stance-btn stance-agree" id="aiAgreeBtn" onclick="selectAiStance('agree')"><i class="fas fa-thumbs-up mr-2"></i>賛成</button>
                            <button class="stance-btn stance-disagree" id="aiDisagreeBtn" onclick="selectAiStance('disagree')"><i class="fas fa-thumbs-down mr-2"></i>反対</button>
                        </div>
                    </div>

                    <!-- 難易度 -->
                    <div class="mb-5">
                        <label class="text-sm text-gray-300 font-bold mb-2 block"><i class="fas fa-fire mr-1"></i>難易度</label>
                        <div class="flex gap-3 mb-2">
                            <button class="diff-btn diff-easy selected" id="diffEasy" onclick="selectDiff('easy')"><i class="fas fa-seedling mr-1"></i>かんたん</button>
                            <button class="diff-btn diff-normal" id="diffNormal" onclick="selectDiff('normal')"><i class="fas fa-fire mr-1"></i>ふつう</button>
                            <button class="diff-btn diff-hard" id="diffHard" onclick="selectDiff('hard')"><i class="fas fa-skull mr-1"></i>むずかしい</button>
                        </div>
                        <div class="text-xs text-gray-500" id="diffDesc">AIは優しく丁寧な反論をします。</div>
                    </div>

                    <!-- ターン数スライダー -->
                    <div class="mb-5">
                        <label class="text-sm text-gray-300 font-bold mb-2 block"><i class="fas fa-exchange-alt mr-1"></i>ターン数（双方の総発言回数）</label>
                        <div class="flex items-center gap-4">
                            <input type="range" id="aiTurnsSlider" min="4" max="20" value="10" step="2" oninput="updateTurnsUI()" class="flex-1" style="accent-color:#06b6d4;height:6px;">
                            <span id="aiTurnsLabel" class="text-cyan-300 font-bold text-lg w-10 text-right">10</span>
                        </div>
                        <div class="flex justify-between text-xs text-gray-600 mt-1"><span>4(短)</span><span>10(標準)</span><span>20(長)</span></div>
                    </div>

                    <!-- クレジット試算 -->
                    <div class="credit-preview mb-5">
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-300"><i class="fas fa-coins text-yellow-400 mr-1"></i>消費クレジット試算</span>
                            <span id="aiCreditCost" class="text-yellow-400 font-bold text-lg">50 cr</span>
                        </div>
                        <div class="text-xs text-gray-500 mt-1">現在の残高: ${userCredits} cr</div>
                        <div class="text-xs text-yellow-600 mt-1" id="aiCreditWarn" style="display:none"><i class="fas fa-exclamation-triangle mr-1"></i>クレジットが不足しています</div>
                    </div>

                    <div class="text-xs text-gray-600 mb-3 p-3 bg-white/3 rounded-lg border border-white/10">
                        <i class="fas fa-info-circle text-gray-500 mr-1"></i>
                        <strong>注意:</strong> AI審判は<strong>ディベートのうまさ</strong>（論理構成・説得力・反論力）で勝敗を判定します。内容の正確性や超直近の時事問題への言及の正しさは評価対象外です。
                    </div>

                    <button id="aiStartBtn" disabled onclick="startAiBattle()" class="w-full py-3 rounded-xl font-bold bg-cyan-500/20 border-2 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/35 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        <i class="fas fa-play mr-2"></i>AI対戦開始
                    </button>
                </div>

                <!-- AIバトルルーム -->
                <div id="aiBattleRoom" style="display:none">
                    <div class="mode-card mb-3">
                        <div class="flex items-start justify-between mb-3 gap-3">
                            <div class="flex-1">
                                <p id="aiRoomTheme" class="font-bold text-cyan-300 text-sm mb-1"></p>
                                <div class="flex gap-2 text-xs flex-wrap">
                                    <span id="aiRoomAgree" class="bg-green-900/30 text-green-300 px-2 py-1 rounded-lg"></span>
                                    <span id="aiRoomDisagree" class="bg-red-900/30 text-red-300 px-2 py-1 rounded-lg"></span>
                                </div>
                            </div>
                            <div class="text-right shrink-0 text-xs text-gray-400">
                                ターン <span id="aiTurnNum">0</span>/<span id="aiTurnMax">10</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 mb-3 text-xs">
                            <span id="aiHumanLabel" class="font-bold"></span>
                            <span class="text-gray-500">vs</span>
                            <span class="text-red-300 font-bold"><i class="fas fa-robot mr-1"></i>AI</span>
                        </div>
                        <div id="aiChatLog" class="mb-4 p-3 bg-black/30 rounded-xl border border-white/10 space-y-3"></div>
                        <div id="aiInputArea" class="flex gap-3">
                            <textarea id="aiInput" class="flex-1 bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-cyan-500/60" rows="2" placeholder="あなたの主張を入力… (最大300字)" maxlength="300" onkeydown="aiEnterSend(event)"></textarea>
                            <button onclick="sendAiMessage()" class="px-4 self-end py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-bold text-sm hover:bg-cyan-500/35">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div id="aiThinking" style="display:none" class="text-center text-cyan-400 text-sm py-3">
                            <i class="fas fa-cog fa-spin mr-2"></i>AIが考えています…
                        </div>
                        <div id="aiJudging" style="display:none" class="text-center text-purple-400 text-sm py-3">
                            <i class="fas fa-gavel fa-bounce mr-2"></i>AI審判が全文を評価中…
                        </div>
                        <div class="flex gap-2 mt-3">
                            <button onclick="aiSurrender()" class="flex-1 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-sm hover:bg-red-500/35">
                                <i class="fas fa-flag mr-1"></i>降参
                            </button>
                        </div>
                    </div>
                    <!-- AIリザルト -->
                    <div id="aiResult" style="display:none" class="mode-card text-center">
                        <h3 class="text-2xl font-black cyber-text mb-3">対戦結果</h3>
                        <div id="aiResultMain" class="mb-3"></div>
                        <div id="aiJudgeComment" class="text-sm text-gray-300 bg-white/5 rounded-xl p-4 mb-4 text-left"></div>
                        <div id="aiScoreBar" class="mb-5">
                            <div class="flex justify-between text-xs text-gray-400 mb-1"><span id="aiScoreA"></span><span id="aiScoreB"></span></div>
                            <div class="h-3 bg-gray-800 rounded-full overflow-hidden">
                                <div id="aiScoreBarFill" class="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-1000" style="width:50%"></div>
                            </div>
                        </div>
                        <button onclick="resetAi()" class="px-8 py-3 rounded-xl bg-cyan-500/20 border-2 border-cyan-500/50 text-cyan-300 font-bold hover:bg-cyan-500/35">
                            <i class="fas fa-redo mr-2"></i>もう一度
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div id="toast" style="position:fixed;bottom:20px;right:20px;z-index:9999;display:none;" class="px-5 py-3 rounded-xl text-sm font-bold shadow-lg"></div>

    <script>
    const CU_ID = ${safeUserId};
    const CU_NAME = ${safeUsername};
    let currentMode = 'pvp';

    const DIFF_CREDITS = { easy: 30, normal: 50, hard: 80 };
    const DIFF_DESC = {
        easy:   'AIは優しく丁寧な反論をします。',
        normal: 'AIは論理的な反論で挑んできます。',
        hard:   'AIは鋭い論理と容赦ない反論で挑んできます！'
    };

    function switchMode(mode) {
        currentMode = mode;
        document.getElementById('pvpSection').style.display = mode === 'pvp' ? 'block' : 'none';
        document.getElementById('aiSection').style.display = mode === 'ai' ? 'block' : 'none';
        document.querySelectorAll('#modeTabs .battle-tab').forEach(function(b, i) {
            b.classList.toggle('active', ['pvp','ai'][i] === mode);
        });
        if (mode === 'ai') loadAiThemes();
    }

    function showToast(msg, type) {
        var el = document.getElementById('toast');
        el.textContent = msg;
        el.className = 'px-5 py-3 rounded-xl text-sm font-bold shadow-lg ' +
            (type === 'success' ? 'bg-green-800 text-white' : type === 'warning' ? 'bg-yellow-800 text-white' : 'bg-red-800 text-white');
        el.style.display = 'block';
        clearTimeout(el._t);
        el._t = setTimeout(function() { el.style.display = 'none'; }, 3500);
    }

    function escHtml(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

    // ─── ライブディベート取得 ───
    var liveDebate = null;
    async function fetchLiveDebate() {
        try {
            var r = await fetch('/api/debates/live');
            var d = await r.json();
            return d.debate || null;
        } catch(e) { return null; }
    }

    async function initPvpLobby() {
        liveDebate = await fetchLiveDebate();
        if (liveDebate && liveDebate.title) {
            document.getElementById('pvpLiveTitle').textContent = liveDebate.title;
            document.getElementById('pvpLiveAgree').textContent = liveDebate.agree_position || '';
            document.getElementById('pvpLiveDisagree').textContent = liveDebate.disagree_position || '';
            document.getElementById('pvpLiveInfo').style.display = 'block';
            document.getElementById('pvpNoLive').style.display = 'none';
        } else {
            document.getElementById('pvpLiveInfo').style.display = 'none';
            document.getElementById('pvpNoLive').style.display = 'block';
        }
    }

    // ─── PvP ───
    var pvpStance = null, pvpRoomId = null, pvpYourStance = null;
    var pvpMessages = [], pvpPollTimer = null, pvpWaitTimer = null, pvpWaitSec = 0;
    var pvpMyTurnCount = 0;
    var pvpTotalTurns = 0;
    var pvpJudging = false;
    var pvpFirstPlayer = null;
    var pvpPlayerAId = null, pvpPlayerBId = null;
    var pvpInputTimer = null, pvpTimerSec = 60;
    var PVP_TURNS_PER_PLAYER = 5;  // 各プレイヤー5ターン = 合計10
    var PVP_INPUT_TIMEOUT = 60;    // 60秒入力タイムアウト

    function startPvpInputTimer() {
        stopPvpInputTimer();
        pvpTimerSec = PVP_INPUT_TIMEOUT;
        var timerEl = document.getElementById('pvpTimerSec');
        var timerBox = document.getElementById('pvpInputTimer');
        if (timerBox) timerBox.style.display = 'block';
        if (timerEl) timerEl.textContent = pvpTimerSec;
        pvpInputTimer = setInterval(function() {
            pvpTimerSec--;
            if (timerEl) timerEl.textContent = pvpTimerSec;
            if (pvpTimerSec <= 10 && timerEl) timerEl.style.color = '#ef4444';
            if (pvpTimerSec <= 0) {
                // タイムアウト: 空メッセージを自動送信して相手ターンに移行
                stopPvpInputTimer();
                autoSendPvpTimeout();
            }
        }, 1000);
    }

    function stopPvpInputTimer() {
        if (pvpInputTimer) { clearInterval(pvpInputTimer); pvpInputTimer = null; }
        var timerBox = document.getElementById('pvpInputTimer');
        var timerEl = document.getElementById('pvpTimerSec');
        if (timerBox) timerBox.style.display = 'none';
        if (timerEl) { timerEl.textContent = PVP_INPUT_TIMEOUT; timerEl.style.color = '#fbbf24'; }
    }

    async function autoSendPvpTimeout() {
        // タイムアウト: 「（時間切れ）」として送信
        if (!pvpRoomId) return;
        try {
            await fetch('/api/battle/room/' + pvpRoomId + '/message', {
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({content: '（時間切れ）'})
            });
        } catch(e) {}
        showToast('⏰ 時間切れ！自動的に相手のターンへ', 'warning');
        await loadPvpRoom();
    }

    function selectPvpStance(s) {
        pvpStance = s;
        document.getElementById('pvpAgreeBtn').classList.toggle('selected', s === 'agree');
        document.getElementById('pvpDisagreeBtn').classList.toggle('selected', s === 'disagree');
        document.getElementById('pvpJoinBtn').disabled = false;
    }

    async function joinPvpQueue() {
        if (!pvpStance) return;
        document.getElementById('pvpJoinBtn').disabled = true;
        try {
            var r = await fetch('/api/battle/queue/join', {
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({mode:'pvp', stance: pvpStance})
            });
            var d = await r.json();
            if (d.error) { showToast(d.error, 'error'); document.getElementById('pvpJoinBtn').disabled = false; return; }
            document.getElementById('pvpLobby').style.display = 'none';
            document.getElementById('pvpWaiting').style.display = 'block';
            pvpWaitSec = 0;
            pvpWaitTimer = setInterval(function() {
                pvpWaitSec++;
                var el = document.getElementById('pvpWaitTime');
                if (el) el.textContent = pvpWaitSec + '秒';
            }, 1000);
            pvpPollTimer = setInterval(pollPvpQueue, 2000);
        } catch(e) { showToast('通信エラー', 'error'); document.getElementById('pvpJoinBtn').disabled = false; }
    }

    async function leavePvpQueue() {
        clearInterval(pvpPollTimer); clearInterval(pvpWaitTimer);
        await fetch('/api/battle/queue/leave', {method:'DELETE'});
        document.getElementById('pvpWaiting').style.display = 'none';
        document.getElementById('pvpLobby').style.display = 'block';
        document.getElementById('pvpJoinBtn').disabled = !pvpStance;
    }

    async function pollPvpQueue() {
        try {
            var r = await fetch('/api/battle/queue/status');
            var d = await r.json();
            if (d.status === 'matched') {
                clearInterval(pvpPollTimer); clearInterval(pvpWaitTimer);
                pvpRoomId = d.room_id;
                pvpYourStance = d.your_stance;
                pvpFirstPlayer = d.first_player || null;
                document.getElementById('pvpWaiting').style.display = 'none';
                // コインフリップ演出
                await showCoinFlip(d.your_stance, d.first_player);
                document.getElementById('pvpRoom').style.display = 'block';
                await loadPvpRoom();
                pvpPollTimer = setInterval(loadPvpRoom, 2500);
            }
        } catch(e) {}
    }

    async function showCoinFlip(yourStance, firstPlayer) {
        document.getElementById('pvpCoinFlip').style.display = 'block';
        var coin = document.getElementById('coinDisplay');
        var result = document.getElementById('coinResult');
        result.style.opacity = '0';
        // コイン回転アニメ
        var coins = ['🪙','⭕','🪙','❌','🪙','⭕','🪙'];
        for (var i = 0; i < coins.length; i++) {
            coin.textContent = coins[i];
            await sleep(180);
        }
        var isFirst = (firstPlayer === CU_ID);
        coin.textContent = isFirst ? '🥇' : '🥈';
        result.style.opacity = '1';
        result.className = 'text-2xl font-black flash-in ' + (isFirst ? 'text-yellow-400' : 'text-cyan-400');
        result.textContent = isFirst ? '🎲 あなたが先攻！' : '🎲 あなたが後攻！';
        await sleep(2000);
        document.getElementById('pvpCoinFlip').style.display = 'none';
    }

    function sleep(ms) { return new Promise(function(r){ setTimeout(r, ms); }); }

    async function loadPvpRoom() {
        if (!pvpRoomId || pvpJudging) return;
        try {
            var r = await fetch('/api/battle/room/' + pvpRoomId);
            var d = await r.json();
            if (d.error) return;

            // first_player保存
            if (d.first_player) pvpFirstPlayer = d.first_player;
            if (d.player_a_id) pvpPlayerAId = d.player_a_id;
            if (d.player_b_id) pvpPlayerBId = d.player_b_id;

            // テーマ表示
            var theme = d.debate && d.debate.title ? d.debate.title : (liveDebate ? liveDebate.title : '');
            document.getElementById('pvpRoomTheme').textContent = theme || 'テーマなし';
            if (d.debate) {
                document.getElementById('pvpRoomAgree').textContent = d.debate.agree_position || '';
                document.getElementById('pvpRoomDisagree').textContent = d.debate.disagree_position || '';
            }
            document.getElementById('pvpPlayerA').textContent = escHtml(d.player_a) + '（賛成）';
            document.getElementById('pvpPlayerB').textContent = escHtml(d.player_b || '待機中') + '（反対）';

            var msgs = d.messages || [];
            pvpTotalTurns = msgs.length;
            document.getElementById('pvpTurnNum').textContent = msgs.length;

            if (msgs.length !== pvpMessages.length) {
                pvpMessages = msgs;
                renderPvpChat(msgs, pvpYourStance || d.your_stance);
            }

            // ターンインジケーター: 先攻ベースで交互
            var isMyTurn = false;
            var fp = pvpFirstPlayer || d.first_player;
            if (fp) {
                var imFirst = fp === CU_ID;
                isMyTurn = msgs.length % 2 === (imFirst ? 0 : 1);
            } else {
                // フォールバック: 最後のメッセージが相手なら自分のターン
                var lastMsg = msgs[msgs.length - 1];
                isMyTurn = msgs.length === 0 || (lastMsg && lastMsg.user_id !== CU_ID);
            }

            var badge = document.getElementById('pvpTurnBadge');
            if (d.status !== 'ended' && !pvpJudging) {
                if (isMyTurn) {
                    badge.textContent = '🎤 あなたのターン';
                    badge.className = 'turn-indicator your-turn';
                    document.getElementById('pvpInputArea').style.display = 'flex';
                    document.getElementById('pvpWaitMsg').style.display = 'none';
                    startPvpInputTimer();
                } else {
                    badge.textContent = '⏳ 相手のターン';
                    badge.className = 'turn-indicator opp-turn';
                    document.getElementById('pvpInputArea').style.display = 'none';
                    document.getElementById('pvpWaitMsg').style.display = 'block';
                    stopPvpInputTimer();
                }
            }

            // 各プレイヤーが5ターン（合計10）でAI審判 または ended
            var myMsgCount = msgs.filter(function(m){ return m.user_id === CU_ID; }).length;
            var oppMsgCount = msgs.filter(function(m){ return m.user_id !== CU_ID; }).length;
            var totalMsgs = msgs.length;

            if (d.status === 'ended') {
                clearInterval(pvpPollTimer);
                stopPvpInputTimer();
                if (d.winner && !pvpJudging) {
                    // 降参による終了
                    showPvpResult(d.winner, pvpYourStance || d.your_stance, null);
                }
            } else if (totalMsgs >= PVP_TURNS_PER_PLAYER * 2 && !pvpJudging) {
                // 両者5ターン完了 → AI審判
                clearInterval(pvpPollTimer);
                stopPvpInputTimer();
                pvpJudging = true;
                document.getElementById('pvpInputArea').style.display = 'none';
                document.getElementById('pvpWaitMsg').style.display = 'none';
                badge.textContent = '⚖️ AI審判中…';
                badge.className = 'turn-indicator opp-turn';
                await requestPvpJudge(d);
            }
        } catch(e) {}
    }

    function renderPvpChat(msgs, myStance) {
        var log = document.getElementById('chatLog');
        if (!msgs.length) {
            log.innerHTML = '<div class="text-center text-gray-500 text-sm py-8">まだメッセージはありません。先攻のプレイヤーから開始！</div>';
            return;
        }
        log.innerHTML = msgs.map(function(m) {
            var isMe = m.user_id === CU_ID;
            var cls = m.stance === 'agree' ? 'chat-msg-agree' : 'chat-msg-disagree';
            var stanceTag = m.stance === 'agree' ? '<span class="text-green-400">賛成</span>' : '<span class="text-red-400">反対</span>';
            return '<div class="' + cls + '">' +
                '<div class="text-xs text-gray-400 mb-1">' + escHtml(m.username || m.user_id) + ' [' + stanceTag + ']' + (isMe ? ' <span class="text-cyan-400">(あなた)</span>' : '') + '</div>' +
                '<p class="text-sm text-white">' + escHtml(m.content) + '</p>' +
                '</div>';
        }).join('');
        log.scrollTop = log.scrollHeight;
    }

    async function sendPvpMessage() {
        var input = document.getElementById('pvpInput');
        var content = input.value.trim();
        if (!content || !pvpRoomId) return;
        input.value = '';
        stopPvpInputTimer();
        // 送信中は入力不可
        input.disabled = true;
        try {
            var r = await fetch('/api/battle/room/' + pvpRoomId + '/message', {
                method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({content: content})
            });
            var d = await r.json();
            if (!d.success) showToast('送信失敗: ' + (d.error||''), 'error');
            else await loadPvpRoom();
        } catch(e) { showToast('通信エラー', 'error'); }
        input.disabled = false;
    }

    function pvpEnterSend(e) { if (e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendPvpMessage();} }

    async function pvpSurrender() {
        if (!confirm('降参しますか？')) return;
        clearInterval(pvpPollTimer);
        var surrenderStance = pvpYourStance === 'agree' ? 'disagree' : 'agree';
        try {
            await fetch('/api/battle/room/' + pvpRoomId + '/end', {
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({winner: surrenderStance})
            });
        } catch(e) {}
        showPvpResult(surrenderStance, pvpYourStance, null, true);
    }

    async function requestPvpJudge(roomData) {
        try {
            var r = await fetch('/api/battle/evaluate', {
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({
                    theme: (roomData.debate && roomData.debate.title) || '',
                    agree_opinion: (roomData.debate && roomData.debate.agree_position) || '',
                    disagree_opinion: (roomData.debate && roomData.debate.disagree_position) || '',
                    messages: pvpMessages,
                    player_agree: pvpPlayerAId || roomData.player_a_id || '',
                    player_disagree: pvpPlayerBId || roomData.player_b_id || '',
                    mode: 'pvp'
                })
            });
            var d = await r.json();
            if (d.error) { showToast('AI審判エラー', 'error'); pvpJudging = false; return; }
            // DBに結果を保存
            await fetch('/api/battle/room/' + pvpRoomId + '/end', {
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({winner: d.winner})
            });
            showPvpResult(d.winner, pvpYourStance, d, false);
        } catch(e) { showToast('審判通信エラー', 'error'); pvpJudging = false; }
    }

    function showPvpResult(winner, myStance, judgeData, isSurrender) {
        document.getElementById('pvpInputArea').style.display = 'none';
        document.getElementById('pvpWaitMsg').style.display = 'none';
        document.getElementById('pvpResult').style.display = 'block';
        var won = winner === myStance;
        var isDraw = winner === 'draw';
        var mainEl = document.getElementById('pvpResultMain');
        if (isSurrender) {
            mainEl.innerHTML = '<p class="text-red-400 text-2xl font-black">🏳 降参</p>';
        } else if (isDraw) {
            mainEl.innerHTML = '<p class="text-yellow-400 text-2xl font-black">🤝 引き分け</p>';
        } else if (won) {
            mainEl.innerHTML = '<p class="text-yellow-400 text-3xl font-black flash-in">🏆 あなたの勝利！</p>';
        } else {
            mainEl.innerHTML = '<p class="text-gray-400 text-2xl font-bold">💀 敗北…</p>';
        }
        if (judgeData) {
            var commentEl = document.getElementById('pvpJudgeComment');
            commentEl.style.display = 'block';
            var oneWordHtml = judgeData.one_word
                ? '<div class="inline-block text-xs bg-purple-900/40 border border-purple-500/50 rounded-full px-3 py-1 text-purple-300 font-bold mb-2">✨ ' + escHtml(judgeData.one_word) + '</div><br>'
                : '';
            commentEl.innerHTML =
                '<div class="text-xs text-purple-400 font-bold mb-2"><i class="fas fa-gavel mr-1"></i>AI審判コメント</div>' +
                oneWordHtml +
                '<p class="text-sm text-gray-200 mb-2">' + escHtml(judgeData.reason || '') + '</p>' +
                '<p class="text-xs text-gray-400">' + escHtml(judgeData.comment || '') + '</p>';
            var scoreBar = document.getElementById('pvpScoreBar');
            scoreBar.style.display = 'block';
            var agreeScore = judgeData.agree_score || 50;
            var disagreeScore = judgeData.disagree_score || 50;
            document.getElementById('pvpScoreA').textContent = '賛成 ' + agreeScore + 'pt';
            document.getElementById('pvpScoreB').textContent = '反対 ' + disagreeScore + 'pt';
            setTimeout(function() {
                document.getElementById('pvpScoreBarFill').style.width = agreeScore + '%';
            }, 300);
            // レーティング変動表示
            if (judgeData.rating_change) {
                var ratingEl = document.getElementById('pvpRatingChange');
                ratingEl.style.display = 'block';
                var myChange = won
                    ? (judgeData.rating_change.winner_change || 0)
                    : (judgeData.rating_change.loser_change || 0);
                var sign = myChange >= 0 ? '+' : '';
                ratingEl.innerHTML = '<i class="fas fa-chart-line mr-2"></i>レーティング変動: <span class="' + (myChange >= 0 ? 'text-green-400' : 'text-red-400') + '">' + sign + myChange + '</span>';
            }
        }
    }

    function resetPvp() {
        clearInterval(pvpPollTimer); clearInterval(pvpWaitTimer);
        stopPvpInputTimer();
        pvpRoomId=null; pvpYourStance=null; pvpStance=null; pvpMessages=[]; pvpWaitSec=0;
        pvpMyTurnCount=0; pvpTotalTurns=0; pvpJudging=false; pvpFirstPlayer=null;
        pvpPlayerAId=null; pvpPlayerBId=null;
        document.getElementById('pvpRoom').style.display='none';
        document.getElementById('pvpResult').style.display='none';
        document.getElementById('pvpInputArea').style.display='flex';
        document.getElementById('pvpAgreeBtn').classList.remove('selected');
        document.getElementById('pvpDisagreeBtn').classList.remove('selected');
        document.getElementById('pvpJoinBtn').disabled=true;
        document.getElementById('pvpLobby').style.display='block';
        initPvpLobby();
    }

    // ─── AI Battle ───
    var aiStance=null, aiDiff='easy', aiTheme=null, aiHistory=[], aiTurnCount=0, aiMaxTurns=10;

    function updateTurnsUI() {
        aiMaxTurns = parseInt(document.getElementById('aiTurnsSlider').value);
        document.getElementById('aiTurnsLabel').textContent = aiMaxTurns;
        updateAiCreditCost();
    }

    function selectDiff(d) {
        aiDiff = d;
        ['easy','normal','hard'].forEach(function(x) {
            document.getElementById('diff' + x.charAt(0).toUpperCase() + x.slice(1)).classList.toggle('selected', x === d);
        });
        document.getElementById('diffDesc').textContent = DIFF_DESC[d];
        updateAiCreditCost();
    }

    function updateAiCreditCost() {
        var base = DIFF_CREDITS[aiDiff] || 50;
        var turns = parseInt(document.getElementById('aiTurnsSlider').value) || 10;
        var cost = base + Math.max(0, turns - 10) * 3;
        document.getElementById('aiCreditCost').textContent = cost + ' cr';
        var warn = document.getElementById('aiCreditWarn');
        warn.style.display = cost > userCredits ? 'block' : 'none';
    }

    function selectAiStance(s) {
        aiStance = s;
        document.getElementById('aiAgreeBtn').classList.toggle('selected', s==='agree');
        document.getElementById('aiDisagreeBtn').classList.toggle('selected', s==='disagree');
        updateAiStartBtn();
    }

    function updateAiStartBtn() {
        var hasTheme = aiTheme !== null || document.getElementById('customThemeInputs').style.display !== 'none';
        document.getElementById('aiStartBtn').disabled = !(hasTheme && aiStance);
    }

    async function loadAiThemes() {
        try {
            var live = await fetchLiveDebate();
            var r = await fetch('/api/dev/themes');
            var d = await r.json();
            var themes = (d.themes || []).filter(function(t){ return t.status==='active'; }).slice(0,6);
            var el = document.getElementById('aiThemeList');
            var html = '';
            if (live && live.title) {
                var lt = live;
                html += '<div class="theme-option selected" style="border-color:rgba(34,197,94,0.6);background:rgba(34,197,94,0.1);" onclick="selectAiThemeData(' +
                    encodeThemeData(lt) + ')">' +
                    '<div class="flex items-center gap-2 mb-1"><div class="pulse-dot"></div><span class="text-green-400 text-xs font-bold">ライブ中</span></div>' +
                    '<p class="text-sm font-bold text-white">' + escHtml(lt.title) + '</p>' +
                    '<p class="text-xs text-green-300"><i class="fas fa-check mr-1"></i>' + escHtml(lt.agree_position||'') + '</p>' +
                    '<p class="text-xs text-red-300"><i class="fas fa-times mr-1"></i>' + escHtml(lt.disagree_position||'') + '</p>' +
                    '</div>';
                aiTheme = { title: lt.title, agree_opinion: lt.agree_position||'', disagree_opinion: lt.disagree_position||'' };
                updateAiStartBtn();
            }
            themes.forEach(function(t) {
                html += '<div class="theme-option" onclick="selectAiThemeData(' + encodeThemeData2(t) + ')">' +
                    '<p class="text-sm font-bold text-white">' + escHtml(t.title) + '</p>' +
                    '<p class="text-xs text-green-300"><i class="fas fa-check mr-1"></i>' + escHtml(t.agree_opinion||'') + '</p>' +
                    '<p class="text-xs text-red-300"><i class="fas fa-times mr-1"></i>' + escHtml(t.disagree_opinion||'') + '</p>' +
                    '</div>';
            });
            if (!html) html = '<div class="text-gray-500 text-sm text-center py-3">テーマがありません</div>';
            el.innerHTML = html;
        } catch(e) {
            document.getElementById('aiThemeList').innerHTML = '<div class="text-gray-500 text-sm">読み込み失敗</div>';
        }
    }

    function encodeThemeData(t) {
        return JSON.stringify(JSON.stringify({title:t.title,agree:t.agree_position||'',disagree:t.disagree_position||''}));
    }
    function encodeThemeData2(t) {
        return JSON.stringify(JSON.stringify({title:t.title,agree:t.agree_opinion||'',disagree:t.disagree_opinion||''}));
    }

    function selectAiThemeData(jsonStr) {
        var data = JSON.parse(jsonStr);
        aiTheme = { title: data.title, agree_opinion: data.agree, disagree_opinion: data.disagree };
        document.querySelectorAll('#aiThemeList .theme-option').forEach(function(e){ e.classList.remove('selected'); });
        event.currentTarget.classList.add('selected');
        document.getElementById('customThemeOpt').classList.remove('selected');
        document.getElementById('customThemeInputs').style.display = 'none';
        updateAiStartBtn();
    }

    function toggleCustomTheme() {
        var inp = document.getElementById('customThemeInputs');
        var showing = inp.style.display !== 'none';
        inp.style.display = showing ? 'none' : 'block';
        document.querySelectorAll('#aiThemeList .theme-option').forEach(function(e){ e.classList.remove('selected'); });
        document.getElementById('customThemeOpt').classList.toggle('selected', !showing);
        if (showing) { aiTheme = null; updateAiStartBtn(); }
    }

    async function startAiBattle() {
        if (document.getElementById('customThemeInputs').style.display !== 'none') {
            var t = document.getElementById('aiCustomTheme').value.trim();
            var a = document.getElementById('aiCustomAgree').value.trim();
            var b = document.getElementById('aiCustomDisagree').value.trim();
            if (!t) { showToast('テーマを入力してください', 'error'); return; }
            aiTheme = { title: t, agree_opinion: a||'賛成の立場', disagree_opinion: b||'反対の立場' };
        }
        if (!aiTheme || !aiStance) { showToast('テーマと立場を選択してください', 'error'); return; }
        aiMaxTurns = parseInt(document.getElementById('aiTurnsSlider').value) || 10;
        var base = DIFF_CREDITS[aiDiff] || 50;
        var turns = aiMaxTurns;
        var cost = base + Math.max(0, turns - 10) * 3;
        if (cost > userCredits) { showToast('クレジットが不足しています（必要: ' + cost + ' cr）', 'error'); return; }

        aiHistory = []; aiTurnCount = 0;
        document.getElementById('aiSetup').style.display = 'none';
        document.getElementById('aiBattleRoom').style.display = 'block';
        document.getElementById('aiRoomTheme').textContent = aiTheme.title;
        document.getElementById('aiRoomAgree').textContent = aiTheme.agree_opinion;
        document.getElementById('aiRoomDisagree').textContent = aiTheme.disagree_opinion;
        document.getElementById('aiTurnMax').textContent = aiMaxTurns;
        var stanceLabel = aiStance === 'agree' ? '賛成' : '反対';
        document.getElementById('aiHumanLabel').innerHTML = 'あなた（<span class="' + (aiStance==='agree' ? 'text-green-300' : 'text-red-300') + '">' + stanceLabel + '</span>）';
        document.getElementById('aiChatLog').innerHTML = '<div class="text-center text-gray-500 text-sm py-4"><i class="fas fa-play-circle mr-2"></i>ディベート開始！まずあなたの主張を入力してください。</div>';
        document.getElementById('aiTurnNum').textContent = '0';
    }

    async function sendAiMessage() {
        var input = document.getElementById('aiInput');
        var content = input.value.trim();
        if (!content) return;
        input.value = ''; input.disabled = true;
        var aiStanceStr = aiStance === 'agree' ? 'disagree' : 'agree';
        aiHistory.push({content:content, is_ai:false, stance:aiStance, username: CU_NAME||'あなた'});
        aiTurnCount++;
        renderAiChat();
        document.getElementById('aiTurnNum').textContent = aiTurnCount;

        if (aiTurnCount >= aiMaxTurns) {
            input.disabled = false;
            await judgeAiBattle();
            return;
        }

        document.getElementById('aiThinking').style.display = 'block';
        try {
            var r = await fetch('/api/battle/ai/message', {
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({
                    theme: aiTheme.title,
                    agree_opinion: aiTheme.agree_opinion,
                    disagree_opinion: aiTheme.disagree_opinion,
                    ai_stance: aiStanceStr,
                    human_stance: aiStance,
                    difficulty: aiDiff,
                    conversation_history: aiHistory,
                    human_message: content
                })
            });
            var d = await r.json();
            document.getElementById('aiThinking').style.display = 'none';
            if (d.error) { showToast('AIエラー: ' + d.error, 'error'); input.disabled=false; return; }
            aiHistory.push({content:d.message, is_ai:true, stance:aiStanceStr, username:'AI'});
            aiTurnCount++;
            renderAiChat();
            document.getElementById('aiTurnNum').textContent = aiTurnCount;
            if (aiTurnCount >= aiMaxTurns) { await judgeAiBattle(); }
        } catch(e) {
            document.getElementById('aiThinking').style.display = 'none';
            showToast('通信エラー', 'error');
        }
        input.disabled = false;
    }

    function aiEnterSend(e) { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendAiMessage();} }

    function renderAiChat() {
        var log = document.getElementById('aiChatLog');
        log.innerHTML = aiHistory.map(function(m) {
            var cls = m.is_ai ? 'chat-msg-ai' : (m.stance==='agree'?'chat-msg-agree':'chat-msg-disagree');
            var stanceTag = m.stance==='agree' ? '<span class="text-green-400">賛成</span>' : '<span class="text-red-400">反対</span>';
            var nameLabel = m.is_ai ? '<i class="fas fa-robot mr-1 text-cyan-400"></i>AI' : escHtml(m.username||'あなた');
            return '<div class="' + cls + '">' +
                '<div class="text-xs text-gray-400 mb-1">' + nameLabel + ' [' + stanceTag + ']</div>' +
                '<p class="text-sm text-white">' + escHtml(m.content) + '</p>' +
                '</div>';
        }).join('');
        log.scrollTop = log.scrollHeight;
    }

    async function aiSurrender() {
        if (!confirm('降参しますか？')) return;
        document.getElementById('aiInputArea').style.display = 'none';
        document.getElementById('aiThinking').style.display = 'none';
        document.getElementById('aiBattleRoom').querySelector('.mode-card').style.display = 'none';
        showAiResult({winner: 'ai', reason:'降参しました', comment:'次は最後まで戦ってみましょう！', agree_score:30, disagree_score:70}, true);
    }

    async function judgeAiBattle() {
        document.getElementById('aiInputArea').style.display = 'none';
        document.getElementById('aiThinking').style.display = 'none';
        document.getElementById('aiJudging').style.display = 'block';
        try {
            var aiStanceStr = aiStance === 'agree' ? 'disagree' : 'agree';
            var msgs = aiHistory.map(function(m){
                return {username: m.is_ai ? 'AI' : (CU_NAME||'あなた'), stance: m.stance, content: m.content, user_id: m.is_ai ? 'AI' : CU_ID};
            });
            // クレジット消費計算
            var base = DIFF_CREDITS[aiDiff] || 50;
            var turns = aiMaxTurns;
            var cost = base + Math.max(0, turns - 10) * 3;

            var r = await fetch('/api/battle/evaluate', {
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({
                    theme: aiTheme.title,
                    agree_opinion: aiTheme.agree_opinion,
                    disagree_opinion: aiTheme.disagree_opinion,
                    messages: msgs,
                    mode: 'ai',
                    ai_battle_cost: cost
                })
            });
            document.getElementById('aiJudging').style.display = 'none';
            var d = await r.json();
            if (d.error) { showToast('審判エラー', 'error'); return; }
            showAiResult(d, false);
        } catch(e) {
            document.getElementById('aiJudging').style.display = 'none';
            showToast('審判通信エラー', 'error');
        }
    }

    function showAiResult(judgeData, isSurrender) {
        document.getElementById('aiResult').style.display = 'block';
        var winner = judgeData.winner;
        var humanWon = (winner === 'ai') ? false : (winner === aiStance);
        var isDraw = winner === 'draw';
        var mainEl = document.getElementById('aiResultMain');
        if (isSurrender) {
            mainEl.innerHTML = '<p class="text-red-400 text-2xl font-black">🏳 降参 — AIの勝利</p>';
        } else if (isDraw) {
            mainEl.innerHTML = '<p class="text-yellow-400 text-2xl font-black">🤝 引き分け！</p>';
        } else if (humanWon) {
            mainEl.innerHTML = '<p class="text-yellow-400 text-3xl font-black flash-in">🏆 あなたの勝利！</p>';
        } else {
            mainEl.innerHTML = '<p class="text-cyan-400 text-2xl font-bold">🤖 AIの勝利！</p>';
        }
        var commentEl = document.getElementById('aiJudgeComment');
        var oneWordHtml = judgeData.one_word
            ? '<div class="inline-block text-xs bg-purple-900/40 border border-purple-500/50 rounded-full px-3 py-1 text-purple-300 font-bold mb-2">✨ ' + escHtml(judgeData.one_word) + '</div><br>'
            : '';
        commentEl.innerHTML = '<div class="text-xs text-purple-400 font-bold mb-2"><i class="fas fa-gavel mr-1"></i>AI審判コメント</div>' +
            oneWordHtml +
            '<p class="text-sm text-gray-200 mb-2">' + escHtml(judgeData.reason || '') + '</p>' +
            '<p class="text-xs text-gray-400">' + escHtml(judgeData.comment || '') + '</p>';
        var agreeScore = judgeData.agree_score || 50;
        var disagreeScore = judgeData.disagree_score || 50;
        document.getElementById('aiScoreA').textContent = '賛成 ' + agreeScore + 'pt';
        document.getElementById('aiScoreB').textContent = '反対 ' + disagreeScore + 'pt';
        setTimeout(function() {
            document.getElementById('aiScoreBarFill').style.width = agreeScore + '%';
        }, 300);
    }

    function resetAi() {
        aiStance=null; aiTheme=null; aiHistory=[]; aiTurnCount=0; aiDiff='easy'; aiMaxTurns=10;
        document.getElementById('aiBattleRoom').style.display='none';
        document.getElementById('aiResult').style.display='none';
        document.getElementById('aiInputArea').style.display='flex';
        document.getElementById('aiJudging').style.display='none';
        document.getElementById('aiSetup').style.display='block';
        document.getElementById('aiAgreeBtn').classList.remove('selected');
        document.getElementById('aiDisagreeBtn').classList.remove('selected');
        document.getElementById('aiStartBtn').disabled=true;
        selectDiff('easy');
        document.getElementById('aiTurnsSlider').value=10;
        updateTurnsUI();
        loadAiThemes();
    }

    // ─── 初期化 ───
    document.addEventListener('DOMContentLoaded', function() {
        initPvpLobby();
        updateTurnsUI();
        selectDiff('easy');
    });
    </script>
</body>
</html>`;
};
