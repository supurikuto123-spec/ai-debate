import { globalNav } from '../components/global-nav';

export const notificationsPage = (userData: any) => `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>通知 - AI Debate</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    body { background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1f 100%); color: #fff; min-height: 100vh; }
    .notif-card {
      background: linear-gradient(135deg, rgba(0,20,40,0.9), rgba(20,0,40,0.9));
      border: 1px solid rgba(0,255,255,0.2);
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 10px;
      transition: all 0.2s;
      cursor: pointer;
    }
    .notif-card:hover { border-color: rgba(0,255,255,0.5); transform: translateY(-2px); }
    .notif-card.unread { border-left: 4px solid #00ffff; }
    .notif-card.unread.warning { border-left-color: #ef4444; }
    .notif-card.unread.info { border-left-color: #3b82f6; }
    .notif-card.unread.success { border-left-color: #22c55e; }
    .notif-title { font-size: 16px; font-weight: bold; color: #fff; margin-bottom: 4px; }
    .notif-body { font-size: 14px; color: #9ca3af; line-height: 1.5; }
    .notif-time { font-size: 12px; color: #6b7280; margin-top: 6px; }
    .notif-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: bold; margin-right: 8px; }
    .badge-info { background: rgba(59,130,246,0.2); color: #60a5fa; border: 1px solid #3b82f6; }
    .badge-warning { background: rgba(239,68,68,0.2); color: #f87171; border: 1px solid #ef4444; }
    .badge-success { background: rgba(34,197,94,0.2); color: #4ade80; border: 1px solid #22c55e; }
    .badge-credit { background: rgba(255,215,0,0.2); color: #fbbf24; border: 1px solid #f59e0b; }
    .empty-state { text-align: center; padding: 60px 20px; color: #6b7280; }
    .btn-read-all {
      background: rgba(0,255,255,0.1);
      border: 1px solid rgba(0,255,255,0.4);
      color: #00ffff;
      padding: 8px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      transition: all 0.2s;
    }
    .btn-read-all:hover { background: rgba(0,255,255,0.25); }
  </style>
</head>
<body class="pt-16">
  ${globalNav(userData)}

  <div class="max-w-2xl mx-auto px-4 py-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-black" style="background:linear-gradient(135deg,#00ffff,#ff00ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
          <i class="fas fa-bell mr-2" style="-webkit-text-fill-color:#00ffff;"></i>通知
        </h1>
        <p class="text-gray-400 text-sm mt-1">コイン変化・お知らせ・メッセージ</p>
      </div>
      <button class="btn-read-all" onclick="markAllRead()">
        <i class="fas fa-check-double mr-2"></i>すべて既読
      </button>
    </div>

    <!-- Notification List -->
    <div id="notif-list">
      <div class="text-center text-gray-400 py-12">
        <i class="fas fa-spinner fa-spin text-3xl mb-4"></i>
        <p>読み込み中...</p>
      </div>
    </div>
  </div>

  <script>
    const typeIcons = {
      info: '<i class="fas fa-info-circle text-blue-400"></i>',
      warning: '<i class="fas fa-exclamation-triangle text-red-400"></i>',
      success: '<i class="fas fa-check-circle text-green-400"></i>',
      credit: '<i class="fas fa-coins text-yellow-400"></i>',
      ban: '<i class="fas fa-ban text-red-500"></i>',
      message: '<i class="fas fa-envelope text-purple-400"></i>'
    };
    const typeLabels = {
      info: ['badge-info', 'お知らせ'],
      warning: ['badge-warning', '警告'],
      success: ['badge-success', '完了'],
      credit: ['badge-credit', 'クレジット'],
      ban: ['badge-warning', '制限'],
      message: ['badge-info', 'メッセージ']
    };

    function formatTime(ts) {
      if (!ts) return '';
      const d = new Date(ts.includes('Z') ? ts : ts + 'Z');
      const now = new Date();
      const diff = Math.floor((now - d) / 1000);
      if (diff < 60) return '今';
      if (diff < 3600) return Math.floor(diff/60) + '分前';
      if (diff < 86400) return Math.floor(diff/3600) + '時間前';
      return d.toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });
    }

    async function loadNotifications() {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        const list = document.getElementById('notif-list');
        
        if (!data.success || !data.notifications || data.notifications.length === 0) {
          list.innerHTML = \`
            <div class="empty-state">
              <i class="fas fa-bell-slash text-5xl mb-4 text-gray-600"></i>
              <p class="text-xl font-bold text-gray-500 mb-2">通知はありません</p>
              <p class="text-sm text-gray-600">コイン変化・お知らせ・メッセージがここに表示されます</p>
            </div>\`;
          return;
        }
        
        list.innerHTML = data.notifications.map(n => {
          const isUnread = !n.is_read;
          const typeLbl = typeLabels[n.type] || typeLabels.info;
          const icon = typeIcons[n.type] || typeIcons.info;
          return \`
            <div class="notif-card \${isUnread ? 'unread ' + n.type : ''}" onclick="readNotif('\${n.id}', '\${n.link||''}', this)">
              <div class="flex items-start gap-3">
                <div class="text-xl mt-1">\${icon}</div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="notif-badge \${typeLbl[0]}">\${typeLbl[1]}</span>
                    \${isUnread ? '<span style="background:#ef4444;width:8px;height:8px;border-radius:50%;display:inline-block;"></span>' : ''}
                    <span class="notif-title">\${escHtml(n.title)}</span>
                  </div>
                  <p class="notif-body mt-1">\${escHtml(n.body)}</p>
                  <p class="notif-time"><i class="fas fa-clock mr-1"></i>\${formatTime(n.created_at)}</p>
                </div>
              </div>
            </div>\`;
        }).join('');
      } catch(e) {
        document.getElementById('notif-list').innerHTML = '<div class="text-red-400 text-center py-8">読み込みに失敗しました</div>';
      }
    }

    function escHtml(str) {
      return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    async function readNotif(id, link, cardEl) {
      // Mark as read
      try { await fetch('/api/notifications/read/' + id, { method: 'POST' }); } catch(e) {}
      cardEl.classList.remove('unread');
      // Navigate if link exists
      if (link && link !== 'null' && link !== '') {
        window.location.href = link;
      }
      // Refresh badge
      try {
        const res = await fetch('/api/notifications/unread-count');
        if (res.ok) {
          const d = await res.json();
          const badge = document.getElementById('nav-notif-badge');
          if (badge) {
            if (d.count > 0) { badge.textContent = d.count > 99 ? '99+' : String(d.count); badge.style.display = 'inline'; }
            else badge.style.display = 'none';
          }
        }
      } catch(e) {}
    }

    async function markAllRead() {
      try {
        await fetch('/api/notifications/read-all', { method: 'POST' });
        // Update UI
        document.querySelectorAll('.notif-card.unread').forEach(c => c.classList.remove('unread'));
        const badge = document.getElementById('nav-notif-badge');
        if (badge) badge.style.display = 'none';
      } catch(e) {}
    }

    loadNotifications();
  </script>
</body>
</html>`;
