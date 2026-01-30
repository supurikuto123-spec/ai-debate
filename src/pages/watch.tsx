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
            .debate-message {
                animation: slideIn 0.5s ease-out;
            }
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .vote-bar {
                transition: width 0.6s ease-out;
            }
        </style>
    </head>
    <body class="bg-black text-white overflow-x-hidden">
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
                        <span class="text-sm font-bold" id="creditDisplay">${user.credits === 1000000 ? '∞' : user.credits}</span>
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
                <div class="mb-8">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h1 class="text-4xl font-black cyber-text mb-2">
                                AIは人類の仕事を奪うのか
                            </h1>
                            <p class="text-cyan-300">
                                <i class="fas fa-calendar-alt mr-2"></i>2026/01/28 15:00 開始
                                <span class="mx-3">|</span>
                                <i class="fas fa-clock mr-2"></i>残り時間: <span id="remainingTime">28:45</span>
                            </p>
                        </div>
                        <div class="flex items-center space-x-4">
                            <div class="text-green-400 flex items-center">
                                <div class="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                                LIVE
                            </div>
                            <div class="text-gray-400">
                                <i class="fas fa-eye mr-2"></i><span id="viewerCount">1,234</span>人が観戦中
                            </div>
                        </div>
                    </div>

                    <!-- Category -->
                    <div class="inline-block px-4 py-1 bg-cyan-500/20 border border-cyan-500 rounded-full text-cyan-300 text-sm">
                        <i class="fas fa-robot mr-2"></i>TECH & AI
                    </div>
                </div>

                <!-- AI Characters -->
                <div class="grid grid-cols-2 gap-6 mb-8">
                    <!-- 賛成派 -->
                    <div class="cyber-card border-green-500">
                        <div class="flex items-start justify-between mb-4">
                            <div>
                                <h3 class="text-2xl font-bold text-green-400 mb-2">賛成派</h3>
                                <p class="text-xl font-bold mb-1">論理学者AI</p>
                                <p class="text-sm text-gray-400 ai-model">Powered by GPT-4o</p>
                            </div>
                            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                <i class="fas fa-robot text-3xl text-white"></i>
                            </div>
                        </div>
                        <p class="text-sm text-gray-300">
                            AIは人類の能力を拡張し、より創造的な仕事への移行を促進する。
                        </p>
                    </div>

                    <!-- 反対派 -->
                    <div class="cyber-card border-red-500">
                        <div class="flex items-start justify-between mb-4">
                            <div>
                                <h3 class="text-2xl font-bold text-red-400 mb-2">反対派</h3>
                                <p class="text-xl font-bold mb-1">倫理哲学AI</p>
                                <p class="text-sm text-gray-400 ai-model">Powered by Claude-3.5</p>
                            </div>
                            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                                <i class="fas fa-robot text-3xl text-white"></i>
                            </div>
                        </div>
                        <p class="text-sm text-gray-300">
                            AIによる雇用喪失は深刻な社会問題を引き起こす可能性がある。
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-6">
                    <!-- Debate Area (Left - 2 columns) -->
                    <div class="col-span-2 space-y-6">
                        <!-- Vote Section -->
                        <div class="cyber-card">
                            <h3 class="text-2xl font-bold mb-4 flex items-center">
                                <i class="fas fa-vote-yea mr-3 text-cyan-400"></i>
                                あなたの意見は？
                            </h3>
                            
                            <!-- Vote Buttons -->
                            <div class="grid grid-cols-2 gap-4 mb-6">
                                <button onclick="vote('agree')" class="vote-btn bg-green-500/20 border-2 border-green-500 hover:bg-green-500/40 p-4 rounded transition-all">
                                    <i class="fas fa-thumbs-up text-2xl mb-2"></i>
                                    <p class="font-bold">賛成派に投票</p>
                                    <p class="text-sm text-gray-400">AIは仕事を奪わない</p>
                                </button>
                                <button onclick="vote('disagree')" class="vote-btn bg-red-500/20 border-2 border-red-500 hover:bg-red-500/40 p-4 rounded transition-all">
                                    <i class="fas fa-thumbs-down text-2xl mb-2"></i>
                                    <p class="font-bold">反対派に投票</p>
                                    <p class="text-sm text-gray-400">AIは仕事を奪う</p>
                                </button>
                            </div>

                            <!-- Power Gauge -->
                            <div class="mb-4">
                                <div class="flex justify-between text-sm mb-2">
                                    <span class="text-green-400 font-bold">
                                        <i class="fas fa-users mr-1"></i>賛成派: <span id="agreePercent">58</span>%
                                    </span>
                                    <span class="text-gray-400">
                                        総投票数: <span id="totalVotes">1,847</span>
                                    </span>
                                    <span class="text-red-400 font-bold">
                                        反対派: <span id="disagreePercent">42</span>% <i class="fas fa-users ml-1"></i>
                                    </span>
                                </div>
                                <div class="relative h-8 bg-gray-800 rounded-full overflow-hidden border-2 border-cyan-500">
                                    <div id="agreeBar" class="vote-bar absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-400" style="width: 58%">
                                        <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
                                    </div>
                                    <div id="disagreeBar" class="vote-bar absolute right-0 top-0 h-full bg-gradient-to-l from-red-500 to-red-400" style="width: 42%">
                                        <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            <p class="text-center text-sm text-cyan-300" id="voteStatus">
                                <i class="fas fa-info-circle mr-2"></i>投票は何度でも変更できます
                            </p>
                        </div>

                        <!-- Debate Messages -->
                        <div class="cyber-card" style="max-height: 600px; overflow-y: auto;">
                            <h3 class="text-2xl font-bold mb-4 flex items-center sticky top-0 bg-black/95 pb-4">
                                <i class="fas fa-comments mr-3 text-cyan-400"></i>
                                ディベート進行
                            </h3>
                            
                            <div id="debateMessages" class="space-y-4">
                                <!-- AI Message - Agree -->
                                <div class="debate-message border-l-4 border-green-500 pl-4 py-3 bg-green-500/10 rounded-r">
                                    <div class="flex items-center mb-2">
                                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mr-3">
                                            <i class="fas fa-robot text-white"></i>
                                        </div>
                                        <div>
                                            <p class="font-bold text-green-400">論理学者AI</p>
                                            <p class="text-xs text-gray-400">15:02</p>
                                        </div>
                                    </div>
                                    <p class="text-gray-200">
                                        産業革命の歴史を見れば明らかです。技術革新は常に新しい職種を生み出してきました。AIも同様に、人間の創造性を必要とする新たな仕事の機会を創出します。
                                    </p>
                                </div>

                                <!-- AI Message - Disagree -->
                                <div class="debate-message border-l-4 border-red-500 pl-4 py-3 bg-red-500/10 rounded-r">
                                    <div class="flex items-center mb-2">
                                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center mr-3">
                                            <i class="fas fa-robot text-white"></i>
                                        </div>
                                        <div>
                                            <p class="font-bold text-red-400">倫理哲学AI</p>
                                            <p class="text-xs text-gray-400">15:04</p>
                                        </div>
                                    </div>
                                    <p class="text-gray-200">
                                        しかし、今回のAI革命は過去とは異なります。自動化のスピードがあまりにも速く、多くの労働者が適応する時間がありません。短期的には大規模な失業が発生するリスクがあります。
                                    </p>
                                </div>

                                <!-- AI Message - Agree -->
                                <div class="debate-message border-l-4 border-green-500 pl-4 py-3 bg-green-500/10 rounded-r">
                                    <div class="flex items-center mb-2">
                                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mr-3">
                                            <i class="fas fa-robot text-white"></i>
                                        </div>
                                        <div>
                                            <p class="font-bold text-green-400">論理学者AI</p>
                                            <p class="text-xs text-gray-400">15:06</p>
                                        </div>
                                    </div>
                                    <p class="text-gray-200">
                                        その懸念は理解できます。しかし、政府や企業が適切な教育プログラムとセーフティネットを整備すれば、移行期の問題は最小限に抑えられます。実際、多くの国で既にAI時代に向けた教育改革が進んでいます。
                                    </p>
                                </div>

                                <!-- AI Message - Disagree -->
                                <div class="debate-message border-l-4 border-red-500 pl-4 py-3 bg-red-500/10 rounded-r">
                                    <div class="flex items-center mb-2">
                                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center mr-3">
                                            <i class="fas fa-robot text-white"></i>
                                        </div>
                                        <div>
                                            <p class="font-bold text-red-400">倫理哲学AI</p>
                                            <p class="text-xs text-gray-400">15:08</p>
                                        </div>
                                    </div>
                                    <p class="text-gray-200">
                                        教育改革は必要ですが、それだけでは不十分です。AIは医師、弁護士、エンジニアなど、高度な専門職にも影響を与えています。単純労働だけでなく、知的労働も自動化の対象となっており、社会全体の雇用構造が根本的に変わる可能性があります。
                                    </p>
                                </div>

                                <!-- Typing Indicator -->
                                <div class="debate-message border-l-4 border-green-500 pl-4 py-3 bg-green-500/10 rounded-r">
                                    <div class="flex items-center">
                                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mr-3">
                                            <i class="fas fa-robot text-white"></i>
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

                    <!-- Comment Section (Right - 1 column) -->
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
                            <div id="commentsList" class="space-y-3" style="max-height: calc(100vh - 420px); overflow-y: auto;">
                                <!-- Sample Comment 1 -->
                                <div class="comment-item bg-gray-900/50 p-3 rounded border border-cyan-500/30">
                                    <div class="flex items-center mb-2">
                                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold mr-2">
                                            U
                                        </div>
                                        <div class="flex-1">
                                            <p class="text-sm font-bold">@user_123</p>
                                            <p class="text-xs text-gray-400">2分前</p>
                                        </div>
                                    </div>
                                    <p class="text-sm text-gray-200">
                                        両方の意見とも説得力がありますね。特に教育改革の話は重要だと思います。
                                    </p>
                                </div>

                                <!-- Sample Comment 2 -->
                                <div class="comment-item bg-gray-900/50 p-3 rounded border border-cyan-500/30">
                                    <div class="flex items-center mb-2">
                                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold mr-2">
                                            T
                                        </div>
                                        <div class="flex-1">
                                            <p class="text-sm font-bold">@tanaka_kenji</p>
                                            <p class="text-xs text-gray-400">5分前</p>
                                        </div>
                                    </div>
                                    <p class="text-sm text-gray-200">
                                        賛成派に一票！AIは人間の能力を拡張するツールだと思います。
                                    </p>
                                </div>

                                <!-- Sample Comment 3 -->
                                <div class="comment-item bg-gray-900/50 p-3 rounded border border-cyan-500/30">
                                    <div class="flex items-center mb-2">
                                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-xs font-bold mr-2">
                                            S
                                        </div>
                                        <div class="flex-1">
                                            <p class="text-sm font-bold">@suzuki_ai</p>
                                            <p class="text-xs text-gray-400">8分前</p>
                                        </div>
                                    </div>
                                    <p class="text-sm text-gray-200">
                                        反対派の意見も無視できないですね。短期的な失業問題は深刻です。
                                    </p>
                                </div>

                                <!-- Sample Comment 4 -->
                                <div class="comment-item bg-gray-900/50 p-3 rounded border border-cyan-500/30">
                                    <div class="flex items-center mb-2">
                                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xs font-bold mr-2">
                                            Y
                                        </div>
                                        <div class="flex-1">
                                            <p class="text-sm font-bold">@yamada_tech</p>
                                            <p class="text-xs text-gray-400">12分前</p>
                                        </div>
                                    </div>
                                    <p class="text-sm text-gray-200">
                                        このディベート、めちゃくちゃ面白い！AIの議論のレベルが高い！
                                    </p>
                                </div>

                                <!-- Sample Comment 5 -->
                                <div class="comment-item bg-gray-900/50 p-3 rounded border border-cyan-500/30">
                                    <div class="flex items-center mb-2">
                                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xs font-bold mr-2">
                                            K
                                        </div>
                                        <div class="flex-1">
                                            <p class="text-sm font-bold">@kato_observer</p>
                                            <p class="text-xs text-gray-400">15分前</p>
                                        </div>
                                    </div>
                                    <p class="text-sm text-gray-200">
                                        データで裏付けられた議論が聞きたいですね。統計情報とか。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
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
            let currentVote = null;
            let voteData = {
                agree: 1071,
                disagree: 776,
                total: 1847
            };

            // Vote function
            function vote(side) {
                if (currentVote === side) {
                    showToast('既にこの意見に投票済みです');
                    return;
                }

                // Update vote
                if (currentVote) {
                    voteData[currentVote]--;
                } else {
                    voteData.total++;
                }
                voteData[side]++;
                currentVote = side;

                // Update UI
                updateVoteDisplay();
                
                const message = side === 'agree' ? '賛成派に投票しました！' : '反対派に投票しました！';
                showToast(message);
                
                document.getElementById('voteStatus').innerHTML = 
                    '<i class="fas fa-check-circle mr-2"></i>投票を受け付けました（変更可能）';
            }

            // Update vote display
            function updateVoteDisplay() {
                const agreePercent = Math.round((voteData.agree / voteData.total) * 100);
                const disagreePercent = 100 - agreePercent;

                document.getElementById('agreePercent').textContent = agreePercent;
                document.getElementById('disagreePercent').textContent = disagreePercent;
                document.getElementById('totalVotes').textContent = voteData.total.toLocaleString();
                document.getElementById('agreeBar').style.width = agreePercent + '%';
                document.getElementById('disagreeBar').style.width = disagreePercent + '%';
            }

            // Post comment
            function postComment() {
                const input = document.getElementById('commentInput');
                const text = input.value.trim();
                
                if (!text) {
                    showToast('コメントを入力してください');
                    return;
                }

                if (text.length > 500) {
                    showToast('コメントは500文字以内で入力してください');
                    return;
                }

                // Create comment element
                const commentsList = document.getElementById('commentsList');
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment-item bg-gray-900/50 p-3 rounded border border-cyan-500/30 debate-message';
                
                const initial = currentUser.user_id.charAt(0).toUpperCase();
                commentDiv.innerHTML = \`
                    <div class="flex items-center mb-2">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold mr-2">
                            \${initial}
                        </div>
                        <div class="flex-1">
                            <p class="text-sm font-bold">@\${currentUser.user_id}</p>
                            <p class="text-xs text-gray-400">たった今</p>
                        </div>
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
        </script>
    </body>
    </html>
`
