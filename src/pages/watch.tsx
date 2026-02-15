import { globalNav } from '../components/global-nav';

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
            @keyframes shimmer-slide {
                0% { left: -100%; }
                100% { left: 200%; }
            }
        </style>
    </head>
    <body class="bg-black text-white overflow-x-hidden">
        \${globalNav(user)}
        
        <!-- Vote Modal -->
        <div id="voteModal" class="modal">
            <div class="cyber-card max-w-2xl w-full mx-4">
                <h2 class="text-3xl font-bold mb-6 text-center cyber-text">
                    <i class="fas fa-vote-yea mr-3 text-cyan-400"></i>
                    まず、あなたの立場を選択してください
                </h2>
                
                <div class="mb-8">
                    <h3 class="text-xl font-bold mb-4 text-cyan-300">ディベートテーマ</h3>
                    <p id="modalTheme" class="text-2xl mb-6 text-center">読み込み中...</p>
                    
                    <div class="grid grid-cols-2 gap-6 mb-8">
                        <div class="border-2 border-green-500 rounded p-4 bg-green-500/10">
                            <h4 class="font-bold text-green-400 mb-2">意見A (Agree)</h4>
                            <p id="modalOpinionA" class="text-sm text-gray-300">読み込み中...</p>
                        </div>
                        <div class="border-2 border-red-500 rounded p-4 bg-red-500/10">
                            <h4 class="font-bold text-red-400 mb-2">意見B (Disagree)</h4>
                            <p id="modalOpinionB" class="text-sm text-gray-300">読み込み中...</p>
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
                        <span class="text-sm font-bold" id="navCredits">${user.credits}</span>
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
                            <h1 id="debateTitle" class="text-3xl font-black cyber-text mb-2">
                                読み込み中...
                            </h1>
                            <div class="flex items-center space-x-4 text-sm text-gray-400">
                                <span>
                                    <i class="fas fa-calendar-alt mr-2 text-cyan-400"></i><span id="debateStartTime">開始前</span>
                                </span>
                                <span>
                                    <i class="fas fa-clock mr-2 text-magenta-400"></i>残り時間: <span id="remainingTime">1:00</span>
                                </span>
                                <span class="text-green-400">
                                    <div class="w-2 h-2 bg-green-400 rounded-full inline-block mr-2 animate-pulse"></div>
                                    LIVE
                                </span>
                                <span>
                                    <i class="fas fa-eye mr-2 text-yellow-400"></i><span id="viewerCount">1</span>人が観戦中
                                </span>
                            </div>
                        </div>
                        <div class="inline-block px-4 py-1 bg-cyan-500/20 border border-cyan-500 rounded-full text-cyan-300 text-sm">
                            <i class="fas fa-microchip mr-2"></i><span id="debateCategory">AI</span>
                        </div>
                    </div>

                    <!-- AI Summary (dynamic from DB) -->
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="bg-green-500/10 border border-green-500 rounded p-3">
                            <div class="flex items-center mb-2">
                                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mr-3">
                                    <i class="fas fa-brain text-white"></i>
                                </div>
                                <div>
                                    <p class="font-bold text-green-400">意見A (Agree)</p>
                                    <p class="text-xs text-gray-400" id="modelLabelA">読み込み中...</p>
                                </div>
                            </div>
                            <p id="summaryOpinionA" class="text-sm text-gray-300">読み込み中...</p>
                        </div>
                        <div class="bg-red-500/10 border border-red-500 rounded p-3">
                            <div class="flex items-center mb-2">
                                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center mr-3">
                                    <i class="fas fa-lightbulb text-white"></i>
                                </div>
                                <div>
                                    <p class="font-bold text-red-400">意見B (Disagree)</p>
                                    <p class="text-xs text-gray-400" id="modelLabelB">読み込み中...</p>
                                </div>
                            </div>
                            <p id="summaryOpinionB" class="text-sm text-gray-300">読み込み中...</p>
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
                                <span class="text-white font-bold ml-2" id="debateTimeLimit">60秒</span>
                            </div>
                            <div>
                                <span class="text-gray-400">AIモデル:</span>
                                <span class="text-white font-bold ml-2" id="debateModelInfo">gpt-4.1-nano</span>
                            </div>
                            <div>
                                <span class="text-gray-400">最大文字数:</span>
                                <span class="text-white font-bold ml-2" id="debateCharLimit">180文字</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Layout: Debate (Left) + Comments (Right) -->
                <div class="grid grid-cols-3 gap-6">
                    <!-- Debate Area (2 columns) -->
                    <div class="col-span-2 space-y-6">
                        <!-- Debate Messages -->
                        <div class="cyber-card">
                            <h3 class="text-2xl font-bold mb-4 flex items-center sticky top-0 bg-black/95 pb-4 border-b border-cyan-500">
                                <i class="fas fa-comments mr-3 text-cyan-400"></i>
                                ディベート進行
                            </h3>
                            
                            <div id="debateMessages" class="flex flex-col space-y-4" style="height: 600px; overflow-y: auto; scroll-behavior: smooth;">
                                <div class="text-center text-gray-400 p-8">
                                    <i class="fas fa-info-circle text-4xl mb-4 text-cyan-400"></i>
                                    <p class="text-lg">devユーザーでコメント欄に <span class="text-cyan-300 font-bold">!s</span> と入力してディベートを開始</p>
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
                                    <span id="commentCount">0</span>件
                                </span>
                            </h3>

                            <!-- Comment Input -->
                            <div class="mb-4">
                                <textarea 
                                    id="commentInput" 
                                    placeholder="コメントを入力..." 
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

                            <!-- Comments List -->
                            <div id="commentsList" class="space-y-3" style="height: 500px; overflow-y: auto; scroll-behavior: smooth; display: flex; flex-direction: column;">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- AI Judges Evaluation Section -->
                <div class="cyber-card mt-6">
                    <h3 class="text-xl font-bold mb-4 flex items-center">
                        <i class="fas fa-gavel mr-3 text-cyan-400"></i>
                        AI審査員の評価
                    </h3>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between bg-gray-900/50 p-3 rounded">
                            <span class="text-sm font-bold">AI-Judge-1:</span>
                            <span id="judge1-eval" class="text-sm text-gray-400">評価中...</span>
                        </div>
                        <div class="flex items-center justify-between bg-gray-900/50 p-3 rounded">
                            <span class="text-sm font-bold">AI-Judge-2:</span>
                            <span id="judge2-eval" class="text-sm text-gray-400">評価中...</span>
                        </div>
                        <div class="flex items-center justify-between bg-gray-900/50 p-3 rounded">
                            <span class="text-sm font-bold">AI-Judge-3:</span>
                            <span id="judge3-eval" class="text-sm text-gray-400">評価中...</span>
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
                            <div id="agreeBar" class="vote-bar absolute left-0 top-0 h-full bg-gradient-to-r from-green-600 via-green-500 to-emerald-400" style="width: 50%; transition: width 0.5s ease;"></div>
                            <div id="disagreeBar" class="vote-bar absolute right-0 top-0 h-full bg-gradient-to-l from-red-600 via-red-500 to-rose-400" style="width: 50%; transition: width 0.5s ease;"></div>
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

        <div id="app-data" 
             data-debate-id="${debateId}" 
             data-user-id="${user.user_id}" 
             data-user-credits="${user.credits}"
             style="display:none;"></div>
        
        <script src="/static/watch.js"></script>
    </body>
    </html>
`
