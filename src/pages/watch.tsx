export const watchPage = (user: any, debateId: string) => `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=1280, initial-scale=0.5, maximum-scale=1.0, user-scalable=yes">
        <title>ディベート観戦 - AI Debate</title>
        <meta name="robots" content="noindex, nofollow">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
        <style>
            .bubble {
                max-width: 70%;
                margin-bottom: 16px;
                animation: slideIn 0.3s ease-out;
            }
            .bubble-agree {
                align-self: flex-start;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                border-radius: 0 16px 16px 16px;
                border-left: 4px solid #34d399;
            }
            .bubble-disagree {
                align-self: flex-end;
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                border-radius: 16px 0 16px 16px;
                border-right: 4px solid #f87171;
            }
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .vote-bar {
                transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
                box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);
            }
            .vote-bar::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                animation: shimmer 3s infinite ease-in-out;
            }
            @keyframes shimmer {
                0% { left: -100%; }
                100% { left: 200%; }
            }
            .modal {
                display: flex;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.98);
                backdrop-filter: blur(10px);
                z-index: 9999;
                align-items: center;
                justify-content: center;
            }
            .modal.hidden {
                display: none;
            }
            .vote-btn {
                cursor: pointer;
                position: relative;
                z-index: 10000;
            }
            .vote-btn:hover {
                transform: scale(1.05);
            }
            .comment-agree {
                border-left: 3px solid #10b981;
            }
            .comment-disagree {
                border-left: 3px solid #ef4444;
            }
            .gauge-shine {
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                animation: shine 2s infinite;
            }
            @keyframes shine {
                to {
                    left: 100%;
                }
            }
            /* 派手なゲージアニメーション */
            .vote-bar {
                transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                box-shadow: 0 0 30px rgba(255,255,255,0.6), 0 0 50px currentColor;
                animation: pulse-glow 1.5s infinite, shimmer 3s infinite;
                position: relative;
                overflow: hidden;
            }
            .vote-bar::after {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
                animation: shimmer-slide 2s infinite;
            }
            @keyframes pulse-glow {
                0%, 100% {
                    box-shadow: 0 0 30px rgba(255,255,255,0.6), 0 0 50px currentColor, inset 0 0 20px rgba(255,255,255,0.3);
                    filter: brightness(1) saturate(1.2);
                    transform: scaleY(1);
                }
                50% {
                    box-shadow: 0 0 50px rgba(255,255,255,1), 0 0 80px currentColor, inset 0 0 40px rgba(255,255,255,0.6);
                    filter: brightness(1.4) saturate(1.5);
                    transform: scaleY(1.05);
                }
            }
            @keyframes shimmer-slide {
                0% { left: -100%; }
                100% { left: 200%; }
            }
        </style>
    </head>
    <body class="bg-black text-white overflow-x-hidden">
        <!-- Vote Modal -->
        <div id="voteModal" class="modal">
            <div class="cyber-card max-w-2xl w-full mx-4">
                <h2 class="text-3xl font-bold mb-6 text-center cyber-text">
                    <i class="fas fa-vote-yea mr-3 text-cyan-400"></i>
                    まず、あなたの立場を選択してください
                </h2>
                
                <div class="mb-8">
                    <h3 class="text-xl font-bold mb-4 text-cyan-300">ディベートテーマ</h3>
                    <p class="text-2xl mb-6 text-center">AIは人類の仕事を奪うのか</p>
                    
                    <div class="grid grid-cols-2 gap-6 mb-8">
                        <div class="border-2 border-green-500 rounded p-4 bg-green-500/10">
                            <h4 class="font-bold text-green-400 mb-2">意見A</h4>
                            <p class="text-sm text-gray-300">
                                AIは人間の能力を拡張し、より創造的な仕事への移行を促進する。歴史的に技術革新は常に新しい職種を生み出してきた。
                            </p>
                        </div>
                        <div class="border-2 border-red-500 rounded p-4 bg-red-500/10">
                            <h4 class="font-bold text-red-400 mb-2">意見B</h4>
                            <p class="text-sm text-gray-300">
                                AIによる雇用喪失は深刻な社会問題を引き起こす。自動化のスピードが速すぎて、労働者が適応する時間がない。
                            </p>
                        </div>
                    </div>
                </div>

                <p class="text-center mb-6 text-yellow-300">
                    <i class="fas fa-info-circle mr-2"></i>
                    投票後に観戦画面が表示されます
                </p>

                <div class="grid grid-cols-2 gap-4">
                    <button id="voteAgreeModalBtn" class="vote-btn bg-green-500/20 border-2 border-green-500 hover:bg-green-500/40 p-6 rounded transition-all">
                        <i class="fas fa-check-circle text-3xl mb-3"></i>
                        <p class="font-bold text-xl">意見Aを支持</p>
                    </button>
                    <button id="voteDisagreeModalBtn" class="vote-btn bg-red-500/20 border-2 border-red-500 hover:bg-red-500/40 p-6 rounded transition-all">
                        <i class="fas fa-check-circle text-3xl mb-3"></i>
                        <p class="font-bold text-xl">意見Bを支持</p>
                    </button>
                </div>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b-2 border-cyan-500">
            <div class="container mx-auto px-6 py-4 flex justify-between items-center">
                <div class="flex items-center space-x-3">
                    <div class="cyber-logo w-10 h-10 flex items-center justify-center">
                        <i class="fas fa-brain text-cyan-400 text-2xl"></i>
                    </div>
                    <span class="text-2xl font-bold cyber-text">AI Debate</span>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="credit-display">
                        <i class="fas fa-coins text-yellow-400"></i>
                        <span class="text-sm font-bold">${user.user_id === 'dev' ? '∞' : user.credits}</span>
                    </div>
                    <div class="text-sm text-gray-400">@${user.user_id}</div>
                    <a href="/main" class="btn-secondary text-sm px-4 py-2">
                        <i class="fas fa-arrow-left mr-1"></i>マッチ一覧
                    </a>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <div class="pt-24 pb-12">
            <div class="cyber-grid"></div>
            
            <div class="container mx-auto px-6 relative z-10">
                <!-- Debate Header -->
                <div class="cyber-card mb-6">
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex-1">
                            <h1 class="text-3xl font-black cyber-text mb-2">
                                AIは人類の仕事を奪うのか
                            </h1>
                            <div class="flex items-center space-x-4 text-sm text-gray-400">
                                <span>
                                    <i class="fas fa-calendar-alt mr-2 text-cyan-400"></i>2026/01/28 15:00 開始
                                </span>
                                <span>
                                    <i class="fas fa-clock mr-2 text-magenta-400"></i>残り時間: <span id="remainingTime">28:45</span>
                                </span>
                                <span class="text-green-400">
                                    <div class="w-2 h-2 bg-green-400 rounded-full inline-block mr-2 animate-pulse"></div>
                                    LIVE
                                </span>
                                <span>
                                    <i class="fas fa-eye mr-2 text-yellow-400"></i><span id="viewerCount">1,234</span>人が観戦中
                                </span>
                            </div>
                        </div>
                        <div class="inline-block px-4 py-1 bg-cyan-500/20 border border-cyan-500 rounded-full text-cyan-300 text-sm">
                            <i class="fas fa-microchip mr-2"></i>TECH & AI
                        </div>
                    </div>

                    <!-- AI Summary -->
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="bg-green-500/10 border border-green-500 rounded p-3">
                            <div class="flex items-center mb-2">
                                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mr-3">
                                    <i class="fas fa-brain text-white"></i>
                                </div>
                                <div>
                                    <p class="font-bold text-green-400">GPT-4o</p>
                                    <p class="text-xs text-gray-400">意見A</p>
                                </div>
                            </div>
                            <p class="text-sm text-gray-300">
                                技術革新は常に新しい職種を生み出してきた。AIも人間の創造性を必要とする新たな仕事の機会を創出する。
                            </p>
                        </div>
                        <div class="bg-red-500/10 border border-red-500 rounded p-3">
                            <div class="flex items-center mb-2">
                                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center mr-3">
                                    <i class="fas fa-lightbulb text-white"></i>
                                </div>
                                <div>
                                    <p class="font-bold text-red-400">Claude-3.5</p>
                                    <p class="text-xs text-gray-400">意見B</p>
                                </div>
                            </div>
                            <p class="text-sm text-gray-300">
                                AIの進化スピードが速すぎて、労働者が適応する時間がない。短期的には大規模な失業が発生するリスクがある。
                            </p>
                        </div>
                    </div>

                    <!-- Debate Rules -->
                    <div class="bg-gray-900/50 border border-cyan-500/30 rounded p-3">
                        <h4 class="font-bold text-cyan-300 mb-2">
                            <i class="fas fa-gavel mr-2"></i>ディベート制約
                        </h4>
                        <div class="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <span class="text-gray-400">総時間:</span>
                                <span class="text-white font-bold ml-2">1分</span>
                            </div>
                            <div>
                                <span class="text-gray-400">AIモデル:</span>
                                <span class="text-white font-bold ml-2">GPT-4o / Claude-3.5</span>
                            </div>
                            <div>
                                <span class="text-gray-400">最大文字数:</span>
                                <span class="text-white font-bold ml-2">130文字</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Layout: Debate (Left) + Comments (Right) -->
                <div class="grid grid-cols-3 gap-6">
                    <!-- Debate Area (2 columns) -->
                    <div class="col-span-2 space-y-6">
                        <!-- Debate Messages -->
                        <div class="cyber-card" style="height: 600px; overflow-y: auto;">
                            <h3 class="text-2xl font-bold mb-4 flex items-center sticky top-0 bg-black/95 pb-4 border-b border-cyan-500">
                                <i class="fas fa-comments mr-3 text-cyan-400"></i>
                                ディベート進行
                            </h3>
                            
                            <div id="debateMessages" class="flex flex-col space-y-4">
                                <!-- ディベート開始後にメッセージが動的に追加されます -->
                                <div class="text-center text-gray-400 p-8">
                                    <i class="fas fa-info-circle text-4xl mb-4 text-cyan-400"></i>
                                    <p class="text-lg">devユーザーでコメント欄に <span class="text-cyan-300 font-bold">!debate</span> と入力してディベートを開始</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Comment Section (1 column) -->
                    <div class="col-span-1">
                        <div class="cyber-card sticky top-24" style="max-height: calc(100vh - 120px);">
                            <h3 class="text-2xl font-bold mb-4 flex items-center">
                                <i class="fas fa-comment-dots mr-3 text-cyan-400"></i>
                                コメント
                                <span class="ml-auto text-sm text-gray-400">
                                    <span id="commentCount">847</span>件
                                </span>
                            </h3>

                            <!-- Comment Input -->
                            <div class="mb-4">
                                <textarea 
                                    id="commentInput" 
                                    placeholder="コメントを入力... (@でユーザー名をメンション可能)" 
                                    class="w-full bg-gray-900 border-2 border-cyan-500 rounded p-3 text-white resize-none focus:outline-none focus:border-cyan-300"
                                    rows="4"
                                ></textarea>
                                <div class="flex gap-2 mt-2">
                                    <button id="postCommentBtn" class="btn-primary flex-1">
                                        <i class="fas fa-paper-plane mr-2"></i>コメント送信
                                    </button>
                                    <button id="clearCommentBtn" class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Comments List (固定高さ、新着が下) -->
                            <div id="commentsList" class="space-y-3" style="height: 500px; overflow-y: auto; scroll-behavior: smooth; display: flex; flex-direction: column-reverse;">
                                <!-- コメントはここに動的に追加される -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Winner Prediction Section -->
                <div class="cyber-card mt-6">
                    <h3 class="text-2xl font-bold mb-4 flex items-center">
                        <i class="fas fa-poll mr-3 text-cyan-400"></i>
                        どちらの意見が優勢だと思いますか？
                    </h3>
                    
                    <!-- Vote Buttons -->
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <button id="voteAgreeBtn" class="vote-prediction-btn bg-green-500/20 border-2 border-green-500 hover:bg-green-500/40 p-4 rounded transition-all">
                            <i class="fas fa-check-circle text-2xl mb-2"></i>
                            <p class="font-bold">意見Aが優勢</p>
                        </button>
                        <button id="voteDisagreeBtn" class="vote-prediction-btn bg-red-500/20 border-2 border-red-500 hover:bg-red-500/40 p-4 rounded transition-all">
                            <i class="fas fa-times-circle text-2xl mb-2"></i>
                            <p class="font-bold">意見Bが優勢</p>
                        </button>
                    </div>

                    <!-- Power Gauge -->
                    <div class="mb-4">
                        <div class="flex justify-between text-sm mb-2">
                            <span class="text-green-400 font-bold">
                                <i class="fas fa-users mr-1"></i>意見A: <span id="agreePercent">--</span><span id="agreePercentSymbol"></span>
                            </span>
                            <span class="text-gray-400" id="voteStatus">
                                集計中...
                            </span>
                            <span class="text-red-400 font-bold">
                                意見B: <span id="disagreePercent">--</span><span id="disagreePercentSymbol"></span> <i class="fas fa-users ml-1"></i>
                            </span>
                        </div>
                        <div class="relative h-10 bg-gray-900 rounded-full overflow-hidden border-2 border-cyan-500/50 shadow-lg">
                            <div id="agreeBar" class="vote-bar absolute left-0 top-0 h-full bg-gradient-to-r from-green-600 via-green-500 to-emerald-400" style="width: 0%"></div>
                            <div id="disagreeBar" class="vote-bar absolute right-0 top-0 h-full bg-gradient-to-l from-red-600 via-red-500 to-rose-400" style="width: 0%"></div>
                            <div class="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                        </div>
                    </div>

                    <p class="text-center text-sm text-cyan-300" id="voteChangeStatus">
                        <i class="fas fa-info-circle mr-2"></i>投票は何度でも変更できます
                    </p>
                </div>
            </div>
        </div>

        <!-- Toast Notification -->
        <div id="toast" class="fixed bottom-8 right-8 bg-cyan-500 text-black px-6 py-3 rounded-lg shadow-lg hidden z-50">
            <i class="fas fa-check-circle mr-2"></i>
            <span id="toastMessage"></span>
        </div>

        <script>
            // Debate and User data
            const DEBATE_ID = '${debateId}';
            const currentUser = {
                user_id: '${user.user_id}',
                credits: ${user.credits}
            };

            // Vote state
            let userVote = null;
            let hasVoted = false;
            let voteData = {
                agree: 0,
                disagree: 0,
                total: 0
            };
            
            // AI評価システム用グローバル変数
            let ai1Votes = { agree: 0, disagree: 0 };  // 評価AI #1
            let ai2Votes = { agree: 0, disagree: 0 };  // 評価AI #2
            let ai3Votes = { agree: 0, disagree: 0 };  // 評価AI #3
            let fogMode = false;  // ゲージ霧モード（残り10%で有効）
            let finalVotingMode = false;  // 最終投票モード（1分猶予）

            // Initialize demo votes (10 random voters)
            function initDemoVotes() {
                // 10人のランダム投票者を生成
                for (let i = 0; i < 10; i++) {
                    const randomVote = Math.random() > 0.5 ? 'agree' : 'disagree';
                    voteData[randomVote]++;
                    voteData.total++;
                }
            }

            // Submit initial vote from modal
            function submitVote(side) {
                userVote = side;
                hasVoted = true;
                voteData[side]++;
                voteData.total++;

                // localStorageに保存
                const storageKey = 'debate_vote_' + DEBATE_ID + '_' + currentUser.user_id;
                localStorage.setItem(storageKey, side);

                // Hide modal
                document.getElementById('voteModal').classList.add('hidden');

                // Update UI
                updateVoteDisplay();
                highlightSelectedButton(side);
                
                showToast('投票が完了しました！観戦を開始します');
            }
            window.submitVote = submitVote;

            // Change vote
            function changeVote(side) {
                if (!hasVoted) {
                    showToast('エラー: 初回投票が必要です');
                    return;
                }

                if (userVote === side) {
                    showToast('既にこの意見に投票済みです');
                    return;
                }

                // Update vote
                voteData[userVote]--;
                voteData[side]++;
                userVote = side;

                // Update UI
                updateVoteDisplay();
                highlightSelectedButton(side);
                
                const message = side === 'agree' ? '意見Aに変更しました！' : '意見Bに変更しました！';
                showToast(message);
            }
            window.changeVote = changeVote;

            // Highlight selected button
            function highlightSelectedButton(side) {
                const agreeBtn = document.getElementById('voteAgreeBtn');
                const disagreeBtn = document.getElementById('voteDisagreeBtn');
                
                if (side === 'agree') {
                    agreeBtn.classList.add('ring-4', 'ring-green-400');
                    disagreeBtn.classList.remove('ring-4', 'ring-red-400');
                } else {
                    disagreeBtn.classList.add('ring-4', 'ring-red-400');
                    agreeBtn.classList.remove('ring-4', 'ring-green-400');
                }
            }

            // Update vote display
            function updateVoteDisplay() {
                if (voteData.total < 5) {
                    // Less than 5 votes - show "集計中"
                    document.getElementById('agreePercent').textContent = '--';
                    document.getElementById('disagreePercent').textContent = '--';
                    document.getElementById('agreePercentSymbol').textContent = '';
                    document.getElementById('disagreePercentSymbol').textContent = '';
                    document.getElementById('voteStatus').innerHTML = '<i class="fas fa-hourglass-half mr-2"></i>集計中... (' + voteData.total + '/5人)';
                    document.getElementById('agreeBar').style.width = '50%';
                    document.getElementById('disagreeBar').style.width = '50%';
                } else {
                    // 5 or more votes - show percentage
                    const agreePercent = Math.round((voteData.agree / voteData.total) * 100);
                    const disagreePercent = 100 - agreePercent;

                    document.getElementById('agreePercent').textContent = agreePercent;
                    document.getElementById('disagreePercent').textContent = disagreePercent;
                    document.getElementById('agreePercentSymbol').textContent = '%';
                    document.getElementById('disagreePercentSymbol').textContent = '%';
                    document.getElementById('voteStatus').innerHTML = '<i class="fas fa-users mr-2"></i>総投票数: ' + voteData.total.toLocaleString() + '人';
                    document.getElementById('agreeBar').style.width = agreePercent + '%';
                    document.getElementById('disagreeBar').style.width = disagreePercent + '%';
                }
            }

            // Post comment
            function postComment() {
                const input = document.getElementById('commentInput');
                const text = input.value.trim();
                
                if (!text) {
                    showToast('コメントを入力してください');
                    return;
                }

                if (!hasVoted) {
                    showToast('投票してからコメントしてください');
                    return;
                }

                // Check for !debate command (dev user only)
                if (text === '!debate' && currentUser.user_id === 'dev') {
                    input.value = '';
                    showToast('ディベートを開始します...');
                    startDebate();
                    return;
                }

                // Check for !stop command (dev user only)
                if (text === '!stop' && currentUser.user_id === 'dev') {
                    input.value = '';
                    if (debateActive) {
                        debateActive = false;
                        showToast('ディベートを停止しました');
                    } else {
                        showToast('ディベートは実行されていません');
                    }
                    return;
                }

                // Check for !delc command (dev user only) - 全コメント削除
                if (text === '!delc' && currentUser.user_id === 'dev') {
                    input.value = '';
                    const commentsList = document.getElementById('commentsList');
                    commentsList.innerHTML = '';
                    showToast('全コメントを削除しました');
                    return;
                }

                // Check for !deld command (dev user only) - 全ディベート履歴削除
                if (text === '!deld' && currentUser.user_id === 'dev') {
                    input.value = '';
                    const debateMessages = document.getElementById('debateMessages');
                    debateMessages.innerHTML = \`
                        <div class="text-center text-gray-400 p-8">
                            <i class="fas fa-info-circle text-4xl mb-4 text-cyan-400"></i>
                            <p class="text-lg">devユーザーでコメント欄に <span class="text-cyan-300 font-bold">!debate</span> と入力してディベートを開始</p>
                        </div>
                    \`;
                    conversationHistory = []; // 会話履歴もクリア
                    debateActive = false; // ディベート停止
                    showToast('全ディベート履歴を削除しました');
                    return;
                }

                if (text.length > 500) {
                    showToast('コメントは500文字以内で入力してください');
                    return;
                }

                // Create comment element
                const commentsList = document.getElementById('commentsList');
                const commentDiv = document.createElement('div');
                const stanceClass = userVote === 'agree' ? 'comment-agree' : 'comment-disagree';
                const stanceColor = userVote === 'agree' ? 'green' : 'red';
                const stanceIcon = userVote === 'agree' ? 'thumbs-up' : 'thumbs-down';
                const stanceText = userVote === 'agree' ? '意見A支持' : '意見B支持';
                const avatarGradient = userVote === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500';
                
                // @メンション機能削除（そのまま表示）
                const formattedText = text;
                
                commentDiv.className = 'comment-item ' + stanceClass + ' bg-gray-900/50 p-3 rounded border border-cyan-500/30';
                
                const initial = currentUser.user_id.charAt(0).toUpperCase();
                commentDiv.innerHTML = \`
                    <div class="flex items-center mb-2">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-br \${avatarGradient} flex items-center justify-center text-xs font-bold mr-2">
                            \${initial}
                        </div>
                        <div class="flex-1">
                            <p class="text-sm font-bold">@\${currentUser.user_id}</p>
                            <p class="text-xs text-\${stanceColor}-400">
                                <i class="fas fa-\${stanceIcon} mr-1"></i>\${stanceText}
                            </p>
                        </div>
                    </div>
                    <p class="text-sm text-gray-200">\${formattedText}</p>
                \`;

                // Add to top
                commentsList.insertBefore(commentDiv, commentsList.firstChild);

                // D1に保存
                saveCommentToD1(text);

                // Update count
                const count = parseInt(document.getElementById('commentCount').textContent);
                document.getElementById('commentCount').textContent = count + 1;

                // Clear input
                input.value = '';
                showToast('コメントを投稿しました！');
            }
            window.postComment = postComment;

            // コメントをD1に保存
            async function saveCommentToD1(content) {
                try {
                    await fetch('/api/comment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            debateId: DEBATE_ID,
                            userId: currentUser.user_id,
                            username: currentUser.user_id,
                            vote: userVote,
                            content: content
                        })
                    });
                } catch (error) {
                    console.error('Failed to save comment:', error);
                }
            }

            // コメント入力をクリアする関数
            function clearCommentInput() {
                const input = document.getElementById('commentInput');
                input.value = '';
            }
            window.clearCommentInput = clearCommentInput;

            // Show toast
            function showToast(message) {
                const toast = document.getElementById('toast');
                const toastMessage = document.getElementById('toastMessage');
                toastMessage.textContent = message;
                toast.classList.remove('hidden');
                setTimeout(() => {
                    toast.classList.add('hidden');
                }, 3000);
            }
            
            // AI評価システム（3つのAIが評価）
            async function getAIEvaluations(message, side) {
                try {
                    // 3つのAI評価を並列取得
                    const evaluations = await Promise.all([
                        getAIEvaluation(message, side, 'AI-1', 0.7),
                        getAIEvaluation(message, side, 'AI-2', 0.8),
                        getAIEvaluation(message, side, 'AI-3', 0.9)
                    ]);
                    
                    // 評価を集計
                    const totalUsers = voteData.total;
                    const votesPerAI = Math.floor(totalUsers / 3);
                    
                    evaluations.forEach((evaluation, index) => {
                        if (evaluation && evaluation.support) {
                            if (evaluation.support === 'agree') {
                                ai1Votes.agree += votesPerAI;
                            } else {
                                ai1Votes.disagree += votesPerAI;
                            }
                        }
                    });
                    
                    // 評価表示エリアを更新
                    displayAIEvaluation(evaluations[0], side);
                    
                    // ゲージを更新
                    updateVoteDisplay();
                } catch (error) {
                    console.error('AI evaluation error:', error);
                }
            }
            
            async function getAIEvaluation(message, side, aiName, temperature) {
                try {
                    const prompt = `この発言を評価してください：「${message}」
