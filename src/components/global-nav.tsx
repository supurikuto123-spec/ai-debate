// Global Navigation Component - Cyberpunk Hamburger Menu
export const globalNav = (user: { credits: number; user_id: string; avatar_type?: string; avatar_value?: string; avatar_url?: string }) => {
  const isDevUser = user.user_id === 'dev';
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
      #nav-toggle { position: fixed; top: 20px; right: 20px; width: 70px; height: 70px; background: linear-gradient(135deg, rgba(0,255,255,0.3), rgba(255,0,255,0.3)); border: 3px solid #00ffff; border-radius: 50%; cursor: pointer; z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 7px; transition: all 0.3s ease; box-shadow: 0 0 30px rgba(0,255,255,0.6); }
      #nav-toggle:hover { transform: scale(1.15) rotate(90deg); box-shadow: 0 0 40px rgba(0,255,255,1); background: linear-gradient(135deg, rgba(0,255,255,0.5), rgba(255,0,255,0.5)); }
      #nav-toggle span { width: 35px; height: 4px; background: #00ffff; border-radius: 3px; transition: all 0.3s ease; box-shadow: 0 0 15px rgba(0,255,255,0.8); pointer-events: none; }
      #nav-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(8px, 8px); }
      #nav-toggle.active span:nth-child(2) { opacity: 0; }
      #nav-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(8px, -8px); }
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
        #nav-toggle { width: 50px; height: 50px; top: 15px; right: 15px; }
        #nav-toggle span { width: 25px; }
        #nav-menu { width: 320px; }
        .nav-profile { padding: 30px 20px 20px; }
        .nav-avatar { width: 60px; height: 60px; }
        .nav-link { padding: 15px 20px; font-size: 1rem; }
      }
    </style>

    <button id="nav-toggle" aria-label="Menu Toggle">
      <span></span><span></span><span></span>
    </button>
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
        <a href="#" class="nav-link" onclick="event.preventDefault();openCommandPanel();">
          <i class="fas fa-terminal" style="color: #22c55e;"></i><span style="color: #22c55e;">コマンド</span>
        </a>
        ${isDevUser ? `
        <a href="/admin/tickets" class="nav-link" style="border-top: 1px solid rgba(255,0,128,0.3);">
          <i class="fas fa-headset" style="color: #ff0080;"></i>
          <span style="color: #ff0080;">サポートチャット管理</span>
        </a>
        ` : `
        <a href="/tickets" class="nav-link">
          <i class="fas fa-headset"></i><span>サポートチャット</span>
        </a>
        `}
      </div>

      <a href="/logout" class="nav-logout">
        <i class="fas fa-sign-out-alt"></i> ログアウト
      </a>
      
      <div style="padding: 20px 30px; border-top: 1px solid rgba(0,255,255,0.2);">
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
        toggle.addEventListener('click', () => { toggle.classList.toggle('active'); menu.classList.toggle('active'); overlay.classList.toggle('active'); });
        overlay.addEventListener('click', () => { toggle.classList.remove('active'); menu.classList.remove('active'); overlay.classList.remove('active'); });
        const currentPath = window.location.pathname;
        links.forEach(link => {
          if (link.getAttribute('href') === currentPath || (currentPath.startsWith('/watch') && link.getAttribute('href').startsWith('/watch'))) link.classList.add('active');
        });
        links.forEach(link => { link.addEventListener('click', () => { toggle.classList.remove('active'); menu.classList.remove('active'); overlay.classList.remove('active'); }); });

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
        // Refresh every 10 seconds
        setInterval(refreshNavCredits, 10000);
        // Also refresh on page visibility change
        document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshNavCredits(); });
      })();
    </script>

    <script>
      // Global helper: update all credit displays on the page
      window.updateCreditsDisplay = function(newCredits) {
        // Nav credits
        const navEl = document.getElementById('nav-credits-value');
        if (navEl) navEl.textContent = Number(newCredits).toLocaleString();
        // Other common credit elements
        const creditsValue = document.getElementById('credits-value');
        if (creditsValue) creditsValue.textContent = Number(newCredits).toLocaleString();
        const navCredits = document.getElementById('navCredits');
        if (navCredits) navCredits.textContent = Number(newCredits).toLocaleString();
      };
    </script>

    <!-- Command Panel -->
    <div id="cmd-panel" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.95);z-index:10001;backdrop-filter:blur(10px);">
      <div style="max-width:600px;margin:80px auto;padding:30px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
          <h2 style="font-size:24px;font-weight:bold;color:#00ffff;">
            <i class="fas fa-terminal" style="margin-right:10px;"></i>コマンド
          </h2>
          <button onclick="closeCmdPanel()" style="background:none;border:none;color:#ff0080;font-size:24px;cursor:pointer;">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div style="margin-bottom:20px;">
          <input id="cmd-input" type="text" placeholder="コマンドを入力... (例: !sa, !dela, !s-1)"
            style="width:100%;padding:14px 18px;background:#111;border:2px solid #00ffff;border-radius:10px;color:#fff;font-size:16px;font-family:monospace;outline:none;"
            onkeydown="if(event.key==='Enter')executeCmd()">
          <button onclick="executeCmd()" style="width:100%;margin-top:10px;padding:12px;background:linear-gradient(135deg,rgba(0,255,255,0.3),rgba(255,0,255,0.3));border:2px solid #00ffff;border-radius:10px;color:#00ffff;font-weight:bold;font-size:16px;cursor:pointer;">
            <i class="fas fa-play" style="margin-right:8px;"></i>実行
          </button>
        </div>
        
        <div id="cmd-result" style="margin-bottom:20px;padding:15px;background:#0a0a0a;border:1px solid #333;border-radius:8px;font-family:monospace;font-size:14px;color:#9ca3af;min-height:40px;display:none;">
        </div>
        
        <div style="border-top:1px solid #333;padding-top:20px;">
          <h3 style="color:#9ca3af;font-size:14px;margin-bottom:15px;">利用可能なコマンド:</h3>
          <div style="display:grid;gap:10px;">
            <div style="padding:10px 14px;background:rgba(0,255,255,0.05);border:1px solid rgba(0,255,255,0.2);border-radius:8px;">
              <code style="color:#22c55e;">!sa</code>
              <span style="color:#9ca3af;font-size:13px;margin-left:10px;">ディベート開始（アーカイブ保存付き）</span>
            </div>
            <div style="padding:10px 14px;background:rgba(0,255,255,0.05);border:1px solid rgba(0,255,255,0.2);border-radius:8px;">
              <code style="color:#22c55e;">!s</code>
              <span style="color:#9ca3af;font-size:13px;margin-left:10px;">ディベート開始</span>
            </div>
            <div style="padding:10px 14px;background:rgba(0,255,255,0.05);border:1px solid rgba(0,255,255,0.2);border-radius:8px;">
              <code style="color:#22c55e;">!dela</code>
              <span style="color:#9ca3af;font-size:13px;margin-left:10px;">現在のディベート削除 → ランダムテーマで新規開始</span>
            </div>
            <div style="padding:10px 14px;background:rgba(0,255,255,0.05);border:1px solid rgba(0,255,255,0.2);border-radius:8px;">
              <code style="color:#22c55e;">!s-1</code>
              <span style="color:#9ca3af;font-size:13px;margin-left:10px;">1分後にディベート予約</span>
            </div>
            <div style="padding:10px 14px;background:rgba(0,255,255,0.05);border:1px solid rgba(0,255,255,0.2);border-radius:8px;">
              <code style="color:#22c55e;">!s-x</code>
              <span style="color:#9ca3af;font-size:13px;margin-left:10px;">x分後に予約（0=即時開始+自動アーカイブ）</span>
            </div>
            <div style="padding:10px 14px;background:rgba(0,255,255,0.05);border:1px solid rgba(0,255,255,0.2);border-radius:8px;">
              <code style="color:#22c55e;">!@xxx+coiny</code>
              <span style="color:#9ca3af;font-size:13px;margin-left:10px;">ユーザーxxxにyコイン付与</span>
            </div>
            <div style="padding:10px 14px;background:rgba(0,255,255,0.05);border:1px solid rgba(0,255,255,0.2);border-radius:8px;">
              <code style="color:#22c55e;">!stop</code>
              <span style="color:#9ca3af;font-size:13px;margin-left:10px;">ディベート停止</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      function openCommandPanel() {
        // Close nav menu first
        document.getElementById('nav-toggle').classList.remove('active');
        document.getElementById('nav-menu').classList.remove('active');
        document.getElementById('nav-overlay').classList.remove('active');
        
        document.getElementById('cmd-panel').style.display = 'block';
        document.getElementById('cmd-input').focus();
      }
      window.openCommandPanel = openCommandPanel;
      
      function closeCmdPanel() {
        document.getElementById('cmd-panel').style.display = 'none';
        document.getElementById('cmd-result').style.display = 'none';
      }
      window.closeCmdPanel = closeCmdPanel;
      
      async function executeCmd() {
        const input = document.getElementById('cmd-input');
        const cmd = input.value.trim();
        if (!cmd) return;
        
        const resultEl = document.getElementById('cmd-result');
        resultEl.style.display = 'block';
        resultEl.style.color = '#9ca3af';
        resultEl.textContent = '実行中...';
        
        // Get current debateId from page if available
        const appDataEl = document.getElementById('app-data');
        const debateId = appDataEl ? appDataEl.dataset.debateId : null;
        
        try {
          const response = await fetch('/api/commands/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: cmd, debateId: debateId })
          });
          
          const data = await response.json();
          
          if (data.success) {
            resultEl.style.color = '#22c55e';
            
            switch(data.action) {
              case 'start_debate':
                resultEl.textContent = '✅ ディベートを開始します...';
                if (typeof window.startDebate === 'function') { closeCmdPanel(); window.startDebate(); }
                else { resultEl.textContent = '⚠️ 観戦ページ(/watch)でのみ使用可能です'; resultEl.style.color = '#f59e0b'; }
                break;
              case 'start_debate_archive':
                resultEl.textContent = '✅ ディベートを開始します（アーカイブ保存有効）...';
                window.archiveOnComplete = true;
                if (data.schedule_minutes === 0) {
                  if (typeof window.startDebate === 'function') { closeCmdPanel(); window.startDebate(); }
                  else { resultEl.textContent = '⚠️ 観戦ページ(/watch)でのみ使用可能です'; resultEl.style.color = '#f59e0b'; }
                } else if (typeof window.startDebate === 'function') { closeCmdPanel(); window.startDebate(); }
                else { resultEl.textContent = '⚠️ 観戦ページ(/watch)でのみ使用可能です'; resultEl.style.color = '#f59e0b'; }
                break;
              case 'schedule_debate':
                resultEl.textContent = '✅ ' + data.schedule_minutes + '分後にディベートを予約しました。';
                if (typeof window.startDebate === 'function') {
                  const mins = data.schedule_minutes;
                  resultEl.textContent += ' カウントダウン開始...';
                  let remaining = mins * 60;
                  const timer = setInterval(() => {
                    remaining--;
                    if (remaining <= 0) {
                      clearInterval(timer);
                      resultEl.textContent = '🚀 予約時間です！ディベートを開始します...';
                      window.archiveOnComplete = true;
                      closeCmdPanel();
                      window.startDebate();
                    } else {
                      const m = Math.floor(remaining / 60);
                      const s = remaining % 60;
                      resultEl.textContent = '⏳ ディベート開始まで: ' + m + ':' + String(s).padStart(2,'0');
                    }
                  }, 1000);
                }
                break;
              case 'dela':
                resultEl.innerHTML = '✅ ディベート削除完了！新テーマ: <strong style="color:#00ffff;">' + (data.theme ? data.theme.title : '不明') + '</strong>';
                // Reload page to load new theme
                setTimeout(() => { location.reload(); }, 1500);
                break;
              case 'stop_debate':
                resultEl.textContent = '✅ ディベートを停止しました';
                if (typeof window.debateActive !== 'undefined') { window.debateActive = false; }
                break;
              case 'delete_debate_messages':
                resultEl.textContent = '✅ ディベート履歴を削除しました';
                break;
              case 'grant_coins':
                resultEl.textContent = '✅ @' + data.target + ' に ' + data.amount + ' コインを付与しました！';
                break;
              default:
                resultEl.textContent = '✅ コマンド実行完了: ' + data.action;
            }
          } else {
            resultEl.style.color = '#ef4444';
            resultEl.textContent = '❌ ' + (data.error || 'コマンド実行失敗');
          }
        } catch (error) {
          resultEl.style.color = '#ef4444';
          resultEl.textContent = '❌ エラー: ' + error.message;
        }
        
        input.value = '';
      }
      window.executeCmd = executeCmd;
    </script>
  `;
};
