-- Add reactions table for announcements
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
