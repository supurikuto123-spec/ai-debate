import { globalNav } from '../components/global-nav';

export const creditsPage = (user: any) => `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <title>クレジット購入 - AI Debate Arena</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/static/styles.css" rel="stylesheet">
    <style>
        .pack-card { background: linear-gradient(135deg, rgba(0,20,40,0.9), rgba(20,0,40,0.9)); border: 2px solid rgba(0,255,255,0.2); border-radius: 16px; padding: 24px; transition: all 0.3s; cursor: pointer; position: relative; overflow: hidden; }
        .pack-card:hover { border-color: rgba(0,255,255,0.6); transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,255,255,0.2); }
        .pack-card.featured { border-color: rgba(234,179,8,0.6); }
        .pack-card.featured::before { content: '人気'; position: absolute; top: 14px; right: -18px; background: linear-gradient(135deg, #eab308, #f59e0b); color: #000; font-weight: 900; font-size: 11px; padding: 3px 22px; transform: rotate(45deg); }
        .pack-btn { width: 100%; padding: 12px; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; border: none; }
        .credit-bar { height: 8px; border-radius: 4px; background: linear-gradient(90deg, #06b6d4, #8b5cf6); }
        .history-item { padding: 12px 16px; background: rgba(255,255,255,0.04); border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); }
    </style>
</head>
<body class="bg-black text-white">
    ${globalNav(user)}

    <div class="min-h-screen pt-20 pb-12">
        <div class="cyber-grid"></div>
        <div class="container mx-auto px-4 max-w-4xl relative z-10">

            <!-- Header -->
            <div class="text-center mb-8 pt-2">
                <h1 class="text-3xl font-black cyber-text mb-2">
                    <i class="fas fa-coins mr-2 text-yellow-400"></i>クレジット購入
                </h1>
                <p class="text-gray-400 text-sm">※ テストモード: 実際の課金は発生しません</p>
                <div class="inline-block mt-3 px-4 py-2 bg-yellow-500/15 border border-yellow-500/40 rounded-xl">
                    <i class="fas fa-coins text-yellow-400 mr-2"></i>
                    <span class="text-yellow-300 font-bold">現在の残高: <span id="currentCredits">${(user as any)?.credits ?? 0}</span> クレジット</span>
                </div>
            </div>

            <!-- TEST MODE BANNER -->
            <div class="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center gap-3">
                <i class="fas fa-flask text-yellow-400 text-xl"></i>
                <div>
                    <p class="text-yellow-300 font-bold text-sm">テストモード</p>
                    <p class="text-gray-400 text-xs">現在は無料でクレジットが付与されます。本番環境では決済システムと連携予定です。</p>
                </div>
            </div>

            <!-- Packages -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <!-- Pack 100 -->
                <div class="pack-card" onclick="purchasePack('pack_100')">
                    <div class="text-center mb-4">
                        <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-cyan-500/20 mb-3">
                            <i class="fas fa-coins text-cyan-400 text-xl"></i>
                        </div>
                        <h3 class="text-lg font-bold text-white">100クレジット</h3>
                        <p class="text-2xl font-black text-cyan-400 mt-1">¥100</p>
                        <p class="text-xs text-gray-500">1クレジット = 1円</p>
                    </div>
                    <div class="credit-bar mb-3" style="width: 25%"></div>
                    <button class="pack-btn bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/35">
                        <i class="fas fa-shopping-cart mr-2"></i>購入
                    </button>
                </div>

                <!-- Pack 500 -->
                <div class="pack-card featured" onclick="purchasePack('pack_500')">
                    <div class="text-center mb-4">
                        <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-500/20 mb-3">
                            <i class="fas fa-star text-yellow-400 text-xl"></i>
                        </div>
                        <h3 class="text-lg font-bold text-white">550クレジット</h3>
                        <p class="text-2xl font-black text-yellow-400 mt-1">¥500</p>
                        <p class="text-xs text-green-400 font-bold">+50 ボーナス！</p>
                    </div>
                    <div class="credit-bar mb-3" style="width: 50%"></div>
                    <button class="pack-btn bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/35">
                        <i class="fas fa-shopping-cart mr-2"></i>購入
                    </button>
                </div>

                <!-- Pack 1000 -->
                <div class="pack-card" onclick="purchasePack('pack_1000')">
                    <div class="text-center mb-4">
                        <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-500/20 mb-3">
                            <i class="fas fa-gem text-purple-400 text-xl"></i>
                        </div>
                        <h3 class="text-lg font-bold text-white">1200クレジット</h3>
                        <p class="text-2xl font-black text-purple-400 mt-1">¥1,000</p>
                        <p class="text-xs text-green-400 font-bold">+200 ボーナス！</p>
                    </div>
                    <div class="credit-bar mb-3" style="width: 75%"></div>
                    <button class="pack-btn bg-purple-500/20 border border-purple-500/50 text-purple-300 hover:bg-purple-500/35">
                        <i class="fas fa-shopping-cart mr-2"></i>購入
                    </button>
                </div>

                <!-- Pack 3000 -->
                <div class="pack-card" onclick="purchasePack('pack_3000')">
                    <div class="text-center mb-4">
                        <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-500/20 mb-3">
                            <i class="fas fa-fire text-red-400 text-xl"></i>
                        </div>
                        <h3 class="text-lg font-bold text-white">4000クレジット</h3>
                        <p class="text-2xl font-black text-red-400 mt-1">¥3,000</p>
                        <p class="text-xs text-green-400 font-bold">+1000 ボーナス！</p>
                    </div>
                    <div class="credit-bar mb-3" style="width: 100%"></div>
                    <button class="pack-btn bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/35">
                        <i class="fas fa-shopping-cart mr-2"></i>購入
                    </button>
                </div>
            </div>

            <!-- Usage guide -->
            <div class="cyber-card mb-6">
                <h3 class="text-lg font-bold text-cyan-300 mb-4"><i class="fas fa-info-circle mr-2"></i>クレジットの使い道</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                        <div class="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                            <i class="fas fa-eye text-cyan-400"></i>
                        </div>
                        <div>
                            <p class="text-sm font-bold">観戦参加</p>
                            <p class="text-xs text-gray-400">100クレジット/回</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                        <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                            <i class="fas fa-robot text-purple-400"></i>
                        </div>
                        <div>
                            <p class="text-sm font-bold">AI対戦</p>
                            <p class="text-xs text-gray-400">50〜80クレジット/回</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                        <div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                            <i class="fas fa-user-friends text-green-400"></i>
                        </div>
                        <div>
                            <p class="text-sm font-bold">ユーザー対戦</p>
                            <p class="text-xs text-gray-400">50クレジット/回（予定）</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Transaction History -->
            <div class="cyber-card">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-cyan-300"><i class="fas fa-history mr-2"></i>購入履歴</h3>
                    <button onclick="loadHistory()" class="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                        <i class="fas fa-sync mr-1"></i>更新
                    </button>
                </div>
                <div id="historyList" class="space-y-2">
                    <div class="text-gray-500 text-sm text-center py-6">読み込み中...</div>
                </div>
            </div>

            <!-- Nav -->
            <div class="text-center mt-6 flex flex-wrap gap-4 justify-center">
                <a href="/mypage" class="inline-block px-5 py-2 bg-white/5 border border-white/20 rounded-lg text-gray-300 hover:bg-white/10 transition-all text-sm">
                    <i class="fas fa-user mr-2"></i>マイページ
                </a>
                <a href="/battle" class="inline-block px-5 py-2 bg-cyan-500/15 border border-cyan-500/40 rounded-lg text-cyan-300 hover:bg-cyan-500/25 transition-all text-sm">
                    <i class="fas fa-gamepad mr-2"></i>対戦へ
                </a>
            </div>
        </div>
    </div>

    <!-- Purchase Modal -->
    <div id="purchaseModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:1000; display:none; align-items:center; justify-content:center;">
        <div style="background:#0a1628; border: 1px solid rgba(0,255,255,0.3); border-radius:16px; padding:28px; width:90%; max-width:400px;">
            <h3 class="text-lg font-bold text-cyan-300 mb-3"><i class="fas fa-shopping-cart mr-2"></i>確認</h3>
            <p id="purchaseConfirmText" class="text-gray-300 text-sm mb-5"></p>
            <div id="purchaseLoading" style="display:none" class="text-center mb-4">
                <i class="fas fa-spinner fa-spin text-cyan-400 text-2xl"></i>
                <p class="text-gray-400 text-sm mt-2">処理中...</p>
            </div>
            <div id="purchaseButtons" class="flex gap-3">
                <button onclick="confirmPurchase()" class="flex-1 py-3 rounded-xl bg-cyan-500/25 border border-cyan-500/60 text-cyan-300 font-bold hover:bg-cyan-500/40 transition-all">
                    <i class="fas fa-check mr-1"></i>購入
                </button>
                <button onclick="closePurchaseModal()" class="flex-1 py-3 rounded-xl bg-white/5 border border-white/20 text-gray-300 font-bold hover:bg-white/10 transition-all">
                    キャンセル
                </button>
            </div>
        </div>
    </div>

    <div id="toast" style="position:fixed;bottom:20px;right:20px;z-index:9999;display:none" class="px-5 py-3 rounded-xl text-sm font-bold shadow-lg"></div>

    <script>
    let selectedPackageId = null;
    const PACK_LABELS = {
        pack_100: '100クレジット (¥100)',
        pack_500: '550クレジット (¥500) +50ボーナス',
        pack_1000: '1200クレジット (¥1000) +200ボーナス',
        pack_3000: '4000クレジット (¥3000) +1000ボーナス'
    };

    function purchasePack(id) {
        selectedPackageId = id;
        document.getElementById('purchaseConfirmText').textContent = \`\${PACK_LABELS[id]}を購入しますか？（テストモード: 無料）\`;
        document.getElementById('purchaseModal').style.display = 'flex';
        document.getElementById('purchaseLoading').style.display = 'none';
        document.getElementById('purchaseButtons').style.display = 'flex';
    }

    function closePurchaseModal() {
        document.getElementById('purchaseModal').style.display = 'none';
    }

    async function confirmPurchase() {
        if (!selectedPackageId) return;
        document.getElementById('purchaseLoading').style.display = 'block';
        document.getElementById('purchaseButtons').style.display = 'none';
        try {
            const r = await fetch('/api/credits/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ package_id: selectedPackageId })
            });
            const d = await r.json();
            if (d.success) {
                document.getElementById('currentCredits').textContent = d.new_balance;
                showToast('購入完了！ +' + d.credits_added + ' クレジット', 'success');
                closePurchaseModal();
                loadHistory();
            } else {
                showToast('エラー: ' + (d.error || '購入失敗'), 'error');
                closePurchaseModal();
            }
        } catch(e) {
            showToast('通信エラー', 'error');
            closePurchaseModal();
        }
    }

    async function loadHistory() {
        const el = document.getElementById('historyList');
        try {
            const r = await fetch('/api/user/credits/history');
            const d = await r.json();
            const items = d.transactions || [];
            if (!items.length) {
                el.innerHTML = '<div class="text-gray-500 text-sm text-center py-6">購入履歴がありません</div>';
                return;
            }
            el.innerHTML = items.map(t => {
                const isEarn = t.type === 'earn';
                const icon = isEarn ? '<i class="fas fa-plus text-green-400"></i>' : '<i class="fas fa-minus text-red-400"></i>';
                const amount = isEarn ? '+' + t.amount : '-' + Math.abs(t.amount);
                const color = isEarn ? 'text-green-400' : 'text-red-400';
                return \`<div class="history-item flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">\${icon}</div>
                        <div>
                            <p class="text-sm font-bold text-white">\${escHtml(t.reason || t.type)}</p>
                            <p class="text-xs text-gray-500">\${t.created_at || ''}</p>
                        </div>
                    </div>
                    <span class="\${color} font-black">\${amount}</span>
                </div>\`;
            }).join('');
        } catch(e) {
            el.innerHTML = '<div class="text-gray-500 text-sm text-center py-4">履歴の取得に失敗しました</div>';
        }
    }

    function showToast(msg, type='success') {
        const el = document.getElementById('toast');
        el.textContent = msg;
        el.className = 'px-5 py-3 rounded-xl text-sm font-bold shadow-lg ' + (type==='success' ? 'bg-green-700 text-white' : 'bg-red-700 text-white');
        el.style.display = 'block';
        setTimeout(() => { el.style.display = 'none'; }, 3500);
    }

    function escHtml(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

    loadHistory();
    </script>
</body>
</html>
`;
