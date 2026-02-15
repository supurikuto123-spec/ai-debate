import type { FC } from 'hono/jsx'
import { i18nScript } from '../components/i18n'

interface UserProfileProps {
  profileUser: {
    user_id: string
    username: string
    email: string
    credits: number
    rating: number
    rank: string
    avatar_url: string | null
    avatar_type: string | null
    avatar_value: string | null
    created_at: string
  }
  currentUser: {
    user_id: string
    username: string
    email: string
    credits: number
    avatar_url: string | null
    avatar_type: string | null
  } | null
  stats: {
    total_debates: number
    wins: number
    losses: number
    draws: number
    win_rate: number
    total_posts: number
  }
  privacy: {
    show_total_debates: boolean
    show_wins: boolean
    show_losses: boolean
    show_draws: boolean
    show_win_rate: boolean
    show_posts: boolean
    show_credits: boolean
  }
}

export const UserProfile: FC<UserProfileProps> = ({ profileUser, currentUser, stats, privacy }) => {
  const isOwnProfile = currentUser?.user_id === profileUser.user_id
  const p = privacy || { show_total_debates: true, show_wins: true, show_losses: true, show_draws: true, show_win_rate: true, show_posts: true, show_credits: true }

  const getAvatarUrl = (user: { avatar_url: string | null; avatar_type: string | null; avatar_value?: string | null; user_id: string }) => {
    if (user.avatar_url) return user.avatar_url
    if (user.avatar_type && user.avatar_type !== 'upload') {
      return `https://api.dicebear.com/7.x/${user.avatar_type}/svg?seed=${user.avatar_value || user.user_id}`
    }
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${user.user_id}`
  }

  const hiddenHtml = '<span style="color:#555;font-size:14px;">🔒 非公開</span>'

  return (
    <html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <title>{profileUser.username} - プロフィール | AI Debate</title>
        <style>{`
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Arial', 'Helvetica', sans-serif;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1f 100%);
                color: #fff;
                min-height: 100vh;
                padding: 20px;
            }
            .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
            .profile-header {
                background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 255, 0.1));
                border: 2px solid cyan;
                border-radius: 20px;
                padding: 40px;
                margin-bottom: 40px;
                box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
                display: flex;
                align-items: center;
                gap: 40px;
            }
            .avatar-large {
                width: 150px; height: 150px; border-radius: 50%;
                border: 4px solid cyan;
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
                object-fit: cover;
            }
            .profile-info { flex: 1; }
            .profile-username {
                font-size: 36px; font-weight: bold; color: cyan;
                text-shadow: 0 0 10px rgba(0, 255, 255, 0.8); margin-bottom: 10px;
            }
            .profile-id { font-size: 18px; color: #888; margin-bottom: 20px; }
            .profile-badges { display: flex; gap: 15px; flex-wrap: wrap; }
            .badge {
                padding: 8px 16px; border-radius: 20px;
                font-size: 14px; font-weight: bold;
                display: inline-flex; align-items: center; gap: 8px;
            }
            .badge-rank {
                background: linear-gradient(135deg, #ff00ff, #ff0080);
                border: 1px solid #ff00ff;
                box-shadow: 0 0 15px rgba(255, 0, 255, 0.5);
            }
            .badge-credits {
                background: linear-gradient(135deg, #ffff00, #ffa500);
                color: #000; border: 1px solid #ffff00;
                box-shadow: 0 0 15px rgba(255, 255, 0, 0.5);
            }
            .badge-rating {
                background: linear-gradient(135deg, #00ffff, #0080ff);
                border: 1px solid #00ffff;
                box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px; margin-bottom: 40px;
            }
            .stat-card {
                background: linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(255, 0, 255, 0.05));
                border: 2px solid rgba(0, 255, 255, 0.3);
                border-radius: 15px; padding: 30px; text-align: center;
                transition: all 0.3s ease;
            }
            .stat-card:hover {
                transform: translateY(-5px); border-color: cyan;
                box-shadow: 0 0 25px rgba(0, 255, 255, 0.4);
            }
            .stat-label {
                font-size: 14px; color: #888; margin-bottom: 10px;
                text-transform: uppercase; letter-spacing: 1px;
            }
            .stat-value {
                font-size: 48px; font-weight: bold;
                background: linear-gradient(135deg, cyan, magenta);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent; background-clip: text;
            }
            .stat-subtitle { font-size: 12px; color: #666; margin-top: 5px; }
            .back-button {
                position: fixed; top: 30px; left: 30px;
                width: 60px; height: 60px;
                background: linear-gradient(135deg, rgba(0, 255, 255, 0.3), rgba(255, 0, 255, 0.3));
                border: 2px solid cyan; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                text-decoration: none; color: cyan; font-size: 24px; font-weight: bold;
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
                transition: all 0.3s ease; z-index: 1000;
            }
            .back-button:hover { transform: scale(1.1); box-shadow: 0 0 30px rgba(0, 255, 255, 0.8); }
            .member-since { font-size: 14px; color: #888; margin-top: 15px; }
            .progress-bar {
                width: 100%; height: 8px; background: rgba(255, 255, 255, 0.1);
                border-radius: 4px; margin-top: 15px; overflow: hidden;
            }
            .progress-fill {
                height: 100%; background: linear-gradient(90deg, cyan, magenta);
                border-radius: 4px; transition: width 0.5s ease;
            }
            .privacy-section {
                background: linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(255, 0, 255, 0.05));
                border: 2px solid rgba(0, 255, 255, 0.3);
                border-radius: 15px; padding: 30px; margin-bottom: 30px;
            }
            .privacy-title {
                font-size: 20px; font-weight: bold; color: cyan;
                margin-bottom: 20px; display: flex; align-items: center; gap: 10px;
            }
            .privacy-toggle {
                display: flex; align-items: center; justify-content: space-between;
                padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            .privacy-toggle:last-child { border-bottom: none; }
            .toggle-switch {
                position: relative; width: 50px; height: 26px;
                background: #333; border-radius: 13px; cursor: pointer; transition: all 0.3s;
            }
            .toggle-switch.on { background: #06b6d4; }
            .toggle-switch::after {
                content: ''; position: absolute; top: 3px; left: 3px;
                width: 20px; height: 20px; border-radius: 50%;
                background: white; transition: all 0.3s;
            }
            .toggle-switch.on::after { left: 27px; }
            @media (max-width: 768px) {
                .profile-header { flex-direction: column; text-align: center; gap: 20px; padding: 25px 15px; }
                .avatar-large { width: 100px; height: 100px; }
                .profile-username { font-size: 24px; }
                .profile-id { font-size: 14px; }
                .profile-badges { justify-content: center; }
                .badge { font-size: 12px; padding: 6px 12px; }
                .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
                .stat-value { font-size: 32px; }
                .stat-card { padding: 20px 15px; }
                .container { padding: 20px 10px; }
                .back-button { width: 44px; height: 44px; top: 15px; left: 15px; font-size: 18px; }
            }
        `}</style>
    </head>
    <body>
        <a href="/main" class="back-button">←</a>
        
        <div class="container">
            <div class="profile-header">
                <img 
                    src={getAvatarUrl(profileUser)} 
                    alt={profileUser.username}
                    class="avatar-large"
                />
                <div class="profile-info">
                    <div class="profile-username">{profileUser.username}</div>
                    <div class="profile-id">@{profileUser.user_id}</div>
                    
                    <div class="profile-badges">
                        <div class="badge badge-rank">
                            <span>🏆</span>
                            <span>{profileUser.rank}</span>
                        </div>
                        <div class="badge badge-rating">
                            <span>⭐</span>
                            <span>Rating: {profileUser.rating}</span>
                        </div>
                        {(isOwnProfile || p.show_credits) && (
                          <div class="badge badge-credits">
                              <span>💰</span>
                              <span>{profileUser.credits.toLocaleString()} Credits</span>
                          </div>
                        )}
                    </div>
                    
                    <div class="member-since">
                        登録日: {new Date(profileUser.created_at + (typeof profileUser.created_at === 'string' && !profileUser.created_at.includes('Z') && !profileUser.created_at.includes('+') ? 'Z' : '')).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}
                    </div>
                </div>
            </div>
            
            {isOwnProfile && (
              <div class="privacy-section" id="privacySection">
                <div class="privacy-title">
                  <span>🔒</span> プライバシー設定
                </div>
                <div class="privacy-toggle">
                  <span>総ディベート数を公開</span>
                  <div class={`toggle-switch ${p.show_total_debates ? 'on' : ''}`} data-key="show_total_debates" onclick="togglePrivacy(this)"></div>
                </div>
                <div class="privacy-toggle">
                  <span>勝利数を公開</span>
                  <div class={`toggle-switch ${p.show_wins ? 'on' : ''}`} data-key="show_wins" onclick="togglePrivacy(this)"></div>
                </div>
                <div class="privacy-toggle">
                  <span>敗北数を公開</span>
                  <div class={`toggle-switch ${p.show_losses ? 'on' : ''}`} data-key="show_losses" onclick="togglePrivacy(this)"></div>
                </div>
                <div class="privacy-toggle">
                  <span>引き分けを公開</span>
                  <div class={`toggle-switch ${p.show_draws ? 'on' : ''}`} data-key="show_draws" onclick="togglePrivacy(this)"></div>
                </div>
                <div class="privacy-toggle">
                  <span>勝率を公開</span>
                  <div class={`toggle-switch ${p.show_win_rate ? 'on' : ''}`} data-key="show_win_rate" onclick="togglePrivacy(this)"></div>
                </div>
                <div class="privacy-toggle">
                  <span>投稿数を公開</span>
                  <div class={`toggle-switch ${p.show_posts ? 'on' : ''}`} data-key="show_posts" onclick="togglePrivacy(this)"></div>
                </div>
                <div class="privacy-toggle">
                  <span>クレジットを公開</span>
                  <div class={`toggle-switch ${p.show_credits ? 'on' : ''}`} data-key="show_credits" onclick="togglePrivacy(this)"></div>
                </div>
              </div>
            )}
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">総ディベート数</div>
                    {(isOwnProfile || p.show_total_debates) 
                      ? <div class="stat-value">{stats.total_debates}</div>
                      : <div dangerouslySetInnerHTML={{ __html: hiddenHtml }} />
                    }
                    <div class="stat-subtitle">Total Debates</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">勝利数</div>
                    {(isOwnProfile || p.show_wins) 
                      ? <div class="stat-value">{stats.wins}</div>
                      : <div dangerouslySetInnerHTML={{ __html: hiddenHtml }} />
                    }
                    <div class="stat-subtitle">Wins</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">敗北数</div>
                    {(isOwnProfile || p.show_losses) 
                      ? <div class="stat-value">{stats.losses}</div>
                      : <div dangerouslySetInnerHTML={{ __html: hiddenHtml }} />
                    }
                    <div class="stat-subtitle">Losses</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">引き分け</div>
                    {(isOwnProfile || p.show_draws) 
                      ? <div class="stat-value">{stats.draws}</div>
                      : <div dangerouslySetInnerHTML={{ __html: hiddenHtml }} />
                    }
                    <div class="stat-subtitle">Draws</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">勝率</div>
                    {(isOwnProfile || p.show_win_rate) 
                      ? <>
                          <div class="stat-value">{stats.win_rate}%</div>
                          <div class="progress-bar">
                            <div class="progress-fill" style={`width: ${stats.win_rate}%`}></div>
                          </div>
                        </>
                      : <div dangerouslySetInnerHTML={{ __html: hiddenHtml }} />
                    }
                    <div class="stat-subtitle">Win Rate</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">投稿数</div>
                    {(isOwnProfile || p.show_posts) 
                      ? <div class="stat-value">{stats.total_posts}</div>
                      : <div dangerouslySetInnerHTML={{ __html: hiddenHtml }} />
                    }
                    <div class="stat-subtitle">Community Posts</div>
                </div>
            </div>
        </div>
        
        <script dangerouslySetInnerHTML={{ __html: `
          function togglePrivacy(el) {
            el.classList.toggle('on');
            savePrivacy();
          }
          async function savePrivacy() {
            const toggles = document.querySelectorAll('.toggle-switch[data-key]');
            const settings = {};
            toggles.forEach(t => { settings[t.dataset.key] = t.classList.contains('on'); });
            try {
              await fetch('/api/user/privacy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
              });
            } catch(e) { console.error('Failed to save privacy:', e); }
          }
        ` }} />
        <div dangerouslySetInnerHTML={{ __html: i18nScript() }} />
    </body>
    </html>
  )
}
