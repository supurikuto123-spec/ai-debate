import { globalNav } from '../components/global-nav';

export const announcementsPage = (userData: any) => `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>お知らせ - AI Debate Arena</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/styles.css" rel="stylesheet">
</head>
<body class="bg-black text-white">
    ${globalNav(userData)}
    <div class="pt-20 pb-12 min-h-screen">
        <div class="cyber-grid"></div>
        <div class="container mx-auto px-6 relative z-10 max-w-4xl">
            <div class="text-center mb-8">
                <h1 class="text-4xl font-black cyber-text mb-2">
                    <i class="fas fa-bullhorn mr-3"></i>お知らせ
                </h1>
                <p class="text-cyan-300">運営からの最新情報</p>
            </div>
            <div id="announcements-container" class="space-y-6">
                <div class="text-center text-gray-400 py-12">
                    <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
                    <div>読み込み中...</div>
                </div>
            </div>
        </div>
    </div>
    <script src="/static/announcements.js"></script>
</body>
</html>`
