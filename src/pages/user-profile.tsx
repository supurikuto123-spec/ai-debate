import type { FC } from 'hono/jsx'

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
}

export const UserProfile: FC<UserProfileProps> = ({ profileUser, currentUser, stats }) => {
  const isOwnProfile = currentUser?.user_id === profileUser.user_id

  // Avatar display logic
  const getAvatarUrl = (user: { avatar_url: string | null; avatar_type: string | null; avatar_value?: string | null; user_id: string }) => {
    // Priority 1: Uploaded avatar (avatar_url starts with /api/avatar/)
    if (user.avatar_url) {
      return user.avatar_url
    }
    // Priority 2: DiceBear with avatar_type and avatar_value
    if (user.avatar_type && user.avatar_type !== 'upload') {
      return `https://api.dicebear.com/7.x/${user.avatar_type}/svg?seed=${user.avatar_value || user.user_id}`
    }
    // Fallback: Default bottts with user_id as seed
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${user.user_id}`
  }

  return (
    <html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=1280, initial-scale=0.5, maximum-scale=1.0, user-scalable=yes" />
        <title>{profileUser.username} - プロフィール | AI Debate</title>
        <style>{`
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Arial', 'Helvetica', sans-serif;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1f 100%);
                color: #fff;
                min-height: 100vh;
                padding: 20px;
            }
            
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 40px 20px;
            }
            
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
                width: 150px;
                height: 150px;
                border-radius: 50%;
                border: 4px solid cyan;
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
                object-fit: cover;
            }
            
            .profile-info {
                flex: 1;
            }
            
            .profile-username {
                font-size: 36px;
                font-weight: bold;
                color: cyan;
                text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
                margin-bottom: 10px;
            }
            
            .profile-id {
                font-size: 18px;
                color: #888;
                margin-bottom: 20px;
            }
            
            .profile-badges {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
            }
            
            .badge {
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: bold;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            
            .badge-rank {
                background: linear-gradient(135deg, #ff00ff, #ff0080);
                border: 1px solid #ff00ff;
                box-shadow: 0 0 15px rgba(255, 0, 255, 0.5);
            }
            
            .badge-credits {
                background: linear-gradient(135deg, #ffff00, #ffa500);
                color: #000;
                border: 1px solid #ffff00;
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
                gap: 20px;
                margin-bottom: 40px;
            }
            
            .stat-card {
                background: linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(255, 0, 255, 0.05));
                border: 2px solid rgba(0, 255, 255, 0.3);
                border-radius: 15px;
                padding: 30px;
                text-align: center;
                transition: all 0.3s ease;
            }
            
            .stat-card:hover {
                transform: translateY(-5px);
                border-color: cyan;
                box-shadow: 0 0 25px rgba(0, 255, 255, 0.4);
            }
            
            .stat-label {
                font-size: 14px;
                color: #888;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .stat-value {
                font-size: 48px;
                font-weight: bold;
                background: linear-gradient(135deg, cyan, magenta);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .stat-subtitle {
                font-size: 12px;
                color: #666;
                margin-top: 5px;
            }
            
            .back-button {
                position: fixed;
                top: 30px;
                left: 30px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, rgba(0, 255, 255, 0.3), rgba(255, 0, 255, 0.3));
                border: 2px solid cyan;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                text-decoration: none;
                color: cyan;
                font-size: 24px;
                font-weight: bold;
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
                transition: all 0.3s ease;
                z-index: 1000;
            }
            
            .back-button:hover {
                transform: scale(1.1);
                box-shadow: 0 0 30px rgba(0, 255, 255, 0.8);
            }
            
            .member-since {
                font-size: 14px;
                color: #888;
                margin-top: 15px;
            }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                margin-top: 15px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, cyan, magenta);
                border-radius: 4px;
                transition: width 0.5s ease;
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
                        <div class="badge badge-credits">
                            <span>💰</span>
                            <span>{profileUser.credits.toLocaleString()} Credits</span>
                        </div>
                    </div>
                    
                    <div class="member-since">
                        登録日: {new Date(profileUser.created_at + (typeof profileUser.created_at === 'string' && !profileUser.created_at.includes('Z') && !profileUser.created_at.includes('+') ? 'Z' : '')).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}
                    </div>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">総ディベート数</div>
                    <div class="stat-value">{stats.total_debates}</div>
                    <div class="stat-subtitle">Total Debates</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">勝利数</div>
                    <div class="stat-value">{stats.wins}</div>
                    <div class="stat-subtitle">Wins</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">敗北数</div>
                    <div class="stat-value">{stats.losses}</div>
                    <div class="stat-subtitle">Losses</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">引き分け</div>
                    <div class="stat-value">{stats.draws}</div>
                    <div class="stat-subtitle">Draws</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">勝率</div>
                    <div class="stat-value">{stats.win_rate}%</div>
                    <div class="stat-subtitle">Win Rate</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style={`width: ${stats.win_rate}%`}></div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-label">投稿数</div>
                    <div class="stat-value">{stats.total_posts}</div>
                    <div class="stat-subtitle">Community Posts</div>
                </div>
            </div>
        </div>
    </body>
    </html>
  )
}
