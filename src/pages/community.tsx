import { globalNav } from '../components/global-nav';

export const communityPage = (userData: any) => `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>コミュニティ - AI Debate Arena</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/styles.css" rel="stylesheet">
</head>
<body class="bg-black text-white">
    ${globalNav(userData)}
    <div class="pt-20 pb-12 min-h-screen">
        <div class="cyber-grid"></div>
        <div class="container mx-auto px-6 relative z-10">
            <div class="text-center mb-8">
                <h1 class="text-4xl font-black cyber-text mb-2">
                    <i class="fas fa-users mr-3"></i>コミュニティ
                </h1>
                <p class="text-cyan-300">言語別スペースで交流</p>
            </div>
            <div class="flex justify-center gap-4 mb-8 flex-wrap">
                <button class="tab-button active" data-lang="ja"><i class="fas fa-flag mr-2"></i>日本語</button>
                <button class="tab-button" data-lang="en"><i class="fas fa-flag mr-2"></i>English</button>
                <button class="tab-button" data-lang="zh"><i class="fas fa-flag mr-2"></i>中文</button>
                <button class="tab-button" data-lang="ko"><i class="fas fa-flag mr-2"></i>한국어</button>
                <button class="tab-button" data-lang="es"><i class="fas fa-flag mr-2"></i>Español</button>
                <button class="tab-button" data-lang="fr"><i class="fas fa-flag mr-2"></i>Français</button>
            </div>
            <div class="grid md:grid-cols-3 gap-6">
                <div class="md:col-span-1">
                    <div class="profile-card sticky top-24">
                        <h3 class="text-xl font-bold text-cyan-400 mb-4">
                            <i class="fas fa-pen mr-2"></i>新規投稿
                        </h3>
                        <textarea id="post-content" placeholder="投稿内容を入力..." class="w-full bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 min-h-[150px]"></textarea>
                        <button id="submit-post" class="btn-primary w-full mt-3">
                            <i class="fas fa-paper-plane mr-2"></i>投稿
                        </button>
                    </div>
                </div>
                <div class="md:col-span-2">
                    <div class="mb-4">
                        <h3 class="text-xl font-bold text-cyan-400">
                            <i class="fas fa-comments mr-2"></i><span id="current-lang-name">日本語</span> スペース
                        </h3>
                        <div class="text-sm text-gray-400 mt-1">投稿数: <span id="post-count">0</span></div>
                    </div>
                    <div id="posts-container" class="space-y-4">
                        <div class="text-center text-gray-400 py-12">
                            <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
                            <div>読み込み中...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="/static/community.js"></script>
</body>
</html>`
