// Global Navigation Component - Cyberpunk Hamburger Menu
export const globalNav = (user: { credits: number; user_id: string; avatar_type?: string; avatar_value?: string }) => {
  const avatarUrl = user.avatar_type === 'upload' 
    ? user.avatar_value 
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar_value || '1'}`;

  return `
    <!-- Global Navigation -->
    <style>
      /* Global Nav Overlay */
      #nav-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(10px);
        z-index: 9998;
        display: none;
        animation: fadeIn 0.3s ease;
      }

      #nav-overlay.active {
        display: block;
      }

      /* Hamburger Button */
      #nav-toggle {
        position: fixed;
        bottom: 30px;
        left: 30px;
        width: 70px;
        height: 70px;
        background: linear-gradient(135deg, rgba(0, 255, 255, 0.3), rgba(255, 0, 255, 0.3));
        border: 3px solid #00ffff;
        border-radius: 50%;
        cursor: pointer;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 7px;
        transition: all 0.3s ease;
        box-shadow: 0 0 30px rgba(0, 255, 255, 0.6);
      }

      #nav-toggle:hover {
        transform: scale(1.15) rotate(90deg);
        box-shadow: 0 0 40px rgba(0, 255, 255, 1);
        background: linear-gradient(135deg, rgba(0, 255, 255, 0.5), rgba(255, 0, 255, 0.5));
      }

      #nav-toggle span {
        width: 35px;
        height: 4px;
        background: #00ffff;
        border-radius: 3px;
        transition: all 0.3s ease;
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.8);
      }

      #nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(8px, 8px);
      }

      #nav-toggle.active span:nth-child(2) {
        opacity: 0;
      }

      #nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(8px, -8px);
      }

      /* Nav Menu */
      #nav-menu {
        position: fixed;
        top: 0;
        right: -100%;
        width: 400px;
        max-width: 90%;
        height: 100vh;
        background: linear-gradient(135deg, rgba(0, 20, 40, 0.95), rgba(20, 0, 40, 0.95));
        border-left: 2px solid #00ffff;
        z-index: 9999;
        transition: right 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        overflow-y: auto;
        box-shadow: -10px 0 50px rgba(0, 255, 255, 0.3);
      }

      #nav-menu.active {
        right: 0;
      }

      /* User Profile Section */
      .nav-profile {
        padding: 40px 30px 30px;
        border-bottom: 2px solid rgba(0, 255, 255, 0.3);
        background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1));
      }

      .nav-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 3px solid #00ffff;
        margin: 0 auto 15px;
        display: block;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
      }

      .nav-username {
        font-family: 'Orbitron', sans-serif;
        font-size: 1.2rem;
        font-weight: 700;
        text-align: center;
        color: #00ffff;
        margin-bottom: 10px;
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
      }

      .nav-credits {
        text-align: center;
        font-size: 1.1rem;
        color: #ffff00;
        font-weight: 700;
        text-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
      }

      /* Nav Links */
      .nav-links {
        padding: 20px 0;
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 18px 30px;
        color: #ffffff;
        text-decoration: none;
        font-size: 1.1rem;
        font-weight: 500;
        transition: all 0.3s ease;
        border-left: 4px solid transparent;
      }

      .nav-link:hover {
        background: linear-gradient(90deg, rgba(0, 255, 255, 0.2), transparent);
        border-left: 4px solid #00ffff;
        padding-left: 35px;
        color: #00ffff;
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
      }

      .nav-link.active {
        background: linear-gradient(90deg, rgba(0, 255, 255, 0.3), transparent);
        border-left: 4px solid #00ffff;
        color: #00ffff;
      }

      .nav-link i {
        font-size: 1.3rem;
        width: 30px;
        text-align: center;
      }

      /* Logout Button */
      .nav-logout {
        margin: 20px 30px;
        padding: 15px;
        background: linear-gradient(135deg, rgba(255, 0, 0, 0.2), rgba(255, 0, 255, 0.2));
        border: 2px solid #ff0080;
        border-radius: 10px;
        color: #ff0080;
        font-family: 'Orbitron', sans-serif;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
        text-decoration: none;
        display: block;
        box-shadow: 0 0 20px rgba(255, 0, 128, 0.3);
      }

      .nav-logout:hover {
        background: linear-gradient(135deg, rgba(255, 0, 0, 0.4), rgba(255, 0, 255, 0.4));
        transform: translateY(-2px);
        box-shadow: 0 5px 25px rgba(255, 0, 128, 0.5);
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        #nav-toggle {
          width: 50px;
          height: 50px;
          top: 15px;
          right: 15px;
        }

        #nav-toggle span {
          width: 25px;
        }

        #nav-menu {
          width: 320px;
        }

        .nav-profile {
          padding: 30px 20px 20px;
        }

        .nav-avatar {
          width: 60px;
          height: 60px;
        }

        .nav-link {
          padding: 15px 20px;
          font-size: 1rem;
        }
      }
    </style>

    <!-- Hamburger Button -->
    <button id="nav-toggle" aria-label="Menu Toggle">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Overlay -->
    <div id="nav-overlay"></div>

    <!-- Navigation Menu -->
    <nav id="nav-menu">
      <!-- User Profile -->
      <div class="nav-profile">
        <img src="${avatarUrl}" alt="Avatar" class="nav-avatar">
        <div class="nav-username">@${user.user_id}</div>
        <div class="nav-credits">
          <i class="fas fa-coins"></i> ${user.credits.toLocaleString()} Credits
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="nav-links">
        <a href="/main" class="nav-link">
          <i class="fas fa-home"></i>
          <span>メインページ</span>
        </a>
        <a href="/watch/1" class="nav-link">
          <i class="fas fa-eye"></i>
          <span>観戦</span>
        </a>
        <a href="/archive" class="nav-link">
          <i class="fas fa-archive"></i>
          <span>アーカイブ</span>
        </a>
        <a href="/community" class="nav-link">
          <i class="fas fa-users"></i>
          <span>コミュニティ</span>
        </a>
        <a href="/announcements" class="nav-link">
          <i class="fas fa-bullhorn"></i>
          <span>お知らせ</span>
        </a>
        <a href="/mypage" class="nav-link">
          <i class="fas fa-user"></i>
          <span>マイページ</span>
        </a>
      </div>

      <!-- Logout -->
      <a href="/logout" class="nav-logout">
        <i class="fas fa-sign-out-alt"></i> ログアウト
      </a>
    </nav>

    <!-- Navigation Script -->
    <script>
      (function() {
        const toggle = document.getElementById('nav-toggle');
        const menu = document.getElementById('nav-menu');
        const overlay = document.getElementById('nav-overlay');
        const links = document.querySelectorAll('.nav-link');

        // Toggle menu
        toggle.addEventListener('click', () => {
          toggle.classList.toggle('active');
          menu.classList.toggle('active');
          overlay.classList.toggle('active');
        });

        // Close menu on overlay click
        overlay.addEventListener('click', () => {
          toggle.classList.remove('active');
          menu.classList.remove('active');
          overlay.classList.remove('active');
        });

        // Highlight active page
        const currentPath = window.location.pathname;
        links.forEach(link => {
          if (link.getAttribute('href') === currentPath || 
              (currentPath.startsWith('/watch') && link.getAttribute('href').startsWith('/watch'))) {
            link.classList.add('active');
          }
        });

        // Close menu on link click (mobile)
        links.forEach(link => {
          link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            overlay.classList.remove('active');
          });
        });
      })();
    </script>
  `;
};
