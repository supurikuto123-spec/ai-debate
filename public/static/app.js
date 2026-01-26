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

// Format count to display ranges (1+, 5+, 10+, 30+, 50+, 100+, then 1000+, 3000+, 5000+, etc.)
function formatCountDisplay(count) {
    if (count < 1) return '1+';
    if (count < 5) return '1+';
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
        // Fetch visitor count
        const visitorResponse = await fetch('/api/stats/visitors');
        const visitorData = await visitorResponse.json();
        const visitorCount = formatCountDisplay(visitorData.count);
        
        const visitorElement = document.getElementById('visitor-count');
        if (visitorElement) {
            visitorElement.textContent = visitorCount;
            visitorElement.style.animation = 'none';
            setTimeout(() => {
                visitorElement.style.animation = 'meterPulse 2s ease-in-out infinite';
            }, 10);
        }
        
        // Fetch registered user count
        const userResponse = await fetch('/api/stats/users');
        const userData = await userResponse.json();
        const userCount = formatCountDisplay(userData.count);
        
        const userElement = document.getElementById('user-count');
        if (userElement) {
            userElement.textContent = userCount;
            userElement.style.animation = 'none';
            setTimeout(() => {
                userElement.style.animation = 'meterPulse 2s ease-in-out infinite';
            }, 10);
        }
    } catch (error) {
        console.error('Failed to update stats:', error);
        // Show placeholder on error
        const visitorElement = document.getElementById('visitor-count');
        const userElement = document.getElementById('user-count');
        if (visitorElement) visitorElement.textContent = '--+';
        if (userElement) userElement.textContent = '--+';
    }
}

// Update stats on page load
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    // Refresh stats every 30 seconds
    setInterval(updateStats, 30000);
});