あなたは${aiName}です。この発言の説得力を評価し、評価記号（!!:優秀、!:良い、?:疑問、??:問題）と短い一言コメント（20文字以内）を返してください。
フォーマット: { "symbol": "!!", "comment": "データに基づく説得力", "support": "agree or disagree" }`;

                    const response = await fetch('/api/debate/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            systemPrompt: 'あなたはディベート評価の専門家です。客観的に評価してください。',
                            conversationHistory: [{ role: 'user', content: prompt }],
                            maxTokens: 50,
                            temperature: temperature
                        })
                    });
                    
                    const data = await response.json();
                    try {
                        return JSON.parse(data.message);
                    } catch {
                        return { symbol: '?', comment: '評価中...', support: side };
                    }
                } catch (error) {
                    return null;
                }
            }
            
            function displayAIEvaluation(evaluation, side) {
                if (!evaluation) return;
                
                const container = document.getElementById('debateMessages');
                const evalHTML = `
                    <div class="text-xs text-gray-400 italic text-right px-4 py-1">
                        <span class="font-bold text-cyan-400">${evaluation.symbol}</span> ${evaluation.comment}
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', evalHTML);
            }
            
            // 最終投票モーダルを表示
            function showFinalVotingModal() {
                finalVotingMode = true;
                
                // モーダル作成
                const modalHTML = `
                    <div id="finalVoteModal" class="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50">
                        <div class="bg-gray-900 border-4 border-cyan-500 rounded-lg p-8 max-w-lg w-full mx-4 shadow-2xl">
                            <h2 class="text-3xl font-bold text-cyan-400 mb-4 text-center">
                                <i class="fas fa-gavel mr-2"></i>最終判定
                            </h2>
                            <p class="text-white text-center mb-6">
                                ディベート終了！<br>
                                <span class="text-cyan-300">1分以内</span>に最終的な支持を決定してください。
                            </p>
                            <div class="grid grid-cols-2 gap-4">
                                <button id="finalVoteAgree" class="bg-green-500/20 border-2 border-green-500 hover:bg-green-500/40 p-6 rounded transition-all">
                                    <i class="fas fa-check-circle text-4xl mb-2"></i>
                                    <p class="font-bold">意見Aを支持</p>
                                </button>
                                <button id="finalVoteDisagree" class="bg-red-500/20 border-2 border-red-500 hover:bg-red-500/40 p-6 rounded transition-all">
                                    <i class="fas fa-times-circle text-4xl mb-2"></i>
                                    <p class="font-bold">意見Bを支持</p>
                                </button>
                            </div>
                            <p class="text-xs text-gray-400 text-center mt-4">
                                未選択の場合、現在の投票がそのまま反映されます
                            </p>
                        </div>
                    </div>
                `;
                document.body.insertAdjacentHTML('beforeend', modalHTML);
                
                // イベントリスナー
                document.getElementById('finalVoteAgree').addEventListener('click', () => {
                    submitFinalVote('agree');
                });
                document.getElementById('finalVoteDisagree').addEventListener('click', () => {
                    submitFinalVote('disagree');
                });
                
                // 60秒後に自動終了
                setTimeout(() => {
                    finalizeFinalVote();
                }, 60000);
            }
            
            function submitFinalVote(side) {
                // 既存の投票を変更
                if (hasVoted && userVote !== side) {
                    voteData[userVote]--;
                    voteData[side]++;
                    userVote = side;
                    
                    // localStorageに保存
                    const storageKey = 'debate_vote_' + DEBATE_ID + '_' + currentUser.user_id;
                    localStorage.setItem(storageKey, side);
                }
                
                // モーダルを閉じる
                const modal = document.getElementById('finalVoteModal');
                if (modal) modal.remove();
                
                showToast('最終投票を受け付けました！');
                
                // AI最終評価へ
                setTimeout(() => {
                    performFinalAIJudgment();
                }, 2000);
            }
            
            function finalizeFinalVote() {
                // 時間切れ：現在の投票をそのまま確定
                const modal = document.getElementById('finalVoteModal');
                if (modal) modal.remove();
                
                showToast('時間切れ！現在の投票で確定しました。');
                
                // AI最終評価へ
                setTimeout(() => {
                    performFinalAIJudgment();
                }, 2000);
            }
            
            // AI最終評価・投票・結果表示
            async function performFinalAIJudgment() {
                showToast('AIによる最終評価を実施中...');
                
                // 全会話を再評価
                const fullDebate = conversationHistory.map(msg => msg.content).join('\n');
                
                try {
                    // 3つのAIによる最終評価
                    const judgments = await Promise.all([
                        getFinalJudgment(fullDebate, 'AI-Judge-1', 0.7),
                        getFinalJudgment(fullDebate, 'AI-Judge-2', 0.8),
                        getFinalJudgment(fullDebate, 'AI-Judge-3', 0.9)
                    ]);
                    
                    // AI投票を集計
                    const totalUsers = voteData.total;
                    const votesPerAI = Math.floor(totalUsers / 3);
                    
                    judgments.forEach(judgment => {
                        if (judgment && judgment.winner) {
                            if (judgment.winner === 'agree') {
                                voteData.agree += votesPerAI;
                            } else {
                                voteData.disagree += votesPerAI;
                            }
                            voteData.total += votesPerAI;
                        }
                    });
                    
                    // 最終結果を表示
                    displayFinalResults(judgments);
                } catch (error) {
                    console.error('Final judgment error:', error);
                    showToast('AI評価エラー');
                }
            }
            
            async function getFinalJudgment(debate, aiName, temperature) {
                try {
                    const prompt = `以下のディベート全体を評価してください：\n${debate}\n\nあなたは${aiName}です。どちらが説得力があったか判定し、理由を簡潔に述べてください（50文字以内）。\nフォーマット: { "winner": "agree or disagree", "reason": "理由" }`;
                    
                    const response = await fetch('/api/debate/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            systemPrompt: 'あなたは公平なディベート審査員です。',
                            conversationHistory: [{ role: 'user', content: prompt }],
                            maxTokens: 100,
                            temperature: temperature
                        })
                    });
                    
                    const data = await response.json();
                    try {
                        return JSON.parse(data.message);
                    } catch {
                        return { winner: 'agree', reason: '評価中...' };
                    }
                } catch (error) {
                    return null;
                }
            }
            
            function displayFinalResults(judgments) {
                // ゲージの霧を解除
                document.getElementById('agreeBar').style.filter = 'none';
                document.getElementById('disagreeBar').style.filter = 'none';
                
                // 結果を更新
                updateVoteDisplay();
                
                // 勝者を決定
                const winner = voteData.agree > voteData.disagree ? '意見A' : '意見B';
                const winnerColor = voteData.agree > voteData.disagree ? 'text-green-400' : 'text-red-400';
                
                // AI評価コメントを表示
                const judgmentComments = judgments.map((j, i) => 
                    `<div class="mb-2"><span class="text-cyan-400 font-bold">AI-Judge-${i+1}:</span> ${j?.reason || '評価中...'}</div>`
                ).join('');
                
                // 結果モーダル
                const resultHTML = `
                    <div id="resultModal" class="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50">
                        <div class="bg-gray-900 border-4 border-cyan-500 rounded-lg p-8 max-w-2xl w-full mx-4 shadow-2xl">
                            <h2 class="text-4xl font-bold text-cyan-400 mb-6 text-center">
                                <i class="fas fa-trophy mr-2"></i>ディベート結果
                            </h2>
                            <div class="text-center mb-6">
                                <p class="text-2xl mb-2">勝者:</p>
                                <p class="text-5xl font-bold ${winnerColor}">${winner}</p>
                            </div>
                            <div class="bg-gray-800 p-4 rounded mb-6">
                                <h3 class="text-xl font-bold text-cyan-400 mb-4">最終投票結果</h3>
                                <div class="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <p class="text-3xl font-bold text-green-400">${voteData.agree}</p>
                                        <p class="text-sm text-gray-400">意見A支持</p>
                                    </div>
                                    <div>
                                        <p class="text-3xl font-bold text-red-400">${voteData.disagree}</p>
                                        <p class="text-sm text-gray-400">意見B支持</p>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-gray-800 p-4 rounded mb-6">
                                <h3 class="text-xl font-bold text-cyan-400 mb-4">AI審査員の評価</h3>
                                <div class="text-sm text-white">
                                    ${judgmentComments}
                                </div>
                            </div>
                            <button onclick="location.href='/main'" class="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded">
                                <i class="fas fa-home mr-2"></i>メインに戻る
                            </button>
                        </div>
                    </div>
                `;
                document.body.insertAdjacentHTML('beforeend', resultHTML);
            }

            // Auto-scroll debate messages
            setInterval(() => {
                const container = document.getElementById('debateMessages');
                if (container.scrollHeight - container.scrollTop - container.clientHeight < 100) {
                    container.scrollTop = container.scrollHeight;
                }
            }, 1000);

            // Update remaining time
            let remainingSeconds = 28 * 60 + 45;
            setInterval(() => {
                remainingSeconds--;
                const minutes = Math.floor(remainingSeconds / 60);
                const seconds = remainingSeconds % 60;
                document.getElementById('remainingTime').textContent = 
                    \`\${minutes}:\${seconds.toString().padStart(2, '0')}\`;
            }, 1000);

            // Simulate viewer count changes
            let viewerCount = 1234;
            setInterval(() => {
                viewerCount += Math.floor(Math.random() * 10) - 3;
                viewerCount = Math.max(1000, viewerCount);
                document.getElementById('viewerCount').textContent = viewerCount.toLocaleString();
            }, 5000);

            // Debate system
            let debateActive = false;
            let debateStartTime = 0;
            const MAX_DEBATE_TIME = 60; // 1 minute in seconds
            const MAX_CHARS = 150;
            let conversationHistory = []; // 会話履歴を保持
            let fogMode = false; // 霧モード（残り10%以下）
            let aiVotes = { agree: 0, disagree: 0 }; // AI投票数
            let aiJudges = []; // 3つのAI評価者

            async function startDebate() {
                if (debateActive) {
                    showToast('ディベートは既に実行中です');
                    return;
                }
                
                debateActive = true;
                debateStartTime = Date.now();
                conversationHistory = []; // 会話履歴をリセット
                
                const debateMessages = document.getElementById('debateMessages');
                debateMessages.innerHTML = '<div class="text-center text-cyan-300 p-4"><i class="fas fa-spinner fa-spin mr-2"></i>ディベート開始...</div>';
                
                // Start countdown timer
                updateDebateTimer();
                
                // Start first AI response
                await generateAIResponse('agree');
            }

            function updateDebateTimer() {
                if (!debateActive) return;
                
                const elapsed = Math.floor((Date.now() - debateStartTime) / 1000);
                const remaining = MAX_DEBATE_TIME - elapsed;
                
                // 残り10%で霧モードオン（ゲージ非公開）
                if (remaining <= MAX_DEBATE_TIME * 0.1 && !fogMode) {
                    fogMode = true;
                    showToast('⚠️ ゲージ非公開化！残り時間わずか。');
                    document.getElementById('agreePercent').textContent = '???';
                    document.getElementById('disagreePercent').textContent = '???';
                    document.getElementById('voteStatus').textContent = '❓ 集計中...';
                    // ゲージを霧状に
                    document.getElementById('agreeBar').style.filter = 'blur(15px)';
                    document.getElementById('disagreeBar').style.filter = 'blur(15px)';
                }
                
                if (remaining <= 0) {
                    debateActive = false;
                    fogMode = false;
                    
                    // 最終投票モード（1分猶予）
                    showFinalVotingModal();
                    return;
                }
                
                const minutes = Math.floor(remaining / 60);
                const seconds = remaining % 60;
                document.getElementById('remainingTime').textContent = 
                    \`\${minutes}:\${seconds.toString().padStart(2, '0')}\`;
                
                setTimeout(updateDebateTimer, 1000);
            }

            async function generateAIResponse(side) {
                if (!debateActive) return;
                
                const turnNumber = conversationHistory.length + 1;
                const systemPrompt = side === 'agree' 
                    ? \`ターン\${turnNumber}: AIは仕事を創出する立場。前回の議論を踏まえ、新しい角度から主張。データや事例を1つ挙げ、簡潔に反論。130文字厳守。\`
                    : \`ターン\${turnNumber}: AIは仕事を奪う立場。前回の議論を踏まえ、新しい角度から主張。データや事例を1つ挙げ、簡潔に反論。130文字厳守。\`;
                
                try {
                    const response = await fetch('/api/debate/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            systemPrompt,
                            conversationHistory, // 会話履歴を送信
                            maxTokens: 80,  // 短くする
                            temperature: 0.9  // 多様性を増やす
                        })
                    });
                    
                    if (!response.ok) {
                        throw new Error('API request failed');
                    }
                    
                    const data = await response.json();
                    
                    if (data.message && debateActive) {
                        // 会話履歴に追加
                        conversationHistory.push({
                            role: side === 'agree' ? 'assistant' : 'user',
                            content: data.message,
                            side: side
                        });
                        
                        addDebateMessageWithTyping(side, data.message); // タイピング演出版を使用
                        
                        // Continue with opposite side after 3 seconds
                        setTimeout(() => {
                            if (debateActive) {
                                const nextSide = side === 'agree' ? 'disagree' : 'agree';
                                generateAIResponse(nextSide);
                            }
                        }, 3000);
                    }
                } catch (error) {
                    console.error('Debate error:', error);
                    showToast('ディベート生成エラー: ' + error.message);
                    debateActive = false;
                }
            }

            function addDebateMessage(side, message) {
                const container = document.getElementById('debateMessages');
                const bubbleClass = side === 'agree' ? 'bubble-agree' : 'bubble-disagree';
                const aiModel = side === 'agree' ? 'GPT-4o' : 'Claude-3.5';
                const iconClass = side === 'agree' ? 'fa-brain' : 'fa-lightbulb';
                
                const bubbleHTML = \`
                    <div class="bubble \${bubbleClass} p-4 text-white shadow-lg">
                        <div class="flex items-center mb-2">
                            <div class="w-10 h-10 rounded-full bg-gradient-to-br \${side === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500'} flex items-center justify-center mr-3">
                                <i class="fas \${iconClass}"></i>
                            </div>
                            <div>
                                <p class="font-bold">\${aiModel}</p>
                                <p class="text-xs opacity-75">\${side === 'agree' ? '意見A' : '意見B'}</p>
                            </div>
                        </div>
                        <p class="text-sm leading-relaxed">\${message}</p>
                    </div>
                \`;
                
                container.insertAdjacentHTML('beforeend', bubbleHTML);
                container.scrollTop = container.scrollHeight;
            }

            // メッセージ追加関数（瞬時表示 + AI評価）
            function addDebateMessageWithTyping(side, message) {
                const container = document.getElementById('debateMessages');
                const bubbleClass = side === 'agree' ? 'bubble-agree' : 'bubble-disagree';
                const aiModel = side === 'agree' ? 'GPT-4o' : 'Claude-3.5';
                const iconClass = side === 'agree' ? 'fa-brain' : 'fa-lightbulb';
                
                // 瞬時表示（タイピングなし）
                const bubbleHTML = \`
                    <div class="bubble \${bubbleClass} p-4 text-white shadow-lg">
                        <div class="flex items-center mb-2">
                            <div class="w-10 h-10 rounded-full bg-gradient-to-br \${side === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500'} flex items-center justify-center mr-3">
                                <i class="fas \${iconClass}"></i>
                            </div>
                            <div>
                                <p class="font-bold">\${aiModel}</p>
                                <p class="text-xs opacity-75">\${side === 'agree' ? '意見A' : '意見B'}</p>
                            </div>
                        </div>
                        <p class="text-sm leading-relaxed">\${message}</p>
                    </div>
                \`;
                
                container.insertAdjacentHTML('beforeend', bubbleHTML);
                container.scrollTop = container.scrollHeight;
                
                // D1に保存
                saveDebateMessageToD1(side, aiModel, message);
                
                // AI評価を取得して表示
                if (!fogMode) {
                    getAIEvaluations(message, side);
                }
            }

            // ディベートメッセージをD1に保存
            async function saveDebateMessageToD1(side, model, content) {
                try {
                    // パラメータ検証
                    if (!side || !model || !content) {
                        console.error('Invalid parameters:', { side, model, content });
                        return;
                    }
                    
                    await fetch('/api/debate/message', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            debateId: DEBATE_ID,
                            side: side,
                            model: model,
                            content: content
                        })
                    });
                } catch (error) {
                    console.error('Failed to save debate message:', error);
                }
            }

            // ディベートメッセージをD1から読み込み
            let lastMessageCount = 0;
            async function loadDebateMessagesFromD1() {
                try {
                    const response = await fetch('/api/debate/' + DEBATE_ID + '/messages');
                    const data = await response.json();
                    
                    if (data.messages && data.messages.length > 0) {
                        // 新しいメッセージがある場合のみ更新
                        if (data.messages.length !== lastMessageCount) {
                            const container = document.getElementById('debateMessages');
                            container.innerHTML = ''; // クリア
                            
                            for (const msg of data.messages) {
                                addDebateMessage(msg.side, msg.content);
                            }
                            
                            lastMessageCount = data.messages.length;
                        }
                    }
                } catch (error) {
                    console.error('Failed to load debate messages:', error);
                }
            }

            // コメントをD1から読み込み
            let lastCommentCount = 0;
            async function loadCommentsFromD1() {
                try {
                    const response = await fetch('/api/comments/' + DEBATE_ID);
                    const data = await response.json();
                    
                    if (data.comments && data.comments.length > 0) {
                        // 新しいコメントがある場合のみ更新
                        if (data.comments.length !== lastCommentCount) {
                            const commentsList = document.getElementById('commentsList');
                            commentsList.innerHTML = ''; // クリア
                            
                            for (const comment of data.comments) {
                                const stanceClass = comment.vote === 'agree' ? 'comment-agree' : 'comment-disagree';
                                const stanceColor = comment.vote === 'agree' ? 'green' : 'red';
                                const stanceIcon = comment.vote === 'agree' ? 'thumbs-up' : 'thumbs-down';
                                const stanceText = comment.vote === 'agree' ? '意見A支持' : '意見B支持';
                                const avatarGradient = comment.vote === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500';
                                const initial = comment.username.charAt(0).toUpperCase();
                                // メンション機能削除
                                const formattedContent = comment.content;
                                
                                const commentDiv = document.createElement('div');
                                commentDiv.className = 'comment-item ' + stanceClass + ' bg-gray-900/50 p-3 rounded border border-cyan-500/30';
                                commentDiv.innerHTML = \`
                                    <div class="flex items-center mb-2">
                                        <div class="w-8 h-8 rounded-full bg-gradient-to-br \${avatarGradient} flex items-center justify-center text-xs font-bold mr-2">
                                            \${initial}
                                        </div>
                                        <div class="flex-1">
                                            <p class="text-sm font-bold">@\${comment.username}</p>
                                            <p class="text-xs text-\${stanceColor}-400">
                                                <i class="fas fa-\${stanceIcon} mr-1"></i>\${stanceText}
                                            </p>
                                        </div>
                                    </div>
                                    <p class="text-sm text-gray-200">\${formattedContent}</p>
                                \`;
                                
                                commentsList.insertBefore(commentDiv, commentsList.firstChild);
                            }
                            
                            lastCommentCount = data.comments.length;
                        }
                    }
                } catch (error) {
                    console.error('Failed to load comments:', error);
                }
            }

            // リアルタイム同期（2秒ごとにポーリング）
            function startRealtimeSync() {
                setInterval(() => {
                    loadDebateMessagesFromD1();
                    loadCommentsFromD1();
                }, 2000);
            }

            // Initialize on page load
            window.addEventListener('DOMContentLoaded', () => {
                console.log('Page loaded, initializing...');
                
                // 投票ボタンのイベントリスナーを先に設定
                const agreeModalBtn = document.getElementById('voteAgreeModalBtn');
                const disagreeModalBtn = document.getElementById('voteDisagreeModalBtn');
                const agreeBtn = document.getElementById('voteAgreeBtn');
                const disagreeBtn = document.getElementById('voteDisagreeBtn');
                
                console.log('Button elements found:', {
                    agreeModalBtn: !!agreeModalBtn,
                    disagreeModalBtn: !!disagreeModalBtn,
                    agreeBtn: !!agreeBtn,
                    disagreeBtn: !!disagreeBtn
                });
                
                if (agreeModalBtn) {
                    agreeModalBtn.addEventListener('click', () => {
                        console.log('Agree modal button clicked');
                        submitVote('agree');
                    });
                    console.log('Agree modal button listener added');
                } else {
                    console.error('Agree modal button not found!');
                }
                
                if (disagreeModalBtn) {
                    disagreeModalBtn.addEventListener('click', () => {
                        console.log('Disagree modal button clicked');
                        submitVote('disagree');
                    });
                    console.log('Disagree modal button listener added');
                } else {
                    console.error('Disagree modal button not found!');
                }
                
                if (agreeBtn) {
                    agreeBtn.addEventListener('click', () => {
                        console.log('Agree button clicked');
                        changeVote('agree');
                    });
                } else {
                    console.error('Agree button not found!');
                }
                
                if (disagreeBtn) {
                    disagreeBtn.addEventListener('click', () => {
                        console.log('Disagree button clicked');
                        changeVote('disagree');
                    });
                } else {
                    console.error('Disagree button not found!');
                }
                
                initDemoVotes();
                updateVoteDisplay();
                loadDebateMessagesFromD1(); // ディベートメッセージを読み込み
                loadCommentsFromD1(); // コメントを読み込み
                
                // リアルタイム同期を開始
                startRealtimeSync();
                
                // localStorageから投票を復元
                const storageKey = 'debate_vote_' + DEBATE_ID + '_' + currentUser.user_id;
                const savedVote = localStorage.getItem(storageKey);
                
                if (savedVote) {
                    // 既に投票済み - モーダルをスキップ
                    userVote = savedVote;
                    hasVoted = true;
                    document.getElementById('voteModal').classList.add('hidden');
                    highlightSelectedButton(savedVote);
                    console.log('Restored vote from localStorage:', savedVote);
                } else {
                    // 未投票 - モーダルを表示
                    document.getElementById('voteModal').classList.remove('hidden');
                    console.log('No saved vote, showing modal');
                }
                
                // コメントボタンのイベントリスナー
                const postCommentBtn = document.getElementById('postCommentBtn');
                const clearCommentBtn = document.getElementById('clearCommentBtn');
                
                if (postCommentBtn) {
                    postCommentBtn.addEventListener('click', postComment);
                }
                
                if (clearCommentBtn) {
                    clearCommentBtn.addEventListener('click', clearCommentInput);
                }
                
                console.log('Initialization complete!');
            });
        </script>
    </body>
    </html>
`
