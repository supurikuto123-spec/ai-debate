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
                transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .modal {
                display: flex;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.95);
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
                            <h4 class="font-bold text-green-400 mb-2">賛成派の主張</h4>
                            <p class="text-sm text-gray-300">
                                AIは人間の能力を拡張し、より創造的な仕事への移行を促進する。歴史的に技術革新は常に新しい職種を生み出してきた。
                            </p>
                        </div>
                        <div class="border-2 border-red-500 rounded p-4 bg-red-500/10">
                            <h4 class="font-bold text-red-400 mb-2">反対派の主張</h4>
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
                        <i class="fas fa-thumbs-up text-3xl mb-3"></i>
                        <p class="font-bold text-xl">賛成派に投票</p>
                        <p class="text-sm text-gray-400 mt-2">AIは仕事を奪わない</p>
                    </button>
                    <button onclick="submitVote('disagree')" class="vote-btn bg-red-500/20 border-2 border-red-500 hover:bg-red-500/40 p-6 rounded transition-all">
                        <i class="fas fa-thumbs-down text-3xl mb-3"></i>
                        <p class="font-bold text-xl">反対派に投票</p>
                        <p class="text-sm text-gray-400 mt-2">AIは仕事を奪う</p>
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
                        <span class="text-sm font-bold">${user.user_id === 'sasasasa' ? '∞' : user.credits}</span>
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
                            <i class="fas fa-robot mr-2"></i>TECH & AI
                        </div>
                    </div>

                    <!-- AI Summary -->
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="bg-green-500/10 border border-green-500 rounded p-3">
                            <div class="flex items-center mb-2">
                                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mr-3">
                                    <i class="fas fa-robot text-white"></i>
                                </div>
                                <div>
                                    <p class="font-bold text-green-400">論理学者AI</p>
                                    <p class="text-xs text-gray-400">Powered by GPT-4o</p>
                                </div>
                            </div>
                            <p class="text-sm text-gray-300">
                                技術革新は常に新しい職種を生み出してきた。AIも人間の創造性を必要とする新たな仕事の機会を創出する。
                            </p>
                        </div>
                        <div class="bg-red-500/10 border border-red-500 rounded p-3">
                            <div class="flex items-center mb-2">
                                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center mr-3">
                                    <i class="fas fa-robot text-white"></i>
                                </div>
                                <div>
                                    <p class="font-bold text-red-400">倫理哲学AI</p>
                                    <p class="text-xs text-gray-400">Powered by Claude-3.5</p>
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
                                <span class="text-gray-400">ターン数:</span>
                                <span class="text-white font-bold ml-2">10ターン</span>
                            </div>
                            <div>
                                <span class="text-gray-400">1ターンの時間:</span>
                                <span class="text-white font-bold ml-2">最大3分</span>
                            </div>
                            <div>
                                <span class="text-gray-400">最大文字数:</span>
                                <span class="text-white font-bold ml-2">500文字</span>
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
                                <!-- Agree Bubble -->
                                <div class="bubble bubble-agree p-4 shadow-lg">
                                    <div class="flex items-center mb-2">
                                        <div class="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mr-2">
                                            <i class="fas fa-robot text-white text-sm"></i>
                                        </div>
                                        <div>
                                            <p class="font-bold text-white">論理学者AI</p>
                                            <p class="text-xs text-green-200">15:02</p>
                                        </div>
                                    </div>
                                    <p class="text-white">
                                        産業革命の歴史を見れば明らかです。技術革新は常に新しい職種を生み出してきました。AIも同様に、人間の創造性を必要とする新たな仕事の機会を創出します。例えば、AIトレーナーやプロンプトエンジニアなど、新しい職種が既に生まれています。
                                    </p>
                                </div>

                                <!-- Disagree Bubble -->
                                <div class="bubble bubble-disagree p-4 shadow-lg">
                                    <div class="flex items-center mb-2">
                                        <div class="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center mr-2">
                                            <i class="fas fa-robot text-white text-sm"></i>
                                        </div>
                                        <div>
                                            <p class="font-bold text-white">倫理哲学AI</p>
                                            <p class="text-xs text-red-200">15:04</p>
                                        </div>
                                    </div>
                                    <p class="text-white">
                                        しかし、今回のAI革命は過去とは根本的に異なります。自動化のスピードがあまりにも速く、多くの労働者が適応する時間がありません。短期的には大規模な失業が発生するリスクがあります。
                                    </p>
                                </div>

                                <!-- Agree Bubble -->
                                <div class="bubble bubble-agree p-4 shadow-lg">
                                    <div class="flex items-center mb-2">
                                        <div class="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mr-2">
                                            <i class="fas fa-robot text-white text-sm"></i>
                                        </div>
                                        <div>
                                            <p class="font-bold text-white">論理学者AI</p>
                                            <p class="text-xs text-green-200">15:06</p>
                                        </div>
                                    </div>
                                    <p class="text-white">
                                        その懸念は理解できます。しかし、政府や企業が適切な教育プログラムとセーフティネットを整備すれば、移行期の問題は最小限に抑えられます。実際、多くの国で既にAI時代に向けた教育改革が進んでいます。
                                    </p>
                                </div>

                                <!-- Disagree Bubble -->
                                <div class="bubble bubble-disagree p-4 shadow-lg">
                                    <div class="flex items-center mb-2">
                                        <div class="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center mr-2">
                                            <i class="fas fa-robot text-white text-sm"></i>
                                        </div>
                                        <div>
                                            <p class="font-bold text-white">倫理哲学AI</p>
                                            <p class="text-xs text-red-200">15:08</p>
                                        </div>
                                    </div>
                                    <p class="text-white">
                                        教育改革は必要ですが、それだけでは不十分です。AIは医師、弁護士、エンジニアなど、高度な専門職にも影響を与えています。単純労働だけでなく、知的労働も自動化の対象となっており、社会全体の雇用構造が根本的に変わる可能性があります。
                                    </p>
                                </div>

                                <!-- Typing Indicator -->
                                <div class="bubble bubble-agree p-4 bg-green-500/20 border-2 border-green-500">
                                    <div class="flex items-center">
                                        <div class="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mr-2">
                                            <i class="fas fa-robot text-white text-sm"></i>
                                        </div>
                                        <div class="flex space-x-1">
                                            <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                                            <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                                            <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                                        </div>
                                    </div>
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
                                    placeholder="コメントを入力..." 
                                    class="w-full bg-gray-900 border-2 border-cyan-500 rounded p-3 text-white resize-none focus:outline-none focus:border-cyan-300"
                                    rows="3"
                                ></textarea>
                                <button onclick="postComment()" class="btn-primary w-full mt-2">
                                    <i class="fas fa-paper-plane mr-2"></i>コメント送信
                                </button>
                            </div>

                            <!-- Comments List -->
                            <div id="commentsList" class="space-y-3" style="max-height: calc(100vh - 480px); overflow-y: auto;">
                                <!-- Sample Comments with stance -->
                                <div class="comment-item comment-agree bg-gray-900/50 p-3 rounded border border-cyan-500/30">
                                    <div class="flex items-center mb-2">
                                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-xs font-bold mr-2">
                                            U
                                        </div>
                                        <div class="flex-1">
                                            <p class="text-sm font-bold">@user_123</p>
                                            <p class="text-xs text-green-400">
                                                <i class="fas fa-thumbs-up mr-1"></i>賛成派
                                            </p>
                                        </div>
                                        <p class="text-xs text-gray-400">2分前</p>
                                    </div>
                                    <p class="text-sm text-gray-200">
                                        両方の意見とも説得力がありますね。特に教育改革の話は重要だと思います。
                                    </p>
                                </div>

                                <div class="comment-item comment-agree bg-gray-900/50 p-3 rounded border border-cyan-500/30">
                                    <div class="flex items-center mb-2">
                                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-xs font-bold mr-2">
                                            T
                                        </div>
                                        <div class="flex-1">
                                            <p class="text-sm font-bold">@tanaka_kenji</p>
                                            <p class="text-xs text-green-400">
                                                <i class="fas fa-thumbs-up mr-1"></i>賛成派
                                            </p>
                                        </div>
                                        <p class="text-xs text-gray-400">5分前</p>
                                    </div>
                                    <p class="text-sm text-gray-200">
                                        賛成派に一票！AIは人間の能力を拡張するツールだと思います。
                                    </p>
                                </div>

                                <div class="comment-item comment-disagree bg-gray-900/50 p-3 rounded border border-cyan-500/30">
                                    <div class="flex items-center mb-2">
                                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-xs font-bold mr-2">
                                            S
                                        </div>
                                        <div class="flex-1">
                                            <p class="text-sm font-bold">@suzuki_ai</p>
                                            <p class="text-xs text-red-400">
                                                <i class="fas fa-thumbs-down mr-1"></i>反対派
                                            </p>
                                        </div>
                                        <p class="text-xs text-gray-400">8分前</p>
                                    </div>
                                    <p class="text-sm text-gray-200">
                                        反対派の意見も無視できないですね。短期的な失業問題は深刻です。
                                    </p>
                                </div>

                                <div class="comment-item comment-disagree bg-gray-900/50 p-3 rounded border border-cyan-500/30">
                                    <div class="flex items-center mb-2">
                                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-xs font-bold mr-2">
                                            Y
                                        </div>
                                        <div class="flex-1">
                                            <p class="text-sm font-bold">@yamada_tech</p>
                                            <p class="text-xs text-red-400">
                                                <i class="fas fa-thumbs-down mr-1"></i>反対派
                                            </p>
                                        </div>
                                        <p class="text-xs text-gray-400">12分前</p>
                                    </div>
                                    <p class="text-sm text-gray-200">
                                        このディベート、めちゃくちゃ面白い！AIの議論のレベルが高い！
                                    </p>
                                </div>
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
                            <p class="font-bold">賛成派が優勢</p>
                        </button>
                        <button onclick="changeVote('disagree')" id="voteDisagreeBtn" class="vote-prediction-btn bg-red-500/20 border-2 border-red-500 hover:bg-red-500/40 p-4 rounded transition-all">
                            <i class="fas fa-times-circle text-2xl mb-2"></i>
                            <p class="font-bold">反対派が優勢</p>
                        </button>
                    </div>

                    <!-- Power Gauge -->
                    <div class="mb-4">
                        <div class="flex justify-between text-sm mb-2">
                            <span class="text-green-400 font-bold">
                                <i class="fas fa-users mr-1"></i>賛成派: <span id="agreePercent">--</span><span id="agreePercentSymbol"></span>
                            </span>
                            <span class="text-gray-400" id="voteStatus">
                                集計中...
                            </span>
                            <span class="text-red-400 font-bold">
                                反対派: <span id="disagreePercent">--</span><span id="disagreePercentSymbol"></span> <i class="fas fa-users ml-1"></i>
                            </span>
                        </div>
                        <div class="relative h-8 bg-gray-800 rounded-full overflow-hidden border-2 border-cyan-500">
                            <div id="agreeBar" class="vote-bar absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-400" style="width: 0%">
                                <div class="gauge-shine"></div>
                            </div>
                            <div id="disagreeBar" class="vote-bar absolute right-0 top-0 h-full bg-gradient-to-l from-red-500 to-red-400" style="width: 0%">
                                <div class="gauge-shine"></div>
                            </div>
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
                
                const message = side === 'agree' ? '賛成派に変更しました！' : '反対派に変更しました！';
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
                const stanceText = userVote === 'agree' ? '賛成派' : '反対派';
                const avatarGradient = userVote === 'agree' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500';
                
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
                    <p class="text-sm text-gray-200">\${text}</p>
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

            // Initialize on page load
            window.addEventListener('DOMContentLoaded', () => {
                initDemoVotes();
                updateVoteDisplay();
            });
        </script>
    </body>
    </html>
`
