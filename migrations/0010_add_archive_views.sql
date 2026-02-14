-- Create archive_views table for tracking user access to archived debates
CREATE TABLE IF NOT EXISTS archive_views (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  debate_id TEXT NOT NULL,
  session_id TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_archive_views_user_id ON archive_views(user_id);
CREATE INDEX IF NOT EXISTS idx_archive_views_debate_id ON archive_views(debate_id);
CREATE INDEX IF NOT EXISTS idx_archive_views_session_id ON archive_views(session_id);
