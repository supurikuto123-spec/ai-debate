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
        .dice-btn { background: linear-gradient(135deg, rgba(255,165,0,0.3), rgba(255,0,100,0.3)); border: 2px solid #ffa500; border-radius: 12px; padding: 12px 24px; color: #ffa500; font-weight: 700; cursor: pointer; transition: all 0.3s; }
        .dice-btn:hover { background: linear-gradient(135deg, rgba(255,165,0,0.5), rgba(255,0,100,0.5)); box-shadow: 0 0 20px rgba(255,165,0,0.4); transform: translateY(-2px); }
        .dice-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .dice-rolling { animation: diceRoll 0.5s ease-in-out; }
        @keyframes diceRoll { 0%{transform:rotate(0deg)} 25%{transform:rotate(90deg)} 50%{transform:rotate(180deg)} 75%{transform:rotate(270deg)} 100%{transform:rotate(360deg)} }
        .theme-chip { display: inline-block; background: rgba(0,255,255,0.1); border: 1px solid rgba(0,255,255,0.4); border-radius: 8px; padding: 8px 14px; margin: 4px; cursor: pointer; transition: all 0.2s; font-size: 13px; }
        .theme-chip:hover { background: rgba(0,255,255,0.25); border-color: #00ffff; }
        .theme-chip.selected { background: rgba(0,255,255,0.3); border-color: #00ffff; box-shadow: 0 0 10px rgba(0,255,255,0.3); color: #00ffff; font-weight: 700; }
        .credit-cost-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 14px; }
        .cost-normal { background: rgba(0,255,255,0.15); border: 1px solid rgba(0,255,255,0.4); color: #00ffff; }
        .cost-hard { background: rgba(255,0,100,0.15); border: 1px solid rgba(255,0,100,0.4); color: #ff0064; }
    </style>
</head>
<body class="bg-black text-white">
    ${globalNav(user)}
    
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
                        
                        <!-- Theme Selection from Voted Themes -->
                        <div class="mb-6">
                            <label class="block text-cyan-300 font-bold mb-3">
                                <i class="fas fa-vote-yea mr-1"></i>ディベートテーマ
                            </label>
                            <div id="theme-loading" class="text-center py-4 text-gray-400">
                                <i class="fas fa-spinner fa-spin mr-2"></i>テーマを読み込み中...
                            </div>
                            <div id="theme-list" class="hidden mb-3" style="max-height: 200px; overflow-y: auto; padding: 4px;">
                            </div>
                            <div id="selected-theme-display" class="hidden mb-3 p-3 bg-cyan-500/10 border border-cyan-500/40 rounded-lg">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <div class="text-sm text-gray-400">選択中のテーマ:</div>
                                        <div class="text-lg font-bold text-cyan-300" id="selected-theme-text"></div>
                                    </div>
                                    <button class="text-gray-500 hover:text-red-400 text-sm" onclick="clearThemeSelection()">
                                        <i class="fas fa-times"></i> 解除
                                    </button>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <button class="dice-btn" id="dice-btn" onclick="rollRandomTheme()">
                                    <i class="fas fa-dice mr-2" id="dice-icon"></i>ランダム選択
                                </button>
                                <span class="text-xs text-gray-500">投票で承認されたテーマからランダムに選ばれます</span>
                            </div>
                        </div>

                        <!-- Stance Selection - stance-based -->
                        <div class="mb-6">
                            <label class="block text-cyan-300 font-bold mb-3">あなたの立場</label>
                            <div id="stance-container" class="grid grid-cols-2 gap-4">
                                <div class="mode-card selected" id="stance-agree" onclick="selectStance('agree')">
                                    <div class="text-center">
                                        <i class="fas fa-thumbs-up text-4xl text-green-400 mb-3"></i>
                                        <h3 class="text-xl font-bold text-green-400" id="stance-agree-label">立場A</h3>
                                        <p class="text-sm text-gray-400 mt-2" id="stance-agree-desc">テーマ選択後に表示されます</p>
                                    </div>
                                </div>
                                <div class="mode-card" id="stance-disagree" onclick="selectStance('disagree')">
                                    <div class="text-center">
                                        <i class="fas fa-thumbs-down text-4xl text-red-400 mb-3"></i>
                                        <h3 class="text-xl font-bold text-red-400" id="stance-disagree-label">立場B</h3>
                                        <p class="text-sm text-gray-400 mt-2" id="stance-disagree-desc">テーマ選択後に表示されます</p>
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
                                    <div class="credit-cost-badge cost-normal mt-2">
                                        <i class="fas fa-coins text-xs"></i> 50 消費。
                                    </div>
                                </button>
                                <button class="mode-card selected text-center py-4" id="diff-normal" onclick="selectDifficulty('normal')" style="padding:16px;">
                                    <i class="fas fa-fire text-2xl text-yellow-400 mb-2"></i>
                                    <div class="text-sm font-bold">ふつう</div>
                                    <div class="credit-cost-badge cost-normal mt-2">
                                        <i class="fas fa-coins text-xs"></i> 50 消費。
                                    </div>
                                </button>
                                <button class="mode-card text-center py-4" id="diff-hard" onclick="selectDifficulty('hard')" style="padding:16px;">
                                    <i class="fas fa-skull-crossbones text-2xl text-red-400 mb-2"></i>
                                    <div class="text-sm font-bold">むずかしい</div>
                                    <div class="credit-cost-badge cost-hard mt-2">
                                        <i class="fas fa-coins text-xs"></i> 80 消費。
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div class="text-center">
                            <div class="mb-3">
                                <span class="text-gray-400 text-sm">消費クレジット: </span>
                                <span class="text-yellow-400 font-bold text-lg" id="credit-cost-display">50</span>
                                <span class="text-gray-400 text-sm"> / 現在: </span>
                                <span class="text-cyan-400 font-bold" id="current-credits">${(user.credits || 0).toLocaleString()}</span>
                            </div>
                            <button class="battle-btn" id="start-battle-btn" onclick="startAIBattle()">
                                <i class="fas fa-play mr-2"></i>対戦開始
                            </button>
                            <p class="text-xs text-gray-500 mt-3" id="credit-warning"></p>
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
        const userCredits = ${user.credits || 0};
        let currentMode = 'ai';
        let selectedStance = 'agree';
        let selectedDifficulty = 'normal';
        let battleActive = false;
        let turnCount = 0;
        const MAX_TURNS = 5;
        let battleHistory = [];
        let approvedThemes = [];
        let selectedThemeObj = null;

        // Credit cost per difficulty
        function getCreditCost() {
            return selectedDifficulty === 'hard' ? 80 : 50;
        }

        function updateCreditCostDisplay() {
            const cost = getCreditCost();
            document.getElementById('credit-cost-display').textContent = cost;
            const warning = document.getElementById('credit-warning');
            const currentEl = document.getElementById('current-credits');
            // Fetch fresh credits
            fetch('/api/user').then(r => r.json()).then(data => {
                if (data.credits !== undefined) {
                    const c = Number(data.credits);
                    currentEl.textContent = c.toLocaleString();
                    if (c < cost) {
                        warning.textContent = 'クレジットが不足しています（必要: ' + cost + 'クレジット）';
                        warning.style.color = '#ff4444';
                        document.getElementById('start-battle-btn').disabled = true;
                    } else {
                        warning.textContent = '';
                        document.getElementById('start-battle-btn').disabled = false;
                    }
                    if (window.updateCreditsDisplay) window.updateCreditsDisplay(c);
                }
            }).catch(() => {});
        }

        // Load approved themes from theme-votes API
        async function loadApprovedThemes() {
            try {
                const res = await fetch('/api/theme-votes?sort=votes');
                const data = await res.json();
                if (data.success && data.themes && data.themes.length > 0) {
                    approvedThemes = data.themes;
                    renderThemeList();
                } else {
                    // Fallback: built-in themes
                    approvedThemes = getBuiltInThemes();
                    renderThemeList();
                }
            } catch (e) {
                approvedThemes = getBuiltInThemes();
                renderThemeList();
            }
        }

        function getBuiltInThemes() {
            const allThemes = [
                // テクノロジー
                { id: 'b1', title: 'AIは人間の仕事を奪うのか', agree_opinion: 'AIは多くの仕事を代替し雇用が減少する', disagree_opinion: 'AIは新たな仕事を生み出し人間を補助する' },
                { id: 'b2', title: 'SNSは社会にとって有益か', agree_opinion: 'SNSは情報共有と民主化を促進する', disagree_opinion: 'SNSは分断やフェイクニュースを助長する' },
                { id: 'b3', title: '自動運転車は安全か', agree_opinion: 'ヒューマンエラーを排除し事故が減る', disagree_opinion: '技術的限界と倫理的判断の問題がある' },
                { id: 'b4', title: 'AGI開発は今すぐ規制すべきか', agree_opinion: '制御不能になる前に安全性を確保すべき', disagree_opinion: '過度な規制は技術革新と競争力を損なう' },
                { id: 'b5', title: 'プログラミング教育は全員必修にすべきか', agree_opinion: 'デジタル社会の基礎力として全員が学ぶべき', disagree_opinion: '適性があり全員強制は非効率' },
                { id: 'b6', title: 'メタバースは社会を変えるか', agree_opinion: '新たな経済圏とコミュニケーション革命をもたらす', disagree_opinion: '現実逃避と企業の利益追求に過ぎない' },
                // 社会
                { id: 'b7', title: 'ベーシックインカムは導入すべきか', agree_opinion: '最低限の生活保障で社会が安定する', disagree_opinion: '労働意欲の低下と財源確保が困難' },
                { id: 'b8', title: 'リモートワークは生産性を向上させるか', agree_opinion: '通勤不要で集中力と効率が上がる', disagree_opinion: '孤立やコミュニケーション不足が生産性を下げる' },
                { id: 'b9', title: '死刑制度は廃止すべきか', agree_opinion: '冤罪のリスクがあり人権に反する', disagree_opinion: '凶悪犯罪の抑止力として必要' },
                { id: 'b10', title: '選挙権年齢は16歳に引き下げるべきか', agree_opinion: '若者の政治参加が民主主義を活性化させる', disagree_opinion: '十分な判断力が育つ前に投票させるのは危険' },
                { id: 'b11', title: '子どものSNS利用は制限すべきか', agree_opinion: 'メンタルヘルスと安全のために制限が必要', disagree_opinion: '制限よりデジタルリテラシー教育が重要' },
                // 教育
                { id: 'b12', title: '大学教育は必要か', agree_opinion: '体系的な学問と人脈形成に不可欠', disagree_opinion: '実践的スキルは大学外でも習得可能' },
                { id: 'b13', title: 'ゲームは教育に役立つか', agree_opinion: '問題解決能力や創造性を育む', disagree_opinion: '依存性が高く学習時間を奪う' },
                { id: 'b14', title: '宿題は廃止すべきか', agree_opinion: '自由な時間が創造性と自主性を育てる', disagree_opinion: '反復学習が知識の定着に不可欠' },
                { id: 'b15', title: 'AIが教師の代わりになれるか', agree_opinion: '個別最適化された学習を提供できる', disagree_opinion: '人間的成長には人との関わりが不可欠' },
                // 環境
                { id: 'b16', title: '原子力発電は推進すべきか', agree_opinion: 'CO2削減と安定供給に有効', disagree_opinion: '事故リスクと廃棄物処理の問題が深刻' },
                { id: 'b17', title: '宇宙開発に投資すべきか', agree_opinion: '人類の未来と技術革新に不可欠', disagree_opinion: '地球上の課題解決が先決' },
                { id: 'b18', title: '肉食は倫理的に問題があるか', agree_opinion: '動物の苦痛と環境負荷を考えると問題がある', disagree_opinion: '食文化の自由と栄養的合理性がある' },
                { id: 'b19', title: '電気自動車は本当にエコか', agree_opinion: '走行時の排出ゼロが環境に貢献する', disagree_opinion: '製造・廃棄時の環境負荷を考えると疑問' },
                // 経済
                { id: 'b20', title: '仮想通貨は規制すべきか', agree_opinion: '投機と詐欺から消費者を守るため規制が必要', disagree_opinion: '規制はイノベーションと金融の自由を損なう' },
                { id: 'b21', title: '富の再分配は強化すべきか', agree_opinion: '格差縮小が社会の安定と経済成長に繋がる', disagree_opinion: '過度な再分配は労働意欲と経済の活力を削ぐ' },
                { id: 'b22', title: '副業を全企業が認めるべきか', agree_opinion: '個人のキャリア形成と収入多様化に有益', disagree_opinion: '本業への集中力低下と情報漏洩リスクがある' },
                // 文化
                { id: 'b23', title: 'AIが作った芸術は本物の芸術か', agree_opinion: '創造的な出力があれば手段は問わない', disagree_opinion: '人間の感情や経験なき創作は芸術と言えない' },
                { id: 'b24', title: '漫画・アニメはもっと評価されるべきか', agree_opinion: '表現の多様性と国際的影響力が高い', disagree_opinion: '娯楽と文化は別のものとして評価すべき' },
                { id: 'b25', title: 'eスポーツはオリンピック正式種目にすべきか', agree_opinion: '競技性と国際的人気を考えれば正式種目にふさわしい', disagree_opinion: '身体的運動を伴わないものはスポーツと言えない' },
                // 哲学
                { id: 'b26', title: '自由意志は存在するか', agree_opinion: '意識的な選択ができる時点で自由意志は存在する', disagree_opinion: '脳の神経活動が全て決めており自由意志は幻想' },
                { id: 'b27', title: 'AIに意識は芽生えるか', agree_opinion: '十分複雑なシステムから意識が発現する可能性がある', disagree_opinion: '生物学的基盤なき意識は生まれない' },
                { id: 'b28', title: '正義は普遍的かそれとも相対的か', agree_opinion: '全人類に共通する道徳的原則が存在する', disagree_opinion: '正義は文化や時代によって変わる相対的なもの' },
                // ライフスタイル
                { id: 'b29', title: '早起きは成功の鍵か', agree_opinion: '朝型生活が集中力と健康を高める', disagree_opinion: 'クロノタイプは個人差があり夜型でも成功できる' },
                { id: 'b30', title: 'お金で幸福は買えるか', agree_opinion: '経済的安定が幸福の基盤を作る', disagree_opinion: '人間関係や自己実現などお金では得られないものがある' },
                { id: 'b31', title: '完璧主義は成長を促すか妨げるか', agree_opinion: '高い基準が優れた成果を生む', disagree_opinion: '完璧を求めすぎると行動が遅れメンタルを損なう' },
                // 国際
                { id: 'b32', title: 'グローバリゼーションは続けるべきか', agree_opinion: '国際協力と経済成長に不可欠', disagree_opinion: '地元経済を圧迫し文化の画一化を招く' },
                { id: 'b33', title: '移民を積極的に受け入れるべきか', agree_opinion: '労働力不足解消と文化の多様性に貢献', disagree_opinion: '社会保障の負担と文化摩擦のリスクがある' },
                // ビジネス
                { id: 'b34', title: '週休4日勤務は導入すべきか', agree_opinion: '労働者の健康と生産性向上に繋がる', disagree_opinion: '経済成長が低下し企業競争力が落ちる' },
                { id: 'b35', title: '学歴社会は変わるべきか', agree_opinion: '実力主義が公平な社会を実現する', disagree_opinion: '学歴は基礎力の指標として有効' },
                { id: 'b36', title: 'タイパ重視の生き方は正しいか', agree_opinion: '限られた時間を効率的に使うのは合理的', disagree_opinion: '効率だけ追求すると人生の深みが失われる' },
            ];
            // 毎回シャッフルして異なるテーマを表示
            const shuffled = allThemes.sort(() => Math.random() - 0.5);
            return shuffled.slice(0, 12);
        }

        function renderThemeList() {
            const container = document.getElementById('theme-list');
            const loading = document.getElementById('theme-loading');
            loading.classList.add('hidden');
            container.classList.remove('hidden');

            container.innerHTML = '';
            approvedThemes.forEach((theme, idx) => {
                const chip = document.createElement('span');
                chip.className = 'theme-chip';
                chip.dataset.index = idx;
                const votes = theme.vote_count !== undefined ? ' (' + theme.vote_count + '票)' : '';
                chip.innerHTML = '<i class="fas fa-comment-dots mr-1 text-cyan-400"></i>' + theme.title + votes;
                chip.onclick = () => selectTheme(idx);
                container.appendChild(chip);
            });
        }

        function selectTheme(index) {
            selectedThemeObj = approvedThemes[index];
            // Highlight chip
            document.querySelectorAll('.theme-chip').forEach((c, i) => {
                c.classList.toggle('selected', i === index);
            });
            // Show selected theme
            document.getElementById('selected-theme-display').classList.remove('hidden');
            document.getElementById('selected-theme-text').textContent = selectedThemeObj.title;
            // Update stance labels
            updateStanceLabels();
        }

        function clearThemeSelection() {
            selectedThemeObj = null;
            document.querySelectorAll('.theme-chip').forEach(c => c.classList.remove('selected'));
            document.getElementById('selected-theme-display').classList.add('hidden');
            document.getElementById('stance-agree-label').textContent = '立場A';
            document.getElementById('stance-agree-desc').textContent = 'テーマ選択後に表示されます';
            document.getElementById('stance-disagree-label').textContent = '立場B';
            document.getElementById('stance-disagree-desc').textContent = 'テーマ選択後に表示されます';
        }

        function updateStanceLabels() {
            if (!selectedThemeObj) return;
            const agreeOp = selectedThemeObj.agree_opinion || '賛成の立場';
            const disagreeOp = selectedThemeObj.disagree_opinion || '反対の立場';
            document.getElementById('stance-agree-label').textContent = '立場A';
            document.getElementById('stance-agree-desc').textContent = agreeOp;
            document.getElementById('stance-disagree-label').textContent = '立場B';
            document.getElementById('stance-disagree-desc').textContent = disagreeOp;
        }

        function rollRandomTheme() {
            if (approvedThemes.length === 0) return;
            const btn = document.getElementById('dice-btn');
            const icon = document.getElementById('dice-icon');
            btn.disabled = true;
            icon.classList.add('dice-rolling');
            
            // Animate through themes quickly
            let rolls = 0;
            const maxRolls = 12;
            const interval = setInterval(() => {
                const randomIdx = Math.floor(Math.random() * approvedThemes.length);
                selectTheme(randomIdx);
                rolls++;
                if (rolls >= maxRolls) {
                    clearInterval(interval);
                    icon.classList.remove('dice-rolling');
                    btn.disabled = false;
                }
            }, 100);
        }

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
            updateCreditCostDisplay();
        }

        async function startAIBattle() {
            if (!selectedThemeObj) {
                alert('テーマを選択してください（ランダム選択ボタンも使えます）');
                return;
            }

            const cost = getCreditCost();
            
            // Consume credits via API
            try {
                const res = await fetch('/api/battle/start', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ difficulty: selectedDifficulty })
                });
                const data = await res.json();
                if (!data.success) {
                    alert(data.error || 'クレジットが不足しています');
                    return;
                }
                // Update credits display
                if (data.new_credits !== undefined && window.updateCreditsDisplay) {
                    window.updateCreditsDisplay(data.new_credits);
                }
            } catch (e) {
                alert('通信エラーが発生しました');
                return;
            }

            const topic = selectedThemeObj.title;
            const agreeOp = selectedThemeObj.agree_opinion || '賛成の立場';
            const disagreeOp = selectedThemeObj.disagree_opinion || '反対の立場';
            const myStance = selectedStance === 'agree' ? agreeOp : disagreeOp;
            
            battleActive = true;
            turnCount = 0;
            battleHistory = [];
            
            document.getElementById('battle-topic-display').textContent = topic;
            document.getElementById('battle-stance-display').textContent = 'あなたの立場: ' + myStance;
            document.getElementById('turn-count').textContent = '0';
            document.getElementById('battle-messages').innerHTML = '';
            
            document.getElementById('ai-setup').classList.add('hidden');
            document.getElementById('ai-battle').classList.remove('hidden');
            document.getElementById('ai-result').classList.add('hidden');
            
            // ディベート開始後はモードタブとユーザー対戦セクションを非表示
            document.querySelector('.flex.justify-center.gap-4.mb-8').classList.add('hidden');
            document.getElementById('user-battle-section').classList.add('hidden');
            
            // Add system message
            addSystemMessage('ディベート開始！テーマ: 「' + topic + '」');
            addSystemMessage('あなたの立場: ' + myStance);
            addSystemMessage('主張を入力してください。');
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
                const topic = selectedThemeObj.title;
                const aiStance = selectedStance === 'agree'
                    ? (selectedThemeObj.disagree_opinion || '反対の立場')
                    : (selectedThemeObj.agree_opinion || '賛成の立場');
                const diffPrompt = selectedDifficulty === 'easy' 
                    ? '初心者向けに分かりやすく反論してください。短くシンプルに。' 
                    : selectedDifficulty === 'hard' 
                    ? '上級者向けに鋭く高度な反論をしてください。統計データ、具体的な事例、学術的根拠を交えて論理的に反駁してください。相手の論点の矛盾を突いてください。' 
                    : '論理的な反論をしてください。具体例や根拠を1つ以上含めてください。';
                
                const systemPrompt = [
                    'あなたは日本語ディベートの熟練者です。',
                    'テーマ:「' + topic + '」',
                    'あなたの立場:「' + aiStance + '」',
                    '',
                    'ルール:',
                    '- 必ず180文字以内で完結させること',
                    '- 句点（。）で文を終えること',
                    '- 自分の立場を一貫して主張し、相手の立場を論破すること',
                    '- 相手の直前の主張に対して具体的に反論すること',
                    '- 感情論ではなく論理とエビデンスで議論すること',
                    '- 同じ論点を繰り返さず、新しい角度から主張すること',
                    diffPrompt
                ].join(String.fromCharCode(10));

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
            selectedThemeObj = null;
            clearThemeSelection();
            document.getElementById('ai-setup').classList.remove('hidden');
            document.getElementById('ai-battle').classList.add('hidden');
            document.getElementById('ai-result').classList.add('hidden');
            // モードタブを再表示
            document.querySelector('.flex.justify-center.gap-4.mb-8').classList.remove('hidden');
            updateCreditCostDisplay();
        }

        // Character count
        document.getElementById('battle-input').addEventListener('input', function() {
            document.getElementById('char-count').textContent = this.value.length + '/180';
        });

        // Init
        loadApprovedThemes();
        updateCreditCostDisplay();
    </script>
</body>
</html>
`;
