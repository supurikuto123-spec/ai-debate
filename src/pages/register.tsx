export const registerPage = (data: { email: string; name: string }) => `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=1280, initial-scale=0.5, maximum-scale=1.0, user-scalable=yes">
        <title>事前登録 - AI Debate | 500クレジット無料プレゼント</title>
        <meta name="description" content="AI Debateの事前登録ページ。ユーザーIDとユーザー名を設定して、500クレジット無料でゲット！AI同士のディベート対決を楽しもう。">
        <meta name="robots" content="noindex, nofollow">
        <link rel="canonical" href="https://ai-debate.jp/register">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
    </head>
    <body class="bg-black text-white">
        <div class="min-h-screen flex items-center justify-center relative">
            <div class="cyber-grid"></div>
            
            <div class="container mx-auto px-6 relative z-10">
                <div class="max-w-md mx-auto">
                    <div class="text-center mb-8">
                        <h1 class="text-4xl font-bold cyber-text mb-4">事前登録</h1>
                        <p class="text-gray-400">ユーザーIDとユーザー名を設定してください</p>
                    </div>
                    
                    <div class="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border-2 border-cyan-500 rounded-2xl p-8 backdrop-blur-md">
                        <div class="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg">
                            <p class="text-green-400 text-center font-bold">
                                <i class="fas fa-gift mr-2"></i>
                                事前登録ボーナス：500クレジット獲得
                            </p>
                        </div>
                        
                        <form id="registerForm">
                            <div class="mb-6">
                                <label class="block text-sm font-bold mb-2 text-cyan-400">
                                    メールアドレス
                                </label>
                                <input 
                                    type="text" 
                                    value="${data.email}" 
                                    disabled
                                    class="w-full px-4 py-3 rounded-lg bg-black/50 border border-gray-700 text-gray-400"
                                />
                            </div>
                            
                            <div class="mb-6">
                                <label class="block text-sm font-bold mb-2 text-cyan-400">
                                    ユーザーID <span class="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="userId" 
                                    name="user_id"
                                    placeholder="例: cool_debater_2026"
                                    class="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500 focus:border-cyan-400 focus:outline-none text-white"
                                    required
                                    pattern="[a-zA-Z0-9_-]{3,20}"
                                    minlength="3"
                                    maxlength="20"
                                />
                                <p class="text-xs text-gray-400 mt-1">
                                    3-20文字、英数字・アンダースコア・ハイフンのみ（重複不可）
                                </p>
                                <p id="userIdStatus" class="text-xs mt-1"></p>
                            </div>
                            
                            <div class="mb-6">
                                <label class="block text-sm font-bold mb-2 text-cyan-400">
                                    ユーザー名 <span class="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    id="username" 
                                    name="username"
                                    placeholder="例: クールなディベーター"
                                    value="${data.name}"
                                    class="w-full px-4 py-3 rounded-lg bg-black/50 border border-cyan-500 focus:border-cyan-400 focus:outline-none text-white"
                                    required
                                    minlength="1"
                                    maxlength="30"
                                />
                                <p class="text-xs text-gray-400 mt-1">
                                    1-30文字、重複可（特殊文字・禁止ワード除く）
                                </p>
                            </div>
                            
                            <div id="errorMessage" class="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg hidden">
                                <p class="text-red-400 text-sm"></p>
                            </div>
                            
                            <button 
                                type="submit" 
                                id="submitBtn"
                                class="w-full btn-glow text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <i class="fas fa-check-circle mr-2"></i>
                                登録完了
                            </button>
                        </form>
                        
                        <div class="mt-6 text-center">
                            <a href="/" class="text-sm text-gray-400 hover:text-cyan-400">
                                <i class="fas fa-arrow-left mr-1"></i>
                                ホームに戻る
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
            let userIdCheckTimeout;
            const userIdInput = document.getElementById('userId');
            const usernameInput = document.getElementById('username');
            const userIdStatus = document.getElementById('userIdStatus');
            const errorMessage = document.getElementById('errorMessage');
            const submitBtn = document.getElementById('submitBtn');
            
            // Check user ID availability
            userIdInput.addEventListener('input', () => {
                clearTimeout(userIdCheckTimeout);
                const userId = userIdInput.value.trim();
                
                if (userId.length < 3) {
                    userIdStatus.textContent = '';
                    return;
                }
                
                if (!/^[a-zA-Z0-9_-]{3,20}$/.test(userId)) {
                    userIdStatus.textContent = '無効な形式です';
                    userIdStatus.className = 'text-xs mt-1 text-red-400';
                    return;
                }
                
                userIdStatus.textContent = '確認中...';
                userIdStatus.className = 'text-xs mt-1 text-yellow-400';
                
                userIdCheckTimeout = setTimeout(async () => {
                    try {
                        const response = await fetch(\`/api/check-userid/\${userId}\`);
                        const data = await response.json();
                        
                        if (data.available) {
                            userIdStatus.textContent = '✓ 使用可能です';
                            userIdStatus.className = 'text-xs mt-1 text-green-400';
                        } else {
                            userIdStatus.textContent = '✗ 既に使用されています';
                            userIdStatus.className = 'text-xs mt-1 text-red-400';
                        }
                    } catch (error) {
                        console.error('Check failed:', error);
                    }
                }, 500);
            });
            
            // Handle form submission
            document.getElementById('registerForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const userId = userIdInput.value.trim();
                const username = usernameInput.value.trim();
                
                if (!userId || !username) {
                    showError('すべての項目を入力してください');
                    return;
                }
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>登録中...';
                
                try {
                    const response = await fetch('/api/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user_id: userId, username })
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok && data.success) {
                        window.location.href = data.redirect;
                    } else {
                        showError(data.error || '登録に失敗しました');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<i class="fas fa-check-circle mr-2"></i>登録完了';
                    }
                } catch (error) {
                    console.error('Registration failed:', error);
                    showError('サーバーエラーが発生しました');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-check-circle mr-2"></i>登録完了';
                }
            });
            
            function showError(message) {
                errorMessage.querySelector('p').textContent = message;
                errorMessage.classList.remove('hidden');
                setTimeout(() => {
                    errorMessage.classList.add('hidden');
                }, 5000);
            }
        </script>
    </body>
    </html>
`
