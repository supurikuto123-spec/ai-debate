import { globalNav } from '../components/global-nav';

export const myPage = (userData: any) => `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>マイページ - AI Debate Arena</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
        <style>
            .avatar-preset {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 3px solid transparent;
            }
            
            .avatar-preset:hover {
                border-color: #00ffff;
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
                transform: scale(1.1);
            }
            
            .avatar-preset.selected {
                border-color: #00ffff;
                box-shadow: 0 0 30px rgba(0, 255, 255, 0.8);
                transform: scale(1.15);
            }

            .profile-card {
                background: linear-gradient(135deg, rgba(0, 20, 40, 0.9), rgba(20, 0, 40, 0.9));
                border: 2px solid rgba(0, 255, 255, 0.3);
                border-radius: 20px;
                padding: 30px;
                box-shadow: 0 10px 50px rgba(0, 255, 255, 0.2);
            }

            .current-avatar {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                border: 4px solid #00ffff;
                box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
            }

            .form-label {
                font-family: 'Orbitron', sans-serif;
                color: #00ffff;
                font-weight: 700;
                margin-bottom: 8px;
                display: block;
            }

            .form-input {
                background: rgba(0, 0, 0, 0.5);
                border: 2px solid rgba(0, 255, 255, 0.3);
                border-radius: 10px;
                padding: 12px 16px;
                color: white;
                width: 100%;
                transition: all 0.3s ease;
            }

            .form-input:focus {
                outline: none;
                border-color: #00ffff;
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
            }

            .save-btn {
                background: linear-gradient(135deg, rgba(0, 255, 255, 0.3), rgba(255, 0, 255, 0.3));
                border: 2px solid #00ffff;
                border-radius: 10px;
                padding: 15px 40px;
                color: white;
                font-family: 'Orbitron', sans-serif;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
            }

            .save-btn:hover {
                background: linear-gradient(135deg, rgba(0, 255, 255, 0.5), rgba(255, 0, 255, 0.5));
                box-shadow: 0 0 30px rgba(0, 255, 255, 0.6);
                transform: translateY(-2px);
            }
        </style>
    </head>
    <body class="bg-black text-white">
        ${globalNav(userData)}

        <div class="pt-20 pb-12 min-h-screen">
            <div class="cyber-grid"></div>
            
            <div class="container mx-auto px-6 relative z-10 max-w-4xl">
                <div class="text-center mb-8">
                    <h1 class="text-4xl font-black cyber-text mb-2">
                        <i class="fas fa-user-circle mr-3"></i>マイページ
                    </h1>
                    <p class="text-cyan-300">プロフィール設定</p>
                </div>

                <div class="profile-card">
                    <!-- Current Avatar Display -->
                    <div class="text-center mb-8">
                        <div class="mb-4">
                            <img 
                                id="current-avatar" 
                                src="${userData.avatar_type === 'upload' ? userData.avatar_value : `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.avatar_value || '1'}`}" 
                                alt="Current Avatar" 
                                class="current-avatar mx-auto"
                            />
                        </div>
                        <div class="text-2xl font-bold text-cyan-400">@${userData.user_id}</div>
                        <div class="text-lg text-gray-300 mt-2">${userData.nickname || 'No Nickname'}</div>
                        <div class="mt-3 text-yellow-400 font-bold text-xl">
                            <i class="fas fa-coins mr-2"></i>${userData.credits.toLocaleString()} Credits
                        </div>
                    </div>

                    <!-- Profile Form -->
                    <form id="profile-form" class="space-y-6">
                        <!-- Nickname -->
                        <div>
                            <label class="form-label">
                                <i class="fas fa-signature mr-2"></i>ニックネーム
                            </label>
                            <input 
                                type="text" 
                                id="nickname" 
                                name="nickname" 
                                value="${userData.nickname || ''}"
                                placeholder="ニックネームを入力"
                                class="form-input"
                                required
                            />
                        </div>

                        <!-- User ID -->
                        <div>
                            <label class="form-label">
                                <i class="fas fa-at mr-2"></i>ユーザーID
                            </label>
                            <input 
                                type="text" 
                                id="user_id" 
                                name="user_id" 
                                value="${userData.user_id}"
                                placeholder="ユーザーIDを入力"
                                pattern="[a-zA-Z0-9_-]{3,20}"
                                title="3-20文字の英数字、ハイフン、アンダースコアのみ"
                                class="form-input"
                                required
                            />
                            <div class="text-xs text-gray-400 mt-1">
                                <i class="fas fa-info-circle mr-1"></i>
                                3-20文字の英数字、ハイフン、アンダースコアのみ
                            </div>
                        </div>

                        <!-- Avatar Selection -->
                        <div>
                            <label class="form-label mb-3">
                                <i class="fas fa-user-circle mr-2"></i>アバター選択
                            </label>
                            
                            <!-- Avatar Presets Grid -->
                            <div class="grid grid-cols-5 gap-4 mb-4">
                                ${Array.from({length: 20}, (_, i) => i + 1).map(seed => `
                                    <img 
                                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}" 
                                        alt="Avatar ${seed}" 
                                        class="avatar-preset ${userData.avatar_type === 'preset' && userData.avatar_value === seed.toString() ? 'selected' : ''}"
                                        data-seed="${seed}"
                                        onclick="selectAvatar('preset', '${seed}')"
                                    />
                                `).join('')}
                            </div>

                            <input type="hidden" id="avatar_type" name="avatar_type" value="${userData.avatar_type || 'preset'}">
                            <input type="hidden" id="avatar_value" name="avatar_value" value="${userData.avatar_value || '1'}">
                        </div>

                        <!-- Save Button -->
                        <div class="text-center pt-4">
                            <button type="submit" class="save-btn">
                                <i class="fas fa-save mr-2"></i>変更を保存
                            </button>
                        </div>
                    </form>

                    <!-- Success Message -->
                    <div id="success-message" class="hidden mt-4 p-4 bg-green-500/20 border-2 border-green-500 rounded-lg text-center">
                        <i class="fas fa-check-circle text-green-400 mr-2"></i>
                        <span class="text-green-300 font-bold">プロフィールを更新しました！</span>
                    </div>

                    <!-- Error Message -->
                    <div id="error-message" class="hidden mt-4 p-4 bg-red-500/20 border-2 border-red-500 rounded-lg text-center">
                        <i class="fas fa-exclamation-circle text-red-400 mr-2"></i>
                        <span class="text-red-300 font-bold" id="error-text"></span>
                    </div>
                </div>
            </div>
        </div>

        <script>
            let selectedAvatarType = '${userData.avatar_type || 'preset'}';
            let selectedAvatarValue = '${userData.avatar_value || '1'}';

            function selectAvatar(type, value) {
                selectedAvatarType = type;
                selectedAvatarValue = value;
                
                document.getElementById('avatar_type').value = type;
                document.getElementById('avatar_value').value = value;
                
                document.querySelectorAll('.avatar-preset').forEach(img => {
                    img.classList.remove('selected');
                });
                
                const selectedImg = document.querySelector(\`img[data-seed="\${value}"]\`);
                if (selectedImg) {
                    selectedImg.classList.add('selected');
                }
                
                document.getElementById('current-avatar').src = 
                    \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${value}\`;
            }

            document.getElementById('profile-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = {
                    nickname: document.getElementById('nickname').value,
                    user_id: document.getElementById('user_id').value,
                    avatar_type: document.getElementById('avatar_type').value,
                    avatar_value: document.getElementById('avatar_value').value
                };

                try {
                    const response = await fetch('/api/profile/update', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });

                    const result = await response.json();

                    if (result.success) {
                        document.getElementById('success-message').classList.remove('hidden');
                        document.getElementById('error-message').classList.add('hidden');
                        
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    } else {
                        document.getElementById('error-message').classList.remove('hidden');
                        document.getElementById('error-text').textContent = result.error || 'エラーが発生しました';
                        document.getElementById('success-message').classList.add('hidden');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    document.getElementById('error-message').classList.remove('hidden');
                    document.getElementById('error-text').textContent = '通信エラーが発生しました';
                    document.getElementById('success-message').classList.add('hidden');
                }
            });
        </script>
    </body>
    </html>
`
