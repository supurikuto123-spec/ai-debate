// AI Debate - Interactive Features
console.log('🚀 AI Debate initialized!');

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // If href is exactly "#", show "under construction" message
        if (href === '#') {
            e.preventDefault();
            showNotification('✨ 機能は近日公開予定です！', 'info');
            return;
        }
        
        // Otherwise, smooth scroll to target
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Social icon links (except Instagram)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.social-icon').forEach(icon => {
        const href = icon.getAttribute('href');
        if (href === '#') {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('✨ 機能は近日公開予定です！', 'info');
            });
        }
    });
});

// Button click handlers (mock functionality)
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        const text = this.textContent.trim();
        
        if (text.includes('登録') || text.includes('ログイン')) {
            showNotification('🚀 機能は近日公開予定です！', 'info');
        } else if (text.includes('始める')) {
            showNotification('✨ AI Debateの世界へようこそ！', 'success');
        } else if (text.includes('デモ')) {
            showNotification('🎬 デモ動画は準備中です', 'info');
        }
    });
});

// Watch button handlers
document.querySelectorAll('.btn-watch').forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        showNotification('👀 ディベート観戦機能は近日公開！', 'info');
    });
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            max-width: 400px;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            backdrop-filter: blur(10px);
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }
        
        .notification-info {
            background: linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(0, 128, 255, 0.2));
            border: 2px solid #00ffff;
        }
        
        .notification-success {
            background: linear-gradient(135deg, rgba(0, 255, 0, 0.2), rgba(0, 200, 0, 0.2));
            border: 2px solid #00ff00;
        }
        
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            color: white;
            font-weight: 600;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        @media (max-width: 768px) {
            .notification {
                right: 10px;
                left: 10px;
                min-width: auto;
            }
        }
    `;
    
    if (!document.querySelector('style[data-notification-styles]')) {
        style.setAttribute('data-notification-styles', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Close button handler
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Add parallax effect to cyber grid
let ticking = false;
window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            const scrolled = window.pageYOffset;
            const grids = document.querySelectorAll('.cyber-grid');
            grids.forEach(grid => {
                grid.style.transform = `perspective(500px) rotateX(60deg) translateY(${scrolled * 0.1}px)`;
            });
            ticking = false;
        });
        ticking = true;
    }
});

// Add intersection observer for animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature and debate cards
document.querySelectorAll('.feature-card, .debate-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Random glitch effect on title
setInterval(() => {
    const glitch = document.querySelector('.glitch');
    if (glitch && Math.random() > 0.7) {
        glitch.style.animation = 'none';
        setTimeout(() => {
            glitch.style.animation = 'glitchColor 2s infinite';
        }, 100);
    }
}, 3000);

// Add cursor trail effect (Y2K style)
const cursorTrail = [];
const maxTrailLength = 10;

document.addEventListener('mousemove', (e) => {
    // Create trail dot
    const dot = document.createElement('div');
    dot.className = 'cursor-trail';
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    document.body.appendChild(dot);
    
    cursorTrail.push(dot);
    
    // Remove old trail dots
    if (cursorTrail.length > maxTrailLength) {
        const oldDot = cursorTrail.shift();
        oldDot.remove();
    }
    
    // Fade out and remove
    setTimeout(() => {
        dot.style.opacity = '0';
        setTimeout(() => dot.remove(), 500);
    }, 100);
});

// Add cursor trail styles
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .cursor-trail {
        position: fixed;
        width: 8px;
        height: 8px;
        background: linear-gradient(135deg, #00ffff, #ff00ff);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transition: opacity 0.5s ease;
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    }
`;
document.head.appendChild(cursorStyle);

// Easter egg: Konami code
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    showNotification('🎮 コナミコード発動！Y2Kパワー全開！', 'success');
    document.body.style.animation = 'rainbow 2s linear infinite';
    
    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(rainbowStyle);
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

console.log('💡 Tip: Try the Konami code! ↑↑↓↓←→←→BA');

// Format count to display ranges (1+, 3+, 5+, 10+, 30+, 50+, 100+, then 300+, 500+, 1000+, etc.)
function formatCountDisplay(count) {
    if (count < 1) return '1+';
    if (count < 3) return '1+';
    if (count < 5) return '3+';
    if (count < 10) return '5+';
    if (count < 30) return '10+';
    if (count < 50) return '30+';
    if (count < 100) return '50+';
    if (count < 300) return '100+';
    if (count < 500) return '300+';
    if (count < 1000) return '500+';
    if (count < 3000) return '1000+';
    if (count < 5000) return '3000+';
    if (count < 10000) return '5000+';
    
    // For 10000+, use 10k, 30k, 50k, 100k format
    if (count < 30000) return '10000+';
    if (count < 50000) return '30000+';
    if (count < 100000) return '50000+';
    
    return '100000+';
}

