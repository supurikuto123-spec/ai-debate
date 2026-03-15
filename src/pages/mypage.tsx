import { globalNav } from '../components/global-nav';


export const myPage = (userData: any, stats?: any) => {
  const avatarType = userData.avatar_type || 'bottts';
  const avatarStyles = ['bottts', 'pixel-art', 'identicon', 'thumbs', 'shapes'];
  
  return `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
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
            .style-tab:hover { background: rgba(6, 182, 212, 0.2); }
            .style-tab.active {
                background: rgba(6, 182, 212, 0.3);
                border-color: #06b6d4;
                color: #fff;
            }

            /* ON/OFF Toggle Switch */
            .toggle-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 16px;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(0, 255, 255, 0.15);
                border-radius: 12px;
                transition: background 0.2s;
            }
            .toggle-row:hover { background: rgba(0, 255, 255, 0.05); }
            .toggle-label {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 0.95rem;
                color: #e2e8f0;
            }
            .toggle-label i { color: #00ffff; width: 18px; text-align: center; }
            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 54px;
                height: 28px;
                flex-shrink: 0;
            }
            .toggle-switch input { opacity: 0; width: 0; height: 0; }
            .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(255,255,255,0.15);
                border: 2px solid rgba(255,255,255,0.2);
                border-radius: 28px;
                transition: all 0.3s ease;
            }
            .toggle-slider:before {
                content: '';
                position: absolute;
                height: 20px;
                width: 20px;
                left: 2px;
                bottom: 2px;
                background: #aaa;
                border-radius: 50%;
                transition: all 0.3s ease;
                box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            }
            .toggle-switch input:checked + .toggle-slider {
                background: linear-gradient(135deg, rgba(0,255,255,0.3), rgba(0,200,255,0.4));
                border-color: #00ffff;
                box-shadow: 0 0 12px rgba(0,255,255,0.4);
            }
            .toggle-switch input:checked + .toggle-slider:before {
                transform: translateX(26px);
                background: #00ffff;
                box-shadow: 0 0 8px rgba(0,255,255,0.6);
            }
            .toggle-status {
                font-size: 0.75rem;
                font-weight: 700;
                margin-left: 8px;
                min-width: 30px;
            }
            .toggle-status.on { color: #00ffff; }
            .toggle-status.off { color: #666; }

            /* Watched debates */
            .watched-card {
                background: rgba(0, 0, 0, 0.4);
                border: 1px solid rgba(100, 100, 255, 0.25);
                border-radius: 12px;
                padding: 14px;
                transition: all 0.2s;
            }
            .watched-card:hover {
                border-color: rgba(100, 100, 255, 0.5);
                background: rgba(50, 0, 100, 0.3);
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

                <!-- Statistics Section (Battle only) -->
                <div class="profile-card mt-8">
                    <h2 class="text-2xl font-bold text-cyan-400 mb-2 flex items-center">
                        <i class="fas fa-trophy mr-3"></i>対戦統計
                    </h2>
                    <p class="text-gray-400 text-sm mb-6"><i class="fas fa-info-circle mr-1"></i>ライブ対戦＋PvP対戦の合算成績</p>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4" id="stats-grid">
                        <div class="text-center p-4 bg-black/40 rounded-lg border border-cyan-500/20">
                            <div class="text-3xl font-bold text-cyan-400" id="stat-total-debates">-</div>
                            <div class="text-sm text-gray-400 mt-1">対戦数</div>
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
                        <div class="text-center p-4 bg-black/40 rounded-lg border border-amber-500/20">
                            <div class="text-3xl font-bold text-amber-400" id="stat-pvp-rating">1000</div>
                            <div class="text-sm text-gray-400 mt-1"><i class="fas fa-chart-line mr-1"></i>PvPレーティング</div>
                        </div>
                        <div class="text-center p-4 bg-black/40 rounded-lg border border-blue-500/20">
                            <div class="text-3xl font-bold text-blue-400" id="stat-posts">-</div>
                            <div class="text-sm text-gray-400 mt-1">コミュニティ投稿</div>
                        </div>
                        <div class="text-center p-4 bg-black/40 rounded-lg border border-indigo-500/20">
                            <div class="text-3xl font-bold text-indigo-400" id="stat-watched">-</div>
                            <div class="text-sm text-gray-400 mt-1">閲覧ディベート数</div>
                        </div>
                    </div>
                    <div class="mt-4 text-center">
                        <a href="/user/${userData.user_id}" class="text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
                            <i class="fas fa-external-link-alt mr-1"></i>公開プロフィールを見る
                        </a>
                    </div>
                </div>

                <!-- Watched Debates Section -->
                <div class="profile-card mt-8">
                    <h2 class="text-2xl font-bold text-purple-400 mb-2 flex items-center">
                        <i class="fas fa-eye mr-3"></i>閲覧ディベート
                    </h2>
                    <p class="text-gray-400 text-sm mb-6">
                        <i class="fas fa-film mr-1"></i>購入して閲覧したアーカイブ
                        <span class="ml-3 px-2 py-0.5 bg-purple-500/20 border border-purple-500/40 rounded text-purple-300 text-xs font-bold" id="watched-count">0本</span>
                    </p>
                    <div id="watched-list" class="space-y-3">
                        <div class="text-center text-gray-500 py-6">
                            <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                            <div class="text-sm">読み込み中...</div>
                        </div>
                    </div>
                    <div class="mt-4 text-center">
                        <a href="/archive" class="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                            <i class="fas fa-archive mr-1"></i>アーカイブを見る
                        </a>
                    </div>
                </div>

                <!-- Privacy Settings Section -->
                <div class="profile-card mt-8">
                    <h2 class="text-2xl font-bold text-cyan-400 mb-2 flex items-center">
                        <i class="fas fa-shield-alt mr-3"></i>プロフィール公開設定
                    </h2>
                    <p class="text-gray-400 text-sm mb-6">
                        <i class="fas fa-info-circle mr-1"></i>公開プロフィールページで表示する情報を選択（マイページでのみ操作できます）
                    </p>
                    <div class="space-y-3" id="privacy-toggles">
                        <div class="toggle-row">
                            <label class="toggle-label" for="priv-debates">
                                <i class="fas fa-gamepad"></i>
                                <span>対戦数</span>
                            </label>
                            <div class="flex items-center">
                                <label class="toggle-switch">
                                    <input type="checkbox" id="priv-debates" checked onchange="updatePrivacy()">
                                    <span class="toggle-slider"></span>
                                </label>
                                <span class="toggle-status on" id="status-debates">ON</span>
                            </div>
                        </div>
                        <div class="toggle-row">
                            <label class="toggle-label" for="priv-wins">
                                <i class="fas fa-trophy"></i>
                                <span>勝利数・敗北数</span>
                            </label>
                            <div class="flex items-center">
                                <label class="toggle-switch">
                                    <input type="checkbox" id="priv-wins" checked onchange="updatePrivacy()">
                                    <span class="toggle-slider"></span>
                                </label>
                                <span class="toggle-status on" id="status-wins">ON</span>
                            </div>
                        </div>
                        <div class="toggle-row">
                            <label class="toggle-label" for="priv-winrate">
                                <i class="fas fa-chart-line"></i>
                                <span>勝率</span>
                            </label>
                            <div class="flex items-center">
                                <label class="toggle-switch">
                                    <input type="checkbox" id="priv-winrate" checked onchange="updatePrivacy()">
                                    <span class="toggle-slider"></span>
                                </label>
                                <span class="toggle-status on" id="status-winrate">ON</span>
                            </div>
                        </div>
                        <div class="toggle-row">
                            <label class="toggle-label" for="priv-watched">
                                <i class="fas fa-eye"></i>
                                <span>閲覧ディベート数</span>
                            </label>
                            <div class="flex items-center">
                                <label class="toggle-switch">
                                    <input type="checkbox" id="priv-watched" onchange="updatePrivacy()">
                                    <span class="toggle-slider"></span>
                                </label>
                                <span class="toggle-status off" id="status-watched">OFF</span>
                            </div>
                        </div>
                        <div class="toggle-row">
                            <label class="toggle-label" for="priv-posts">
                                <i class="fas fa-edit"></i>
                                <span>コミュニティ投稿数</span>
                            </label>
                            <div class="flex items-center">
                                <label class="toggle-switch">
                                    <input type="checkbox" id="priv-posts" onchange="updatePrivacy()">
                                    <span class="toggle-slider"></span>
                                </label>
                                <span class="toggle-status off" id="status-posts">OFF</span>
                            </div>
                        </div>
                        <div class="toggle-row">
                            <label class="toggle-label" for="priv-credits">
                                <i class="fas fa-coins"></i>
                                <span>クレジット残高</span>
                            </label>
                            <div class="flex items-center">
                                <label class="toggle-switch">
                                    <input type="checkbox" id="priv-credits" onchange="updatePrivacy()">
                                    <span class="toggle-slider"></span>
                                </label>
                                <span class="toggle-status off" id="status-credits">OFF</span>
                            </div>
                        </div>
                    </div>
                    <div id="privacy-save-msg" class="hidden mt-4 text-center text-green-400 text-sm">
                        <i class="fas fa-check-circle mr-1"></i>設定を保存しました
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
                    <p class="text-center text-gray-600 text-xs mt-4">&copy; 2026 AI Debate Arena. All rights reserved.</p>
                </footer>
            </div>
        </div>

        <script>
            let currentAvatarStyle = '${avatarType}';
            let selectedAvatarType = '${userData.avatar_type || avatarType}';
            let selectedAvatarValue = '${userData.avatar_value || '1'}';
            let uploadedFile = null;
            let privacySaveTimer = null;

            // ===== STATS =====
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
                            const watchedEl = document.getElementById('stat-watched');
                            if (watchedEl) watchedEl.textContent = data.stats.watched_debates || 0;
                            const pvpRatingEl = document.getElementById('stat-pvp-rating');
                            if (pvpRatingEl && data.stats.pvp_rating != null) pvpRatingEl.textContent = data.stats.pvp_rating;
                        }
                    }
                } catch(e) { console.error('Stats load error:', e); }
            })();

            // ===== WATCHED DEBATES =====
            (async function loadWatched() {
                try {
                    const res = await fetch('/api/archive/watched');
                    const data = await res.json();
                    const list = document.getElementById('watched-list');
                    const countEl = document.getElementById('watched-count');
                    if (!data.success || !data.debates || data.debates.length === 0) {
                        list.innerHTML = '<div class="text-center text-gray-500 py-6"><i class="fas fa-film text-3xl mb-2 opacity-30"></i><div class="text-sm">まだ閲覧したディベートはありません</div><div class="text-xs mt-1 text-gray-600"><a href="/archive" class="text-purple-400 hover:underline">アーカイブを見る →</a></div></div>';
                        countEl.textContent = '0本';
                        return;
                    }
                    countEl.textContent = data.debates.length + '本';
                    list.innerHTML = data.debates.map(d => {
                        const winner = d.winner === 'agree' ? '<span class="text-green-400 font-bold"><i class="fas fa-crown mr-1"></i>意見A勝利</span>' :
                                       d.winner === 'disagree' ? '<span class="text-red-400 font-bold"><i class="fas fa-crown mr-1"></i>意見B勝利</span>' :
                                       '<span class="text-gray-400">-</span>';
                        const date = d.watched_at ? new Date(d.watched_at).toLocaleDateString('ja-JP') : '';
                        return '<div class="watched-card">' +
                            '<div class="flex justify-between items-start gap-2">' +
                            '<div class="flex-1 min-w-0">' +
                            '<div class="text-sm font-bold text-purple-300 truncate">' + (d.theme || '（テーマ不明）') + '</div>' +
                            '<div class="flex gap-3 mt-1 text-xs text-gray-400">' +
                            '<span class="text-green-400/70"><i class="fas fa-thumbs-up mr-1"></i>' + (d.agree_votes || 0) + '票</span>' +
                            '<span>' + winner + '</span>' +
                            '<span class="text-red-400/70"><i class="fas fa-thumbs-down mr-1"></i>' + (d.disagree_votes || 0) + '票</span>' +
                            '</div>' +
                            '</div>' +
                            '<div class="text-xs text-gray-500 whitespace-nowrap">' + date + '</div>' +
                            '</div>' +
                            '</div>';
                    }).join('');
                } catch(e) {
                    document.getElementById('watched-list').innerHTML = '<div class="text-center text-gray-500 py-4 text-sm">読み込み失敗</div>';
                }
            })();

            // ===== PRIVACY TOGGLES =====
            const privacyMap = {
                'priv-debates': 'show_total_debates',
                'priv-wins':    'show_wins',
                'priv-winrate': 'show_win_rate',
                'priv-posts':   'show_posts',
                'priv-credits': 'show_credits'
            };
            const statusMap = {
                'priv-debates': 'status-debates',
                'priv-wins':    'status-wins',
                'priv-winrate': 'status-winrate',
                'priv-posts':   'status-posts',
                'priv-credits': 'status-credits'
            };

            // Load privacy settings
            (async function loadPrivacy() {
                try {
                    const res = await fetch('/api/user/privacy');
                    const data = await res.json();
                    if (data.success && data.settings) {
                        const s = data.settings;
                        setToggle('priv-debates', s.show_total_debates !== false);
                        setToggle('priv-wins',    s.show_wins !== false);
                        setToggle('priv-winrate', s.show_win_rate !== false);
                        setToggle('priv-posts',   s.show_posts === true);
                        setToggle('priv-credits', s.show_credits === true);
                    }
                } catch(e) {}
            })();

            function setToggle(id, val) {
                const el = document.getElementById(id);
                if (!el) return;
                el.checked = val;
                updateStatusLabel(id, val);
            }

            function updateStatusLabel(id, checked) {
                const statusId = statusMap[id];
                if (!statusId) return;
                const el = document.getElementById(statusId);
                if (!el) return;
                el.textContent = checked ? 'ON' : 'OFF';
                el.className = 'toggle-status ' + (checked ? 'on' : 'off');
            }

            function updatePrivacy() {
                // Update status labels immediately
                Object.keys(privacyMap).forEach(id => {
                    const el = document.getElementById(id);
                    if (el) updateStatusLabel(id, el.checked);
                });
                // Debounce save
                clearTimeout(privacySaveTimer);
                privacySaveTimer = setTimeout(savePrivacy, 600);
            }

            async function savePrivacy() {
                const settings = {};
                Object.entries(privacyMap).forEach(([id, key]) => {
                    const el = document.getElementById(id);
                    settings[key] = el ? el.checked : true;
                });
                // Also save show_losses and show_draws (linked to show_wins for simplicity)
                settings['show_losses'] = settings['show_wins'];
                settings['show_draws'] = settings['show_wins'];
                try {
                    const res = await fetch('/api/user/privacy', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(settings)
                    });
                    if (res.ok) {
                        const msg = document.getElementById('privacy-save-msg');
                        msg.classList.remove('hidden');
                        setTimeout(() => msg.classList.add('hidden'), 2000);
                    }
                } catch(e) {}
            }

            // ===== AVATAR GRID =====
            function renderAvatarGrid(style) {
                const grid = document.getElementById('avatar-grid');
                const seeds = [];
                for (let i = 1; i <= 24; i++) seeds.push(i);
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
                document.querySelectorAll('.avatar-preset').forEach(img => img.classList.remove('selected'));
                const selectedImg = document.querySelector('img[data-style="' + type + '"][data-seed="' + value + '"]');
                if (selectedImg) selectedImg.classList.add('selected');
                document.getElementById('current-avatar').src = 'https://api.dicebear.com/7.x/' + type + '/svg?seed=' + value;
                document.getElementById('upload-preview').classList.add('hidden');
                uploadedFile = null;
            }

            async function handleAvatarUpload(event) {
                const file = event.target.files[0];
                if (!file) return;
                if (file.size > 2 * 1024 * 1024) { alert('ファイルサイズは2MB以下にしてください'); return; }
                if (!file.type.startsWith('image/')) { alert('画像ファイルを選択してください'); return; }
                uploadedFile = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('upload-preview-img').src = e.target.result;
                    document.getElementById('upload-preview').classList.remove('hidden');
                    document.getElementById('current-avatar').src = e.target.result;
                    document.querySelectorAll('.avatar-preset').forEach(img => img.classList.remove('selected'));
                };
                reader.readAsDataURL(file);
            }

            // ===== PROFILE FORM SUBMIT =====
            document.getElementById('profile-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                let avatarUrl = '${userData.avatar_url || ''}';
                let avatarValue = selectedAvatarValue;

                if (uploadedFile) {
                    try {
                        const uploadFormData = new FormData();
                        uploadFormData.append('avatar', uploadedFile);
                        const uploadResponse = await fetch('/api/avatar/upload', { method: 'POST', body: uploadFormData });
                        const uploadResult = await uploadResponse.json();
                        if (!uploadResult.success) { alert('画像のアップロードに失敗しました'); return; }
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
                        setTimeout(() => window.location.reload(), 2000);
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
    
</body>
    </html>
`;
}
