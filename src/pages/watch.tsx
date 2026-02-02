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
                box-shadow: 0 0 20px rgba(255,255,255,0.5);
                animation: pulse-glow 2s infinite;
            }
            @keyframes pulse-glow {
                0%, 100% {
                    box-shadow: 0 0 20px rgba(255,255,255,0.5), 0 0 40px currentColor;
                    filter: brightness(1);
                }
                50% {
                    box-shadow: 0 0 30px rgba(255,255,255,0.8), 0 0 60px currentColor;
                    filter: brightness(1.2);
                }
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
                    <button onclick="submitVote('agree')" class="vote-btn bg-green-500/20 border-2 border-green-500 hover:bg-green-500/40 p-6 rounded transition-all">
                        <i class="fas fa-check-circle text-3xl mb-3"></i>
                        <p class="font-bold text-xl">意見Aを支持</p>
                    </button>
                    <button onclick="submitVote('disagree')" class="vote-btn bg-red-500/20 border-2 border-red-500 hover:bg-red-500/40 p-6 rounded transition-all">
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
                                <span class="text-white font-bold ml-2">150文字</span>
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
                                    <button onclick="postComment()" class="btn-primary flex-1">
                                        <i class="fas fa-paper-plane mr-2"></i>コメント送信
                                    </button>
                                    <button onclick="clearCommentInput()" class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Comments List (拡大版) -->
                            <div id="commentsList" class="space-y-3" style="max-height: calc(100vh - 400px); min-height: 400px; overflow-y: auto; scroll-behavior: smooth;">
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
                        <button onclick="changeVote('agree')" id="voteAgreeBtn" class="vote-prediction-btn bg-green-500/20 border-2 border-green-500 hover:bg-green-500/40 p-4 rounded transition-all">
                            <i class="fas fa-check-circle text-2xl mb-2"></i>
                            <p class="font-bold">意見Aが優勢</p>
                        </button>
                        <button onclick="changeVote('disagree')" id="voteDisagreeBtn" class="vote-prediction-btn bg-red-500/20 border-2 border-red-500 hover:bg-red-500/40 p-4 rounded transition-all">
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
            // User data
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

            // Initialize demo votes (4 random voters)
            function initDemoVotes() {
                // 4人のランダム投票者を生成
                for (let i = 0; i < 4; i++) {
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
                
                // @メンションを強調表示
                const formattedText = text.replace(/@(\w+)/g, '<span class="text-cyan-400 font-bold">@$1</span>');
                
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
                        <p class="text-xs text-gray-400">たった今</p>
                    </div>
                    <p class="text-sm text-gray-200">\${formattedText}</p>
                \`;

                // Add to top
                commentsList.insertBefore(commentDiv, commentsList.firstChild);

                // Update count
                const count = parseInt(document.getElementById('commentCount').textContent);
                document.getElementById('commentCount').textContent = count + 1;

                // Clear input
                input.value = '';
                showToast('コメントを投稿しました！');
            }

            // コメント入力をクリアする関数
            function clearCommentInput() {
                const input = document.getElementById('commentInput');
                input.value = '';
            }

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
                
                if (remaining <= 0) {
                    debateActive = false;
                    showToast('ディベート終了（制限時間）');
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
                
                const systemPrompt = side === 'agree' 
                    ? 'あなたは「AIは人類の仕事を奪わない」という立場です。具体的な統計データ、歴史的事例、専門家の見解を引用し、論理的に主張してください。相手の意見に反論しながら、建設的な議論を展開してください。150文字以内。'
                    : 'あなたは「AIは人類の仕事を奪う」という立場です。具体的な統計データ、実例、労働市場の変化を示し、論理的に主張してください。相手の意見に反論しながら、建設的な議論を展開してください。150文字以内。';
                
                try {
                    const response = await fetch('/api/debate/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            systemPrompt,
                            conversationHistory, // 会話履歴を送信
                            maxTokens: 200,
                            temperature: 0.8
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
                        <p class="text-xs opacity-75 mt-2">たった今</p>
                    </div>
                \`;
                
                container.insertAdjacentHTML('beforeend', bubbleHTML);
                container.scrollTop = container.scrollHeight;
            }

            // タイピング演出版のメッセージ追加関数
            function addDebateMessageWithTyping(side, message) {
                const container = document.getElementById('debateMessages');
                const bubbleClass = side === 'agree' ? 'bubble-agree' : 'bubble-disagree';
                const aiModel = side === 'agree' ? 'GPT-4o' : 'Claude-3.5';
                const iconClass = side === 'agree' ? 'fa-brain' : 'fa-lightbulb';
                
                // 空のバブルを作成
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
                        <p class="text-sm leading-relaxed typing-text"></p>
                        <p class="text-xs opacity-75 mt-2">たった今</p>
                    </div>
                \`;
                
                container.insertAdjacentHTML('beforeend', bubbleHTML);
                const typingElement = container.querySelector('.bubble:last-child .typing-text');
                
                // D1に保存
                saveDebateMessageToD1(side, aiModel, message);
                
                // タイピング演出
                let index = 0;
                const typingSpeed = 30; // ms per character
                
                function typeNextChar() {
                    if (index < message.length && debateActive) {
                        typingElement.textContent += message[index];
                        index++;
                        container.scrollTop = container.scrollHeight;
                        setTimeout(typeNextChar, typingSpeed);
                    }
                }
                
                typeNextChar();
            }

            // ディベートメッセージをD1に保存
            async function saveDebateMessageToD1(side, model, content) {
                try {
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
            async function loadDebateMessagesFromD1() {
                try {
                    const response = await fetch('/api/debate/' + DEBATE_ID + '/messages');
                    const data = await response.json();
                    
                    if (data.messages && data.messages.length > 0) {
                        const container = document.getElementById('debateMessages');
                        container.innerHTML = ''; // クリア
                        
                        for (const msg of data.messages) {
                            addDebateMessage(msg.side, msg.content);
                        }
                    }
                } catch (error) {
                    console.error('Failed to load debate messages:', error);
                }
            }

            // Initialize on page load
            window.addEventListener('DOMContentLoaded', () => {
                initDemoVotes();
                updateVoteDisplay();
                loadDebateMessagesFromD1(); // ディベートメッセージを読み込み
                
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
                }
            });
        </script>
    </body>
    </html>
`
