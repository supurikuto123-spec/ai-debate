-- Archived debates table
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

-- Theme proposals table
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

-- Theme votes table
CREATE TABLE IF NOT EXISTS theme_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  theme_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(theme_id, user_id),
  FOREIGN KEY (theme_id) REFERENCES theme_proposals(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Contact messages table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_archived_debates_debate_id ON archived_debates(debate_id);
CREATE INDEX IF NOT EXISTS idx_archived_debates_created_at ON archived_debates(created_at);
CREATE INDEX IF NOT EXISTS idx_theme_proposals_status ON theme_proposals(status);
CREATE INDEX IF NOT EXISTS idx_theme_votes_theme_id ON theme_votes(theme_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_user_id ON contact_messages(user_id);
