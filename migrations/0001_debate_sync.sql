-- ディベート投票テーブル
CREATE TABLE IF NOT EXISTS debate_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  debate_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  vote TEXT NOT NULL CHECK(vote IN ('agree', 'disagree')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(debate_id, user_id)
);

-- ディベートコメントテーブル
CREATE TABLE IF NOT EXISTS debate_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  debate_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  vote TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ディベートメッセージテーブル（AIディベート履歴）
CREATE TABLE IF NOT EXISTS debate_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  debate_id TEXT NOT NULL,
  side TEXT NOT NULL CHECK(side IN ('agree', 'disagree')),
  model TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_votes_debate ON debate_votes(debate_id);
CREATE INDEX IF NOT EXISTS idx_comments_debate ON debate_comments(debate_id);
CREATE INDEX IF NOT EXISTS idx_messages_debate ON debate_messages(debate_id);
