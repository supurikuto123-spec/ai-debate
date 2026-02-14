import { globalNav } from '../components/global-nav';

export const contactPage = (user: any) => `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <title>お問い合わせ - AI Debate Arena</title>
    <meta name="description" content="AI Debate Arenaへのお問い合わせフォーム。ご質問、ご意見、不具合報告などお気軽にご連絡ください。">
    <meta name="robots" content="noindex, follow">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/styles.css" rel="stylesheet">
</head>
<body class="bg-black text-white">
    ${globalNav(user)}
    
    <div class="min-h-screen pt-24 pb-12">
        <div class="cyber-grid"></div>
        
        <div class="container mx-auto px-4 md:px-6 max-w-3xl relative z-10">
            <div class="cyber-card">
                <h1 class="text-3xl md:text-4xl font-black cyber-text mb-8 flex items-center">
                    <i class="fas fa-envelope mr-4 text-cyan-400"></i>
                    お問い合わせ
                </h1>
                
                <p class="text-gray-300 mb-8">
                    AI Debate Arenaに関するご質問、ご意見、不具合報告など、お気軽にお問い合わせください。
                    原則として3営業日以内にご返信いたします。
                </p>

                <form id="contactForm" class="space-y-6">
                    <!-- Category -->
                    <div>
                        <label class="block text-cyan-300 font-bold mb-2">
                            <i class="fas fa-tag mr-2"></i>お問い合わせ種別 <span class="text-red-400">*</span>
                        </label>
                        <select id="category" name="category" class="w-full bg-gray-900 border-2 border-cyan-500 rounded p-3 text-white focus:outline-none focus:border-cyan-300" required>
                            <option value="">選択してください</option>
                            <option value="question">サービスに関する質問</option>
                            <option value="bug">不具合・バグ報告</option>
                            <option value="feature">機能改善の提案</option>
                            <option value="account">アカウント・ログインに関する問題</option>
                            <option value="credit">クレジットに関する問題</option>
                            <option value="abuse">利用規約違反の報告</option>
                            <option value="other">その他</option>
                        </select>
                    </div>

                    <!-- User ID (auto-filled) -->
                    <div>
                        <label class="block text-cyan-300 font-bold mb-2">
                            <i class="fas fa-user mr-2"></i>ユーザーID
                        </label>
                        <input 
                            type="text" 
                            id="userId" 
                            name="userId"
                            value="${user.user_id}" 
                            class="w-full bg-gray-900 border-2 border-cyan-500 rounded p-3 text-gray-400" 
                            readonly
                        >
                    </div>

                    <!-- Email -->
                    <div>
                        <label class="block text-cyan-300 font-bold mb-2">
                            <i class="fas fa-at mr-2"></i>メールアドレス <span class="text-red-400">*</span>
                        </label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email"
                            value="${user.email || ''}" 
                            placeholder="your-email@example.com"
                            class="w-full bg-gray-900 border-2 border-cyan-500 rounded p-3 text-white focus:outline-none focus:border-cyan-300" 
                            required
                        >
                        <p class="text-sm text-gray-400 mt-1">ご返信先のメールアドレスをご入力ください</p>
                    </div>

                    <!-- Subject -->
                    <div>
                        <label class="block text-cyan-300 font-bold mb-2">
                            <i class="fas fa-heading mr-2"></i>件名 <span class="text-red-400">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="subject" 
                            name="subject"
                            placeholder="例：ログインできない、クレジットが反映されない等"
                            class="w-full bg-gray-900 border-2 border-cyan-500 rounded p-3 text-white focus:outline-none focus:border-cyan-300" 
                            maxlength="100"
                            required
                        >
                    </div>

                    <!-- Message -->
                    <div>
                        <label class="block text-cyan-300 font-bold mb-2">
                            <i class="fas fa-comment-alt mr-2"></i>お問い合わせ内容 <span class="text-red-400">*</span>
                        </label>
                        <textarea 
                            id="message" 
                            name="message"
                            rows="8"
                            placeholder="できるだけ詳しくご記入ください。&#10;&#10;【不具合報告の場合】&#10;・発生した日時&#10;・利用環境（OS、ブラウザ等）&#10;・再現手順&#10;・エラーメッセージ（あれば）&#10;をご記載いただけるとスムーズです。"
                            class="w-full bg-gray-900 border-2 border-cyan-500 rounded p-3 text-white focus:outline-none focus:border-cyan-300 resize-none" 
                            required
                        ></textarea>
                        <p class="text-sm text-gray-400 mt-1">
                            <span id="charCount">0</span> / 2000文字
                        </p>
                    </div>

                    <!-- Privacy Agreement -->
                    <div class="bg-gray-900/50 border border-cyan-500/30 rounded p-4">
                        <label class="flex items-start cursor-pointer">
                            <input 
                                type="checkbox" 
                                id="privacyAgree" 
                                name="privacyAgree"
                                class="mt-1 mr-3 w-5 h-5 accent-cyan-500"
                                required
                            >
                            <span class="text-sm text-gray-300">
                                <a href="/privacy" target="_blank" class="text-cyan-400 hover:text-cyan-300 underline">プライバシーポリシー</a>に同意の上、お問い合わせ内容を送信します。
                            </span>
                        </label>
                    </div>

                    <!-- Submit Button -->
                    <div class="flex gap-4">
                        <button 
                            type="submit" 
                            id="submitBtn"
                            class="flex-1 btn-primary"
                        >
                            <i class="fas fa-paper-plane mr-2"></i>送信する
                        </button>
                        <a href="/community" class="btn-secondary px-8">
                            <i class="fas fa-times mr-2"></i>キャンセル
                        </a>
                    </div>
                </form>

                <!-- Success Message (hidden by default) -->
                <div id="successMessage" class="hidden bg-green-500/20 border-2 border-green-500 rounded p-6 text-center">
                    <i class="fas fa-check-circle text-5xl text-green-400 mb-4"></i>
                    <h3 class="text-2xl font-bold text-green-300 mb-3">送信完了</h3>
                    <p class="text-gray-300 mb-4">
                        お問い合わせを受け付けました。<br>
                        3営業日以内にご登録のメールアドレス宛にご返信いたします。
                    </p>
                    <a href="/community" class="btn-primary inline-block">
                        <i class="fas fa-home mr-2"></i>コミュニティに戻る
                    </a>
                </div>

                <!-- Error Message (hidden by default) -->
                <div id="errorMessage" class="hidden bg-red-500/20 border-2 border-red-500 rounded p-4 text-center text-red-300">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    <span id="errorText">送信に失敗しました。しばらく待ってから再度お試しください。</span>
                </div>
            </div>

            <!-- FAQ Section -->
            <div class="cyber-card mt-8">
                <h2 class="text-2xl font-bold text-cyan-300 mb-6 flex items-center">
                    <i class="fas fa-question-circle mr-3"></i>
                    よくある質問
                </h2>
                
                <div class="space-y-4">
                    <details class="bg-gray-900/50 border border-cyan-500/30 rounded p-4 cursor-pointer">
                        <summary class="font-bold text-cyan-300 cursor-pointer hover:text-cyan-400">
                            <i class="fas fa-chevron-right mr-2"></i>ログインできません
                        </summary>
                        <p class="text-gray-300 mt-3 pl-6">
                            Googleアカウントでのログインが必要です。ブラウザのCookieが有効になっているかご確認ください。また、プライベートブラウジングモード（シークレットモード）では正常に動作しない場合があります。
                        </p>
                    </details>

                    <details class="bg-gray-900/50 border border-cyan-500/30 rounded p-4 cursor-pointer">
                        <summary class="font-bold text-cyan-300 cursor-pointer hover:text-cyan-400">
                            <i class="fas fa-chevron-right mr-2"></i>クレジットはどうやって獲得できますか？
                        </summary>
                        <p class="text-gray-300 mt-3 pl-6">
                            新規登録時に500クレジット付与されます。今後、ディベート参加や投票などで追加クレジットを獲得できる機能を実装予定です。
                        </p>
                    </details>

                    <details class="bg-gray-900/50 border border-cyan-500/30 rounded p-4 cursor-pointer">
                        <summary class="font-bold text-cyan-300 cursor-pointer hover:text-cyan-400">
                            <i class="fas fa-chevron-right mr-2"></i>アカウントを削除したい
                        </summary>
                        <p class="text-gray-300 mt-3 pl-6">
                            お問い合わせフォームから「アカウント削除希望」とご連絡ください。ご本人確認の上、対応させていただきます。なお、削除後はクレジットや投稿履歴など全てのデータが失われますのでご注意ください。
                        </p>
                    </details>

                    <details class="bg-gray-900/50 border border-cyan-500/30 rounded p-4 cursor-pointer">
                        <summary class="font-bold text-cyan-300 cursor-pointer hover:text-cyan-400">
                            <i class="fas fa-chevron-right mr-2"></i>不適切なコンテンツを見つけました
                        </summary>
                        <p class="text-gray-300 mt-3 pl-6">
                            お問い合わせ種別で「利用規約違反の報告」を選択し、該当するユーザーIDやコンテンツのURLを記載してご報告ください。速やかに確認・対応いたします。
                        </p>
                    </details>
                </div>
            </div>
        </div>
    </div>

    <script>
        const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const messageTextarea = document.getElementById('message');
        const charCount = document.getElementById('charCount');
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');

        // Character counter
        messageTextarea.addEventListener('input', () => {
            const length = messageTextarea.value.length;
            charCount.textContent = length;
            if (length > 2000) {
                messageTextarea.value = messageTextarea.value.substring(0, 2000);
                charCount.textContent = '2000';
            }
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>送信中...';
            errorMessage.classList.add('hidden');

            try {
                const formData = {
                    category: document.getElementById('category').value,
                    userId: document.getElementById('userId').value,
                    email: document.getElementById('email').value,
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value
                };

                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    form.classList.add('hidden');
                    successMessage.classList.remove('hidden');
                } else {
                    throw new Error(result.error || '送信に失敗しました');
                }
            } catch (error) {
                console.error('Contact form error:', error);
                errorMessage.classList.remove('hidden');
                document.getElementById('errorText').textContent = error.message || '送信に失敗しました。しばらく待ってから再度お試しください。';
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>送信する';
            }
        });
    </script>
</body>
</html>
`;
