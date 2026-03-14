-- VPS DB修復スクリプト
-- /var/www/ai-debate で以下を実行:
-- npx wrangler d1 execute ai-debate-db --local --file=./vps_fix_db.sql

-- ① last_access_at カラム（存在しない場合のみ追加）
ALTER TABLE users ADD COLUMN last_access_at DATETIME;

-- ② is_banned カラム
ALTER TABLE users ADD COLUMN is_banned INTEGER NOT NULL DEFAULT 0;

-- ③ ban_reason カラム
ALTER TABLE users ADD COLUMN ban_reason TEXT;

-- ④ post_ban カラム
ALTER TABLE users ADD COLUMN post_ban INTEGER NOT NULL DEFAULT 0;

-- ⑤ debate_ban カラム
ALTER TABLE users ADD COLUMN debate_ban INTEGER NOT NULL DEFAULT 0;

-- ⑥ credit_freeze カラム
ALTER TABLE users ADD COLUMN credit_freeze INTEGER NOT NULL DEFAULT 0;

-- ⑦ restriction_reason カラム
ALTER TABLE users ADD COLUMN restriction_reason TEXT;

-- ⑧ is_dev カラム
ALTER TABLE users ADD COLUMN is_dev INTEGER NOT NULL DEFAULT 0;

-- ⑨ notifications テーブル
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  link TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ⑩ archived_debates テーブル
CREATE TABLE IF NOT EXISTS archived_debates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  debate_id TEXT,
  title TEXT,
  agree_position TEXT,
  disagree_position TEXT,
  agree_votes INTEGER DEFAULT 0,
  disagree_votes INTEGER DEFAULT 0,
  winner TEXT,
  messages TEXT,
  created_at DATETIME,
  archived_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_archived_debates_archived_at ON archived_debates(archived_at DESC);
CREATE INDEX IF NOT EXISTS idx_archived_debates_debate_id ON archived_debates(debate_id);

-- ⑪ archive_views テーブル
CREATE TABLE IF NOT EXISTS archive_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  debate_id TEXT NOT NULL,
  purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ⑫ support_tickets テーブル
CREATE TABLE IF NOT EXISTS support_tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ⑬ ticket_messages テーブル
CREATE TABLE IF NOT EXISTS ticket_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  is_admin INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ⑭ theme_proposals テーブル
CREATE TABLE IF NOT EXISTS theme_proposals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  agree_opinion TEXT,
  disagree_opinion TEXT,
  category TEXT,
  proposed_by TEXT,
  status TEXT DEFAULT 'active',
  vote_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ⑮ theme_votes テーブル
CREATE TABLE IF NOT EXISTS theme_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  theme_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ⑯ dev_invitations テーブル
CREATE TABLE IF NOT EXISTS dev_invitations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inviter_user_id TEXT NOT NULL,
  invitee_user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ⑰ debates テーブルに不足カラムを追加
ALTER TABLE debates ADD COLUMN status TEXT NOT NULL DEFAULT 'upcoming';
ALTER TABLE debates ADD COLUMN scheduled_at DATETIME;
ALTER TABLE debates ADD COLUMN winner TEXT;