// Fetch and update visitor/user stats
async function updateStats() {
    try {
        // Fetch online connection count
        const onlineResponse = await fetch('/api/stats/online');
        const onlineData = await onlineResponse.json();
        
        const onlineElement = document.getElementById('online-count');
        if (onlineElement) {
            onlineElement.textContent = onlineData.count;
            onlineElement.style.animation = 'none';
            setTimeout(() => {
                onlineElement.style.animation = 'meterPulse 2s ease-in-out infinite';
            }, 10);
        }
        
        // Fetch total visitor count
        const visitorResponse = await fetch('/api/stats/visitors');
        const visitorData = await visitorResponse.json();
        
        const visitorElement = document.getElementById('visitor-count');
        if (visitorElement) {
            visitorElement.textContent = visitorData.count;
            visitorElement.style.animation = 'none';
            setTimeout(() => {
                visitorElement.style.animation = 'meterPulse 2s ease-in-out infinite';
            }, 10);
        }
        
        // Fetch total registered user count
        const userResponse = await fetch('/api/stats/users');
        const userData = await userResponse.json();
        
        const userElement = document.getElementById('user-count');
        if (userElement) {
            userElement.textContent = userData.count;
            userElement.style.animation = 'none';
            setTimeout(() => {
                userElement.style.animation = 'meterPulse 2s ease-in-out infinite';
            }, 10);
        }
    } catch (error) {
        console.error('Failed to update stats:', error);
        // Show placeholder on error
        const onlineElement = document.getElementById('online-count');
        const visitorElement = document.getElementById('visitor-count');
        const userElement = document.getElementById('user-count');
        if (onlineElement) onlineElement.textContent = '--';
        if (visitorElement) visitorElement.textContent = '--';
        if (userElement) userElement.textContent = '--';
    }
}

// Update stats on page load
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    // Refresh stats every 30 seconds
    setInterval(updateStats, 30000);
    // Initialize i18n
    initI18n();
});

// ================================
// MULTILINGUAL SUPPORT (i18n)
// ================================
const i18nTranslations = {
  ja: { /* Default - no translation needed */ },
  en: {
    'AI vs AI ディベートショーを観戦しよう': 'Watch AI vs AI debate shows',
    '最先端のAI同士が繰り広げる白熱したディベートを楽しむ': 'Enjoy heated debates between cutting-edge AIs',
    '観戦でクレジット獲得、自分でもAIと対決可能': 'Earn credits by watching, challenge AI yourself',
    '事前登録ボーナス': 'Pre-registration Bonus',
    '無料プレゼント': 'Free Gift',
    'メインページへ': 'Go to Main',
    '事前登録して始める': 'Pre-register & Start',
    'リアルタイム接続数': 'Live Connections',
    '累計訪問者数': 'Total Visitors',
    '総登録ユーザー数': 'Total Registered Users',
    'サービスリリースまで': 'Until Service Launch',
    'リリース日確定次第、お知らせします': 'We will notify you once the release date is confirmed',
    '仕組み': 'How It Works',
    'AI vs AI 試合を観戦': 'Watch AI vs AI Matches',
    '試合を作成する': 'Create Matches',
    '自分も参戦': 'Join the Battle',
    'クレジットシステム': 'Credit System',
    '獲得方法': 'How to Earn',
    '使い道': 'How to Spend',
    '新規登録ボーナス': 'Sign-up Bonus',
    'カテゴリー': 'Categories',
    '主な機能': 'Key Features',
    '定期開催の試合': 'Regular Matches',
    'レーティングシステム': 'Rating System',
    'AIステータス': 'AI Status',
    'コミュニティ': 'Community',
    'クレジット経済': 'Credit Economy',
    'サブスク無制限': 'Unlimited Subscription',
    '無料で始める': 'Start Free',
    'プラットフォーム': 'Platform',
    'ホーム': 'Home',
    '機能': 'Features',
    'ログアウト': 'Logout',
    '始める': 'Start',
    'ログイン': 'Login',
  },
  zh: {
    'AI vs AI ディベートショーを観戦しよう': '观看AI对AI辩论秀',
    '最先端のAI同士が繰り広げる白熱したディベートを楽しむ': '享受前沿AI之间的激烈辩论',
    '観戦でクレジット獲得、自分でもAIと対決可能': '观看获得积分，也可以挑战AI',
    '事前登録ボーナス': '预注册奖金',
    '無料プレゼント': '免费赠送',
    'メインページへ': '前往主页',
    '事前登録して始める': '预注册开始',
    'リアルタイム接続数': '实时连接数',
    '累計訪問者数': '累计访问者',
    '総登録ユーザー数': '注册用户总数',
    '仕組み': '运作方式',
    'カテゴリー': '分类',
    '主な機能': '主要功能',
    'クレジットシステム': '积分系统',
    '無料で始める': '免费开始',
    'ホーム': '首页',
    'ログアウト': '退出',
  },
  ko: {
    'AI vs AI ディベートショーを観戦しよう': 'AI 대 AI 토론쇼를 관전하세요',
    '最先端のAI同士が繰り広げる白熱したディベートを楽しむ': '최첨단 AI들의 열띤 토론을 즐기세요',
    '観戦でクレジット獲得、自分でもAIと対決可能': '관전으로 크레딧 획득, AI와 직접 대결 가능',
    '事前登録ボーナス': '사전등록 보너스',
    '無料プレゼント': '무료 선물',
    'メインページへ': '메인 페이지로',
    '事前登録して始める': '사전등록하고 시작',
    'リアルタイム接続数': '실시간 접속자',
    '累計訪問者数': '누적 방문자 수',
    '総登録ユーザー数': '총 등록 사용자',
    '仕組み': '작동 방식',
    'カテゴリー': '카테고리',
    '主な機能': '주요 기능',
    '無料で始める': '무료로 시작',
    'ホーム': '홈',
    'ログアウト': '로그아웃',
  },
  es: {
    'AI vs AI ディベートショーを観戦しよう': 'Mira shows de debate AI vs AI',
    '最先端のAI同士が繰り広げる白熱したディベートを楽しむ': 'Disfruta de debates intensos entre IAs de vanguardia',
    '観戦でクレジット獲得、自分でもAIと対決可能': 'Gana créditos viendo, desafía a la IA tú mismo',
    '事前登録ボーナス': 'Bono de pre-registro',
    '無料プレゼント': 'Regalo gratis',
    'メインページへ': 'Ir al inicio',
    '事前登録して始める': 'Pre-registrarse y empezar',
    '仕組み': 'Cómo funciona',
    'カテゴリー': 'Categorías',
    '主な機能': 'Funciones principales',
    '無料で始める': 'Empezar gratis',
    'ホーム': 'Inicio',
    'ログアウト': 'Cerrar sesión',
  },
  fr: {
    'AI vs AI ディベートショーを観戦しよう': 'Regardez des débats IA contre IA',
    '最先端のAI同士が繰り広げる白熱したディベートを楽しむ': 'Profitez de débats intenses entre IAs de pointe',
    '観戦でクレジット獲得、自分でもAIと対決可能': 'Gagnez des crédits en regardant, défiez l\'IA vous-même',
    '事前登録ボーナス': 'Bonus de pré-inscription',
    '無料プレゼント': 'Cadeau gratuit',
    'メインページへ': 'Aller à l\'accueil',
    '事前登録して始める': 'S\'inscrire et commencer',
    '仕組み': 'Comment ça marche',
    'カテゴリー': 'Catégories',
    '主な機能': 'Fonctionnalités',
    '無料で始める': 'Commencer gratuitement',
    'ホーム': 'Accueil',
    'ログアウト': 'Déconnexion',
  }
};

