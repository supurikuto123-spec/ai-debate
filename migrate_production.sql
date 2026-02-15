-- ============================================
-- AI Debate 本番マイグレーション統合スクリプト
-- 既存テーブルがあればスキップ、カラム追加は安全に実行
-- VPSで実行: npx wrangler d1 execute ai-debate-db --file=./migrate_production.sql
-- ============================================

-- === 0001_initial_schema.sql ===
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  google_id TEXT UNIQUE NOT NULL,
  credits INTEGER DEFAULT 500,
  is_pre_registration INTEGER DEFAULT 1,
  rating INTEGER DEFAULT 1200,
  rank TEXT DEFAULT 'Bronze',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS credit_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('earn', 'spend')),
  reason TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at);

-- === 0001_debate_sync.sql ===
CREATE TABLE IF NOT EXISTS debate_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  debate_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  vote TEXT NOT NULL CHECK(vote IN ('agree', 'disagree')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(debate_id, user_id)
);

CREATE TABLE IF NOT EXISTS debate_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  debate_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  vote TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS debate_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  debate_id TEXT NOT NULL,
  side TEXT NOT NULL CHECK(side IN ('agree', 'disagree')),
  model TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_votes_debate ON debate_votes(debate_id);
CREATE INDEX IF NOT EXISTS idx_comments_debate ON debate_comments(debate_id);
CREATE INDEX IF NOT EXISTS idx_messages_debate ON debate_messages(debate_id);

-- === 0002_add_debates_table.sql ===
CREATE TABLE IF NOT EXISTS debates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  agree_position TEXT NOT NULL,
  disagree_position TEXT NOT NULL,
  time_limit INTEGER DEFAULT 600,
  char_limit INTEGER DEFAULT 180,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- === 0002_add_visits_table.sql ===
CREATE TABLE IF NOT EXISTS visits (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  page_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at);
CREATE INDEX IF NOT EXISTS idx_visits_session_id ON visits(session_id);

-- === 0003_add_reactions.sql ===
CREATE TABLE IF NOT EXISTS post_reactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  emoji TEXT DEFAULT '❤️',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_user_id ON post_reactions(user_id);

-- === 0004_add_announcement_reactions.sql ===
CREATE TABLE IF NOT EXISTS announcement_reactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  announcement_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  emoji TEXT DEFAULT '👍',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(announcement_id, user_id),
  FOREIGN KEY (announcement_id) REFERENCES announcements(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_announcement_reactions_announcement_id ON announcement_reactions(announcement_id);
CREATE INDEX IF NOT EXISTS idx_announcement_reactions_user_id ON announcement_reactions(user_id);

-- === 0005_add_community_and_announcements.sql ===
CREATE TABLE IF NOT EXISTS community_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'ja',
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'announcement',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_community_posts_language ON community_posts(language);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at);

-- === 0007_add_archive_themes_contact.sql ===
CREATE TABLE IF NOT EXISTS archived_debates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  debate_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  agree_position TEXT NOT NULL,
  disagree_position TEXT NOT NULL,
  agree_votes INTEGER DEFAULT 0,
  disagree_votes INTEGER DEFAULT 0,
  ai_evaluation TEXT,
  winner TEXT,
  messages TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  archived_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS theme_proposals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  vote_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS theme_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  theme_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(theme_id, user_id),
  FOREIGN KEY (theme_id) REFERENCES theme_proposals(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  category TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX IF NOT EXISTS idx_archived_debates_debate_id ON archived_debates(debate_id);
CREATE INDEX IF NOT EXISTS idx_archived_debates_created_at ON archived_debates(created_at);
CREATE INDEX IF NOT EXISTS idx_theme_proposals_status ON theme_proposals(status);
CREATE INDEX IF NOT EXISTS idx_theme_votes_theme_id ON theme_votes(theme_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_user_id ON contact_messages(user_id);

-- === 0010_add_archive_views.sql ===
CREATE TABLE IF NOT EXISTS archive_views (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  debate_id TEXT NOT NULL,
  session_id TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX IF NOT EXISTS idx_archive_views_user_id ON archive_views(user_id);
CREATE INDEX IF NOT EXISTS idx_archive_views_debate_id ON archive_views(debate_id);
CREATE INDEX IF NOT EXISTS idx_archive_views_session_id ON archive_views(session_id);

-- === 0011 + 0014: support_tickets (最終形: priorityなし) ===
-- 既存テーブルがある場合のpriority削除処理
-- まずpriority付きの古いテーブルが存在するか確認して再作成
DROP TABLE IF EXISTS support_tickets_new;

CREATE TABLE IF NOT EXISTS support_tickets_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 既存データがあればコピー（テーブルが存在しない場合はエラーにならないよう対応）
INSERT OR IGNORE INTO support_tickets_new (id, user_id, subject, message, status, assigned_to, created_at, updated_at, resolved_at)
SELECT id, user_id, subject, message, status, assigned_to, created_at, updated_at, resolved_at
FROM support_tickets;

DROP TABLE IF EXISTS support_tickets;
ALTER TABLE support_tickets_new RENAME TO support_tickets;

CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON support_tickets(assigned_to);

-- ticket_messages テーブル
CREATE TABLE IF NOT EXISTS ticket_messages (
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  is_staff_reply BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_user_id ON ticket_messages(user_id);

-- === デフォルトディベートを確実に設定 (0016) ===
DELETE FROM debates WHERE id = 'default';
INSERT INTO debates (id, title, topic, agree_position, disagree_position, status, created_at) 
VALUES ('default', 'AIは仕事を創出するか奪うか', 'AIと雇用の関係', 'AIは仕事を創出する', 'AIは仕事を奪う', 'live', datetime('now'));
