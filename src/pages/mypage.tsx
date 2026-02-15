import { globalNav } from '../components/global-nav';
import { i18nScript } from '../components/i18n';

export const myPage = (userData: any, stats?: any) => {
  const avatarType = userData.avatar_type || 'bottts';
  const avatarStyles = ['bottts', 'pixel-art', 'identicon', 'thumbs', 'shapes'];
  
  return `
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
                width: 70px;
                height: 70px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 3px solid transparent;
                background: rgba(0, 20, 40, 0.8);
                object-fit: cover;
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
                background: rgba(0, 20, 40, 0.8);
                object-fit: cover;
            }

            .form-label {
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

            .style-tab {
                padding: 6px 14px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                transition: all 0.2s;
                background: rgba(6, 182, 212, 0.1);
                border: 1px solid rgba(6, 182, 212, 0.3);
                color: #06b6d4;
            }
            .style-tab:hover {
                background: rgba(6, 182, 212, 0.2);
            }
            .style-tab.active {
                background: rgba(6, 182, 212, 0.3);
                border-color: #06b6d4;
                color: #fff;
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
                                src="${userData.avatar_url ? userData.avatar_url : (userData.avatar_type && userData.avatar_type !== 'upload' ? `https://api.dicebear.com/7.x/${userData.avatar_type}/svg?seed=${userData.avatar_value || userData.user_id}` : `https://api.dicebear.com/7.x/bottts/svg?seed=${userData.user_id}`)}" 
                                alt="Current Avatar" 
                                class="current-avatar mx-auto"
                                onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=${userData.user_id}'"
                            />
                        </div>
                        <div class="text-2xl font-bold text-cyan-400">@${userData.user_id}</div>
                        <div class="text-lg text-gray-300 mt-2">${userData.nickname || 'No Nickname'}</div>
                        <div class="mt-3 text-yellow-400 font-bold text-xl" id="credits-display">
                            <i class="fas fa-coins mr-2"></i><span id="credits-value">${Number(userData.credits || 0).toLocaleString()}</span> Credits
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
                            
                            <!-- Avatar Style Tabs -->
                            <div class="flex flex-wrap gap-2 mb-4">
                                ${avatarStyles.map(style => `
                                    <button type="button" class="style-tab ${style === avatarType ? 'active' : ''}" 
                                            data-style="${style}" onclick="switchAvatarStyle('${style}')">
                                        ${style === 'bottts' ? 'ロボット' : style === 'pixel-art' ? 'ピクセル' : style === 'identicon' ? 'パターン' : style === 'thumbs' ? 'サムネ' : 'シェイプ'}
                                    </button>
                                `).join('')}
                            </div>
                            
                            <!-- Avatar Presets Grid -->
                            <div id="avatar-grid" class="grid grid-cols-5 sm:grid-cols-8 gap-3 mb-4">
                                <!-- Will be populated by JS -->
                            </div>

                            <!-- Upload Option -->
                            <div class="mt-4 p-4 bg-slate-800/50 rounded-lg border border-cyan-500/20">
                                <label for="avatar-upload" class="block text-sm text-cyan-400 mb-2 cursor-pointer">
                                    <i class="fas fa-upload mr-2"></i>画像をアップロード（クリックして選択）
                                </label>
                                <input 
                                    type="file" 
                                    id="avatar-upload" 
                                    accept="image/*" 
                                    class="hidden"
                                    onchange="handleAvatarUpload(event)"
                                />
                                <div id="upload-preview" class="hidden mt-3">
                                    <img id="upload-preview-img" class="w-32 h-32 rounded-full mx-auto border-2 border-cyan-500" />
                                </div>
                            </div>

                            <input type="hidden" id="avatar_type" name="avatar_type" value="${userData.avatar_type || 'bottts'}">
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

                <!-- Statistics Section -->
                <div class="profile-card mt-8">
                    <h2 class="text-2xl font-bold text-cyan-400 mb-6 flex items-center">
                        <i class="fas fa-chart-bar mr-3"></i>統計情報
                    </h2>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4" id="stats-grid">
                        <div class="text-center p-4 bg-black/40 rounded-lg border border-cyan-500/20">
                            <div class="text-3xl font-bold text-cyan-400" id="stat-total-debates">-</div>
                            <div class="text-sm text-gray-400 mt-1">総ディベート数</div>
                        </div>
                        <div class="text-center p-4 bg-black/40 rounded-lg border border-green-500/20">
                            <div class="text-3xl font-bold text-green-400" id="stat-wins">-</div>
                            <div class="text-sm text-gray-400 mt-1">勝利数</div>
                        </div>
                        <div class="text-center p-4 bg-black/40 rounded-lg border border-red-500/20">
                            <div class="text-3xl font-bold text-red-400" id="stat-losses">-</div>
                            <div class="text-sm text-gray-400 mt-1">敗北数</div>
                        </div>
                        <div class="text-center p-4 bg-black/40 rounded-lg border border-yellow-500/20">
                            <div class="text-3xl font-bold text-yellow-400" id="stat-draws">-</div>
                            <div class="text-sm text-gray-400 mt-1">引き分け</div>
                        </div>
                        <div class="text-center p-4 bg-black/40 rounded-lg border border-purple-500/20">
                            <div class="text-3xl font-bold text-purple-400" id="stat-win-rate">-%</div>
                            <div class="text-sm text-gray-400 mt-1">勝率</div>
                            <div class="w-full h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" id="stat-win-bar" style="width:0%;transition:width 0.5s;"></div>
                            </div>
                        </div>
                        <div class="text-center p-4 bg-black/40 rounded-lg border border-blue-500/20">
                            <div class="text-3xl font-bold text-blue-400" id="stat-posts">-</div>
                            <div class="text-sm text-gray-400 mt-1">コミュニティ投稿</div>
                        </div>
                    </div>
                    <div class="mt-4 text-center">
                        <a href="/user/${userData.user_id}" class="text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
                            <i class="fas fa-external-link-alt mr-1"></i>公開プロフィールを見る
                        </a>
                    </div>
                </div>

                <!-- Footer -->
                <footer class="border-t border-cyan-500/20 mt-12 pt-8 pb-4">
                    <div class="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-gray-400">
                        <a href="/main" class="hover:text-cyan-400 transition-colors">メインページ</a>
                        <a href="/archive" class="hover:text-cyan-400 transition-colors">アーカイブ</a>
                        <a href="/community" class="hover:text-cyan-400 transition-colors">コミュニティ</a>
                        <a href="/terms" class="hover:text-cyan-400 transition-colors">利用規約</a>
                        <a href="/privacy" class="hover:text-cyan-400 transition-colors">プライバシーポリシー</a>
                        <a href="/legal" class="hover:text-cyan-400 transition-colors">特定商取引法</a>
                        <a href="/tickets" class="hover:text-cyan-400 transition-colors">サポート</a>
                    </div>
                    <p class="text-center text-gray-600 text-xs mt-4">&copy; 2025 AI Debate Arena. All rights reserved.</p>
                </footer>
            </div>
        </div>

        <script>
            let currentAvatarStyle = '${avatarType}';
            let selectedAvatarType = '${userData.avatar_type || avatarType}';
            let selectedAvatarValue = '${userData.avatar_value || '1'}';
            let uploadedFile = null;

            // Load stats from user profile API
            (async function loadStats() {
                try {
                    const res = await fetch('/api/user/stats');
                    if (res.ok) {
                        const data = await res.json();
                        if (data.success) {
                            document.getElementById('stat-total-debates').textContent = data.stats.total_debates;
                            document.getElementById('stat-wins').textContent = data.stats.wins;
                            document.getElementById('stat-losses').textContent = data.stats.losses;
                            document.getElementById('stat-draws').textContent = data.stats.draws;
                            document.getElementById('stat-win-rate').textContent = data.stats.win_rate + '%';
                            document.getElementById('stat-win-bar').style.width = data.stats.win_rate + '%';
                            document.getElementById('stat-posts').textContent = data.stats.total_posts;
                        }
                    }
                } catch(e) { console.error('Stats load error:', e); }
            })();

            function renderAvatarGrid(style) {
                const grid = document.getElementById('avatar-grid');
                const seeds = [];
                for (let i = 1; i <= 24; i++) {
                    seeds.push(i);
                }
                
                grid.innerHTML = seeds.map(seed => {
                    const isSelected = (selectedAvatarType === style) && selectedAvatarValue === seed.toString();
                    return '<img ' +
                        'src="https://api.dicebear.com/7.x/' + style + '/svg?seed=' + seed + '" ' +
                        'alt="Avatar ' + seed + '" ' +
                        'class="avatar-preset ' + (isSelected ? 'selected' : '') + '" ' +
                        'data-style="' + style + '" ' +
                        'data-seed="' + seed + '" ' +
                        'loading="lazy" ' +
                        'onclick="selectAvatar(\\'' + style + '\\', \\'' + seed + '\\')" ' +
                        'onerror="this.style.display=\\'none\\'" ' +
                    '/>';
                }).join('');
            }

            function switchAvatarStyle(style) {
                currentAvatarStyle = style;
                document.querySelectorAll('.style-tab').forEach(tab => {
                    tab.classList.toggle('active', tab.dataset.style === style);
                });
                renderAvatarGrid(style);
            }

            function selectAvatar(type, value) {
                selectedAvatarType = type;
                selectedAvatarValue = value;
                
                document.getElementById('avatar_type').value = type;
                document.getElementById('avatar_value').value = value;
                
                document.querySelectorAll('.avatar-preset').forEach(img => {
                    img.classList.remove('selected');
                });
                
                const selectedImg = document.querySelector('img[data-style="' + type + '"][data-seed="' + value + '"]');
                if (selectedImg) {
                    selectedImg.classList.add('selected');
                }
                
                document.getElementById('current-avatar').src = 
                    'https://api.dicebear.com/7.x/' + type + '/svg?seed=' + value;
                
                // Hide upload preview
                document.getElementById('upload-preview').classList.add('hidden');
                uploadedFile = null;
            }

            async function handleAvatarUpload(event) {
                const file = event.target.files[0];
                if (!file) return;
                
                if (file.size > 2 * 1024 * 1024) {
                    alert('ファイルサイズは2MB以下にしてください');
                    return;
                }
                
                if (!file.type.startsWith('image/')) {
                    alert('画像ファイルを選択してください');
                    return;
                }
                
                uploadedFile = file;
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('upload-preview-img').src = e.target.result;
                    document.getElementById('upload-preview').classList.remove('hidden');
                    document.getElementById('current-avatar').src = e.target.result;
                    
                    document.querySelectorAll('.avatar-preset').forEach(img => {
                        img.classList.remove('selected');
                    });
                    
                    selectedAvatarType = 'upload';
                    selectedAvatarValue = '';
                };
                reader.readAsDataURL(file);
            }

            document.getElementById('profile-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                let avatarValue = selectedAvatarValue;
                let avatarUrl = null;
                
                if (uploadedFile) {
                    try {
                        const uploadFormData = new FormData();
                        uploadFormData.append('avatar', uploadedFile);
                        
                        const uploadResponse = await fetch('/api/avatar/upload', {
                            method: 'POST',
                            body: uploadFormData
                        });
                        
                        const uploadResult = await uploadResponse.json();
                        if (!uploadResult.success) {
                            alert('画像のアップロードに失敗しました');
                            return;
                        }
                        
                        avatarUrl = uploadResult.url;
                        avatarValue = uploadResult.url;
                        selectedAvatarType = 'upload';
                    } catch (error) {
                        console.error('Upload error:', error);
                        alert('画像のアップロードエラー');
                        return;
                    }
                }
                
                const formData = {
                    nickname: document.getElementById('nickname').value,
                    user_id: document.getElementById('user_id').value,
                    avatar_type: selectedAvatarType,
                    avatar_value: avatarValue,
                    avatar_url: avatarUrl
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

            // Initialize avatar grid
            renderAvatarGrid(currentAvatarStyle);
            
            // Fetch fresh credits from DB
            (async function() {
                try {
                    const response = await fetch('/api/user');
                    if (response.ok) {
                        const userData = await response.json();
                        const creditsEl = document.getElementById('credits-value');
                        if (creditsEl && userData.credits !== undefined) {
                            creditsEl.textContent = Number(userData.credits).toLocaleString();
                        if (window.updateCreditsDisplay) window.updateCreditsDisplay(userData.credits);
                        }
                    }
                } catch (e) {
                    console.error('Failed to sync credits:', e);
                }
            })();
        </script>
    ${i18nScript()}
</body>
    </html>
`;
}
