import { globalNav } from '../components/global-nav';

export const battlePage = (user: any) => `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <title>対戦 - AI Debate Arena</title>
    <meta name="robots" content="noindex, nofollow">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/styles.css" rel="stylesheet">
    <style>
        .battle-tab { padding: 12px 28px; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 16px; transition: all 0.3s; background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.1); color: #9ca3af; }
        .battle-tab:hover { background: rgba(6,182,212,0.15); border-color: rgba(6,182,212,0.4); }
        .battle-tab.active { background: rgba(6,182,212,0.25); border-color: #06b6d4; color: #fff; box-shadow: 0 0 20px rgba(6,182,212,0.3); }
        .mode-card { background: linear-gradient(135deg, rgba(0,20,40,0.9), rgba(20,0,40,0.9)); border: 2px solid rgba(0,255,255,0.3); border-radius: 16px; padding: 30px; transition: all 0.3s; cursor: pointer; }
        .mode-card:hover { border-color: #00ffff; box-shadow: 0 0 30px rgba(0,255,255,0.3); transform: translateY(-4px); }
        .mode-card.selected { border-color: #00ffff; box-shadow: 0 0 40px rgba(0,255,255,0.5); }
        .topic-input { background: rgba(0,0,0,0.5); border: 2px solid rgba(0,255,255,0.3); border-radius: 10px; padding: 12px 16px; color: white; width: 100%; transition: all 0.3s; }
        .topic-input:focus { outline: none; border-color: #00ffff; box-shadow: 0 0 20px rgba(0,255,255,0.3); }
        .battle-btn { background: linear-gradient(135deg, rgba(0,255,255,0.3), rgba(255,0,255,0.3)); border: 2px solid #00ffff; border-radius: 12px; padding: 16px 40px; color: white; font-weight: 700; font-size: 18px; cursor: pointer; transition: all 0.3s; box-shadow: 0 0 20px rgba(0,255,255,0.3); }
        .battle-btn:hover { background: linear-gradient(135deg, rgba(0,255,255,0.5), rgba(255,0,255,0.5)); box-shadow: 0 0 30px rgba(0,255,255,0.6); transform: translateY(-2px); }
        .battle-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .chat-bubble { border-radius: 12px; padding: 14px 18px; max-width: 85%; margin-bottom: 12px; animation: fadeIn 0.3s ease; }
        .chat-user { align-self: flex-end; background: linear-gradient(135deg, rgba(6,182,212,0.3), rgba(6,182,212,0.15)); border: 1px solid rgba(6,182,212,0.4); border-radius: 12px 12px 4px 12px; }
        .chat-ai { align-self: flex-start; background: linear-gradient(135deg, rgba(168,85,247,0.3), rgba(168,85,247,0.15)); border: 1px solid rgba(168,85,247,0.4); border-radius: 12px 12px 12px 4px; }
        .typing-indicator { display: flex; gap: 4px; padding: 8px 14px; }
        .typing-indicator span { width: 8px; height: 8px; border-radius: 50%; background: #a855f7; animation: bounce 1.4s infinite; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-8px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    </style>
</head>
<body class="bg-black text-white">
    \${globalNav(user)}
    
    <div class="min-h-screen pt-24 pb-12">
        <div class="cyber-grid"></div>
        
        <div class="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
            <!-- Header -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-black cyber-text mb-3">
                    <i class="fas fa-gamepad mr-3 text-cyan-400"></i>対戦モード
                </h1>
                <p class="text-gray-300">AIと議論して腕を磨こう</p>
            </div>

            <!-- Battle Mode Tabs -->
            <div class="flex justify-center gap-4 mb-8">
                <button class="battle-tab active" data-mode="ai" onclick="switchMode('ai')">
                    <i class="fas fa-robot mr-2"></i>AI対戦
                </button>
                <button class="battle-tab" data-mode="user" onclick="switchMode('user')">
                    <i class="fas fa-user-friends mr-2"></i>ユーザー対戦
                </button>
            </div>

            <!-- AI Battle Section -->
            <div id="ai-battle-section">
                <!-- Setup Phase -->
                <div id="ai-setup" class="space-y-6">
                    <div class="cyber-card">
                        <h2 class="text-2xl font-bold text-cyan-300 mb-6">
                            <i class="fas fa-cog mr-2"></i>AI対戦設定
                        </h2>
                        
                        <!-- Topic Input -->
                        <div class="mb-6">
                            <label class="block text-cyan-300 font-bold mb-2">ディベートテーマ</label>
                            <input type="text" id="ai-topic" class="topic-input" placeholder="例：リモートワークは生産性を向上させるか" maxlength="100">
                            <div class="text-xs text-gray-500 mt-1">空欄の場合はランダムテーマが選ばれます</div>
                        </div>

                        <!-- Stance Selection -->
                        <div class="mb-6">
                            <label class="block text-cyan-300 font-bold mb-3">あなたの立場</label>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="mode-card selected" id="stance-agree" onclick="selectStance('agree')">
                                    <div class="text-center">
                                        <i class="fas fa-check-circle text-4xl text-green-400 mb-3"></i>
                                        <h3 class="text-xl font-bold text-green-400">賛成</h3>
                                        <p class="text-sm text-gray-400 mt-2">テーマに対して賛成の立場で議論</p>
                                    </div>
                                </div>
                                <div class="mode-card" id="stance-disagree" onclick="selectStance('disagree')">
                                    <div class="text-center">
                                        <i class="fas fa-times-circle text-4xl text-red-400 mb-3"></i>
                                        <h3 class="text-xl font-bold text-red-400">反対</h3>
                                        <p class="text-sm text-gray-400 mt-2">テーマに対して反対の立場で議論</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- AI Difficulty -->
                        <div class="mb-6">
                            <label class="block text-cyan-300 font-bold mb-3">AI難易度</label>
                            <div class="grid grid-cols-3 gap-3">
                                <button class="mode-card text-center py-4" id="diff-easy" onclick="selectDifficulty('easy')" style="padding:16px;">
                                    <i class="fas fa-seedling text-2xl text-green-400 mb-2"></i>
                                    <div class="text-sm font-bold">かんたん</div>
                                </button>
                                <button class="mode-card selected text-center py-4" id="diff-normal" onclick="selectDifficulty('normal')" style="padding:16px;">
                                    <i class="fas fa-fire text-2xl text-yellow-400 mb-2"></i>
                                    <div class="text-sm font-bold">ふつう</div>
                                </button>
                                <button class="mode-card text-center py-4" id="diff-hard" onclick="selectDifficulty('hard')" style="padding:16px;">
                                    <i class="fas fa-skull-crossbones text-2xl text-red-400 mb-2"></i>
                                    <div class="text-sm font-bold">むずかしい</div>
                                </button>
                            </div>
                        </div>

                        <div class="text-center">
                            <button class="battle-btn" onclick="startAIBattle()">
                                <i class="fas fa-play mr-2"></i>対戦開始
                            </button>
                            <p class="text-xs text-gray-500 mt-3">※ 現在プレビュー版です。クレジットは消費しません。</p>
                        </div>
                    </div>
                </div>

                <!-- Battle Phase -->
                <div id="ai-battle" class="hidden">
                    <div class="cyber-card mb-4">
                        <div class="flex justify-between items-center">
                            <div>
                                <h2 id="battle-topic-display" class="text-xl font-bold text-cyan-300"></h2>
                                <div class="text-sm text-gray-400 mt-1">
                                    <span id="battle-stance-display"></span> ・ 
                                    <span>ターン: <span id="turn-count">0</span>/5</span>
                                </div>
                            </div>
                            <button class="text-red-400 hover:text-red-300 text-sm" onclick="endAIBattle()">
                                <i class="fas fa-stop mr-1"></i>対戦終了
                            </button>
                        </div>
                    </div>
                    
                    <div class="cyber-card">
                        <!-- Chat Messages -->
                        <div id="battle-messages" class="flex flex-col space-y-2" style="height:450px; overflow-y:auto; scroll-behavior:smooth; padding:10px;">
                        </div>
                        
                        <!-- Input Area -->
                        <div class="mt-4 border-t border-cyan-500/30 pt-4">
                            <div class="flex gap-3">
                                <textarea id="battle-input" rows="2"
                                    class="flex-1 topic-input resize-none"
                                    placeholder="あなたの主張を入力... (180文字以内)"
                                    maxlength="180"
                                    onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendBattleMessage()}"
                                ></textarea>
                                <button id="battle-send-btn" class="battle-btn" style="padding:12px 24px;" onclick="sendBattleMessage()">
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                            <div class="flex justify-between text-xs text-gray-500 mt-2">
                                <span id="char-count">0/180</span>
                                <span id="battle-status">あなたのターン</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Result Phase -->
                <div id="ai-result" class="hidden">
                    <div class="cyber-card text-center">
                        <i class="fas fa-trophy text-6xl text-yellow-400 mb-6"></i>
                        <h2 class="text-3xl font-bold mb-4 cyber-text" id="result-title">結果</h2>
                        <p class="text-xl mb-6" id="result-message"></p>
                        <div class="flex justify-center gap-4">
                            <button class="battle-btn" onclick="resetAIBattle()">
                                <i class="fas fa-redo mr-2"></i>もう一度
                            </button>
                            <a href="/main" class="battle-btn" style="display:inline-block; text-decoration:none;">
                                <i class="fas fa-home mr-2"></i>メインへ
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- User Battle Section (Coming Soon) -->
            <div id="user-battle-section" class="hidden">
                <div class="cyber-card text-center py-16">
                    <i class="fas fa-user-friends text-6xl text-purple-400 mb-6"></i>
                    <h2 class="text-3xl font-bold mb-4 cyber-text">ユーザー対戦</h2>
                    <p class="text-gray-400 text-lg mb-6">
                        他のプレイヤーとリアルタイムでディベート対決！
                    </p>
                    <div class="max-w-md mx-auto space-y-4 text-left mb-8">
                        <div class="flex items-center gap-3 text-gray-300">
                            <i class="fas fa-check text-cyan-400"></i>
                            <span>マッチング機能でランダムに対戦相手を検索</span>
                        </div>
                        <div class="flex items-center gap-3 text-gray-300">
                            <i class="fas fa-check text-cyan-400"></i>
                            <span>レーティング制でスキルに応じた対戦</span>
                        </div>
                        <div class="flex items-center gap-3 text-gray-300">
                            <i class="fas fa-check text-cyan-400"></i>
                            <span>勝利でクレジット＆レート獲得</span>
                        </div>
                        <div class="flex items-center gap-3 text-gray-300">
                            <i class="fas fa-check text-cyan-400"></i>
                            <span>観戦者からの投票で追加ボーナス</span>
                        </div>
                    </div>
                    <div class="inline-block px-6 py-3 bg-purple-500/20 border-2 border-purple-500 rounded-lg">
                        <i class="fas fa-clock mr-2 text-purple-400"></i>
                        <span class="text-purple-300 font-bold">Coming Soon - 開発中</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const userId = '${user.user_id}';
        let currentMode = 'ai';
        let selectedStance = 'agree';
        let selectedDifficulty = 'normal';
        let battleActive = false;
        let turnCount = 0;
        const MAX_TURNS = 5;
        let battleHistory = [];

        const RANDOM_TOPICS = [
            'AIは人間の仕事を奪うのか',
            'SNSは社会にとって有益か',
            'ベーシックインカムは導入すべきか',
            '大学教育は必要か',
            '原子力発電は推進すべきか',
            'リモートワークは生産性を向上させるか',
            '自動運転車は安全か',
            '死刑制度は廃止すべきか',
            'ゲームは教育に役立つか',
            '宇宙開発に投資すべきか'
        ];

        function switchMode(mode) {
            currentMode = mode;
            document.querySelectorAll('.battle-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
            document.getElementById('ai-battle-section').classList.toggle('hidden', mode !== 'ai');
            document.getElementById('user-battle-section').classList.toggle('hidden', mode !== 'user');
        }

        function selectStance(stance) {
            selectedStance = stance;
            document.getElementById('stance-agree').classList.toggle('selected', stance === 'agree');
            document.getElementById('stance-disagree').classList.toggle('selected', stance === 'disagree');
        }

        function selectDifficulty(diff) {
            selectedDifficulty = diff;
            ['easy','normal','hard'].forEach(d => {
                document.getElementById('diff-' + d).classList.toggle('selected', d === diff);
            });
        }

        function startAIBattle() {
            let topic = document.getElementById('ai-topic').value.trim();
            if (!topic) {
                topic = RANDOM_TOPICS[Math.floor(Math.random() * RANDOM_TOPICS.length)];
            }
            
            battleActive = true;
            turnCount = 0;
            battleHistory = [];
            
            document.getElementById('battle-topic-display').textContent = topic;
            document.getElementById('battle-stance-display').textContent = selectedStance === 'agree' ? 'あなた: 賛成側' : 'あなた: 反対側';
            document.getElementById('turn-count').textContent = '0';
            document.getElementById('battle-messages').innerHTML = '';
            
            document.getElementById('ai-setup').classList.add('hidden');
            document.getElementById('ai-battle').classList.remove('hidden');
            document.getElementById('ai-result').classList.add('hidden');
            
            // Add system message
            addSystemMessage('ディベート開始！テーマ: 「' + topic + '」');
            addSystemMessage('あなたは' + (selectedStance === 'agree' ? '賛成' : '反対') + '側です。主張を入力してください。');
        }

        function addSystemMessage(text) {
            const container = document.getElementById('battle-messages');
            const div = document.createElement('div');
            div.className = 'text-center text-gray-400 text-sm py-2';
            div.innerHTML = '<i class="fas fa-info-circle mr-1"></i>' + text;
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
        }

        function addChatMessage(text, isUser) {
            const container = document.getElementById('battle-messages');
            const div = document.createElement('div');
            div.className = 'chat-bubble ' + (isUser ? 'chat-user' : 'chat-ai');
            div.innerHTML = '<div class="text-xs font-bold mb-1 ' + (isUser ? 'text-cyan-400' : 'text-purple-400') + '">' +
                (isUser ? '<i class="fas fa-user mr-1"></i>あなた' : '<i class="fas fa-robot mr-1"></i>AI') +
                '</div><div class="text-sm leading-relaxed">' + text + '</div>';
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
        }

        function showTypingIndicator() {
            const container = document.getElementById('battle-messages');
            const div = document.createElement('div');
            div.id = 'typing-indicator';
            div.className = 'chat-bubble chat-ai';
            div.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
        }

        function hideTypingIndicator() {
            const el = document.getElementById('typing-indicator');
            if (el) el.remove();
        }

        async function sendBattleMessage() {
            if (!battleActive) return;
            const input = document.getElementById('battle-input');
            const text = input.value.trim();
            if (!text) return;
            if (text.length > 180) { alert('180文字以内で入力してください'); return; }

            input.value = '';
            document.getElementById('char-count').textContent = '0/180';
            turnCount++;
            document.getElementById('turn-count').textContent = turnCount;
            
            addChatMessage(text, true);
            battleHistory.push({ role: 'user', content: text });

            if (turnCount >= MAX_TURNS) {
                addSystemMessage('最大ターン数に到達しました。');
                setTimeout(() => showBattleResult(), 1000);
                return;
            }

            // Disable input while AI responds
            input.disabled = true;
            document.getElementById('battle-send-btn').disabled = true;
            document.getElementById('battle-status').textContent = 'AIが考え中...';
            showTypingIndicator();

            try {
                const topic = document.getElementById('battle-topic-display').textContent;
                const aiStance = selectedStance === 'agree' ? 'disagree' : 'agree';
                const diffPrompt = selectedDifficulty === 'easy' ? 'シンプルで短い反論をしてください。' : selectedDifficulty === 'hard' ? '鋭く高度な反論をしてください。データや具体例を使ってください。' : '適切な反論をしてください。';
                
                const systemPrompt = 'あなたはディベートの' + (aiStance === 'agree' ? '賛成' : '反対') + '側です。テーマ:「' + topic + '」。' + diffPrompt + '180文字以内、句点で終えること。相手の立場を認めないこと。';

                const response = await fetch('/api/debate/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        systemPrompt: systemPrompt,
                        conversationHistory: battleHistory,
                        maxTokens: 220,
                        temperature: selectedDifficulty === 'easy' ? 0.5 : selectedDifficulty === 'hard' ? 0.9 : 0.7
                    })
                });

                const data = await response.json();
                hideTypingIndicator();

                if (data.message) {
                    addChatMessage(data.message, false);
                    battleHistory.push({ role: 'assistant', content: data.message });
                } else {
                    addSystemMessage('AIの応答に失敗しました');
                }
            } catch (error) {
                hideTypingIndicator();
                console.error('AI response error:', error);
                addSystemMessage('通信エラーが発生しました');
            }

            input.disabled = false;
            document.getElementById('battle-send-btn').disabled = false;
            document.getElementById('battle-status').textContent = 'あなたのターン';
            input.focus();
        }

        function showBattleResult() {
            battleActive = false;
            document.getElementById('ai-battle').classList.add('hidden');
            document.getElementById('ai-result').classList.remove('hidden');
            
            document.getElementById('result-title').textContent = '対戦完了！';
            document.getElementById('result-message').textContent = MAX_TURNS + 'ターンのディベートが終了しました。お疲れ様でした！';
        }

        function endAIBattle() {
            if (!confirm('対戦を終了しますか？')) return;
            showBattleResult();
        }

        function resetAIBattle() {
            battleActive = false;
            turnCount = 0;
            battleHistory = [];
            document.getElementById('ai-setup').classList.remove('hidden');
            document.getElementById('ai-battle').classList.add('hidden');
            document.getElementById('ai-result').classList.add('hidden');
        }

        // Character count
        document.getElementById('battle-input').addEventListener('input', function() {
            document.getElementById('char-count').textContent = this.value.length + '/180';
        });
    </script>
</body>
</html>
`;