function detectLanguage() {
  const saved = localStorage.getItem('ai-debate-lang');
  if (saved) return saved;
  
  const browserLang = (navigator.language || navigator.userLanguage || 'ja').toLowerCase();
  if (browserLang.startsWith('en')) return 'en';
  if (browserLang.startsWith('zh')) return 'zh';
  if (browserLang.startsWith('ko')) return 'ko';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('fr')) return 'fr';
  return 'ja';
}

function translatePage(lang) {
  if (lang === 'ja' || !i18nTranslations[lang]) return;
  const dict = i18nTranslations[lang];
  
  // Walk all text nodes and translate matching text
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  
  textNodes.forEach(node => {
    const text = node.textContent.trim();
    if (text && dict[text]) {
      node.textContent = node.textContent.replace(text, dict[text]);
    }
  });
}

function initI18n() {
  const lang = detectLanguage();
  
  // Create language switcher UI
  const switcher = document.createElement('div');
  switcher.id = 'lang-switcher';
  switcher.style.cssText = 'position:fixed;bottom:20px;left:20px;z-index:9999;display:flex;gap:4px;background:rgba(0,0,0,0.85);border:1px solid rgba(0,255,255,0.3);border-radius:10px;padding:6px 8px;backdrop-filter:blur(10px);';
  
  const langs = [
    { code: 'ja', label: 'JP' },
    { code: 'en', label: 'EN' },
    { code: 'zh', label: '中' },
    { code: 'ko', label: '한' },
    { code: 'es', label: 'ES' },
    { code: 'fr', label: 'FR' },
  ];
  
  langs.forEach(l => {
    const btn = document.createElement('button');
    btn.textContent = l.label;
    btn.style.cssText = 'padding:4px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;border:1px solid transparent;background:transparent;color:#9ca3af;transition:all 0.2s;min-width:32px;';
    if (l.code === lang) {
      btn.style.background = 'rgba(0,255,255,0.25)';
      btn.style.borderColor = '#06b6d4';
      btn.style.color = '#00ffff';
    }
    btn.addEventListener('click', () => {
      localStorage.setItem('ai-debate-lang', l.code);
      location.reload();
    });
    switcher.appendChild(btn);
  });
  
  document.body.appendChild(switcher);
  
  // Apply translations
  if (lang !== 'ja') {
    translatePage(lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang === 'ko' ? 'ko-KR' : lang;
  }
}
