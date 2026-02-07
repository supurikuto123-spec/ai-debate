import { globalNav } from '../components/global-nav';

export const archivePage = (userData: any) => `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>アーカイブ - AI Debate Arena</title>
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
                    <i class="fas fa-archive mr-3"></i>アーカイブ
                </h1>
                <p class="text-cyan-300">過去のディベートを視聴</p>
                <div class="mt-3 inline-block px-4 py-2 bg-cyan-500/20 border-2 border-cyan-500 rounded-lg">
                    <i class="fas fa-coins text-yellow-400 mr-2"></i>
                    <span class="text-yellow-300 font-bold">視聴料: 15クレジット</span>
                </div>
            </div>
            <div class="flex justify-center gap-4 mb-8">
                <button class="tab-button active" data-filter="all"><i class="fas fa-th mr-2"></i>すべて</button>
                <button class="tab-button" data-filter="completed"><i class="fas fa-check-circle mr-2"></i>完了</button>
                <button class="tab-button" data-filter="live"><i class="fas fa-broadcast-tower mr-2"></i>進行中</button>
            </div>
            <div id="archive-grid" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div class="text-center text-gray-400 py-12 col-span-full">
                    <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
                    <div>読み込み中...</div>
                </div>
            </div>
        </div>
    </div>
    <div id="replay-modal" class="modal hidden">
        <div class="modal-content max-w-5xl w-full">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-2xl font-bold text-cyan-400">
                    <i class="fas fa-play-circle mr-2"></i><span id="replay-title">リプレイ</span>
                </h3>
                <button id="close-replay" class="text-gray-400 hover:text-white text-2xl"><i class="fas fa-times"></i></button>
            </div>
            <div id="replay-container"></div>
            <div class="flex justify-between items-center mt-4">
                <div class="flex gap-2">
                    <button id="prev-message" class="btn-secondary"><i class="fas fa-step-backward"></i></button>
                    <button id="play-pause" class="btn-primary"><i class="fas fa-play"></i> 再生</button>
                    <button id="next-message" class="btn-secondary"><i class="fas fa-step-forward"></i></button>
                </div>
                <div class="flex gap-2">
                    <button class="speed-btn btn-secondary" data-speed="0.5">0.5x</button>
                    <button class="speed-btn btn-primary" data-speed="1">1x</button>
                    <button class="speed-btn btn-secondary" data-speed="1.5">1.5x</button>
                    <button class="speed-btn btn-secondary" data-speed="2">2x</button>
                </div>
            </div>
            <div class="mt-3 text-center text-gray-400"><span id="replay-progress">0 / 0</span></div>
        </div>
    </div>
    <script src="/static/archive.js"></script>
</body>
</html>`
