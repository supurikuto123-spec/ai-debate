// Global Navigation Component - Cyberpunk Hamburger Menu
export const globalNav = (user: { credits: number; user_id: string; avatar_type?: string; avatar_value?: string; avatar_url?: string; is_dev?: number | boolean; email?: string } | null) => {
  if (!user) {
    // Guest navigation (not logged in)
    return `
    <style>
      #guest-nav { position: fixed; top: 0; left: 0; width: 100%; z-index: 9999; background: linear-gradient(135deg, rgba(0,10,30,0.97), rgba(10,0,30,0.97)); border-bottom: 2px solid rgba(0,255,255,0.3); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; height: 60px; box-shadow: 0 4px 30px rgba(0,255,255,0.15); }
      .guest-logo { font-size: 1.2rem; font-weight: 900; background: linear-gradient(135deg, #00ffff, #ff00ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 2px; text-decoration: none; }
      .guest-nav-btn { background: linear-gradient(135deg, rgba(0,255,255,0.15), rgba(255,0,255,0.15)); border: 1.5px solid rgba(0,255,255,0.5); color: #00ffff; padding: 8px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 0.9rem; transition: all 0.3s; }
      .guest-nav-btn:hover { background: rgba(0,255,255,0.3); box-shadow: 0 0 15px rgba(0,255,255,0.4); }
    </style>
    <nav id="guest-nav">
      <a href="/" class="guest-logo">⚡ AI Debate</a>
      <div style="display:flex;align-items:center;gap:12px;">
        <img id="guest-avatar" src="" alt="" style="display:none;width:36px;height:36px;border-radius:50%;border:2px solid rgba(0,255,255,0.5);object-fit:cover;">
        <a href="/" class="guest-nav-btn"><i class="fas fa-sign-in-alt mr-2"></i>ログイン</a>
      </div>
    </nav>
    <script>
      (function() {
        try {
          const savedAvatar = localStorage.getItem('lastAvatarUrl');
          if (savedAvatar) {
            const avatarEl = document.getElementById('guest-avatar');
            if (avatarEl) { avatarEl.src = savedAvatar; avatarEl.style.display = 'block'; }
          }
        } catch(e) {}
      })();
    </script>`;
  }
  const isDevUser = user.user_id === 'dev' || user.is_dev === 1 || user.is_dev === true;
  // Avatar display logic with proper priority
  const getAvatarUrl = () => {
    if (user.avatar_url) return user.avatar_url;
    if (user.avatar_type && user.avatar_type !== 'upload') {
      return `https://api.dicebear.com/7.x/${user.avatar_type}/svg?seed=${user.avatar_value || user.user_id}`;
    }
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${user.user_id}`;
  };
  const avatarUrl = getAvatarUrl();

  return `
    <!-- Global Navigation -->
    <style>
      #nav-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); backdrop-filter: blur(10px); z-index: 9998; display: none; animation: fadeIn 0.3s ease; }
      #nav-overlay.active { display: block; }
      #nav-toggle { background: transparent; border: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; z-index: 10000; padding: 10px; transition: all 0.3s ease; }
      #nav-toggle:hover span { background: #fff; box-shadow: 0 0 10px rgba(255,255,255,0.8); }
      #nav-toggle span { width: 30px; height: 3px; background: #00ffff; border-radius: 3px; transition: all 0.3s ease; pointer-events: none; }
      #nav-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(6px, 6px); background: #ff0080; }
      #nav-toggle.active span:nth-child(2) { opacity: 0; }
      #nav-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(6px, -6px); background: #ff0080; }
      #nav-menu { position: fixed; top: 0; right: -100%; width: 400px; max-width: 90%; height: 100vh; background: linear-gradient(135deg, rgba(0,20,40,0.95), rgba(20,0,40,0.95)); border-left: 2px solid #00ffff; z-index: 9999; transition: right 0.5s cubic-bezier(0.68,-0.55,0.265,1.55); overflow-y: auto; box-shadow: -10px 0 50px rgba(0,255,255,0.3); }
      #nav-menu.active { right: 0; }
      .nav-profile { padding: 40px 30px 30px; border-bottom: 2px solid rgba(0,255,255,0.3); background: linear-gradient(135deg, rgba(0,255,255,0.1), rgba(255,0,255,0.1)); }
      .nav-avatar { width: 100px; height: 100px; border-radius: 50%; border: 3px solid #00ffff; margin: 0 auto 15px; display: block; box-shadow: 0 0 20px rgba(0,255,255,0.5); object-fit: cover; }
      .nav-avatar-wrap { position: relative; width: 110px; margin: 0 auto 15px; }
      .nav-avatar-wrap.dev-frame { }
      .nav-avatar-wrap.dev-frame .nav-avatar { border: 4px solid transparent; background-image: linear-gradient(#000, #000), conic-gradient(from 0deg, #ffd700, #ff00ff, #00ffff, #22c55e, #ffd700); background-origin: border-box; background-clip: padding-box, border-box; box-shadow: 0 0 30px rgba(255,215,0,0.5), 0 0 60px rgba(0,255,255,0.2), inset 0 0 20px rgba(255,0,255,0.1); animation: devGlow 4s linear infinite; margin: 0 auto; }
      .dev-badge { position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #ffd700 0%, #ff8c00 50%, #ffd700 100%); background-size: 200% 100%; animation: badgeShimmer 3s ease infinite; color: #000; font-size: 10px; font-weight: 900; padding: 3px 12px; border-radius: 12px; white-space: nowrap; box-shadow: 0 0 15px rgba(255,215,0,0.7), 0 2px 8px rgba(0,0,0,0.5); letter-spacing: 1.5px; z-index: 1; border: 1px solid rgba(255,255,255,0.3); }
      @keyframes devGlow { 0%, 100% { box-shadow: 0 0 30px rgba(255,215,0,0.5), 0 0 60px rgba(0,255,255,0.2); filter: drop-shadow(0 0 8px rgba(255,215,0,0.4)); } 25% { box-shadow: 0 0 35px rgba(255,0,255,0.5), 0 0 70px rgba(255,215,0,0.3); filter: drop-shadow(0 0 10px rgba(255,0,255,0.4)); } 50% { box-shadow: 0 0 40px rgba(0,255,255,0.6), 0 0 80px rgba(255,0,255,0.3); filter: drop-shadow(0 0 12px rgba(0,255,255,0.5)); } 75% { box-shadow: 0 0 35px rgba(34,197,94,0.5), 0 0 70px rgba(0,255,255,0.3); filter: drop-shadow(0 0 10px rgba(34,197,94,0.4)); } }
      @keyframes badgeShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      .nav-username { font-family: 'Orbitron', sans-serif; font-size: 1.2rem; font-weight: 700; text-align: center; color: #00ffff; margin-bottom: 10px; text-shadow: 0 0 10px rgba(0,255,255,0.5); }
      .nav-credits { text-align: center; font-size: 1.1rem; color: #ffff00; font-weight: 700; text-shadow: 0 0 10px rgba(255,255,0,0.5); }
      .nav-links { padding: 20px 0; }
      .nav-link { display: flex; align-items: center; gap: 15px; padding: 18px 30px; color: #ffffff; text-decoration: none; font-size: 1.1rem; font-weight: 500; transition: all 0.3s ease; border-left: 4px solid transparent; }
      .nav-link:hover { background: linear-gradient(90deg, rgba(0,255,255,0.2), transparent); border-left: 4px solid #00ffff; padding-left: 35px; color: #00ffff; text-shadow: 0 0 10px rgba(0,255,255,0.5); }
      .nav-link.active { background: linear-gradient(90deg, rgba(0,255,255,0.3), transparent); border-left: 4px solid #00ffff; color: #00ffff; }
      .nav-link i { font-size: 1.5rem; width: 34px; text-align: center; }
      .nav-logout { margin: 20px 30px; padding: 15px; background: linear-gradient(135deg, rgba(255,0,0,0.2), rgba(255,0,255,0.2)); border: 2px solid #ff0080; border-radius: 10px; color: #ff0080; font-family: 'Orbitron', sans-serif; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.3s ease; text-align: center; text-decoration: none; display: block; box-shadow: 0 0 20px rgba(255,0,128,0.3); }
      .nav-logout:hover { background: linear-gradient(135deg, rgba(255,0,0,0.4), rgba(255,0,255,0.4)); transform: translateY(-2px); box-shadow: 0 5px 25px rgba(255,0,128,0.5); }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @media (max-width: 768px) {
        #nav-menu { width: 320px; }
        .nav-profile { padding: 30px 20px 20px; }
        .nav-avatar { width: 60px; height: 60px; }
        .nav-link { padding: 15px 20px; font-size: 1rem; }
      }
    </style>

    <!-- Fixed Top Header -->
    <header style="position: fixed; top: 0; left: 0; width: 100%; height: 60px; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(0,255,255,0.3); display: flex; justify-content: space-between; align-items: center; padding: 0 20px; z-index: 9997;">
      <a href="/main" style="text-decoration: none; display: flex; align-items: center; gap: 10px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" style="width:34px;height:34px;flex-shrink:0;">
          <defs>
            <linearGradient id="nav-bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#03050f"/><stop offset="100%" stop-color="#080018"/></linearGradient>
            <linearGradient id="nav-logo" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#00e5ff"/><stop offset="50%" stop-color="#8800ff"/><stop offset="100%" stop-color="#ff00cc"/></linearGradient>
          </defs>
          <rect width="64" height="64" rx="14" fill="url(#nav-bg)"/>
          <path d="M 32 8 A 24 24 0 0 0 32 56" fill="none" stroke="#00e5ff" stroke-width="2.5" stroke-linecap="round" opacity="0.9"/>
          <path d="M 32 8 A 24 24 0 0 1 32 56" fill="none" stroke="#ff00cc" stroke-width="2.5" stroke-linecap="round" opacity="0.9"/>
          <path d="M 20 22 L 14 22 L 14 42 L 20 42" fill="none" stroke="#00e5ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>
          <path d="M 44 22 L 50 22 L 50 42 L 44 42" fill="none" stroke="#ff00cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>
          <text x="32" y="37" text-anchor="middle" font-size="16" font-weight="900" font-family="Arial Black,Arial,sans-serif" fill="url(#nav-logo)" letter-spacing="-0.5">AI</text>
          <circle cx="10" cy="10" r="2" fill="#00e5ff" opacity="0.5"/>
          <circle cx="54" cy="10" r="2" fill="#ff00cc" opacity="0.5"/>
        </svg>
        <span style="font-family:'Orbitron',sans-serif;font-size:1.05rem;font-weight:900;letter-spacing:2px;background:linear-gradient(135deg,#00e5ff,#8800ff,#ff00cc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">AI DEBATE</span>
      </a>
      <button id="nav-toggle" aria-label="Menu Toggle">
        <span></span><span></span><span></span>
      </button>
    </header>

    <div id="nav-overlay"></div>

    <nav id="nav-menu">
      <div class="nav-profile">
        <div class="nav-avatar-wrap ${isDevUser ? 'dev-frame' : ''}">
          <img src="${avatarUrl}" alt="Avatar" class="nav-avatar">
          ${isDevUser ? '<div class="dev-badge"><i class="fas fa-crown" style="margin-right:3px;"></i>DEV</div>' : ''}
        </div>
        <div class="nav-username">@${user.user_id}</div>
        <div class="nav-credits" id="nav-credits-display">
          <i class="fas fa-coins"></i> <span id="nav-credits-value">${(user.credits || 0).toLocaleString()}</span> Credits
        </div>
      </div>

      <div class="nav-links">
        <a href="/announcements" class="nav-link">
          <i class="fas fa-bullhorn"></i><span>お知らせ</span>
        </a>
        <a href="/main" class="nav-link">
          <i class="fas fa-eye"></i><span>観戦</span>
        </a>
        <a href="/battle" class="nav-link">
          <i class="fas fa-gamepad"></i><span>対戦</span>
        </a>
        <a href="/credits" class="nav-link">
          <i class="fas fa-coins" style="color:#fbbf24;"></i><span style="color:#fbbf24;">クレジット購入</span>
        </a>
        <a href="/archive" class="nav-link">
          <i class="fas fa-archive"></i><span>アーカイブ</span>
        </a>
        <a href="/theme-vote" class="nav-link">
          <i class="fas fa-vote-yea"></i><span>テーマ投票</span>
        </a>
        <a href="/community" class="nav-link">
          <i class="fas fa-users"></i><span>コミュニティ</span>
        </a>
        <a href="/mypage" class="nav-link">
          <i class="fas fa-user"></i><span>マイページ</span>
        </a>
        <a href="/notifications" class="nav-link" id="nav-notif-link">
          <i class="fas fa-bell" style="position:relative;"></i>
          <span>通知 <span id="nav-notif-badge" style="display:none;background:#ef4444;color:#fff;border-radius:10px;padding:1px 6px;font-size:11px;margin-left:4px;font-weight:700;"></span></span>
        </a>
        ${isDevUser ? `
        <a href="/dev/themes" class="nav-link" style="border-top: 1px solid rgba(255,215,0,0.3);">
          <i class="fas fa-cogs" style="color: #ffd700;"></i><span style="color: #ffd700;">テーマ管理</span>
        </a>
        <a href="/admin/dashboard" class="nav-link">
          <i class="fas fa-crown" style="color: #ffd700;"></i><span style="color: #ffd700;">開発者ダッシュボード</span>
        </a>
        <a href="/admin/tickets" class="nav-link">
          <i class="fas fa-headset" style="color: #ff0080;"></i>
          <span style="color: #ff0080;">サポート管理</span>
        </a>
        ` : `
        <a href="/tickets" class="nav-link">
          <i class="fas fa-headset"></i><span>サポートチャット</span>
        </a>
        `}
      </div>

      <a href="/logout" class="nav-logout" onclick="saveAvatarBeforeLogout(this)">
        <i class="fas fa-sign-out-alt"></i> ログアウト
      </a>
      
      <div style="padding: 20px 30px; border-top: 1px solid rgba(0,255,255,0.2);">
        <!-- AIO Debate Statistics -->
        <div style="background:rgba(0,255,255,0.05);border:1px solid rgba(0,255,255,0.2);border-radius:10px;padding:14px;margin-bottom:16px;">
          <div style="font-size:11px;font-weight:700;color:#00ffff;letter-spacing:1px;margin-bottom:10px;text-transform:uppercase;">
            <i class="fas fa-chart-bar" style="margin-right:6px;"></i>AIO Debate 統計
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div style="text-align:center;">
              <div id="aio-debates" style="font-size:18px;font-weight:900;color:#00ffff;">-</div>
              <div style="font-size:10px;color:#6b7280;">総ディベート</div>
            </div>
            <div style="text-align:center;">
              <div id="aio-users" style="font-size:18px;font-weight:900;color:#ff00ff;">-</div>
              <div style="font-size:10px;color:#6b7280;">登録ユーザー</div>
            </div>
            <div style="text-align:center;">
              <div id="aio-votes" style="font-size:18px;font-weight:900;color:#ffd700;">-</div>
              <div style="font-size:10px;color:#6b7280;">総投票数</div>
            </div>
            <div style="text-align:center;">
              <div id="aio-posts" style="font-size:18px;font-weight:900;color:#22c55e;">-</div>
              <div style="font-size:10px;color:#6b7280;">投稿数</div>
            </div>
          </div>
        </div>
        <a href="/terms" style="display: block; color: #888; font-size: 0.85rem; padding: 8px 0; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#00ffff'" onmouseout="this.style.color='#888'">
          <i class="fas fa-file-contract" style="margin-right: 8px;"></i>利用規約
        </a>
        <a href="/privacy" style="display: block; color: #888; font-size: 0.85rem; padding: 8px 0; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#00ffff'" onmouseout="this.style.color='#888'">
          <i class="fas fa-shield-alt" style="margin-right: 8px;"></i>プライバシーポリシー
        </a>
        <a href="/legal" style="display: block; color: #888; font-size: 0.85rem; padding: 8px 0; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#00ffff'" onmouseout="this.style.color='#888'">
          <i class="fas fa-gavel" style="margin-right: 8px;"></i>特定商取引法
        </a>
      </div>
    </nav>

    <script>
      (function() {
        const toggle = document.getElementById('nav-toggle');
        const menu = document.getElementById('nav-menu');
        const overlay = document.getElementById('nav-overlay');
        const links = document.querySelectorAll('.nav-link');

        // Toggle menu open/close on hamburger click
        toggle.addEventListener('click', () => {
          const isNowActive = !menu.classList.contains('active');
          toggle.classList.toggle('active');
          menu.classList.toggle('active');
          overlay.classList.toggle('active');
          if (isNowActive) loadAioStats();
        });

        // Close menu when clicking overlay
        overlay.addEventListener('click', () => {
          toggle.classList.remove('active');
          menu.classList.remove('active');
          overlay.classList.remove('active');
        });

        // Highlight current page link
        const currentPath = window.location.pathname;
        links.forEach(link => {
          const href = link.getAttribute('href');
          if (href && (href === currentPath || (currentPath.startsWith('/watch') && href.startsWith('/watch')))) {
            link.classList.add('active');
          }
        });

        // Close menu on nav link click (mobile)
        links.forEach(link => {
          link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            overlay.classList.remove('active');
          });
        });

        // Auto-refresh credits from DB
        async function refreshNavCredits() {
          try {
            const res = await fetch('/api/user');
            if (res.ok) {
              const data = await res.json();
              const el = document.getElementById('nav-credits-value');
              if (el && data.credits !== undefined) el.textContent = Number(data.credits).toLocaleString();
            }
          } catch(e) {}
        }
        setInterval(refreshNavCredits, 10000);
        document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshNavCredits(); });

        // Load unread notification count
        async function refreshNotifBadge() {
          try {
            const res = await fetch('/api/notifications/unread-count');
            if (res.ok) {
              const data = await res.json();
              const badge = document.getElementById('nav-notif-badge');
              if (badge) {
                if (data.count > 0) {
                  badge.textContent = data.count > 99 ? '99+' : String(data.count);
                  badge.style.display = 'inline';
                } else {
                  badge.style.display = 'none';
                }
              }
            }
          } catch(e) {}
        }
        refreshNotifBadge();
        setInterval(refreshNotifBadge, 30000);

        // Load AIO Debate statistics
        async function loadAioStats() {
          try {
            const res = await fetch('/api/stats/aio');
            if (res.ok) {
              const d = await res.json();
              const debates = document.getElementById('aio-debates');
              const users = document.getElementById('aio-users');
              const votes = document.getElementById('aio-votes');
              const posts = document.getElementById('aio-posts');
              if (debates) debates.textContent = Number(d.total_debates || 0).toLocaleString();
              if (users) users.textContent = Number(d.total_users || 0).toLocaleString();
              if (votes) votes.textContent = Number(d.total_votes || 0).toLocaleString();
              if (posts) posts.textContent = Number(d.total_posts || 0).toLocaleString();
            }
          } catch(e) {}
        }
      })();
    </script>

    <script>
      // Global helper: update all credit displays on the page
      window.updateCreditsDisplay = function(newCredits) {
        const navEl = document.getElementById('nav-credits-value');
        if (navEl) navEl.textContent = Number(newCredits).toLocaleString();
        const creditsValue = document.getElementById('credits-value');
        if (creditsValue) creditsValue.textContent = Number(newCredits).toLocaleString();
        const navCredits = document.getElementById('navCredits');
        if (navCredits) navCredits.textContent = Number(newCredits).toLocaleString();
      };
    </script>

    <!-- Custom Animated Popups -->
    <div id="ai-debate-popup-overlay" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);z-index:100000;opacity:0;transition:opacity 0.3s ease;align-items:center;justify-content:center;">
        <div id="ai-debate-popup-box" style="background:linear-gradient(135deg, rgba(0,20,40,0.95), rgba(20,0,40,0.95));border:2px solid #00ffff;box-shadow:0 0 30px rgba(0,255,255,0.4);border-radius:12px;padding:30px;max-width:90%;width:400px;text-align:center;transform:scale(0.8);opacity:0;transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
            <div id="ai-debate-popup-icon" style="font-size:3rem;margin-bottom:15px;"></div>
            <div id="ai-debate-popup-message" style="color:#fff;font-size:1.1rem;margin-bottom:25px;line-height:1.5;"></div>
            <div id="ai-debate-popup-buttons" style="display:flex;gap:15px;justify-content:center;">
            </div>
        </div>
    </div>
    <script>
      (function(){
        const overlay = document.getElementById('ai-debate-popup-overlay');
        const box = document.getElementById('ai-debate-popup-box');
        const iconEl = document.getElementById('ai-debate-popup-icon');
        const msgEl = document.getElementById('ai-debate-popup-message');
        const btnContainer = document.getElementById('ai-debate-popup-buttons');
        
        window.customAlert = function(msg) {
          return new Promise(resolve => {
            overlay.style.display = 'flex';
            void overlay.offsetWidth;
            overlay.style.opacity = '1';
            box.style.transform = 'scale(1)';
            box.style.opacity = '1';
            msgEl.innerHTML = (msg||'').toString().replace(/\\n/g, '<br>');
            iconEl.innerHTML = '<i class="fas fa-exclamation-circle" style="color:#00ffff;text-shadow:0 0 10px rgba(0,255,255,0.6);"></i>';
            btnContainer.innerHTML = '';
            const btn = document.createElement('button');
            btn.textContent = 'OK';
            btn.style.cssText = 'padding:10px 25px;background:linear-gradient(90deg, #00ffff, #0080ff);color:#000;font-weight:bold;border:none;border-radius:6px;cursor:pointer;font-family:"Orbitron", sans-serif;';
            btn.onclick = () => { closePopup(); resolve(); };
            btnContainer.appendChild(btn);
          });
        };
        
        window.customConfirm = function(msg) {
          return new Promise(resolve => {
            overlay.style.display = 'flex';
            void overlay.offsetWidth;
            overlay.style.opacity = '1';
            box.style.transform = 'scale(1)';
            box.style.opacity = '1';
            msgEl.innerHTML = (msg||'').toString().replace(/\\n/g, '<br>');
            iconEl.innerHTML = '<i class="fas fa-question-circle" style="color:#ff0080;text-shadow:0 0 10px rgba(255,0,128,0.6);"></i>';
            btnContainer.innerHTML = '';
            const btnCancel = document.createElement('button');
            btnCancel.textContent = 'キャンセル';
            btnCancel.style.cssText = 'padding:10px 20px;background:transparent;border:2px solid #ff0080;color:#ff0080;font-weight:bold;border-radius:6px;cursor:pointer;';
            btnCancel.onclick = () => { closePopup(); resolve(false); };
            const btnOk = document.createElement('button');
            btnOk.textContent = 'OK';
            btnOk.style.cssText = 'padding:10px 25px;background:linear-gradient(90deg, #ff0080, #ff00ff);color:#fff;font-weight:bold;border:none;border-radius:6px;cursor:pointer;';
            btnOk.onclick = () => { closePopup(); resolve(true); };
            btnContainer.appendChild(btnCancel);
            btnContainer.appendChild(btnOk);
          });
        };
        
        function closePopup() {
          overlay.style.opacity = '0';
          box.style.transform = 'scale(0.8)';
          box.style.opacity = '0';
          setTimeout(() => { overlay.style.display = 'none'; }, 300);
        }

        window.alert = function(msg) { window.customAlert(msg); };

        document.addEventListener('DOMContentLoaded', () => {
          if (/Mobi|Android|iPhone/i.test(navigator.userAgent) && !localStorage.getItem('mobile_warned')) {
            localStorage.setItem('mobile_warned', 'true');
            window.customAlert('AI Debateへようこそ！\\n\\nPCデバイスでの閲覧を強く推奨しています。モバイルでは一部のUIが最適化されていない場合があります。');
          }
        });
      })();
    </script>

    <script>
      function saveAvatarBeforeLogout(linkEl) {
        try {
          const avatarEl = document.querySelector('.nav-avatar');
          if (avatarEl && avatarEl.src) localStorage.setItem('lastAvatarUrl', avatarEl.src);
          localStorage.setItem('lastUserId', '${user.user_id}');
        } catch(e) {}
      }
      window.saveAvatarBeforeLogout = saveAvatarBeforeLogout;
    </script>
  `;
};
